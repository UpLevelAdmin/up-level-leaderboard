/**
 * Grand Tournament 4 - Google Apps Script
 * เชื่อมต่อกับ Google Form: https://forms.gle/V4JjbAnaA7hPRX8F8
 */

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1');
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const participants = [];
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    participants.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ participants: participants }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ระบบ Slip Verification และ Telegram Notification
 * ต้องตั้งค่า Trigger 'On Form Submit' ให้ฟังก์ชันนี้
 */

const SLIPOK_API_KEY = "SLIPOKE2TSLQJ";
const BRANCH_ID = "58927";
const BOT_TOKEN = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID = "-4911555842"; 
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

function onFormSubmit(e) {
  try {
    const responses = e.values; // Array ของคำตอบตามลำดับ Column
    const timestamp = responses[0];
    
    // พยายามหา Slip URL (หาจากคำตอบที่มี link Google Drive)
    let slipUrl = "";
    for (let i = 0; i < responses.length; i++) {
      if (String(responses[i]).includes("drive.google.com") || String(responses[i]).includes("open?id=")) {
        slipUrl = responses[i];
        break;
      }
    }

    // ข้อมูลจาก Form (ปรับ index ให้ตรงกับ Google Sheet จริง)
    // สำหรับ GT4: กระบวนการดึงข้อมูลควรยืดหยุ่น
    const name = responses[1] || "ไม่ระบุชื่อ";
    const phone = responses[4] || "ไม่ระบุเบอร์";

    // 1. ตรวจสอบ SlipOK และอัปเดตสถานะใน Sheet
    if (e.range && slipUrl) {
      const sheet = e.range.getSheet();
      const row = e.range.getRow();
      
      // หาคอลัมน์ "สถานะ" หรือ "สถานะการชำระเงิน"
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      let statusCol = headers.indexOf("สถานะ") + 1;
      if (statusCol === 0) statusCol = headers.indexOf("สถานะการชำระเงิน") + 1;
      
      // ถ้ายังไม่มีคอลัมน์นี้ ให้สร้างใหม่ในช่องที่ i (Column 9) หรือต่อท้าย
      if (statusCol === 0) {
        statusCol = 9; // ช่อง I
        sheet.getRange(1, statusCol).setValue("สถานะ");
      }

      setFilePublic(slipUrl);
      const verifyResult = verifySlipDirectly(slipUrl);
      
      if (verifyResult && verifyResult.success) {
        sheet.getRange(row, statusCol).setValue("✅ ชำระแล้ว");
        syncToFirebasePayment({
          phoneNumber: phone.replace(/[^\d]/g, ""),
          customerName: name,
          amount: verifyResult.data.amount,
          transRef: verifyResult.data.transRef,
          status: 'verified',
          source: 'gt4_registration',
          slipUrl: slipUrl,
          note: "GT4 Registration"
        });
      } else {
        sheet.getRange(row, statusCol).setValue("⏳ รอตรวจสอบ");
      }
    } else if (e.range) {
       const sheet = e.range.getSheet();
       const row = e.range.getRow();
       const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
       let statusCol = headers.indexOf("สถานะการชำระเงิน") + 1;
       if (statusCol > 0) sheet.getRange(row, statusCol).setValue("❌ รอชำระ");
    }

    // 2. แจ้งเตือน Telegram
    sendTelegramNotification(name, phone, timestamp, !!slipUrl);

  } catch (error) {
    console.error("❌ GT4 onFormSubmit Error:", error);
  }
}

function verifySlipDirectly(fileUrl) {
  try {
    const fileId = getFileIdFromUrl(fileUrl);
    if (!fileId) return null;

    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();

    const options = {
      method: "post",
      headers: {
        "x-authorization": SLIPOK_API_KEY,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({
        files: Utilities.base64Encode(blob.getBytes()),
        log: true
      }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(`https://api.slipok.com/api/line/apikey/${BRANCH_ID}`, options);
    const result = JSON.parse(response.getContentText());

    if (result.success) return { success: true, data: result.data };
    
    // จัดการกรณีสลิปซ้ำแต่ถูกต้อง
    if (result.data && (result.code === 1004 || result.code === 1012 || result.message?.includes('ใช้ไปแล้ว'))) {
      return { success: true, data: result.data };
    }
    return null;
  } catch (e) {
    return null;
  }
}

function sendTelegramNotification(name, phone, time, hasSlip) {
  const message = `🔥 *Grand Tournament 4 Registration* 🔥
  
👤 *ชื่อ:* ${name}
📱 *เบอร์:* ${phone}
⏰ *เมื่อ:* ${time}
${hasSlip ? "✅ *แนบสลิปแล้ว*" : "⚠️ *ยังไม่แนบสลิป*"}

---
📊 [เปิดดู Google Sheet](https://docs.google.com/spreadsheets/d/1O9_P8K_i_p-5k6v7-F0D_f7_f9_p-5k6v7-F0D_f7_f9/edit)`;

  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "Markdown",
    disable_web_page_preview: true
  };

  UrlFetchApp.fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}

function getFileIdFromUrl(url) {
  if (url.indexOf('?id=') > 0) return url.split('?id=')[1].split('&')[0];
  const parts = url.match(/[-\w]{25,}/);
  return parts ? parts[0] : null;
}

function setFilePublic(fileUrl) {
  try {
    const fileId = getFileIdFromUrl(fileUrl);
    if (fileId) DriveApp.getFileById(fileId).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
}

function syncToFirebasePayment(paymentData) {
  const firestoreUrl = "https://up-level-guild.web.app/api/webhook/add-payment";
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      secret: "up-level-secret-key-1234",
      payment: paymentData
    }),
    muteHttpExceptions: true
  };
  try { UrlFetchApp.fetch(firestoreUrl, options); } catch (e) {}
}

