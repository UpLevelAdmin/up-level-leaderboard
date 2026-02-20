/**
 * Google Apps Script สำหรับระบบพรีออเดอร์ Team Jersey 2026
 * 
 * ⚠️ วิธีตั้งค่า:
 * 1. ไปที่ Google Sheet: (สร้าง Sheet ใหม่หรือใช้ Sheet เดิมแล้วเปลี่ยน ID)
 * 2. คลิก Extensions > Apps Script
 * 3. Copy โค้ดทั้งหมดจากไฟล์นี้ไปวางใน Apps Script Editor
 * 4. ตั้งค่า Trigger: คลิก Triggers (นาฬิกา) > Add Trigger
 *    - Choose which function to run: onFormSubmit
 *    - Select event source: From spreadsheet
 *    - Select event type: On form submit
 * 5. Deploy เป็น Web App:
 *    - คลิก Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - คลิก Deploy และ Copy URL ที่ได้
 * 6. นำ URL ที่ได้ไปอัปเดตในไฟล์ preorder-jersey.html (บรรทัดที่กำหนด apiUrl)
 */

// ===== ฟังก์ชันแจ้งเตือน Telegram =====

// แก้ไขข้อมูลเหล่านี้
const BOT_TOKEN = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID = "-4911555842"; // Group Chat ID

const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;


/**
 * ฟังก์ชันที่ทำงานเมื่อมีการส่งฟอร์ม (เชื่อมจาก Google Sheet Trigger -> On Form Submit)
 */
function onFormSubmit(e) {
  try {
    const responses = e.namedValues;
    sendTelegramNotification(responses);

    // 1. ตรวจสอบ SlipOK และอัปเดตสถานะใน Sheet
    if (e.range) {
      const sheet = e.range.getSheet();
      const row = e.range.getRow();
      
      // หาคอลัมน์ "สถานะการชำระเงิน"
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      let statusCol = headers.indexOf("สถานะการชำระเงิน") + 1;
      
      // ถ้ายังไม่มีคอลัมน์นี้ ให้สร้างใหม่
      if (statusCol === 0) {
        statusCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, statusCol).setValue("สถานะการชำระเงิน");
      }

      // หาค่าสลิปจาก responses
      let slipUrl = "";
      for (const key in responses) {
        if (key.includes('บัญชี') || key.includes('QR') || key.includes('สลิป') || key.includes('หลักฐาน') || key.includes('ชำระเงิน')) {
           const val = responses[key][0];
           if (val && val.includes('drive.google.com')) {
              slipUrl = val;
              break;
           }
        }
      }

      if (slipUrl) {
        setFilePublic(slipUrl);
        const result = verifySlipDirectly(slipUrl);
        if (result && result.success) {
           sheet.getRange(row, statusCol).setValue("✅ ชำระแล้ว");
        } else {
           sheet.getRange(row, statusCol).setValue("⏳ รอตรวจสอบ");
        }
      } else {
        sheet.getRange(row, statusCol).setValue("❌ รอชำระ");
      }
    }

    // ล้าง Cache เพื่อให้หน้าเว็บโหลดรายชื่อตอนดึงข้อมูลได้ตัวใหม่เสมอ
    invalidateCache();

  } catch(error) {
    console.error("Error in onFormSubmit: " + error.toString());
  }
}

