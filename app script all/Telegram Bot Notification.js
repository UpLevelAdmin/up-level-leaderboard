/**
 * Google Apps Script สำหรับแจ้งเตือนผ่าน Telegram Bot
 * วิธีใช้:
 * 1. สร้าง Telegram Bot ผ่าน @BotFather
 * 2. รับ Bot Token จาก @BotFather
 * 3. หา Chat ID ของคุณ (ส่งข้อความให้บอทแล้วดูใน logs)
 * 4. แก้ไข BOT_TOKEN และ CHAT_ID ด้านล่าง
 * 5. ตั้งค่า Trigger เหมือนกับสคริปต์อื่นๆ
 */

// แก้ไขข้อมูลเหล่านี้
const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
const CHAT_ID = "YOUR_CHAT_ID_HERE";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * ฟังก์ชันที่ทำงานเมื่อมีการส่งฟอร์ม
 */
function onFormSubmit(e) {
  try {
    // ดึงข้อมูลจากฟอร์ม
    const responses = e.values;
    const timestamp = responses[0];
    const nickname = responses[1];
    const phone = responses[2];
    const level = responses[3];
    const selectedDate = responses[4];
    
    // สร้างข้อความแจ้งเตือน
    const message = `🏟️ *มีคนสมัคร Gym Battle ใหม่!*

👤 *ชื่อเล่น:* ${nickname}
📱 *เบอร์โทร:* ${phone}
🎮 *ระดับการเล่น:* ${level}
📅 *วันที่เลือก:* ${selectedDate}
⏰ *เวลาที่สมัคร:* ${timestamp}

---
📊 [ตรวจสอบรายชื่อทั้งหมด](https://your-website.com/gymbattle.html)`;
    
    // ส่งไปยัง Telegram
    const payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    };
    
    UrlFetchApp.fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    console.log("✅ ส่งการแจ้งเตือนไปยัง Telegram สำเร็จ");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
  }
}

/**
 * ฟังก์ชันทดสอบการส่งไปยัง Telegram
 */
function testTelegramNotification() {
  const testData = {
    values: [
      new Date().toLocaleString('th-TH'),
      "ผู้ทดสอบ",
      "0812345678",
      "Gold",
      "วันอังคารที่ 2 กันยายน 2568"
    ]
  };
  
  onFormSubmit(testData);
  console.log("🧪 ส่งการทดสอบไปยัง Telegram แล้ว");
}

/**
 * ฟังก์ชันสำหรับส่งสรุปรายชื่อผู้สมัครประจำวัน
 */
function sendDailySummary() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    const today = new Date();
    const todayStr = today.toLocaleDateString('th-TH');
    
    let todayCount = 0;
    let todayRegistrations = [];
    
    for (let i = 1; i < data.length; i++) {
      const rowDate = new Date(data[i][0]);
      if (rowDate.toLocaleDateString('th-TH') === todayStr) {
        todayCount++;
        todayRegistrations.push({
          nickname: data[i][1],
          phone: data[i][2],
          level: data[i][3],
          selectedDate: data[i][4]
        });
      }
    }
    
    let message = `📊 *สรุปผู้สมัคร Gym Battle ประจำวัน*

📅 *วันที่:* ${todayStr}
👥 *จำนวนผู้สมัคร:* ${todayCount} คน

`;
    
    if (todayRegistrations.length > 0) {
      message += `📋 *รายชื่อผู้สมัคร:*\n`;
      todayRegistrations.forEach((reg, index) => {
        message += `${index + 1}. ${reg.nickname} (${reg.level}) - ${reg.selectedDate}\n`;
      });
    } else {
      message += `📝 ยังไม่มีผู้สมัครวันนี้`;
    }
    
    message += `\n---\n📊 [ตรวจสอบรายชื่อทั้งหมด](https://your-website.com/gymbattle.html)`;
    
    const payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    };
    
    UrlFetchApp.fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    console.log(`✅ ส่งสรุปประจำวันไปยัง Telegram สำเร็จ - ${todayCount} คน`);
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งสรุป:", error);
  }
}

/**
 * ฟังก์ชันสำหรับหา Chat ID ของคุณ
 * เรียกใช้ฟังก์ชันนี้แล้วส่งข้อความให้บอท จะได้ Chat ID
 */
function getChatId() {
  try {
    const response = UrlFetchApp.fetch(`${TELEGRAM_API_URL}/getUpdates`);
    const data = JSON.parse(response.getContentText());
    
    if (data.ok && data.result.length > 0) {
      const lastMessage = data.result[data.result.length - 1];
      const chatId = lastMessage.message.chat.id;
      const username = lastMessage.message.from.username || lastMessage.message.from.first_name;
      
      console.log(`Chat ID ของ ${username}: ${chatId}`);
      return chatId;
    } else {
      console.log("ไม่พบข้อความใหม่ กรุณาส่งข้อความให้บอทก่อน");
      return null;
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการหา Chat ID:", error);
    return null;
  }
}
