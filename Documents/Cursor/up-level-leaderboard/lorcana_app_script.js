function doGet(e) {
    return handleResponse(e);
}

function handleResponse(e) {
    var output = JSON.stringify(getData());
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

function getData() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {
        groupedData: {}
    };

    // ==========================================
    // ⚙️ ตั้งค่า (CONFIG)
    // ==========================================

    var sheetNames = ['Form Responses 1', 'การตอบแบบฟอร์ม 1'];

    // Keyword สำหรับค้นหาหัวข้อคอลัมน์
    var colKeyword_Date = "วันที่ลงแข่งขัน LORCANA";
    var colKeyword_Nickname = "ชื่อเล่น";
    var colKeyword_Tel = "เบอร์โทรศัพท์สำหรับติดต่อ";
    var colKeyword_Level = "ระดับประสบการณ์";
    var colKeyword_Slip = "แนบสลิป";
    var colKeyword_Status = "สถานะ"; // คอลัมน์ใหม่สำหรับเก็บสถานะ (Paid, Reject ฯลฯ)

    // ==========================================

    sheetNames.forEach(function (sheetName) {
        var sheet = ss.getSheetByName(sheetName);
        if (!sheet) return;

        var data = sheet.getDataRange().getValues();
        if (data.length < 2) return;

        var headers = data[0];

        // Helper function หา index จาก keyword
        function getColIndex(keyword) {
            for (var i = 0; i < headers.length; i++) {
                if (String(headers[i]).indexOf(keyword) > -1) {
                    return i;
                }
            }
            return -1;
        }

        var nicknameIndex = getColIndex(colKeyword_Nickname);
        var dateIndex = getColIndex(colKeyword_Date);
        var telIndex = getColIndex(colKeyword_Tel);
        var levelIndex = getColIndex(colKeyword_Level);
        var slipIndex = getColIndex(colKeyword_Slip);
        var statusIndex = getColIndex(colKeyword_Status); // หาคอลัมน์สถานะ

        // Fallback index (ถ้าหาไม่เจอ)
        if (dateIndex === -1) dateIndex = 1;
        if (nicknameIndex === -1) nicknameIndex = 3;
        if (telIndex === -1) telIndex = 4;
        if (levelIndex === -1) levelIndex = 5;

        // วนลูปเก็บข้อมูล (เริ่มแถวที่ 2)
        for (var i = 1; i < data.length; i++) {
            var row = data[i];
            var rawDate = row[dateIndex];
            var nickname = row[nicknameIndex];
            var phone = (telIndex !== -1) ? row[telIndex] : "";
            var level = (levelIndex !== -1) ? row[levelIndex] : "";
            var slip = (slipIndex !== -1) ? row[slipIndex] : "";
            var manualStatus = (statusIndex !== -1) ? row[statusIndex] : "";

            if (!nickname || nickname === "") continue;

            // แปลงวันที่เป็น Key
            var dateKey = String(rawDate).trim();
            dateKey = dateKey.replace(/^\d+\.\s*/, ''); // ตัดเลขนำหน้าข้อ

            if (!result.groupedData[dateKey]) {
                result.groupedData[dateKey] = [];
            }

            // --- Logic สถานะ ---
            var finalStatus = "Waiting"; // ค่าเริ่มต้น: รอชำระเงิน

            if (manualStatus && manualStatus !== "") {
                // 1. ถ้ามีสถานะแปะไว้ใน Sheet (เช่น SlipOK ตรวจแล้ว หรือ แอดมินกรอกเอง) ให้ใช้ค่านี้เลย
                // ค่าที่คาดหวัง: "Paid", "Confirmed", "Reject"
                finalStatus = manualStatus;
            } else {
                // 2. ถ้าไม่มีสถานะใน Sheet ให้ดูว่าแนบสลิปมาไหม
                if (slip && slip !== "") {
                    finalStatus = "Pending"; // มีสลิป รอตรวจ
                } else {
                    finalStatus = "Waiting"; // ไม่มีสลิป รอโอน
                }
            }

            // Normalize status for frontend
            if (String(finalStatus).toLowerCase().indexOf("paid") > -1 || String(finalStatus).toLowerCase().indexOf("ชำระแล้ว") > -1) {
                finalStatus = "Paid";
            }

            result.groupedData[dateKey].push({
                nickname: nickname,
                phone: String(phone),
                level: level,
                status: finalStatus,
                slip: slip
            });
        }
    });

    return result;
}

// ==========================================
// � TELEGRAM NOTIFICATION
// ==========================================
function sendTelegramNotification(e) {
    // 1. ใส่ Token และ Chat ID
    var BOT_TOKEN = "7268878598:AAH7Rj_Gnzg7I2T2zU0Q2nKkGjP8oKsz-b4";
    var CHAT_ID = "-4559569661"; // Group ID

    // ตรวจสอบว่ามีข้อมูลส่งมาไหม (กรณีรัน Test เอง e จะเป็น undefined)
    if (!e || !e.values) return;

    var answers = e.values; // Array ของคำตอบเรียงตามคอลัมน์ [Timestamp, Date, Name, Nickname, ...]

    // ปรับ index ให้ตรงกับฟอร์มจริง (เริ่มนับที่ 0)
    // สมมติ: 0=Timestamp, 1=Date, 2=Name, 3=Nickname, 4=Tel, 5=Level, 6=Slip
    var timestamp = answers[0];
    var date = answers[1];
    var nickname = answers[3];
    var tel = answers[4];
    var level = answers[5];
    var slip = answers[6] || "ยังไม่แนบ";

    var msg = "🆕 **มีผู้สมัคร Lorcana ใหม่!**\n\n" +
        "👤 **ชื่อ:** " + nickname + "\n" +
        "📅 **รอบ:** " + date + "\n" +
        "📞 **โทร:** " + tel + "\n" +
        "🔰 **ระดับ:** " + level + "\n" +
        "🧾 **สลิป:** " + (slip.includes("http") ? "แนบแล้ว ✅" : "ยังไม่แนบ ❌");

    var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";

    var payload = {
        "chat_id": CHAT_ID,
        "text": msg,
        "parse_mode": "Markdown"
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    try {
        UrlFetchApp.fetch(url, options);
    } catch (error) {
        Logger.log("Telegram Error: " + error);
    }
}

// ==========================================
// 🚀 FUTURE FEATURE: SlipOK Integration
// ==========================================
function scanAndVerifySlips() {
    // ใส่ SLIPOK API KEY ที่นี่
    var SLIPOK_API_KEY = "YOUR_SLIPOK_API_KEY_HERE";
    var BRANCH_ID = "YOUR_BRANCH_ID"; // ถ้ามี

    // 1. อ่าน Sheet
    // 2. หาแถวที่มี Slip แต่ Status ยังว่าง
    // 3. ส่งรูปไป SlipOK API
    // 4. ถ้า success -> เขียน "Paid" ลงคอลัมน์ Status
    // 5. ถ้า fail -> เขียน "Check Slip"
}