// ===== เพิ่มเมนูใน Google Sheet =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Up Level (GT4)')
    .addItem('✅ ยืนยันชำระเงิน (โดยแอดมิน)', 'adminForcePaid')
    .addItem('🔄 ส่งตรวจสลิปซ้ำ (Retrigger)', 'retriggerVerification')
    .addToUi();
}

/**
 * ฟังก์ชันสำหรับแอดมินบังคับสถานะเป็น "ชำระแล้ว" เอง
 */
function adminForcePaid() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const activeCell = sheet.getActiveCell();
  const row = activeCell.getRow();

  if (row <= 1) {
    ui.alert("⚠️ โปรดเลือกแถวที่มีข้อมูลผู้สมัคร");
    return;
  }

  // ถามชื่อแอดมิน
  const prompt = ui.prompt("📌 บันทึกโดยแอดมิน", "ระบุชื่อแอดมินผู้ดำเนินการ:", ui.ButtonSet.OK_CANCEL);
  if (prompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = prompt.getResponseText();

  if (!adminName) {
    ui.alert("❌ กรุณาระบุชื่อแอดมินก่อนดำเนินการ");
    return;
  }

  // คำเตือนเรื่องสลิป
  const confirm = ui.alert("⚠️ ยืนยันการดำเนินการ", `คุณได้ตรวจสอบลิงก์สลิปเรียบร้อยแล้วใช่ไหม?\n(ชื่อแอดมิน: ${adminName})`, ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let statusColIndex = headers.indexOf("สถานะ");
  if (statusColIndex === -1) statusColIndex = headers.indexOf("สถานะการชำระเงิน");
  
  if (statusColIndex === -1) {
    ui.alert("❌ ไม่พบช่องสถานะใน Sheet (กรุณาตรวจสอบหัวตาราง)");
    return;
  }

  const name = sheet.getRange(row, 2).getValue();
  const phone = sheet.getRange(row, 5).getValue();
  const slipUrl = sheet.getRange(row, headers.findIndex(h => String(h).includes("สลิป")) + 1).getValue() || "Manual by Admin";

  // อัปเดตสถานะใน Sheet
  sheet.getRange(row, statusColIndex + 1).setValue("✅ ชำระแล้ว");

  // ส่งข้อมูลไป Firebase
  syncToFirebasePayment({
    phoneNumber: String(phone).replace(/[^\d]/g, ""),
    customerName: name,
    amount: 0,
    status: 'verified',
    source: 'gt4_admin_override',
    slipUrl: slipUrl,
    note: `ยืนยันโดยแอดมิน: ${adminName}`
  });

  // แจ้งเตือน Telegram
  sendTelegramNotification(name, phone, "N/A", true, `✅ *ADMIN OVERRIDE*\nโดยแอดมิน: ${adminName}`);

  ui.alert(`🎉 เรียบร้อย! เปลี่ยนสถานะให้คุณ ${name} เป็นชำระแล้ว`);
}

/**
 * ฟังก์ชันสำหรับกดส่งตรวจสอบสลิปซ้ำ (เผื่อ Trigger ไม่ทำงาน)
 */
function retriggerVerification() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();

  if (row <= 1) {
    ui.alert("⚠️ โปรดเลือกแถวที่ต้องการตรวจซ้ำ");
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  ui.alert("🔄 กำลังเริ่มการตรวจสอบซ้ำ...");
  
  // จำลอง Object Event สำหรับส่งให้ onFormSubmit
  const e = {
    values: rowData,
    range: sheet.getRange(row, 1, 1, sheet.getLastColumn())
  };

  try {
    onFormSubmit(e);
    ui.alert("✅ ดำเนินการ Re-trigger เรียบร้อย (โปรดตรวจสอบสถานะใน Sheet และ Telegram)");
  } catch (err) {
    ui.alert("❌ เกิดข้อผิดพลาด: " + err.toString());
  }
}