function sendTelegramNotification(responses) {
  // ชื่อฟิลด์อิงตาม Header ของ Column ใน Google Sheet ที่ผูกกับฟอร์ม
  var timestamp = responses["Timestamp"] ? responses["Timestamp"][0] : new Date().toLocaleString('th-TH');
  var name = responses["ชื่อ - นามสกุล"] ? responses["ชื่อ - นามสกุล"][0] : "ไม่ระบุ";
  var nickname = responses["ชื่อเล่น"] ? responses["ชื่อเล่น"][0] : "ไม่ระบุ";
  var phone = responses["เบอร์โทรศัพท์"] ? responses["เบอร์โทรศัพท์"][0] : "ไม่ระบุ";
  var size = responses["ไซส์เสื้อที่ต้องการ"] ? responses["ไซส์เสื้อที่ต้องการ"][0] : "ไม่ระบุ";
  var screenName = responses["ชื่อที่จะสกรีนด้านหลัง"] ? responses["ชื่อที่จะสกรีนด้านหลัง"][0] : "ไม่ระบุ";
  var receiveMethod = responses["ช่องทางการรับสินค้า"] ? responses["ช่องทางการรับสินค้า"][0] : "ไม่ระบุ";
  var slip = responses["หลักฐานการโอนเงิน"] ? responses["หลักฐานการโอนเงิน"][0] : "ไม่มี";
  
  // นับจำนวนคนที่สั่งซื้อ
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1") || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  let totalCount = 0;
  if (sheet) {
    try {
      const data = sheet.getDataRange().getValues();
      totalCount = data.length - 1; // ลบ header row
    } catch (countError) {
      console.warn('Warning: Could not count total participants:', countError);
    }
  }

  var textMsg = `<b>👕 มีออเดอร์เสื้อพรีออเดอร์ใหม่เข้ามา!</b>\n\n` +
                `👤 <b>ชื่อ:</b> ${name} (${nickname})\n` +
                `📞 <b>เบอร์โทร:</b> ${phone}\n` +
                `📏 <b>ไซส์:</b> ${size}\n` +
                `🔠 <b>ชื่อสกรีน:</b> ${screenName}\n` +
                `📦 <b>รับสินค้าแบบ:</b> ${receiveMethod}\n\n` +
                `🔗 <b>อ้างอิงสลิป/หลักฐาน:</b> ${slip}\n\n`+
                `📊 <b>รวมยอดสั่งซื้อ: ${totalCount} คน</b>`;

  var url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  var payload = {
    chat_id: CHAT_ID,
    text: textMsg,
    parse_mode: "HTML"
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

/**
 * Endpoint สำหรับดึงข้อมูลรายชื่อไปโชว์ที่หน้าเว็บ
 */
function doGet(e) {
  try {
    var isDebug = e && e.parameter && e.parameter.debug === 'true';
    var refresh = e && e.parameter && e.parameter.refresh === 'true';
    
    // 1. ตรวจสอบ Cache ก่อน (รับโหลดเร็ว)
    const cache = CacheService.getScriptCache();
    const CACHE_KEY = 'jersey_preorder_data';
    
    if (!refresh && !isDebug) {
      const cachedResult = cache.get(CACHE_KEY);
      if (cachedResult) {
        return ContentService.createTextOutput(cachedResult)
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
       return createErrorResponse("No active spreadsheet found");
    }
    
    // ลองหา sheet
    var targetSheet = spreadsheet.getSheetByName('Form Responses 1') || spreadsheet.getSheetByName('Sheet1') || spreadsheet.getSheets()[0];
    
    if (!targetSheet) {
       return createErrorResponse("No suitable sheet found.");
    }
    
    var data = targetSheet.getDataRange().getValues();
    if (data.length <= 1) {
       return createErrorResponse("No data rows found in sheet");
    }
    
    var headers = data[0];
    var participants = [];
    
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var participant = {};
        
        for (var j = 0; j < headers.length; j++) {
           participant[headers[j]] = (row[j] === null || row[j] === undefined) ? '' : row[j];
        }
        participants.push(participant);
    }
    
    var result = {
      participants: participants
    };
    
    const resultString = JSON.stringify(result);
    // 2. บันทึกลง Cache
    if (!isDebug) {
      cache.put(CACHE_KEY, resultString, 600); // เก็บไว้ 10 นาที
    }
    
    return ContentService.createTextOutput(resultString)
        .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return createErrorResponse(error.toString());
  }
}

function createErrorResponse(errorMsg) {
    return ContentService.createTextOutput(JSON.stringify({
        participants: [],
        error: errorMsg
    })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}

function invalidateCache() {
  try {
    const cache = CacheService.getScriptCache();
    cache.remove('jersey_preorder_data');
    console.log("🧹 Cache invalidated successfully");
  } catch (e) {
    console.error("❌ Failed to invalidate cache:", e);
  }
}

// ===== ระบบตรวจสอบสลิปอัตโนมัติ (SlipOK) =====
const SLIPOK_API_KEY = "SLIPOKE2TSLQJ"; 
const BRANCH_ID = "58927";

function getFileIdFromUrl(url) {
  var id = "";
  if (url.indexOf('?id=') > 0) {
    id = url.split('?id=')[1].split('&')[0];
  } else {
    var parts = url.match(/[-\w]{25,}/);
    if (parts && parts.length > 0) {
      id = parts[0];
    }
  }
  return id;
}

function setFilePublic(fileUrl) {
  if (!fileUrl) return;
  try {
    const fileId = getFileIdFromUrl(fileUrl);
    if (fileId) {
      // Dummy call so Apps Script prompts for Drive app authorization
      // DriveApp.getFiles(); 
      const file = DriveApp.getFileById(fileId);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
  } catch (e) {
    console.warn("⚠️ Failed to set public access: " + e.toString());
  }
}

function verifySlipDirectly(fileUrl) {
  if (!fileUrl) return { success: false, message: "No file URL provided" };
  try {
    const fileId = getFileIdFromUrl(fileUrl);
    if (!fileId) return { success: false, message: "Could not extract file ID from URL" };
    
    // **ต้องใช้ Base64** เพื่อไม่ให้ SlipOK โหลดรูปจาก URL แล้วติดหน้า HTML ของ Google Drive
    const file = DriveApp.getFileById(fileId);
    if (!file) {
      return { success: false, message: "Google Drive File not found or no permission" };
    }
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
    
    // Check for used slip
    if (result.code === 1004 || result.code === 1012 || String(result.message).includes('ใช้ไปแล้ว') || String(result.message).includes('used') || String(result.message).includes('สลิปซ้ำ')) {
      return { success: true, data: result.data, warning: "สลิปนี้เคยถูกส่งตรวจไปแล้ว" };
    }
    
    return { success: false, message: result.message || `API Error Code: ${result.code}` };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ===== เพิ่มเมนูใน Google Sheet สำหรับกดตรวจสลิปเอง (Manual) =====
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Up Level (Jersey)')
    .addItem('🔍 ตรวจสอบสลิปแถวปัจจุบัน', 'checkSlipManual')
    .addToUi();
}

/**
 * ฟังก์ชันสำหรับกดตรวจสลิปด้วยตัวเอง (Manual) จาก Google Sheet
 * - เลือก (คลิก) ไปที่แถวของลูกค้าที่ต้องการตรวจ
 * - กดเมนู Up Level (Jersey) > ตรวจสอบสลิปแถวปัจจุบัน
 */
function checkSlipManual() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const activeCell = sheet.getActiveCell();
  
  if (!activeCell) {
    ui.alert("⚠️ กรุณาคลิกเลือกเซลล์ในแถวที่ต้องการตรวจสอบก่อน");
    return;
  }

  const row = activeCell.getRow();
  
  // ป้องกันการกดตรวจที่แถวหัวตาราง
  if (row <= 1) {
    ui.alert("⚠️ โปรดเลือกแถวที่มีข้อมูล (บรรทัดที่ 2 เป็นต้นไป)");
    return;
  }

  // หาคอลัมน์ทั้งหมดเพื่อหาว่าอันไหนดึงลิงก์และสถานะ
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let slipColIndex = -1;
  let statusColIndex = headers.indexOf("สถานะการชำระเงิน");

  // ถ้ายังไม่มีคอลัมน์สถานะ ให้สร้างใหม่แทรกท้ายให้
  if (statusColIndex === -1) {
    statusColIndex = sheet.getLastColumn();
    sheet.getRange(1, statusColIndex + 1).setValue("สถานะการชำระเงิน");
  }

  for (let i = 0; i < headers.length; i++) {
    const headerStr = String(headers[i]);
    if (headerStr.includes('บัญชี') || headerStr.includes('QR') || headerStr.includes('สลิป') || headerStr.includes('หลักฐาน') || headerStr.includes('ชำระเงิน') && !headerStr.includes('สถานะ')) {
      slipColIndex = i;
      break;
    }
  }

  if (slipColIndex === -1) {
    ui.alert("❌ ไม่พบคอลัมน์หลักฐานการโอนเงิน/สลิป ในตาราง");
    return;
  }

  const slipUrl = sheet.getRange(row, slipColIndex + 1).getValue();

  if (!slipUrl || !String(slipUrl).includes('drive.google.com')) {
    ui.alert("❌ ไม่พบลิงก์ Google Drive ในแถวที่เลือก\n(หรือลูกค้าไม่ได้อัพโหลดรูปมา)");
    sheet.getRange(row, statusColIndex + 1).setValue("❌ รอชำระ");
    invalidateCache(); // ล้างแคชเพื่อให้เว็บอัพเดท
    return;
  }

  // แจ้งเตือนกำลังทำงาน
  let resultStatus = "";
  try {
    setFilePublic(slipUrl);
    const slipResult = verifySlipDirectly(slipUrl);
    if (slipResult && slipResult.success) {
      resultStatus = "✅ ชำระแล้ว";
      let alertMsg = `🎉 สลิปถูกต้อง! อัปเดตสถานะเป็น "ชำระแล้ว"\nยอด: ${slipResult.data.amount} บ.\nผู้โอน: ${slipResult.data.sender?.name}`;
      if (slipResult.warning) {
        alertMsg += `\n\n⚠️ หมายเหตุ: ${slipResult.warning}`;
      }
      ui.alert(alertMsg);
    } else {
      resultStatus = "⏳ รอตรวจสอบ";
      let errorMsg = slipResult && slipResult.message ? slipResult.message : "ไม่ทราบสาเหตุ";
      ui.alert(`⚠️ สลิปมีปัญหา หรือตรวจไม่ผ่าน\nสาเหตุ: ${errorMsg}\n\nระบบจะขึ้นว่า "รอตรวจสอบ" แทนครับ`);
    }
  } catch (error) {
    resultStatus = "⏳ รอตรวจสอบ";
    ui.alert("❌ ระบบการตรวจขัดข้อง: " + error.toString());
  }

  sheet.getRange(row, statusColIndex + 1).setValue(resultStatus);
  invalidateCache(); // ล้างแคชให้หน้าเว็บดึงข้อมูลใหม่
}
