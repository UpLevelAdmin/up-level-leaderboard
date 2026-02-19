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

            