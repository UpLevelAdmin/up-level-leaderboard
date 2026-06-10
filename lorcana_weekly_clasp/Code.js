/**
 * Lorcana Weekly Play — GAS Backend
 *
 * Sheet layout ("Form Responses 1"):
 *   A=Timestamp · B=วันที่ · C=ชื่อ-นามสกุล (Eng) · D=ชื่อเล่น ·
 *   E=Event (Pack Rush / Core Constructed) · F=เบอร์ ·
 *   G=ระดับ · H=ค่าสมัคร · I=ยืนยัน · J=สลิป · K=สถานะ
 *
 * Endpoints:
 *   GET ?type=json                              → groupedData by date (with eventType)
 *   GET ?op=lookupPhone&phone=09xxxxxxxx        → last registration profile
 *   POST {json body}                            → register + slip OK + notify
 */

// ============================================================
// CONFIG — match gym GAS so behaviour stays consistent
// ============================================================
const SHEET_NAME = "Form Responses 1";
const SLIP_FOLDER_NAME = "Lorcana Weekly Slips";

const PRICES = { "Pack Rush": 400, "Core Constructed": 200 };
const ON_DEMAND = "On-demand · นัดเล่น (ครบ 4 คนจัดเลย)";

// Telegram (reuse gym group for now — Champ can swap if he wants its own channel)
const BOT_TOKEN = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID = "-4911555842";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// SlipOK (shared)
const SLIPOK_API_KEY = "SLIPOKE2TSLQJ";
const BRANCH_ID = "58927";

// Firestore mirror (so the team-dashboard / payment widgets pick up payments)
const FIREBASE_PROJECT_ID = "up-level-guild";
const FIREBASE_API_KEY = "AIzaSyAKxWv3FI7HrdrRlnJhsQbJ-97Pb_sdiOQ";
const FIRESTORE_COLLECTION = "public_payments";

const PUBLIC_LIST_URL = "https://uplevelguild.netlify.app/lorcana-weekly";

// ============================================================
// Helpers
// ============================================================
function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function normalizePhone_(s) {
  let p = String(s == null ? "" : s).replace(/[^\d]/g, "");
  if (p.length === 9 && p.charAt(0) !== "0") p = "0" + p;
  if (p.length === 11 && p.indexOf("66") === 0) p = "0" + p.substring(2);
  if (p.length === 12 && p.indexOf("660") === 0) p = p.substring(2);
  while (p.length > 10 && p.charAt(0) === "0" && p.charAt(1) === "0") p = p.substring(1);
  return p;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 14).setValues([[
      "Timestamp", "วันที่", "ชื่อ-นามสกุล (Eng)", "ชื่อเล่น",
      "Event", "เบอร์", "ระดับ", "ค่าสมัคร", "ยืนยัน", "สลิป", "สถานะ",
      "OD วันที่", "OD เวลา", "OD ข้อความ"
    ]]);
    sheet.setFrozenRows(1);
    sheet.getRange("F:F").setNumberFormat("@");
  } else if (sheet.getLastColumn() < 14) {
    // backfill new headers when upgrading
    const lastCol = sheet.getLastColumn();
    const extras = ["OD วันที่", "OD เวลา", "OD ข้อความ"];
    sheet.getRange(1, lastCol + 1, 1, 14 - lastCol).setValues([extras.slice(0, 14 - lastCol)]);
  }
  return sheet;
}

