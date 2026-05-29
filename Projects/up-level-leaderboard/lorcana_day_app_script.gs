/**
 * Lorcana Day · 31 พ.ค. 2569 — Signup endpoint
 *
 * Sheet: https://docs.google.com/spreadsheets/d/14lWpIUlZk_vZych5burFjvZV7ojzrgXlUGQehCIP1Aw/edit
 *
 * Deploy: Extensions → Apps Script → paste this → Deploy → New deployment
 *   - Type: Web app
 *   - Execute as: Me (your account)
 *   - Who has access: Anyone
 *   - Copy the /exec URL into newbie-lorcana-day.html (APP_SCRIPT_URL)
 *
 * Endpoints
 *   POST /exec       → write signup row (JSON body)
 *   GET  /exec       → returns { total, byTier, capRemaining, recent: [...] }
 *   GET  /exec?stats → returns stats only
 */

const SHEET_NAME      = 'Signups';
const CAP_TOTAL       = 28;
const CAP_NEWBIE      = 0;   // 0 = no per-tier cap
const CAP_MASTER      = 0;
const EVENT_DATE      = '2026-05-31';
const RECENT_LIMIT    = 50;

// Telegram (reuse Lorcana preorder bot)
const TG_BOT_TOKEN    = '7268878598:AAH7Rj_Gnzg7I2T2zU0Q2nKkGjP8oKsz-b4';
const TG_CHAT_ID      = '-4559569661';

// SlipOK (auto slip verification — reuse preorder credentials)
const SLIPOK_API_KEY  = 'SLIPOKE2TSLQJ';
const SLIPOK_BRANCH   = '58927';

const HEADERS = [
  'timestamp',
  'name',
  'nickname',
  'phone',
  'lineId',
  'tier',
  'tierPrice',
  'hasDeck',
  'sets',
  'paymentStatus',
  'slipUrl',
  'eventDate',
  'eventName',
  'source',
  'notes',
];

const SLIP_FOLDER_NAME = 'LorcanaDay-Slips-2026-05-31';

/* ─────────── SETUP ─────────── */

/** Run once from the Apps Script editor to create + format the sheet. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  // Header row
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.getRange(1, 1, 1, HEADERS.length)
    .setBackground('#FF8C42')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sh.setFrozenRows(1);

  // Column widths
  const widths = [160, 180, 130, 130, 160, 130, 90, 90, 80, 130, 240, 110, 180, 80, 220];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // Force phone column to text format (prevents leading-0 strip)
  const phoneColIdx = HEADERS.indexOf('phone') + 1;
  sh.getRange(2, phoneColIdx, 1000, 1).setNumberFormat('@');

  // Conditional format: paid = green (paymentStatus column = J)
  const rules = sh.getConditionalFormatRules();
  const statusColIdx = HEADERS.indexOf('paymentStatus') + 1;
  const statusColLetter = String.fromCharCode(64 + statusColIdx); // A=1, B=2, ...
  const paidRange = sh.getRange(statusColLetter + '2:' + statusColLetter + '1000');
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('paid')
      .setBackground('#C8E6C9')
      .setRanges([paidRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('pending')
      .setBackground('#FFF59D')
      .setRanges([paidRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('cancelled')
      .setBackground('#FFCDD2')
      .setRanges([paidRange])
      .build()
  );
  sh.setConditionalFormatRules(rules);

  // Touch DriveApp now so the OAuth consent screen requests Drive scope at setup time
  // (so slip upload via doPost won't fail with "no permission to call DriveApp" later)
  try { getSlipFolder_(); } catch (e) { Logger.log('Drive scope warm-up: ' + e); }

  SpreadsheetApp.flush();
  return 'setup complete (sheet + Drive folder ready)';
}

/** Standalone helper Champ can run from editor to grant Drive scope without re-running setup. */
function authorizeDrive() {
  const folder = getSlipFolder_();
  return 'Drive authorized · slip folder: ' + folder.getUrl();
}

