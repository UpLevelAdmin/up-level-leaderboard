/**
 * Google Apps Script สำหรับแจ้งเตือนผ่าน LINE Messaging API
 * วิธีใช้:
 * 1. สร้าง LINE Official Account (LINE OA)
 * 2. ไปที่ LINE Developers Console และสร้าง Messaging API Channel
 * 3. รับ Channel Access Token
 * 4. หา User ID ของคุณ (ส่งข้อความให้ LINE OA)
 * 5. แก้ไข LINE_ACCESS_TOKEN และ USER_ID ด้านล่าง
 * 6. ตั้งค่า Trigger เหมือนกับสคริปต์อื่นๆ
 */

// แก้ไขข้อมูลเหล่านี้
const LINE_ACCESS_TOKEN = "YOUR_LINE_ACCESS_TOKEN_HERE";
const USER_ID = "YOUR_USER_ID_HERE";

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

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
    const message = `🏟️ มีคนสมัคร Gym Battle ใหม่!

👤 ชื่อเล่น: ${nickname}
📱 เบอร์โทร: ${phone}
🎮 ระดับการเล่น: ${level}
📅 วันที่เลือก: ${selectedDate}
⏰ เวลาที่สมัคร: ${timestamp}

---
📊 ตรวจสอบรายชื่อทั้งหมด:
https://your-website.com/gymbattle.html`;
    
    // สร้าง payload สำหรับ LINE API
    const payload = {
      to: USER_ID,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };
    
    // ส่งไปยัง LINE
    UrlFetchApp.fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      payload: JSON.stringify(payload)
    });
    
    console.log("✅ ส่งการแจ้งเตือนไปยัง LINE สำเร็จ");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
  }
}

/**
 * ฟังก์ชันทดสอบการส่งไปยัง LINE
 */
function testLineNotification() {
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
  console.log("🧪 ส่งการทดสอบไปยัง LINE แล้ว");
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
    
    let message = `📊 สรุปผู้สมัคร Gym Battle ประจำวัน

📅 วันที่: ${todayStr}
👥 จำนวนผู้สมัคร: ${todayCount} คน

`;
    
    if (todayRegistrations.length > 0) {
      message += `📋 รายชื่อผู้สมัคร:\n`;
      todayRegistrations.forEach((reg, index) => {
        message += `${index + 1}. ${reg.nickname} (${reg.level}) - ${reg.selectedDate}\n`;
      });
    } else {
      message += `📝 ยังไม่มีผู้สมัครวันนี้`;
    }
    
    message += `\n---\n📊 ตรวจสอบรายชื่อทั้งหมด:\nhttps://your-website.com/gymbattle.html`;
    
    const payload = {
      to: USER_ID,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    };
    
    UrlFetchApp.fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      payload: JSON.stringify(payload)
    });
    
    console.log(`✅ ส่งสรุปประจำวันไปยัง LINE สำเร็จ - ${todayCount} คน`);
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งสรุป:", error);
  }
}

/**
 * ฟังก์ชันสำหรับส่งข้อความแบบ Rich Message (Flex Message)
 */
function sendRichMessage() {
  try {
    const flexMessage = {
      type: "flex",
      altText: "Gym Battle Registration Alert",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "🏟️ Gym Battle",
              weight: "bold",
              color: "#1DB446",
              size: "sm"
            },
            {
              type: "text",
              text: "มีคนสมัครใหม่!",
              weight: "bold",
              size: "xl",
              margin: "md"
            }
          ]
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "👤",
                  size: "sm",
                  color: "#555555",
                  flex: 0
                },
                {
                  type: "text",
                  text: "ผู้ทดสอบ",
                  size: "sm",
                  color: "#111111",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "📱",
                  size: "sm",
                  color: "#555555",
                  flex: 0
                },
                {
                  type: "text",
                  text: "0812345678",
                  size: "sm",
                  color: "#111111",
                  flex: 0
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "🎮",
                  size: "sm",
                  color: "#555555",
                  flex: 0
                },
                {
                  type: "text",
                  text: "Gold",
                  size: "sm",
                  color: "#111111",
                  flex: 0
                }
              ]
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "ดูรายชื่อทั้งหมด",
                uri: "https://your-website.com/gymbattle.html"
              },
              style: "primary",
              color: "#1DB446"
            }
          ]
        }
      }
    };
    
    const payload = {
      to: USER_ID,
      messages: [flexMessage]
    };
    
    UrlFetchApp.fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      payload: JSON.stringify(payload)
    });
    
    console.log("✅ ส่ง Rich Message ไปยัง LINE สำเร็จ");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่ง Rich Message:", error);
  }
}
