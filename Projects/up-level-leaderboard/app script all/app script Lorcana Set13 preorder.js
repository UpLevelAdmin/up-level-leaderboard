/**
 * =============================================
 *  Lorcana Set 13 — "Attack of the Vine" Preorder
 *  Up Level Academy — Google Apps Script
 *
 *  Receives JSON from lorcana-set13-preorder.html
 *  Saves slip to Drive, verifies via SlipOK, logs to sheet,
 *  notifies Telegram channel.
 *
 *  Sheet: 1IpEqQgX6IuMoENzD1lfR8BsfBwgecGYHUD5WDqSlyiM
 *  Tab:   Responses
 *
 *  No quota limit. No member check. Unlimited preorder.
 *  Preorder closes 2026-06-05 23:59 Asia/Bangkok.
 * =============================================
 */

const SCRIPT_VERSION = "lorcana13.v4";

// ===== Config =====
const SHEET_NAME      = "Responses";
const SLIP_FOLDER_ID  = "1-KShlgHqTIvlnxeNgZDBy0CI53Ue-WsL";

const SLIPOK_API_KEY  = "SLIPOKE2TSLQJ";
const BRANCH_ID       = "58927";

const BOT_TOKEN       = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID         = "-4911555842";
const TELEGRAM_URL    = `https://api.telegram.org/bot${BOT_TOKEN}`;

const CLOSE_AT_ISO    = "2026-05-31T23:59:00+07:00";  // Bangkok
const SHIPPING_FEE    = 100;
const DUP_WINDOW_MS   = 60000;
const DEPOSIT_RATE    = 0.5;   // 50% มัดจำ
const BOOSTER_KEY     = "booster_box";
const BOOSTER_LIMIT   = 4;     // 1 case = 4 boxes ต่อคน

// ===== SKU catalog (must match frontend) =====
const SKUS = [
  { key: "booster_box",      name: "Booster Box",                                price: 4700 },
  { key: "playmat_mike",     name: "Playmat — Mike, Sulley & Boo",               price: 700  },
  { key: "playmat_circle",   name: "Playmat — Circle of Life",                   price: 700  },
  { key: "starter_rapunzel", name: "Collection Starter — Rapunzel Edition",      price: 900  },
  { key: "beast_giftbox",    name: "Beast Gift Box",                             price: 900  },
  { key: "quest_hunny",      name: "Illumineer's Quest — Great Hunny Rescue",    price: 1800 },
  { key: "portfolio_mickey", name: "Mickey & Minnie Fabled Portfolio",           price: 750  }
];

// ===== Column layout (1-based) =====
const COL_TIMESTAMP   = 1;
const COL_NAME        = 2;
const COL_PHONE       = 3;
const COL_SHIPPING    = 4;
const COL_ADDRESS     = 5;
const COL_QTY_START   = 6;                          // F..L = 7 SKU qty columns
const COL_QTY_END     = COL_QTY_START + SKUS.length - 1;
const COL_SUBTOTAL    = COL_QTY_END + 1;            // M
const COL_SHIP_FEE    = COL_SUBTOTAL + 1;           // N
const COL_TOTAL       = COL_SHIP_FEE + 1;           // O  ยอดเต็ม
const COL_DEPOSIT     = COL_TOTAL + 1;              // P  มัดจำ 50%
const COL_REMAINING   = COL_DEPOSIT + 1;            // Q  ยอดคงเหลือ
const COL_SLIP        = COL_REMAINING + 1;          // R
const COL_TRANSREF    = COL_SLIP + 1;               // S
const COL_SENDER      = COL_TRANSREF + 1;           // T
const COL_STATUS      = COL_SENDER + 1;             // U
const COL_NOTES       = COL_STATUS + 1;             // V

// =============================================
//  Helpers
// =============================================
function normalizePhone(p) {
  let s = String(p || "").replace(/[^\d]/g, "");
  if (s.length === 11 && s.startsWith("66")) s = s.substring(2);
  if (s.length === 9 && /^[689]/.test(s))    s = "0" + s;
  return s;
}