/* ─────────── ENDPOINTS ─────────── */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const body = parseBody_(e);

    // Action: slip upload
    if (body.action === 'upload-slip') {
      return handleSlipUpload_(body);
    }

    const row = buildRow_(body);
    const err = validateRow_(row);
    if (err) return json_({ ok: false, error: err }, 400);

    // Cap check
    const stats = getStats_();
    if (stats.total >= CAP_TOTAL) {
      return json_({ ok: false, error: 'เต็มแล้ว — ที่นั่งครบ ' + CAP_TOTAL + ' คน' }, 409);
    }
    if (CAP_NEWBIE > 0 && row.tier === 'newbie' && stats.byTier.newbie >= CAP_NEWBIE) {
      return json_({ ok: false, error: 'tier น้องใหม่เต็ม' }, 409);
    }
    if (CAP_MASTER > 0 && row.tier === 'master' && stats.byTier.master >= CAP_MASTER) {
      return json_({ ok: false, error: 'tier รุ่นพี่เต็ม' }, 409);
    }

    // Duplicate phone check
    const dup = isDuplicate_(row.phone);
    if (dup) {
      return json_({ ok: false, error: 'เบอร์นี้ลงทะเบียนแล้ว' }, 409);
    }

    appendRow_(row);

    // Fire-and-forget Telegram notification
    try { notifyTelegram_(row); } catch (_) { /* never block signup */ }

    return json_({
      ok: true,
      message: 'ลงทะเบียนสำเร็จ',
      total: stats.total + 1,
      capRemaining: CAP_TOTAL - (stats.total + 1),
      tierPrice: row.tierPrice,
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    const stats = getStats_();
    if (e && e.parameter && e.parameter.stats === '1') {
      return json_({ ok: true, ...stats });
    }
    return json_({
      ok: true,
      eventDate: EVENT_DATE,
      capTotal: CAP_TOTAL,
      ...stats,
      recent: getRecent_(RECENT_LIMIT),
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

/* ─────────── HELPERS ─────────── */

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try { return JSON.parse(e.postData.contents); }
  catch (_) { return {}; }
}

function buildRow_(body) {
  const name     = sanitize_(body.name, 80);
  const nickname = sanitize_(body.nickname, 60);
  const phone    = String(body.phone || '').replace(/[^\d]/g, '');
  const lineId   = sanitize_(body.lineId, 80);
  const tier     = body.tier === 'master' ? 'master' : (body.tier === 'newbie' ? 'newbie' : '');
  const price    = tier === 'master' ? 250 : (tier === 'newbie' ? 100 : 0);
  const hasDeck  = body.hasDeck === true || body.hasDeck === 'yes' || body.hasDeck === 'true';
  const sets     = Array.isArray(body.sets) ? body.sets.slice(0, 10).map(s => String(s).slice(0, 20)) : [];

  return {
    timestamp:     new Date(),
    name,
    nickname,
    phone,
    lineId,
    tier,
    tierPrice:     price,
    hasDeck:       hasDeck ? 'yes' : 'no',
    sets:          sets.join(', '),
    paymentStatus: 'pending',
    slipUrl:       '',
    eventDate:     EVENT_DATE,
    eventName:     'lorcana-day-vol-01',
    source:        String(body.source || 'web').slice(0, 30),
    notes:         '',
  };
}

function validateRow_(row) {
  if (!row.name || row.name.length < 2)     return 'ชื่อสั้นเกินไป';
  if (!row.nickname || row.nickname.length < 1) return 'กรอกชื่อเล่น';
  if (!row.phone || row.phone.length < 9)   return 'เบอร์โทรไม่ถูกต้อง';
  if (!row.tier)                            return 'เลือก Tier (น้องใหม่ / รุ่นพี่)';
  return null;
}

function appendRow_(row) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
          || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  const values = HEADERS.map(h => row[h] !== undefined ? row[h] : '');
  sh.appendRow(values);
  // Ensure phone cell is text format on the new row (preserve leading 0)
  const phoneColIdx = HEADERS.indexOf('phone') + 1;
  sh.getRange(sh.getLastRow(), phoneColIdx).setNumberFormat('@').setValue(row.phone);
}

function isDuplicate_(phone) {
  if (!phone) return false;
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return false;
  const phoneCol = HEADERS.indexOf('phone') + 1;
  const range = sh.getRange(2, phoneCol, sh.getLastRow() - 1, 1).getValues();
  // Normalize: digits only, strip leading 0 — covers old rows where Sheets stripped leading zero
  const norm = s => String(s || '').replace(/[^\d]/g, '').replace(/^0+/, '');
  const target = norm(phone);
  return range.some(r => norm(r[0]) === target);
}

function getStats_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const byTier   = { newbie: 0, master: 0 };
  const byStatus = { pending: 0, paid: 0, cancelled: 0 };
  if (!sh || sh.getLastRow() < 2) {
    return { total: 0, byTier, byStatus, capRemaining: CAP_TOTAL };
  }
  const tierCol   = HEADERS.indexOf('tier') + 1;
  const statusCol = HEADERS.indexOf('paymentStatus') + 1;
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
  let total = 0;
  rows.forEach(r => {
    const tier   = String(r[tierCol - 1] || '');
    const status = String(r[statusCol - 1] || 'pending');
    if (tier === 'newbie' || tier === 'master') {
      total++;
      byTier[tier]++;
      if (byStatus[status] !== undefined) byStatus[status]++;
      else byStatus[status] = 1;
    }
  });
  return { total, byTier, byStatus, capRemaining: Math.max(0, CAP_TOTAL - total) };
}

function getRecent_(limit) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  const all = sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues();
  const recent = all.slice(-limit).reverse();
  return recent.map(r => {
    const obj = {};
    HEADERS.forEach((h, i) => obj[h] = r[i]);
    // Public fields only (no phone/email/lineId leaked to /exec GET)
    return {
      timestamp:     obj.timestamp,
      nickname:      obj.nickname,
      tier:          obj.tier,
      paymentStatus: obj.paymentStatus,
    };
  });
}