// ============================================================
// Drive slip upload
// ============================================================
function findSlipFolder_() {
  const it = DriveApp.getFoldersByName(SLIP_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(SLIP_FOLDER_NAME);
}

function uploadSlipToDrive_(base64Data, mime, filename) {
  if (!base64Data) return "";
  const idx = base64Data.indexOf("base64,");
  const raw = idx >= 0 ? base64Data.substring(idx + 7) : base64Data;
  const decoded = Utilities.base64Decode(raw);
  const blob = Utilities.newBlob(decoded, mime || "image/jpeg", filename || ("slip_" + Date.now() + ".jpg"));
  const folder = findSlipFolder_();
  const file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  return file.getUrl();
}

function getFileIdFromUrl_(url) {
  if (!url) return "";
  if (url.indexOf("?id=") > 0) return url.split("?id=")[1].split("&")[0];
  const m = url.match(/[-\w]{25,}/);
  return (m && m[0]) || "";
}

function setFilePublic_(url) {
  if (!url) return;
  try {
    const id = getFileIdFromUrl_(url);
    if (id) DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) { console.warn("setFilePublic failed: " + e); }
}

function convertDriveUrlToDirectLink_(url) {
  if (!url) return "";
  const id = getFileIdFromUrl_(url);
  return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
}

// ============================================================
// SlipOK verification
// ============================================================
function verifySlipDirectly_(fileUrl, expectedAmount) {
  if (!fileUrl) return null;
  try {
    const id = getFileIdFromUrl_(fileUrl);
    if (!id) return null;
    const blob = DriveApp.getFileById(id).getBlob();
    const options = {
      method: "post",
      headers: { "x-authorization": SLIPOK_API_KEY, "Content-Type": "application/json" },
      payload: JSON.stringify({ files: Utilities.base64Encode(blob.getBytes()), log: true, amount: expectedAmount }),
      muteHttpExceptions: true
    };
    const res = UrlFetchApp.fetch(`https://api.slipok.com/api/line/apikey/${BRANCH_ID}`, options);
    const result = JSON.parse(res.getContentText());
    if (result.success) return { success: true, data: result.data };
    // duplicate slip = still a real slip
    if (result.data && (result.code === 1004 || result.code === 1012 ||
        (result.message && (result.message.indexOf("ใช้ไปแล้ว") >= 0 || result.message.indexOf("used") >= 0 || result.message.indexOf("สลิปซ้ำ") >= 0)))) {
      return { success: true, data: result.data, duplicate: true };
    }
    console.warn("SlipOK fail: " + (result.message || "") + " code=" + result.code);
    return null;
  } catch (e) {
    console.error("verifySlip error: " + e);
    return null;
  }
}

// ============================================================
// Firestore mirror (public_payments)
// ============================================================
function firestoreField_(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  return { stringValue: String(v) };
}

function syncToFirebasePayment_(data) {
  data.slipUrl = convertDriveUrlToDirectLink_(data.slipUrl);
  const fields = {};
  Object.keys(data).forEach(k => { fields[k] = firestoreField_(data[k]); });
  fields.createdAt = { timestampValue: new Date().toISOString() };
  fields.updatedAt = { timestampValue: new Date().toISOString() };
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${FIRESTORE_COLLECTION}?key=${FIREBASE_API_KEY}`;
  try {
    const res = UrlFetchApp.fetch(url, {
      method: "post", contentType: "application/json",
      payload: JSON.stringify({ fields: fields }), muteHttpExceptions: true
    });
    if (res.getResponseCode() !== 200) console.error("Firestore err: " + res.getContentText());
  } catch (e) { console.error("syncFirestore: " + e); }
}

// ============================================================
// Telegram notify
// ============================================================
function notifyTelegram_(rec) {
  const guildHeader = "🛡️ *Up Level Notifier* 🛡️";
  const eventEmoji = rec.eventType === "Pack Rush" ? "📦" : "⚔️";
  let msg = `${guildHeader}\n✨ *มีคนสมัคร Lorcana Weekly!*\n\n` +
            `${eventEmoji} *Event:* ${rec.eventType} (${rec.amount} ฿)\n` +
            `👤 *ชื่อเล่น:* ${rec.nickname}\n` +
            `📱 *เบอร์โทร:* ${rec.phone}\n` +
            `🎯 *ระดับ:* ${rec.level}\n` +
            `📅 *วันที่:* ${rec.selectedDate}\n` +
            `💰 *สลิป:* ${rec.verificationStatus}\n\n` +
            `📊 *รวมวันนี้:* ${rec.countForDate} คน`;
  if (rec.slipUrl && !rec.isSlipVerified) {
    msg += `\n\n📎 [ดูสลิป](${rec.slipUrl})\n⚠️ *กรุณาตรวจสอบ/อนุมัติ*`;
  }
  msg += `\n\n📊 [รายชื่อทั้งหมด](${PUBLIC_LIST_URL})`;

  const payload = { chat_id: CHAT_ID, text: msg, parse_mode: "Markdown", disable_web_page_preview: false };
  try {
    UrlFetchApp.fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      payload: JSON.stringify(payload), muteHttpExceptions: true
    });
  } catch (e) { console.warn("Telegram send failed: " + e); }
}

// ============================================================
// doPost — registration
// ============================================================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const phone = normalizePhone_(body.phone);
    if (!phone) return jsonOut_({ ok: false, error: "missing phone" });
    if (!body.selectedDate) return jsonOut_({ ok: false, error: "missing date" });
    if (!body.eventType || !PRICES[body.eventType]) return jsonOut_({ ok: false, error: "invalid eventType" });
    if (!body.nickname) return jsonOut_({ ok: false, error: "missing nickname" });
    if (!body.level) return jsonOut_({ ok: false, error: "missing level" });
    if (!body.accept) return jsonOut_({ ok: false, error: "must accept terms" });

    const eventType = body.eventType;
    const amount = PRICES[eventType];

    let slipUrl = "";
    if (body.slipBase64) slipUrl = uploadSlipToDrive_(body.slipBase64, body.slipMime, body.slipFilename);

    const isOd = body.selectedDate === ON_DEMAND;
    const odDate = isOd ? (body.odDate || "") : "";
    const odTime = isOd ? (body.odTime || "") : "";
    const odMessage = isOd ? (body.odMessage || "") : "";
    if (isOd && !odDate) return jsonOut_({ ok: false, error: "on-demand ต้องเลือกวันที่" });

    const sheet = getSheet_();
    const timestamp = new Date();
    const row = [
      timestamp,
      body.selectedDate,
      body.name || "",
      body.nickname,
      eventType,
      phone,
      body.level,
      amount,
      "ฉันยอมรับเงื่อนไขทั้งหมดและยืนยันการสมัคร",
      slipUrl,
      "",
      odDate,
      odTime,
      odMessage
    ];
    sheet.appendRow(row);
    const rowIndex = sheet.getLastRow();
    sheet.getRange(rowIndex, 6).setNumberFormat("@").setValue(phone);
    if (odDate) sheet.getRange(rowIndex, 12).setNumberFormat("@").setValue(odDate);
    if (odTime) sheet.getRange(rowIndex, 13).setNumberFormat("@").setValue(odTime);

    // Pipeline: slip OK + Firestore + Telegram + status
    let verificationStatus = "⚠️ ไม่ได้แนบสลิป";
    let isSlipVerified = false;
    let slipData = { amount: 0, transRef: "" };

    if (slipUrl) {
      setFilePublic_(slipUrl);
      const result = verifySlipDirectly_(slipUrl, amount);
      if (result && result.success) {
        isSlipVerified = true;
        verificationStatus = result.duplicate ? "✅ ตรวจสอบแล้ว (สลิปซ้ำ-ผ่าน)" : "✅ ตรวจสอบแล้ว (Auto)";
        slipData = result.data || slipData;

        // amount mismatch warning (don't block, just flag)
        const slipAmount = Number(slipData.amount || 0);
        if (slipAmount && Math.abs(slipAmount - amount) > 0.5) {
          verificationStatus = `⚠️ ยอดไม่ตรง (สลิป ${slipAmount} ≠ ${amount}) — ตรวจสอบ`;
          sheet.getRange(rowIndex, 11).setValue(verificationStatus);
        } else {
          sheet.getRange(rowIndex, 11).setValue("✅ ชำระแล้ว (Auto)");
        }

        syncToFirebasePayment_({
          phoneNumber: phone, customerName: body.nickname, amount: slipAmount || amount,
          transRef: slipData.transRef || "", senderName: (slipData.sender && slipData.sender.name) || "",
          transferDate: slipData.transTimestamp || "", status: 'verified',
          source: 'lorcana_weekly', slipUrl: slipUrl, eventType: eventType, eventDate: body.selectedDate
        });
      } else {
        verificationStatus = "⏳ รอตรวจสอบ (สลิปอ่านไม่ออก)";
        sheet.getRange(rowIndex, 11).setValue("⏳ รอตรวจสอบ (ภาพมีปัญหา)");
        syncToFirebasePayment_({
          phoneNumber: phone, customerName: body.nickname, amount: 0,
          transRef: "MANUAL_CHECK", senderName: "", status: 'manual_check',
          source: 'lorcana_weekly', slipUrl: slipUrl, eventType: eventType, eventDate: body.selectedDate
        });
      }
    } else {
      sheet.getRange(rowIndex, 11).setValue("❌ รอชำระเงิน");
      syncToFirebasePayment_({
        phoneNumber: phone, customerName: body.nickname, amount: 0,
        transRef: "NO_SLIP", senderName: "", status: 'awaiting_payment',
        source: 'lorcana_weekly', slipUrl: "", eventType: eventType, eventDate: body.selectedDate
      });
    }

    // Count for the day (across both events)
    const data = sheet.getDataRange().getValues();
    let countForDate = 0;
    for (let i = 1; i < data.length; i++) if (data[i][1] === body.selectedDate) countForDate++;

    notifyTelegram_({
      eventType: eventType, amount: amount, nickname: body.nickname, phone: phone,
      level: body.level, selectedDate: body.selectedDate,
      verificationStatus: verificationStatus, isSlipVerified: isSlipVerified,
      slipUrl: slipUrl, countForDate: countForDate
    });

    const status = String(sheet.getRange(rowIndex, 11).getValue() || "");
    return jsonOut_({ ok: true, slipUrl: slipUrl, row: rowIndex, status: status });

  } catch (err) {
    console.error("doPost: " + err);
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// ============================================================
// doGet — list + lookup
// ============================================================
function doGet(e) {
  // Lookup by phone (only our own sheet; gym GAS has the cross-form registry)
  if (e && e.parameter && e.parameter.op === "lookupPhone") {
    const phone = normalizePhone_(e.parameter.phone || "");
    if (!phone) return jsonOut_({ found: false });
    const sheet = getSheet_();
    const data = sheet.getDataRange().getValues();
    let last = null;
    for (let i = 1; i < data.length; i++) {
      const rowPhone = normalizePhone_(data[i][5]);
      if (rowPhone && rowPhone === phone) last = data[i];
    }
    if (!last) return jsonOut_({ found: false });
    return jsonOut_({
      found: true,
      source: "current",
      name: String(last[2] || ""),
      nickname: String(last[3] || ""),
      eventType: String(last[4] || ""),
      level: String(last[6] || "")
    });
  }

  // JSON list grouped by date
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const groupedData = {};

  for (let i = 1; i < data.length; i++) {
    const rawDate = String(data[i][1] || "");
    const date = rawDate.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    if (!date) continue;
    if (!groupedData[date]) groupedData[date] = [];
    const hasSlip = (data[i][9] && String(data[i][9]).trim() !== "");
    groupedData[date].push({
      nickname: data[i][3],
      eventType: data[i][4],
      level: data[i][6],
      phone: data[i][5],
      amount: data[i][7],
      paid: hasSlip,
      status: data[i][10] ? String(data[i][10]).trim() : "",
      odDate: data[i][11] ? String(data[i][11]).trim() : "",
      odTime: data[i][12] ? String(data[i][12]).trim() : "",
      odMessage: data[i][13] ? String(data[i][13]).trim() : ""
    });
  }

  // OG preview page — share THIS URL in Line/Telegram for rich preview with live counts
  if (e && e.parameter && e.parameter.op === "preview") {
    return renderPreviewHtml_(groupedData);
  }

  if (!e || !e.parameter || e.parameter.type !== "json") {
    let html = "<h2>Lorcana Weekly · Form Responses</h2>";
    Object.keys(groupedData).forEach(d => {
      html += `<h3>${d} (${groupedData[d].length})</h3><ul>`;
      groupedData[d].forEach(p => {
        html += `<li>${p.nickname} · ${p.eventType} · ${p.status || "—"}</li>`;
      });
      html += "</ul>";
    });
    return HtmlService.createHtmlOutput(html);
  }

  return jsonOut_({ groupedData: groupedData });
}

// ============================================================
// Live preview (rich OG meta for Line/Telegram link sharing)
// ============================================================
function renderPreviewHtml_(groupedData) {
  const od = groupedData[ON_DEMAND] || [];
  const odPack = od.filter(p => String(p.eventType || '').toLowerCase().indexOf('pack') >= 0).length;
  const odCore = od.length - odPack;

  // Find next scheduled date (Mon/Sat) — naive scan: latest non-On-demand date
  let nextScheduled = "";
  let nextPack = 0, nextCore = 0;
  Object.keys(groupedData).forEach(d => {
    if (d === ON_DEMAND) return;
    if (!nextScheduled) nextScheduled = d;
  });
  if (nextScheduled) {
    const list = groupedData[nextScheduled] || [];
    nextPack = list.filter(p => String(p.eventType || '').toLowerCase().indexOf('pack') >= 0).length;
    nextCore = list.length - nextPack;
  }

  const odTitle = `📦 ${odPack}/4 · ⚔️ ${odCore}/4`;
  const ogTitle = `🔥 LORCANA On-demand ${odTitle}`;
  const ogDesc = `${ON_DEMAND}\n${nextScheduled ? `ตารางถัดไป: ${nextScheduled} (📦 ${nextPack} · ⚔️ ${nextCore})` : 'จ.19:00 · ส.13:00'}\nค่าสมัคร Pack Rush 400 / Core 200`;
  const ogImage = "https://ravensburger.cloud/cms/gallery/lorcana-web/products/s12-wild-unknown/dlc_s12_stubpage_1080x1080_mobile_hero.png";
  const redirectUrl = "https://uplevelguild.netlify.app/lorcana-weekly";

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml_(ogTitle)}</title>

  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml_(ogTitle)}">
  <meta property="og:description" content="${escapeHtml_(ogDesc)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1080">
  <meta property="og:image:height" content="1080">
  <meta property="og:url" content="${redirectUrl}">
  <meta property="og:site_name" content="Up Level Guild · Lorcana Weekly">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml_(ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml_(ogDesc)}">
  <meta name="twitter:image" content="${ogImage}">

  <meta http-equiv="refresh" content="0; url=${redirectUrl}">
  <link rel="canonical" href="${redirectUrl}">
  <style>
    body{font-family:'Barlow Condensed',sans-serif;background:#0E1A26;color:#F4EAD6;margin:0;padding:2rem;text-align:center}
    a{color:#D4B568;font-weight:700}
  </style>
</head>
<body>
  <h1>${escapeHtml_(ogTitle)}</h1>
  <p>${escapeHtml_(ogDesc).replace(/\n/g, '<br>')}</p>
  <p><a href="${redirectUrl}">→ ไปหน้าสมัคร</a></p>
  <script>location.replace(${JSON.stringify(redirectUrl)});</script>
</body>
</html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function escapeHtml_(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================
// Admin / manual tools
// ============================================================
function batchVerifyExistingSlips() {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const currentStatus = String(data[i][10] || "");
    if (currentStatus.indexOf("ชำระแล้ว") >= 0) continue;
    const slipUrl = data[i][9];
    const amount = Number(data[i][7] || 0);
    if (!slipUrl || String(slipUrl).indexOf("http") < 0) continue;
    setFilePublic_(slipUrl);
    const r = verifySlipDirectly_(slipUrl, amount);
    if (r && r.success) {
      sheet.getRange(i + 1, 11).setValue("✅ ชำระแล้ว (Auto)");
      syncToFirebasePayment_({
        phoneNumber: data[i][5], customerName: data[i][3],
        amount: (r.data && r.data.amount) || amount,
        transRef: (r.data && r.data.transRef) || "",
        status: 'verified', source: 'lorcana_weekly_batch',
        slipUrl: slipUrl, eventType: data[i][4], eventDate: data[i][1]
      });
    } else {
      sheet.getRange(i + 1, 11).setValue("⏳ รอตรวจสอบ (ภาพมีปัญหา)");
    }
    Utilities.sleep(500);
  }
}

function testTelegramNotification() {
  notifyTelegram_({
    eventType: "Pack Rush", amount: 400, nickname: "TEST",
    phone: "0812345678", level: "rookie",
    selectedDate: "วันเสาร์ที่ 13 มิถุนายน 2569",
    verificationStatus: "✅ ตรวจสอบแล้ว", isSlipVerified: true,
    slipUrl: "", countForDate: 1
  });
}
