/**
 * =============================================
 *  MA5 Checkout (Trust Model v2) — Google Apps Script
 *  Up Level Academy
 *  Sheet ใหม่ (ไม่ผูกกับ Form) — รับข้อมูลจาก ma5-checkout.html
 *
 *  Entitlement model (กฎกติกาแคมเปญ v3):
 *    Path A — เปิดให้ทุกคน: คอมเมนต์ภาพเด็ค + ชื่อเด็ค + แท็กเพื่อน 1 คน → 1 Box
 *    Path B — เฉพาะสมาชิก Guild: รีวิวความประทับใจ + ภาพ                → 2 Box
 *  Member verification = name first-word + phone match. Max 2 Box.
 *
 *  Quota = 60 Box รวม legacy elite sheet + sheet นี้
 *
 *  Sheet "Form Responses 1" — Column layout:
 *    A Timestamp · B Name · C (reserved) · D Phone · E Boxes
 *    F Pickup    · G Address · H Slip URL · I Status · J (reserved)
 *    K Comment URL + flags · L Member Type · M Source
 * =============================================
 */

// ===== ค่าคงที่ =====
const SLIPOK_API_KEY = "SLIPOKE2TSLQJ";
const BRANCH_ID      = "58927";
const BOT_TOKEN      = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID        = "-4911555842";
const TELEGRAM_URL   = `https://api.telegram.org/bot${BOT_TOKEN}`;

const SHEET_NAME     = "Form Responses 1";

// ===== Column Index (1-based) =====
const COL_TIMESTAMP   = 1;
const COL_NAME        = 2;
const COL_NICKNAME    = 3;
const COL_PHONE       = 4;
const COL_BOXES       = 5;
const COL_PICKUP      = 6;
const COL_ADDRESS     = 7;
const COL_SLIP        = 8;
const COL_STATUS      = 9;
const COL_FB_USER_ID  = 10;
const COL_COMMENT_URL = 11;
const COL_MEMBER_TYPE = 12;
const COL_SOURCE      = 13;

// ===== Firebase Webhook =====
const FIREBASE_WEBHOOK = "https://up-level-guild.web.app/api/webhook/add-payment";
const FIREBASE_SECRET  = "up-level-secret-key-1234";

// ===== ราคา =====
const PRE_PRICE_BOX  = 1400;

// ===== Entitlement =====
const PATH_A_BOXES         = 1;     // เปิดให้ทุกคน
const PATH_B_BOXES         = 2;     // เฉพาะสมาชิก guild
const PATH_B_NEEDS_MEMBER  = true;
const PER_PHONE_LIMIT      = 2;     // รวมทุก order ต่อเบอร์
const DUP_WINDOW_MS        = 60000; // window กัน double-submit

// ===== โควต้ารวม (legacy + new) =====
const BOX_QUOTA      = 70;

// ===== Legacy Elite Sheet (รอบ VIP เก่า) =====
const LEGACY_SHEET_ID   = "1aKgYogobcyZoji5Yh0-A6B93GO8GscjrbbIa80-3k-w";
const LEGACY_TAB_GID    = 1951007822;
const LEGACY_BOX_COL    = 5;   // col E = "จำนวน Booster Box (MA5)"

// ===== Guild Member Lookup Sheet =====
const GUILD_MEMBER_SHEET_ID = "1nFf1G3zR_kd9JmuSgmMCA3k3YQ6d8S_yaElMjs3diQU";
const GUILD_MEMBER_TAB      = "member";

// ===== Drive Folder สำหรับเก็บสลิป =====
const SLIP_FOLDER_ID = "17wqoFtIAfpMOAZM2jgF5uaA10BuDr3H5";

// =============================================
//  Helpers
// =============================================
function normalizePhone(p) {
  return String(p || "").replace(/[^\d]/g, "");
}

