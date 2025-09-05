/**
 * Google Apps Script สำหรับแจ้งเตือนผ่าน Discord Webhook
 * วิธีใช้:
 * 1. สร้าง Discord Server และ Channel
 * 2. ไปที่ Channel Settings > Integrations > Webhooks
 * 3. สร้าง Webhook ใหม่และคัดลอก URL
 * 4. แก้ไข DISCORD_WEBHOOK_URL ด้านล่าง
 * 5. ตั้งค่า Trigger เหมือนกับสคริปต์อีเมล
 */

// แก้ไข URL นี้เป็น Discord Webhook URL ของคุณ
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

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
    
    // สร้าง Embed สำหรับ Discord
    const embed = {
      title: "🏟️ มีคนสมัคร Gym Battle ใหม่!",
      color: 0x00ff00, // สีเขียว
      fields: [
        {
          name: "👤 ชื่อเล่น",
          value: nickname,
          inline: true
        },
        {
          name: "📱 เบอร์โทร",
          value: phone,
          inline: true
        },
        {
          name: "🎮 ระดับการเล่น",
          value: level,
          inline: true
        },
        {
          name: "📅 วันที่เลือก",
          value: selectedDate,
          inline: false
        },
        {
          name: "⏰ เวลาที่สมัคร",
          value: timestamp,
          inline: false
        }
      ],
      footer: {
        text: "Gym Battle Registration System"
      },
      timestamp: new Date().toISOString()
    };
    
    const payload = {
      embeds: [embed]
    };
    
    // ส่งไปยัง Discord
    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    console.log("✅ ส่งการแจ้งเตือนไปยัง Discord สำเร็จ");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
  }
}

/**
 * ฟังก์ชันทดสอบการส่งไปยัง Discord
 */
function testDiscordNotification() {
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
  console.log("🧪 ส่งการทดสอบไปยัง Discord แล้ว");
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
    
    const embed = {
      title: `📊 สรุปผู้สมัคร Gym Battle - ${todayStr}`,
      color: 0x0099ff, // สีฟ้า
      fields: [
        {
          name: "📅 วันที่",
          value: todayStr,
          inline: true
        },
        {
          name: "👥 จำนวนผู้สมัคร",
          value: `${todayCount} คน`,
          inline: true
        }
      ],
      footer: {
        text: "Gym Battle System - Daily Summary"
      },
      timestamp: new Date().toISOString()
    };
    
    // เพิ่มรายชื่อผู้สมัครถ้ามี
    if (todayRegistrations.length > 0) {
      const registrationsList = todayRegistrations
        .map((reg, index) => `${index + 1}. ${reg.nickname} (${reg.level})`)
        .join('\n');
      
      embed.fields.push({
        name: "📋 รายชื่อผู้สมัคร",
        value: registrationsList.length > 1024 ? 
          registrationsList.substring(0, 1021) + "..." : 
          registrationsList,
        inline: false
      });
    }
    
    const payload = {
      embeds: [embed]
    };
    
    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    console.log(`✅ ส่งสรุปประจำวันไปยัง Discord สำเร็จ - ${todayCount} คน`);
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งสรุป:", error);
  }
}