function sanitize_(s, maxLen) {
  return String(s || '').trim().replace(/[ -]/g, '').slice(0, maxLen);
}

function json_(obj, status) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

/* ─────────── ADMIN ─────────── */

/** Mark a row as paid (by phone) — run from Apps Script editor. */
function markPaid(phone) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('sheet not found');
  const phoneCol = HEADERS.indexOf('phone') + 1;
  const statusCol = HEADERS.indexOf('paymentStatus') + 1;
  const norm = s => String(s || '').replace(/[^\d]/g, '').replace(/^0+/, '');
  const target = norm(phone);
  const data = sh.getRange(2, phoneCol, sh.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (norm(data[i][0]) === target) {
      sh.getRange(i + 2, statusCol).setValue('paid');
      return 'updated row ' + (i + 2);
    }
  }
  return 'not found';
}

/** Quick stats — run from Apps Script editor for a peek. */
function logStats() {
  Logger.log(JSON.stringify(getStats_(), null, 2));
}

/* ─────────── TELEGRAM ─────────── */

function notifyTelegram_(row) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const tierLabel = row.tier === 'master' ? '⚔️ รุ่นพี่' : '🌱 น้องใหม่';
  const deckLabel = row.hasDeck === 'yes' ? 'เอามาเอง' : 'ขอยืม';
  const setsLine  = row.sets ? '🃏 Set: ' + row.sets + '\n' : '';
  const stats = getStats_();
  const remaining = Math.max(0, CAP_TOTAL - stats.total);

  // Plain text (no parse_mode) — name/nickname may contain Markdown-breaking chars (* _ [ ` )
  const msg =
    '🤠 Lorcana Day · สมัครใหม่\n\n' +
    '👤 ' + row.name + ' (' + row.nickname + ')\n' +
    '📞 ' + row.phone + '\n' +
    (row.lineId ? '💬 Line: ' + row.lineId + '\n' : '') +
    '🎟️ ' + tierLabel + ' · ' + row.tierPrice + ' บาท\n' +
    '🃏 Deck: ' + deckLabel + '\n' +
    setsLine +
    '\n📊 รวม: ' + stats.total + '/' + CAP_TOTAL + ' · เหลือ ' + remaining + ' ที่';

  const r = UrlFetchApp.fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: msg,
    }),
    muteHttpExceptions: true,
  });
  const code = r.getResponseCode();
  if (code !== 200) Logger.log('Telegram signup noti failed ' + code + ': ' + r.getContentText());
}