function normalizeName(s) {
  return String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

const NAME_PREFIXES = [
  "นาย", "นาง", "นางสาว", "น.ส.", "นส.", "นส",
  "ด.ช.", "ด.ญ.", "ดช.", "ดญ.", "ดร.", "ดร",
  "mr.", "mr", "mrs.", "mrs", "ms.", "ms", "dr.", "dr"
];
function stripPrefix(name) {
  let n = normalizeName(name);
  if (!n) return "";
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

function isPreorderClosed() {
  return Date.now() >= new Date(CLOSE_AT_ISO).getTime();
}

// =============================================
//  doGet — Router
// =============================================
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  try {
    if (action === "order_status") {
      return jsonResponse(getOrderStatus(e.parameter.phone));
    }
    if (action === "recent") {
      return jsonResponse(getRecentOrders(parseInt(e.parameter.limit) || 5));
    }
    return jsonResponse(getSummary());
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

// Return last N orders with PII masked (first 5 chars of name, last-4 hidden phone)
function getRecentOrders(limit) {
  const n = Math.min(Math.max(1, limit || 5), 10);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { found: false, orders: [] };

  const data = sheet.getDataRange().getValues();
  const out  = [];
  // Walk from newest to oldest (bottom to top)
  for (let i = data.length - 1; i >= 1 && out.length < n; i--) {
    const row = data[i];
    const name   = String(row[COL_NAME - 1] || "").trim();
    if (!name) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;

    const phoneRaw = normalizePhone(row[COL_PHONE - 1]);
    const phoneMasked = phoneRaw.length >= 7
      ? phoneRaw.substring(0, 3) + "-XXX-" + phoneRaw.substring(phoneRaw.length - 4)
      : "xxx-xxx-xxxx";

    // First word (or first 5 Thai chars) of name + …
    const stripped = stripPrefix(name);
    const namePart = stripped.length > 5 ? stripped.substring(0, 5) + "…" : stripped;

    // Item summary (count of all SKU qty)
    let itemQty = 0;
    for (let s = 0; s < SKUS.length; s++) itemQty += parseInt(row[COL_QTY_START - 1 + s]) || 0;

    const ts = row[COL_TIMESTAMP - 1];
    out.push({
      name:      namePart,
      phone:     phoneMasked,
      items:     itemQty,
      verified:  status.indexOf("มัดจำแล้ว") >= 0,
      timestamp: ts instanceof Date ? ts.toISOString() : String(ts)
    });
  }
  return { found: out.length > 0, count: out.length, orders: out };
}

function getSummary() {
  return {
    version:      SCRIPT_VERSION,
    closeAt:      CLOSE_AT_ISO,
    closed:       isPreorderClosed(),
    skus:         SKUS,
    shipping:     SHIPPING_FEE,
    depositRate:  DEPOSIT_RATE,
    boosterLimit: BOOSTER_LIMIT
  };
}

// Customer-safe order lookup (no slip URL, no address)
function getOrderStatus(phone) {
  const normPhone = normalizePhone(phone);
  if (!normPhone) return { found: false, reason: "no_phone" };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { found: false, reason: "sheet_not_found" };

  const data   = sheet.getDataRange().getValues();
  const orders = [];
  for (let i = 1; i < data.length; i++) {
    const row      = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;

    const items = [];
    for (let s = 0; s < SKUS.length; s++) {
      const q = parseInt(row[COL_QTY_START - 1 + s]) || 0;
      if (q > 0) items.push({ name: SKUS[s].name, qty: q });
    }

    const ts = row[COL_TIMESTAMP - 1];
    orders.push({
      timestamp: ts instanceof Date ? ts.toISOString() : String(ts),
      name:      String(row[COL_NAME - 1] || ""),
      shipping:  String(row[COL_SHIPPING - 1] || ""),
      items:     items,
      total:     parseFloat(row[COL_TOTAL - 1]) || 0,
      deposit:   parseFloat(row[COL_DEPOSIT - 1]) || 0,
      remaining: parseFloat(row[COL_REMAINING - 1]) || 0,
      status:    String(row[COL_STATUS - 1] || "")
    });
  }
  return { found: orders.length > 0, count: orders.length, orders: orders };
}

// =============================================
//  Quantity / cart helpers
// =============================================
function readQtyMap(body) {
  const items = body && body.items ? body.items : {};
  const qtyArr = SKUS.map(s => Math.max(0, parseInt(items[s.key]) || 0));
  const totalQty = qtyArr.reduce((a, b) => a + b, 0);
  const subtotal = SKUS.reduce((sum, s, i) => sum + qtyArr[i] * s.price, 0);
  return { qtyArr, totalQty, subtotal };
}

function findDuplicateTransRef(sheet, transRef) {
  if (!transRef) return -1;
  const tr = String(transRef).trim();
  if (!tr) return -1;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const existing = String(data[i][COL_TRANSREF - 1] || "").trim();
    if (existing && existing === tr) return i + 1;
  }
  return -1;
}

// Count active booster boxes ordered by a phone (skip cancelled/refunded rows)
function countBoosterForPhone(sheet, normPhone) {
  const boosterIdx = SKUS.findIndex(s => s.key === BOOSTER_KEY);
  if (boosterIdx < 0) return 0;
  const col  = COL_QTY_START + boosterIdx;
  const data = sheet.getDataRange().getValues();
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;
    total += parseInt(row[col - 1]) || 0;
  }
  return total;
}

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

// =============================================
//  doPost — Submit order
// =============================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) {
    return jsonResponse({ success: false, error: "busy_try_again" });
  }

  try {
    if (isPreorderClosed()) {
      return jsonResponse({ success: false, error: "preorder_closed" });
    }

    const body = JSON.parse(e.postData.contents);

    if (!body.customerName || !body.phone) {
      return jsonResponse({ success: false, error: "missing_fields" });
    }

    const shipping = String(body.shipping || "").toLowerCase();
    if (shipping !== "pickup" && shipping !== "ship") {
      return jsonResponse({ success: false, error: "invalid_shipping" });
    }
    const address = String(body.address || "").trim();
    if (shipping === "ship" && address.length < 10) {
      return jsonResponse({ success: false, error: "address_required" });
    }

    const { qtyArr, totalQty, subtotal } = readQtyMap(body);
    if (totalQty <= 0) {
      return jsonResponse({ success: false, error: "empty_cart" });
    }

    const shipFee   = shipping === "ship" ? SHIPPING_FEE : 0;
    const total     = subtotal + shipFee;
    // Deposit = 50% ของยอดสินค้าเท่านั้น (ค่าส่งเก็บทีหลังพร้อมยอดคงเหลือ)
    const deposit   = Math.round(subtotal * DEPOSIT_RATE);
    const remaining = total - deposit;

    if (!body.slipBase64) {
      return jsonResponse({ success: false, error: "missing_slip" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ success: false, error: "sheet_not_found" });
    ensureHeaders(sheet);

    const normPhone = normalizePhone(body.phone);
    if (isRecentDuplicate(sheet, normPhone)) {
      return jsonResponse({
        success: false,
        error:   "duplicate_recent",
        message: "พบการสั่งซื้อจากเบอร์นี้เมื่อสักครู่ — รอสักครู่แล้วลองใหม่"
      });
    }

    // Booster Box per-person limit (1 case = BOOSTER_LIMIT boxes)
    const boosterIdx       = SKUS.findIndex(s => s.key === BOOSTER_KEY);
    const requestedBooster = boosterIdx >= 0 ? qtyArr[boosterIdx] : 0;
    if (requestedBooster > 0) {
      const existingBooster = countBoosterForPhone(sheet, normPhone);
      if (existingBooster + requestedBooster > BOOSTER_LIMIT) {
        return jsonResponse({
          success:   false,
          error:     "booster_limit_exceeded",
          existing:  existingBooster,
          requested: requestedBooster,
          limit:     BOOSTER_LIMIT,
          message:   `Booster Box จำกัด ${BOOSTER_LIMIT} กล่อง/ท่าน (1 case) · ของท่านมีอยู่แล้ว ${existingBooster} กล่อง`
        });
      }
    }

    // Save slip
    const slipUrl = saveImageToDrive(body.slipBase64, body.phone, "slip");

    // SlipOK
    let status         = "⏳ รอตรวจสอบสลิป";
    let transRef       = "";
    let senderName     = "";
    let senderMismatch = false;
    let verifiedAmount = null;

    if (slipUrl) {
      const verified = verifySlip(slipUrl);
      if (verified && verified.success) {
        const amt = parseFloat(verified.data.amount);
        transRef  = verified.data.transRef || "";

        if (transRef) {
          const dupRow = findDuplicateTransRef(sheet, transRef);
          if (dupRow > 0) {
            return jsonResponse({
              success:  false,
              error:    "duplicate_slip",
              message:  `สลิปนี้เคยถูกใช้แล้ว (อ้างอิงแถว ${dupRow})`,
              transRef: transRef
            });
          }
        }

        const senderObj = verified.data.sender || {};
        senderName = String(senderObj.displayName || senderObj.name || "").trim();
        if (senderName) {
          const senderFirst   = firstWord(senderName);
          const customerFirst = firstWord(body.customerName);
          if (senderFirst && customerFirst && senderFirst !== customerFirst) {
            senderMismatch = true;
          }
        }

        if (Math.abs(amt - deposit) < 1) {
          status         = "✅ มัดจำแล้ว";
          verifiedAmount = amt;
        } else {
          status = `⚠️ ยอดไม่ตรง (${amt}/${deposit})`;
        }

        if (senderMismatch) status += ` ⚠️ sender:${senderName}`;
      }
    }

    // Build row
    const row = [
      new Date(),                  // A timestamp
      body.customerName,           // B name
      "'" + body.phone,            // C phone (text-cast)
      shipping === "ship" ? "จัดส่ง" : "รับที่ร้าน",  // D
      shipping === "ship" ? address : "",             // E
      ...qtyArr,                                       // F..L SKU qty
      subtotal,                                        // M
      shipFee,                                         // N
      total,                                           // O total full
      deposit,                                         // P deposit 50%
      remaining,                                       // Q remaining
      slipUrl,                                         // R
      transRef,                                        // S
      senderName,                                      // T
      status,                                          // U
      SCRIPT_VERSION                                   // V
    ];
    sheet.appendRow(row);
    SpreadsheetApp.flush();

    // Telegram
    const itemLines = SKUS
      .map((s, i) => qtyArr[i] > 0 ? `   • ${s.name} × ${qtyArr[i]}` : "")
      .filter(Boolean)
      .join("\n");
    const shipLine = shipping === "ship"
      ? `🚚 จัดส่ง (+${SHIPPING_FEE} บาท)\n📍 ${address}`
      : `🏬 รับที่ร้าน`;
    const senderLine = senderMismatch ? `⚠️ Sender ไม่ตรง: ${senderName}\n` : "";

    sendTelegram(
      `🌿 *Lorcana Set 13 — ออเดอร์ใหม่!*\n\n` +
      `👤 ${body.customerName}\n` +
      `📱 ${body.phone}\n` +
      `${shipLine}\n` +
      `🛒 รายการ (${totalQty} ชิ้น):\n${itemLines}\n` +
      `💰 ยอดเต็ม ${total.toLocaleString()} บาท\n` +
      `💵 มัดจำ 50% สินค้า = ${deposit.toLocaleString()} บาท (คงเหลือ + ค่าส่ง ${remaining.toLocaleString()})\n` +
      `📊 ${status}\n` +
      senderLine +
      (slipUrl ? `🧾 [Slip](${slipUrl})` : "")
    );

    return jsonResponse({
      success:  true,
      status:   status,
      slipUrl:  slipUrl,
      verified: status === "✅ มัดจำแล้ว",
      total:    total,
      deposit:  deposit,
      remaining: remaining,
      subtotal: subtotal,
      shipFee:  shipFee,
      itemCount: totalQty
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
    "เบอร์ติดต่อ",
    "วิธีรับสินค้า",
    "ที่อยู่จัดส่ง"
  ];
  SKUS.forEach(s => headers.push(s.name));
  headers.push("ยอดสินค้า", "ค่าส่ง", "ยอดรวม", "มัดจำ 50%", "คงเหลือ", "สลิป URL", "Slip TransRef", "ชื่อผู้โอน", "สถานะ", "Version");

  for (let c = 0; c < headers.length; c++) {
    const cell = sheet.getRange(1, c + 1);
    if (!cell.getValue()) cell.setValue(headers[c]);
  }
  // Optional: bold + freeze row 1 once
  try {
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1);
  } catch (e) {}
}

// =============================================
//  Drive — save base64 image
// =============================================
function saveImageToDrive(base64Str, phone, prefix) {
  try {
    const match = base64Str.match(/^data:(.+);base64,(.+)$/);
    if (!match) return "";
    const mimeType = match[1];
    const bytes    = Utilities.base64Decode(match[2]);
    const ext = mimeType.includes("png") ? "png"
            : ((mimeType.includes("jpeg") || mimeType.includes("jpg")) ? "jpg" : "img");
    const blob = Utilities.newBlob(bytes, mimeType, `${prefix}_${normalizePhone(phone)}_${Date.now()}.${ext}`);
    const folder = DriveApp.getFolderById(SLIP_FOLDER_ID);
    const file   = folder.createFile(blob);
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
    .createMenu("🌿 Lorcana Set 13")
    .addItem("✅ ยืนยันชำระ (Admin)",       "adminForcePaid")
    .addItem("↩️ คืนเงิน (เลือกแถว)",        "adminRefund")
    .addItem("🔍 ตรวจสลิปค้าง (เลือกแถว)",   "retriggerVerification")
    .addItem("📊 สรุปออเดอร์",               "showOrderSummary")
    .addSeparator()
    .addItem("🔧 Ensure Headers",           "manualEnsureHeaders")
    .addItem("🧪 ทดสอบ SlipOK",             "testSlipOK")
    .addToUi();
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

  const name    = String(sheet.getRange(row, COL_NAME).getValue());
  const phone   = String(sheet.getRange(row, COL_PHONE).getValue());
  const deposit = parseFloat(sheet.getRange(row, COL_DEPOSIT).getValue()) || 0;
  const total   = parseFloat(sheet.getRange(row, COL_TOTAL).getValue()) || 0;

  sheet.getRange(row, COL_STATUS).setValue("✅ มัดจำแล้ว");
  sendTelegram(`✅ *ADMIN OVERRIDE — Lorcana 13*\n👤 ${name}\n📱 ${phone}\n💵 มัดจำ ${deposit.toLocaleString()} / เต็ม ${total.toLocaleString()}\n✍️ ${adminName}`);
  ui.alert(`🎉 ${name} → ✅ มัดจำแล้ว`);
}

function adminRefund() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const name  = String(sheet.getRange(row, COL_NAME).getValue() || "");
  const phone = String(sheet.getRange(row, COL_PHONE).getValue() || "");
  const total = parseFloat(sheet.getRange(row, COL_TOTAL).getValue()) || 0;
  if (!name) { ui.alert("⚠️ row นี้ไม่มีข้อมูลลูกค้า"); return; }

  const adminPrompt = ui.prompt("📌 Admin", "ชื่อแอดมิน:", ui.ButtonSet.OK_CANCEL);
  if (adminPrompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = adminPrompt.getResponseText().trim();
  if (!adminName) return;

  const reasonPrompt = ui.prompt("เหตุผลที่คืนเงิน", "เช่น: ลูกค้ายกเลิก / ยอดไม่ตรง", ui.ButtonSet.OK_CANCEL);
  if (reasonPrompt.getSelectedButton() !== ui.Button.OK) return;
  const reason = reasonPrompt.getResponseText().trim() || "ไม่ระบุ";

  const confirm = ui.alert(
    "ยืนยันคืนเงิน",
    `ลูกค้า: ${name}\nเบอร์: ${phone}\n💰 ${total.toLocaleString()} บาท\nAdmin: ${adminName}\nเหตุผล: ${reason}\n\n⚠️ โอนเงินคืนผ่าน KShop ก่อนแล้วค่อยกด YES`,
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  sheet.getRange(row, COL_STATUS).setValue(`🔄 คืนเงิน · ${adminName} · ${reason}`);
  sendTelegram(
    `🔄 *Lorcana 13 — คืนเงิน*\n\n👤 ${name}\n📱 ${phone}\n💰 ${total.toLocaleString()} บาท\n❌ ${reason}\n✍️ ${adminName}`
  );
  ui.alert(`🔄 บันทึกคืนเงินแล้ว`);
}

function retriggerVerification() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const slipUrl = sheet.getRange(row, COL_SLIP).getValue();
  if (!slipUrl) { ui.alert("❌ ไม่มีลิงก์สลิป"); return; }

  const verified = verifySlip(slipUrl);
  const deposit  = parseFloat(sheet.getRange(row, COL_DEPOSIT).getValue()) || 0;

  if (verified && verified.success) {
    const amt = parseFloat(verified.data.amount);
    if (Math.abs(amt - deposit) < 1) {
      sheet.getRange(row, COL_STATUS).setValue("✅ มัดจำแล้ว");
      ui.alert(`✅ ผ่าน ยอด ${amt}`);
    } else {
      sheet.getRange(row, COL_STATUS).setValue(`⚠️ ยอดไม่ตรง (${amt}/${deposit})`);
      ui.alert(`⚠️ ยอดไม่ตรง (${amt}/${deposit})`);
    }
  } else {
    ui.alert("❌ SlipOK ไม่ผ่าน");
  }
}

function showOrderSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let totalOrders = 0, depositRevenue = 0, fullRevenue = 0;
  let paid = 0, pending = 0, unpaid = 0, refunded = 0;
  const skuTotals = SKUS.map(() => 0);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[COL_NAME - 1]) continue;
    const status      = String(row[COL_STATUS - 1] || "");
    const orderTotal  = parseFloat(row[COL_TOTAL - 1])   || 0;
    const orderDeposit = parseFloat(row[COL_DEPOSIT - 1]) || 0;

    totalOrders++;
    if (status.includes("คืนเงิน") || status.includes("ยกเลิก")) {
      refunded++;
    } else {
      if (status.includes("มัดจำแล้ว"))    { paid++; depositRevenue += orderDeposit; fullRevenue += orderTotal; }
      else if (status.includes("รอตรวจ"))   pending++;
      else                                  unpaid++;
      for (let s = 0; s < SKUS.length; s++) {
        skuTotals[s] += parseInt(row[COL_QTY_START - 1 + s]) || 0;
      }
    }
  }

  const skuLines = SKUS.map((s, i) => `${s.name}: ${skuTotals[i]}`).join("\n");
  SpreadsheetApp.getUi().alert("📊 สรุป Lorcana Set 13",
    `📋 ออเดอร์: ${totalOrders}\n` +
    `✅ ${paid} | ⏳ ${pending} | ❌ ${unpaid} | 🔄 ${refunded}\n` +
    `💵 มัดจำที่ verified: ${depositRevenue.toLocaleString()} บาท\n` +
    `💰 ยอดเต็ม (ถ้าครบ): ${fullRevenue.toLocaleString()} บาท\n` +
    `━━━━━━━━━━━━━━\n${skuLines}`,
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