function normalizeName(s) {
  return String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

// Strip honorifics/prefixes (Thai + English) from the front of a name
const NAME_PREFIXES = [
  "นาย", "นาง", "นางสาว", "น.ส.", "นส.", "นส",
  "ด.ช.", "ด.ญ.", "ดช.", "ดญ.",
  "ดร.", "ดร",
  "mr.", "mr", "mrs.", "mrs", "ms.", "ms", "dr.", "dr"
];
function stripPrefix(name) {
  let n = normalizeName(name);
  if (!n) return "";
  // remove dots/spaces inside common prefixes first
  for (let i = 0; i < 3; i++) {
    let stripped = false;
    for (const p of NAME_PREFIXES) {
      const lp = p.toLowerCase();
      if (n === lp || n.startsWith(lp + " ") || n.startsWith(lp)) {
        n = n.substring(lp.length).trim();
        stripped = true;
        break;
      }
    }
    if (!stripped) break;
  }
  return n;
}

function firstWord(name) {
  const n = stripPrefix(name);
  if (!n) return "";
  return n.split(" ")[0];
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =============================================
//  doGet — Router
// =============================================
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  try {
    if (action === "member_lookup") {
      return jsonResponse(lookupMember(e.parameter.phone, e.parameter.name));
    }
    return jsonResponse(getSummary());
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

const SCRIPT_VERSION = "v3.5";

function getSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const newCount    = sheet ? countUsedQuotaFromSheet(sheet) : 0;
  const legacyCount = countLegacyBoxes();
  const used        = newCount + legacyCount;
  return {
    version:        SCRIPT_VERSION,
    boxQuota:       BOX_QUOTA,
    usedBoxes:      used,
    usedNew:        newCount,
    usedLegacy:     legacyCount,
    remainingBoxes: Math.max(0, BOX_QUOTA - used),
    isBoxFull:      used >= BOX_QUOTA
  };
}

// =============================================
//  Quota Counters
// =============================================
function countUsedQuotaFromSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  let usedBoxes = 0;
  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    const status = String(row[COL_STATUS - 1] || "");
    if (!row[COL_NAME - 1]) continue;
    if (/เกินโควต้า|ยกเลิก|คืนเงิน|ยอดไม่ตรง/.test(status)) continue;
    usedBoxes += parseInt(row[COL_BOXES - 1]) || 0;
  }
  return usedBoxes;
}

// Count active boxes for a phone (skip refunded/cancelled/over-quota/mismatched)
function countBoxesForPhone(sheet, normPhone) {
  const data = sheet.getDataRange().getValues();
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/เกินโควต้า|ยกเลิก|คืนเงิน|ยอดไม่ตรง/.test(status)) continue;
    total += parseInt(row[COL_BOXES - 1]) || 0;
  }
  return total;
}

// Find existing row with the same slip transRef (col J). Returns 1-based row number or -1.
function findDuplicateTransRef(sheet, transRef) {
  if (!transRef) return -1;
  const tr = String(transRef).trim();
  if (!tr) return -1;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const existing = String(data[i][COL_FB_USER_ID - 1] || "").trim();
    if (existing && existing === tr) return i + 1;
  }
  return -1;
}

// Detect a row with the same phone in the past DUP_WINDOW_MS (re-submit guard)
function isRecentDuplicate(sheet, normPhone) {
  const data = sheet.getDataRange().getValues();
  const now  = Date.now();
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;
    const ts = row[COL_TIMESTAMP - 1];
    let t = NaN;
    if (ts instanceof Date) t = ts.getTime();
    else if (ts) { const d = new Date(ts); t = d.getTime(); }
    if (!isNaN(t) && (now - t) < DUP_WINDOW_MS) return true;
  }
  return false;
}

function countLegacyBoxes() {
  try {
    const ext    = SpreadsheetApp.openById(LEGACY_SHEET_ID);
    const sheets = ext.getSheets();
    let sheet    = sheets.find(s => s.getSheetId() === LEGACY_TAB_GID);
    if (!sheet) sheet = sheets[0];
    if (!sheet) return 0;
    const data = sheet.getDataRange().getValues();
    let total = 0;
    for (let i = 1; i < data.length; i++) {
      const v = parseInt(data[i][LEGACY_BOX_COL - 1]);
      if (!isNaN(v) && v > 0) total += v;
    }
    return total;
  } catch (err) {
    console.error("countLegacyBoxes error:", err);
    return 0;
  }
}