/** Test Telegram from editor */
function testTelegram() {
  notifyTelegram_({
    name: 'ทดสอบ ระบบ',
    nickname: 'tester',
    phone: '0999999999',
    lineId: '@test',
    tier: 'newbie',
    tierPrice: 100,
    hasDeck: 'no',
    sets: '',
  });
}

/* ─────────── SLIP UPLOAD ─────────── */

function handleSlipUpload_(body) {
  const phone = String(body.phone || '').replace(/[^\d]/g, '');
  if (!phone || phone.length < 9) return json_({ ok: false, error: 'phone missing' }, 400);
  if (!body.data) return json_({ ok: false, error: 'file data missing' }, 400);

  // Find row by phone
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return json_({ ok: false, error: 'no signups yet' }, 404);
  const phoneColIdx = HEADERS.indexOf('phone') + 1;
  const data = sh.getRange(2, phoneColIdx, sh.getLastRow() - 1, 1).getValues();
  const norm = s => String(s || '').replace(/[^\d]/g, '').replace(/^0+/, '');
  const target = norm(phone);
  let rowIdx = -1;
  for (let i = 0; i < data.length; i++) {
    if (norm(data[i][0]) === target) { rowIdx = i + 2; break; }
  }
  if (rowIdx < 0) return json_({ ok: false, error: 'ไม่พบการลงทะเบียนของเบอร์นี้' }, 404);

  // Decode base64 → blob → save to Drive folder
  const folder    = getSlipFolder_();
  const mime      = String(body.mimeType || 'image/jpeg');
  const ext       = mime.split('/')[1] || 'jpg';
  const safeName  = phone + '_' + new Date().getTime() + '.' + ext;
  const bytes     = Utilities.base64Decode(body.data);
  const blob      = Utilities.newBlob(bytes, mime, safeName);
  const file      = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const slipUrl   = file.getUrl();

  // SlipOK auto verify (using base64 directly — faster + no Drive sharing race)
  const verify = verifySlip_(body.data);

  // Update row
  const slipColIdx   = HEADERS.indexOf('slipUrl') + 1;
  const statusColIdx = HEADERS.indexOf('paymentStatus') + 1;
  const notesColIdx  = HEADERS.indexOf('notes') + 1;
  const priceColIdx  = HEADERS.indexOf('tierPrice') + 1;
  const expectedPrice = sh.getRange(rowIdx, priceColIdx).getValue();

  let finalStatus = 'slip_uploaded';
  let notes = '';

  if (verify.success) {
    const amount = Number(verify.data && verify.data.amount) || 0;
    const sender = (verify.data && verify.data.sender && verify.data.sender.name) || '';
    if (amount === Number(expectedPrice)) {
      finalStatus = 'paid';
      notes = `✓ SlipOK ${amount}฿ · ${sender}` + (verify.warning ? ' · ' + verify.warning : '');
    } else {
      finalStatus = 'amount_mismatch';
      notes = `⚠ amount ${amount}฿ ≠ tier ${expectedPrice}฿ · ${sender}` + (verify.warning ? ' · ' + verify.warning : '');
    }
  } else {
    notes = `✗ SlipOK: ${verify.message || 'unknown'}`;
  }

  sh.getRange(rowIdx, slipColIdx).setValue(slipUrl);
  sh.getRange(rowIdx, statusColIdx).setValue(finalStatus);
  sh.getRange(rowIdx, notesColIdx).setValue(notes);

  // Telegram noti
  try {
    const nameColIdx = HEADERS.indexOf('nickname') + 1;
    const tierColIdx = HEADERS.indexOf('tier') + 1;
    const nickname = sh.getRange(rowIdx, nameColIdx).getValue();
    const tier     = sh.getRange(rowIdx, tierColIdx).getValue();
    notifySlipUploaded_({
      nickname, phone, tier, price: expectedPrice, slipUrl,
      status: finalStatus, notes,
      verifyAmount: verify.success ? (verify.data && verify.data.amount) : null,
      verifySender: verify.success ? (verify.data && verify.data.sender && verify.data.sender.name) : null,
    });
  } catch (_) {}

  return json_({
    ok: true,
    verified: finalStatus === 'paid',
    status: finalStatus,
    amount: verify.success ? (verify.data && verify.data.amount) : null,
    expected: expectedPrice,
    slipUrl,
  });
}