// =============================================
//  Member Lookup — phone + flexible name match
//  Match passes if phone matches AND the customer's input first-word
//  matches ANY of: legal name first word / nickname / codename (all
//  case-insensitive, prefix-stripped). Helps when the customer
//  registered with "นาย ธนภัทร" but types "ธนภัทร" or "JJ".
// =============================================
function lookupMember(phone, name) {
  const normPhone = normalizePhone(phone);
  if (!normPhone) return { isMember: false, reason: "no_phone" };

  const inputFirst = firstWord(name);
  const inputFull  = normalizeName(name);

  try {
    const ext   = SpreadsheetApp.openById(GUILD_MEMBER_SHEET_ID);
    const sheet = ext.getSheetByName(GUILD_MEMBER_TAB);
    if (!sheet) return { isMember: false, reason: "sheet_not_found" };

    const data    = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase());

    let phoneCol = -1, codenameCol = -1, rankCol = -1, nameCol = -1, nicknameCol = -1;
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      if (phoneCol    === -1 && (h.includes("phone")    || h.includes("เบอร์") || h.includes("โทร") || h.includes("tel"))) phoneCol = i;
      if (codenameCol === -1 && (h.includes("codename") || h.includes("โค้ดเนม"))) codenameCol = i;
      if (rankCol     === -1 && (h.includes("rank")     || h.includes("แรงค์"))) rankCol = i;
      if (nicknameCol === -1 && (h.includes("ชื่อเล่น") || h.includes("nickname"))) nicknameCol = i;
      if (nameCol     === -1 && nicknameCol !== i && (h.includes("ชื่อ-") || h.includes("ชื่อ - ") || h.includes("full name") || (h.includes("ชื่อ") && !h.includes("ชื่อเล่น")))) nameCol = i;
    }
    if (phoneCol === -1) return { isMember: false, reason: "phone_col_not_found" };

    for (let r = 1; r < data.length; r++) {
      const rowPhone = normalizePhone(data[r][phoneCol]);
      if (!rowPhone || rowPhone !== normPhone) continue;

      const rowName     = nameCol     !== -1 ? data[r][nameCol]     : "";
      const rowNickname = nicknameCol !== -1 ? data[r][nicknameCol] : "";
      const rowCodename = codenameCol !== -1 ? data[r][codenameCol] : "";

      const candidates = [
        firstWord(rowName),
        normalizeName(rowNickname),
        normalizeName(rowCodename)
      ].filter(Boolean);

      const matched = inputFirst && candidates.some(c => c === inputFirst);
      // Also accept full-input match against any candidate (e.g. user types "JJ")
      const matchedFull = inputFull && candidates.some(c => c === inputFull);

      if (!inputFirst) {
        // No name provided — accept on phone match only (lenient)
        return {
          isMember: true,
          codename: rowCodename,
          rank:     rankCol !== -1 ? data[r][rankCol] : "",
          name:     rowName,
          rowNum:   r + 1
        };
      }

      if (matched || matchedFull) {
        return {
          isMember: true,
          codename: rowCodename,
          rank:     rankCol !== -1 ? data[r][rankCol] : "",
          name:     rowName,
          matchedBy: matchedFull ? "full" : "first",
          rowNum:   r + 1
        };
      }

      return {
        isMember: false,
        reason:   "name_mismatch",
        hint:     "เบอร์ตรงแต่ชื่อไม่ตรง — ลองชื่อเล่นหรือ codename"
      };
    }
    return { isMember: false, reason: "not_in_member_list" };
  } catch (err) {
    return { isMember: false, reason: "error", detail: String(err) };
  }
}

// =============================================
//  Entitlement calculator (server is source of truth)
// =============================================
function calcBoxes(pathChoice, isMember) {
  if (pathChoice === "A") {
    return { ok: true, boxes: PATH_A_BOXES, base: PATH_A_BOXES };
  }
  if (pathChoice === "B") {
    if (PATH_B_NEEDS_MEMBER && !isMember) {
      return { ok: false, error: "path_b_requires_member" };
    }
    return { ok: true, boxes: PATH_B_BOXES, base: PATH_B_BOXES };
  }
  return { ok: false, error: "invalid_path" };
}

// =============================================
//  doPost — Checkout submission
// =============================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) {
    return jsonResponse({ success: false, error: "busy_try_again" });
  }

  try {
    const body = JSON.parse(e.postData.contents);

    // Validate required
    if (!body.phone || !body.customerName) {
      return jsonResponse({ success: false, error: "missing_fields" });
    }
    const pathChoice = String(body.pathChoice || "").toUpperCase();
    if (pathChoice !== "A" && pathChoice !== "B") {
      return jsonResponse({ success: false, error: "invalid_path" });
    }
    if (!body.commentImageBase64) {
      return jsonResponse({ success: false, error: "missing_comment_screenshot" });
    }

    // Member re-check (server-side; ignore frontend claim)
    const memberCheck = lookupMember(body.phone, body.customerName);
    const isMember    = memberCheck.isMember;

    // Server-computed entitlement
    const calc = calcBoxes(pathChoice, isMember);
    if (!calc.ok) return jsonResponse({ success: false, error: calc.error });
    const boxes = calc.boxes;

    // Quota check (legacy + new)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ success: false, error: "sheet_not_found" });

    const normPhone = normalizePhone(body.phone);

    // Duplicate submission guard (same phone within DUP_WINDOW_MS)
    if (isRecentDuplicate(sheet, normPhone)) {
      return jsonResponse({
        success: false,
        error:   "duplicate_recent",
        message: "พบการสั่งซื้อจากเบอร์นี้เมื่อสักครู่ — รอสักครู่แล้วลองใหม่"
      });
    }

    // Per-phone lifetime limit (sum of active rows + this submission)
    const existingForPhone = countBoxesForPhone(sheet, normPhone);
    if (existingForPhone + boxes > PER_PHONE_LIMIT) {
      return jsonResponse({
        success:   false,
        error:     "exceeds_personal_limit",
        existing:  existingForPhone,
        requested: boxes,
        limit:     PER_PHONE_LIMIT
      });
    }

    const newCount    = countUsedQuotaFromSheet(sheet);
    const legacyCount = countLegacyBoxes();
    const used        = newCount + legacyCount;
    const remaining   = Math.max(0, BOX_QUOTA - used);

    if (used + boxes > BOX_QUOTA) {
      return jsonResponse({
        success:   false,
        error:     "quota_exceeded",
        remaining: remaining,
        requested: boxes
      });
    }

    // Save comment + slip to Drive
    const commentImgUrl = saveImageToDrive(body.commentImageBase64, body.phone, "comment");
    let slipUrl = "";
    if (body.slipBase64) slipUrl = saveImageToDrive(body.slipBase64, body.phone, "slip");

    // SlipOK verify
    const expectedAmount = boxes * PRE_PRICE_BOX;
    let status = "❌ ยังไม่ชำระ";
    let verifiedAmount = null;
    let transRef = "";
    let senderName = "";
    let senderMismatch = false;

    if (slipUrl) {
      const verified = verifySlip(slipUrl);
      if (verified && verified.success) {
        const amt = parseFloat(verified.data.amount);
        transRef = verified.data.transRef || "";

        // Duplicate slip guard — reject if this transRef already used in any prior row
        if (transRef) {
          const dupRow = findDuplicateTransRef(sheet, transRef);
          if (dupRow > 0) {
            return jsonResponse({
              success: false,
              error:   "duplicate_slip",
              message: `สลิปนี้เคยถูกใช้แล้ว (อ้างอิงแถว ${dupRow})`,
              transRef: transRef
            });
          }
        }

        // Sender name check — flag if slip sender doesn't seem to match customer
        const senderObj = verified.data.sender || {};
        senderName = String(senderObj.displayName || senderObj.name || "").trim();
        if (senderName) {
          const senderFirst = firstWord(senderName);
          const customerFirst = firstWord(body.customerName);
          if (senderFirst && customerFirst && senderFirst !== customerFirst) {
            senderMismatch = true;
          }
        }

        if (Math.abs(amt - expectedAmount) < 1) {
          status         = "✅ ชำระแล้ว";
          verifiedAmount = amt;
        } else {
          status = `⚠️ ยอดไม่ตรง (${amt}/${expectedAmount})`;
        }

        if (senderMismatch) {
          status += ` ⚠️ sender:${senderName}`;
        }
      } else {
        status = "⏳ รอตรวจสอบสลิป";
      }
    }

    // Build row
    ensureHeaders(sheet);
    const flag = ` [path:${pathChoice}${isMember ? " M" : ""}]`;
    const newRow = [
      new Date(),
      body.customerName,
      "",
      body.phone,
      boxes,
      "รับที่ร้าน",
      "",
      slipUrl,
      status,
      transRef,                              // J Slip TransRef (was reserved)
      commentImgUrl + flag,
      isMember ? "เก่า" : "ใหม่",
      "checkout"
    ];
    sheet.appendRow(newRow);

    if (status === "✅ ชำระแล้ว") {
      syncToFirebase({
        phoneNumber:  normalizePhone(body.phone),
        customerName: body.customerName,
        amount:       verifiedAmount,
        transRef:     transRef,
        status:       "verified",
        source:       "ma5_checkout",
        slipUrl:      slipUrl,
        note:         `MA5 Checkout | Box x${boxes} | path:${pathChoice} | ${isMember ? "Member" : "Guest"}`
      });
    }

    const pathLabel = pathChoice === "A" ? "คอมเมนต์เด็ค" : "รีวิว (สมาชิก)";
    const memberLabel = isMember ? "🏰 สมาชิกเดิม" : "🆕 ไม่ใช่สมาชิก";
    const senderLine = senderMismatch ? `⚠️ Sender ไม่ตรง: ${senderName}\n` : "";
    sendTelegram(
      `💜 *MA5 Checkout — ออเดอร์ใหม่!*\n\n` +
      `👤 ${body.customerName}\n` +
      `📱 ${body.phone}\n` +
      `🎫 Path ${pathChoice} (${pathLabel})\n` +
      `📦 ${boxes} Box (${expectedAmount.toLocaleString()} บาท)\n` +
      `${memberLabel}\n` +
      `📊 ${status}\n` +
      senderLine +
      `🪣 quota ${used + boxes}/${BOX_QUOTA}\n` +
      (commentImgUrl ? `🖼 [Comment](${commentImgUrl})\n` : "") +
      (slipUrl ? `🧾 [Slip](${slipUrl})` : "")
    );

    return jsonResponse({
      success:  true,
      status:   status,
      slipUrl:  slipUrl,
      verified: status === "✅ ชำระแล้ว",
      boxes:    boxes,
      isMember: isMember,
      path:     pathChoice
    });
  } catch (err) {
    console.error("doPost error:", err);
    return jsonResponse({ success: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// =============================================
//  Headers
// =============================================
function ensureHeaders(sheet) {
  const headers = [
    "Timestamp",
    "ชื่อ - นามสกุล",
    "(reserved)",
    "เบอร์ติดต่อ",
    "Box",
    "การรับสินค้า",
    "ที่อยู่",
    "สลิป URL",
    "สถานะ",
    "Slip TransRef",
    "Comment Screenshot",
    "Member",
    "Source"
  ];
  for (let c = 0; c < headers.length; c++) {
    const cell = sheet.getRange(1, c + 1);
    if (!cell.getValue()) cell.setValue(headers[c]);
  }
}

// =============================================
//  Save Image to Drive
// =============================================
function saveImageToDrive(base64Str, phone, prefix) {
  try {
    const match = base64Str.match(/^data:(.+);base64,(.+)$/);
    if (!match) return "";
    const mimeType = match[1];
    const bytes    = Utilities.base64Decode(match[2]);
    const ext      = mimeType.includes("png") ? "png" : (mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "img");
    const blob     = Utilities.newBlob(bytes, mimeType, `${prefix}_${normalizePhone(phone)}_${Date.now()}.${ext}`);
    const folder   = DriveApp.getFolderById(SLIP_FOLDER_ID);
    const file     = folder.createFile(blob);
    // No public sharing — file inherits folder permissions (admin/owner only).
    // SlipOK reads blob bytes via DriveApp auth, not via public URL.
    return file.getUrl();
  } catch (err) {
    console.error("saveImageToDrive error:", err);
    return "";
  }
}

// =============================================
//  SlipOK
// =============================================
function verifySlip(fileUrl) {
  try {
    const fileId = extractFileId(fileUrl);
    if (!fileId) return null;
    const blob = DriveApp.getFileById(fileId).getBlob();
    const res  = UrlFetchApp.fetch(
      `https://api.slipok.com/api/line/apikey/${BRANCH_ID}`,
      {
        method:  "post",
        headers: { "x-authorization": SLIPOK_API_KEY, "Content-Type": "application/json" },
        payload: JSON.stringify({ files: Utilities.base64Encode(blob.getBytes()), log: true }),
        muteHttpExceptions: true
      }
    );
    const result = JSON.parse(res.getContentText());
    if (result.success) return { success: true, data: result.data };
    // duplicate slip codes — DO NOT treat as success
    return null;
  } catch (e) {
    console.error("SlipOK Error:", e);
    return null;
  }
}

function extractFileId(url) {
  if (!url) return null;
  if (url.includes("?id=")) return url.split("?id=")[1].split("&")[0];
  const m = url.match(/[-\w]{25,}/);
  return m ? m[0] : null;
}

function setFilePublic(fileUrl) {
  try {
    const id = extractFileId(fileUrl);
    if (id) DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
}

// =============================================
//  Firebase Sync
// =============================================
function syncToFirebase(paymentData) {
  try {
    UrlFetchApp.fetch(FIREBASE_WEBHOOK, {
      method:      "post",
      contentType: "application/json",
      payload:     JSON.stringify({ secret: FIREBASE_SECRET, payment: paymentData }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error("Firebase sync error:", e);
  }
}

// =============================================
//  Telegram
// =============================================
function sendTelegram(text) {
  try {
    UrlFetchApp.fetch(`${TELEGRAM_URL}/sendMessage`, {
      method:      "POST",
      contentType: "application/json",
      payload:     JSON.stringify({
        chat_id:                  CHAT_ID,
        text,
        parse_mode:               "Markdown",
        disable_web_page_preview: true
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error("Telegram Error:", e);
  }
}

// =============================================
//  Admin Menu
// =============================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("💜 MA5 Checkout (Trust v2)")
    .addItem("✅ ยืนยันชำระ (Admin)",          "adminForcePaid")
    .addItem("↩️ คืนเงิน (เลือกแถว)",           "adminRefund")
    .addItem("🔍 ตรวจสลิปค้าง (เลือกแถว)",      "retriggerVerification")
    .addItem("📊 สรุปออเดอร์ (รวม legacy)",     "showOrderSummary")
    .addSeparator()
    .addItem("🗑 Wipe test data (ลบทุก row)",   "wipeTestData")
    .addItem("🔧 Ensure Headers",              "manualEnsureHeaders")
    .addItem("🧪 ทดสอบ SlipOK",                "testSlipOK")
    .addItem("🧪 ทดสอบ Member Lookup",         "testMemberLookup")
    .addToUi();
}

// =============================================
//  Admin refund — mark row as refunded + alert
//  Quota counter auto-skips refunded rows.
// =============================================
function adminRefund() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const name   = String(sheet.getRange(row, COL_NAME).getValue() || "");
  const phone  = String(sheet.getRange(row, COL_PHONE).getValue() || "");
  const boxes  = parseInt(sheet.getRange(row, COL_BOXES).getValue()) || 0;
  const status = String(sheet.getRange(row, COL_STATUS).getValue() || "");
  if (!name) { ui.alert("⚠️ row นี้ไม่มีข้อมูลลูกค้า"); return; }

  const adminPrompt = ui.prompt("📌 Admin", "ชื่อแอดมิน:", ui.ButtonSet.OK_CANCEL);
  if (adminPrompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = adminPrompt.getResponseText().trim();
  if (!adminName) return;

  const reasonPrompt = ui.prompt("เหตุผลที่คืนเงิน", "เช่น: คอมเมนต์ไม่ตรงกติกา / ปลอมสิทธิ์สมาชิก", ui.ButtonSet.OK_CANCEL);
  if (reasonPrompt.getSelectedButton() !== ui.Button.OK) return;
  const reason = reasonPrompt.getResponseText().trim() || "ไม่ระบุ";

  const total = boxes * PRE_PRICE_BOX;
  const confirm = ui.alert(
    "ยืนยันคืนเงิน",
    `ลูกค้า: ${name}\nเบอร์: ${phone}\nBox: ${boxes} (${total.toLocaleString()} บาท)\nสถานะเดิม: ${status}\n\nแอดมิน: ${adminName}\nเหตุผล: ${reason}\n\n⚠️ โอนเงินคืนผ่าน KShop ก่อนแล้วค่อยกด YES`,
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  const newStatus = `🔄 คืนเงิน · ${adminName} · ${reason}`;
  sheet.getRange(row, COL_STATUS).setValue(newStatus);

  sendTelegram(
    `🔄 *MA5 Checkout — คืนเงิน*\n\n` +
    `👤 ${name}\n` +
    `📱 ${phone}\n` +
    `📦 ${boxes} Box (${total.toLocaleString()} บาท)\n` +
    `📊 สถานะเดิม: ${status}\n` +
    `❌ เหตุผล: ${reason}\n` +
    `✍️ Admin: ${adminName}\n` +
    `🪣 Quota ${boxes} Box คืนเข้าระบบแล้ว`
  );

  // Optional Firebase notify (best-effort)
  try {
    UrlFetchApp.fetch(FIREBASE_WEBHOOK, {
      method:      "post",
      contentType: "application/json",
      payload:     JSON.stringify({
        secret: FIREBASE_SECRET,
        payment: {
          phoneNumber:  normalizePhone(phone),
          customerName: name,
          amount:       total,
          status:       "refunded",
          source:       "ma5_checkout_refund",
          note:         `Refund by ${adminName} | ${reason}`
        }
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error("Firebase refund sync error:", e);
  }

  ui.alert(`🔄 บันทึกคืนเงินแล้ว · ${boxes} Box คืนเข้า quota`);
}

function wipeTestData() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) { ui.alert("ไม่พบ sheet"); return; }
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) { ui.alert("ไม่มี data row"); return; }
  if (ui.alert("ยืนยัน", `ลบ ${lastRow - 1} rows (เก็บ header)?`, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  sheet.deleteRows(2, lastRow - 1);
  ui.alert(`🗑 ลบแล้ว ${lastRow - 1} rows`);
}

function manualEnsureHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) { SpreadsheetApp.getUi().alert("ไม่พบ sheet"); return; }
  ensureHeaders(sheet);
  SpreadsheetApp.getUi().alert("✅ ตั้ง headers แล้ว");
}

function adminForcePaid() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const adminPrompt = ui.prompt("📌 Admin", "ชื่อแอดมิน:", ui.ButtonSet.OK_CANCEL);
  if (adminPrompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = adminPrompt.getResponseText().trim();
  if (!adminName) return;

  if (ui.alert("ยืนยัน", `Admin: ${adminName}`, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const name  = String(sheet.getRange(row, COL_NAME).getValue());
  const phone = String(sheet.getRange(row, COL_PHONE).getValue());
  const boxes = parseInt(sheet.getRange(row, COL_BOXES).getValue()) || 0;
  const total = boxes * PRE_PRICE_BOX;

  sheet.getRange(row, COL_STATUS).setValue("✅ ชำระแล้ว");

  syncToFirebase({
    phoneNumber:  normalizePhone(phone),
    customerName: name,
    amount:       total,
    status:       "verified",
    source:       "ma5_checkout_admin_override",
    note:         `Admin: ${adminName} | Box x${boxes}`
  });

  sendTelegram(`✅ *ADMIN OVERRIDE — MA5 Checkout*\n\n👤 ${name}\n📱 ${phone}\n📦 Box x${boxes}\n💰 ${total.toLocaleString()} บาท\n✍️ ${adminName}`);
  ui.alert(`🎉 ${name} → ✅ ชำระแล้ว`);
}

function retriggerVerification() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const slipUrl = sheet.getRange(row, COL_SLIP).getValue();
  if (!slipUrl) { ui.alert("❌ ไม่มีลิงก์สลิป"); return; }

  const verified = verifySlip(slipUrl);
  const boxes    = parseInt(sheet.getRange(row, COL_BOXES).getValue()) || 0;
  const expected = boxes * PRE_PRICE_BOX;

  if (verified && verified.success) {
    const amt = parseFloat(verified.data.amount);
    if (Math.abs(amt - expected) < 1) {
      sheet.getRange(row, COL_STATUS).setValue("✅ ชำระแล้ว");
      ui.alert(`✅ ผ่าน ยอด ${amt}`);
    } else {
      sheet.getRange(row, COL_STATUS).setValue(`⚠️ ยอดไม่ตรง (${amt}/${expected})`);
      ui.alert(`⚠️ ยอดไม่ตรง (${amt}/${expected})`);
    }
  } else {
    ui.alert("❌ SlipOK ไม่ผ่าน");
  }
}

function showOrderSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let totalOrders = 0, totalBoxes = 0, paid = 0, pending = 0, unpaid = 0, members = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[COL_NAME - 1]) continue;
    const boxes  = parseInt(row[COL_BOXES - 1]) || 0;
    const status = String(row[COL_STATUS - 1] || "");
    const mtype  = String(row[COL_MEMBER_TYPE - 1] || "");
    totalOrders++;
    totalBoxes += boxes;
    if (status.includes("ชำระแล้ว"))      paid++;
    else if (status.includes("รอตรวจสอบ")) pending++;
    else                                  unpaid++;
    if (mtype === "เก่า") members++;
  }

  const legacy    = countLegacyBoxes();
  const grand     = totalBoxes + legacy;
  const remaining = Math.max(0, BOX_QUOTA - grand);

  SpreadsheetApp.getUi().alert("📊 สรุป MA5 Checkout",
    `📋 ออเดอร์ใหม่: ${totalOrders}\n` +
    `📦 Box ใหม่: ${totalBoxes}\n` +
    `🏛 Box legacy: ${legacy}\n` +
    `━━━━━━━━━━━━━━\n` +
    `🪣 รวม ${grand}/${BOX_QUOTA} · เหลือ ${remaining}\n\n` +
    `✅ ${paid} | ⏳ ${pending} | ❌ ${unpaid}\n` +
    `🏰 สมาชิกเดิม: ${members}`,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function testSlipOK() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) return;
  const slipUrl = sheet.getRange(row, COL_SLIP).getValue();
  if (!slipUrl) { ui.alert("❌ ไม่มีลิงก์สลิป"); return; }
  const result = verifySlip(slipUrl);
  if (result && result.success) {
    const d = result.data;
    ui.alert(`✅ สลิปถูกต้อง\n💰 ${d.amount}\n📅 ${d.date}\n👤 ${d.sender ? d.sender.displayName : '-'}`);
  } else {
    ui.alert("❌ ตรวจไม่ผ่าน");
  }
}

function testMemberLookup() {
  const ui = SpreadsheetApp.getUi();
  const p1 = ui.prompt("Test Member Lookup", "เบอร์โทร:", ui.ButtonSet.OK_CANCEL);
  if (p1.getSelectedButton() !== ui.Button.OK) return;
  const p2 = ui.prompt("Test Member Lookup", "ชื่อ-นามสกุล (เว้นว่างได้):", ui.ButtonSet.OK_CANCEL);
  if (p2.getSelectedButton() !== ui.Button.OK) return;
  const result = lookupMember(p1.getResponseText().trim(), p2.getResponseText().trim());
  ui.alert("Result", JSON.stringify(result, null, 2), ui.ButtonSet.OK);
}