/** Call SlipOK with base64 slip image — returns { success, data, message, warning }. */
function verifySlip_(base64) {
  if (!base64) return { success: false, message: 'no slip data' };
  try {
    const r = UrlFetchApp.fetch(
      'https://api.slipok.com/api/line/apikey/' + SLIPOK_BRANCH,
      {
        method: 'post',
        headers: {
          'x-authorization': SLIPOK_API_KEY,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ files: base64, log: true }),
        muteHttpExceptions: true,
      }
    );
    const result = JSON.parse(r.getContentText());
    if (result.success) return { success: true, data: result.data };

    // Duplicate slip — already used before
    const dupCodes = [1004, 1012];
    const msg = String(result.message || '');
    if (dupCodes.indexOf(result.code) !== -1 || msg.indexOf('ใช้ไปแล้ว') !== -1 || msg.indexOf('used') !== -1 || msg.indexOf('สลิปซ้ำ') !== -1) {
      return { success: true, data: result.data, warning: 'สลิปนี้เคยถูกตรวจไปแล้ว' };
    }
    return { success: false, message: result.message || ('SlipOK code ' + result.code) };
  } catch (e) {
    return { success: false, message: String(e) };
  }
}

function getSlipFolder_() {
  const props = PropertiesService.getScriptProperties();
  const cached = props.getProperty('SLIP_FOLDER_ID');
  if (cached) {
    try { return DriveApp.getFolderById(cached); } catch (_) { /* fall through */ }
  }
  // Find or create
  const it = DriveApp.getFoldersByName(SLIP_FOLDER_NAME);
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder(SLIP_FOLDER_NAME);
  props.setProperty('SLIP_FOLDER_ID', folder.getId());
  return folder;
}

function notifySlipUploaded_(o) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
  const tierLabel = o.tier === 'master' ? '⚔️ รุ่นพี่' : '🌱 น้องใหม่';

  let header, footer;
  if (o.status === 'paid') {
    header = '✅ Slip PAID · auto-verified';
    footer = '💰 รับ ' + o.verifyAmount + '฿ จาก ' + (o.verifySender || '?') + '\n🎉 mark paid แล้ว';
  } else if (o.status === 'amount_mismatch') {
    header = '⚠️ ยอดสลิปไม่ตรง · ต้องเช็คมือ';
    footer = '💰 สลิป: ' + o.verifyAmount + '฿ (ควรเป็น ' + o.price + '฿)\nผู้โอน: ' + (o.verifySender || '?') + '\n➡️ ตรวจมือ + mark paid ใน sheet';
  } else {
    header = '📎 สลิปใหม่ · ตรวจ SlipOK ไม่ผ่าน';
    footer = '➡️ ' + o.notes + '\nตรวจมือใน sheet';
  }

  const msg =
    header + '\n\n' +
    '👤 ' + o.nickname + '\n' +
    '📞 ' + o.phone + '\n' +
    '🎟️ ' + tierLabel + ' · ' + o.price + '฿\n' +
    '🧾 ' + o.slipUrl + '\n\n' +
    footer;

  const r = UrlFetchApp.fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: msg,
    }),
    muteHttpExceptions: true,
  });
  const code = r.getResponseCode();
  if (code !== 200) Logger.log('Telegram slip noti failed ' + code + ': ' + r.getContentText());
}
