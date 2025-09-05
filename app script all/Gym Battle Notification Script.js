/**
 * Google Apps Script สำหรับแจ้งเตือนเมื่อมีคนสมัคร Gym Battle
 * วิธีใช้:
 * 1. เปิด Google Sheets ที่เชื่อมกับ Google Form
 * 2. ไปที่ Extensions > Apps Script
 * 3. วางโค้ดนี้ลงไป
 * 4. แก้ไข EMAIL_ADDRESS ให้เป็นอีเมลที่ต้องการรับการแจ้งเตือน
 * 5. ไปที่ Triggers > Add Trigger
 * 6. ตั้งค่า: Function = onFormSubmit, Event = On form submit
 */

// แก้ไขอีเมลนี้เป็นอีเมลที่ต้องการรับการแจ้งเตือน
const EMAIL_ADDRESS = "your-email@gmail.com";

/**
 * ฟังก์ชันที่ทำงานเมื่อมีการส่งฟอร์ม
 */
function onFormSubmit(e) {
  try {
    // ดึงข้อมูลจากฟอร์ม
    const responses = e.values;
    const timestamp = responses[0]; // เวลาที่ส่ง
    const nickname = responses[1]; // ชื่อเล่น
    const phone = responses[2]; // เบอร์โทร
    const level = responses[3]; // ระดับการเล่น
    const selectedDate = responses[4]; // วันที่เลือก
    
    // สร้างข้อความแจ้งเตือน
    const subject = "🏟️ มีคนสมัคร Gym Battle ใหม่!";
    const message = `
🏟️ <b>Gym Battle Registration Alert</b>

📅 <b>เวลาที่สมัคร:</b> ${timestamp}
👤 <b>ชื่อเล่น:</b> ${nickname}
📱 <b>เบอร์โทร:</b> ${phone}
🎮 <b>ระดับการเล่น:</b> ${level}
📅 <b>วันที่เลือก:</b> ${selectedDate}

---
📊 <b>ตรวจสอบรายชื่อทั้งหมด:</b> https://your-website.com/gymbattle.html
    `;
    
    // ส่งอีเมล
    GmailApp.sendEmail(
      EMAIL_ADDRESS,
      subject,
      message,
      {
        htmlBody: message,
        name: "Gym Battle System"
      }
    );
    
    console.log("✅ ส่งอีเมลแจ้งเตือนสำเร็จ");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    
    // ส่งอีเมลแจ้งข้อผิดพลาด
    GmailApp.sendEmail(
      EMAIL_ADDRESS,
      "❌ ข้อผิดพลาดในระบบแจ้งเตือน Gym Battle",
      `เกิดข้อผิดพลาดในการส่งการแจ้งเตือน:\n\n${error.toString()}`,
      {
        name: "Gym Battle System - Error"
      }
    );
  }
}

/**
 * ฟังก์ชันทดสอบการส่งอีเมล
 */
function testEmailNotification() {
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
  console.log("🧪 ส่งอีเมลทดสอบแล้ว");
}

/**
 * ฟังก์ชันสำหรับส่งสรุปรายชื่อผู้สมัครประจำวัน
 */
function sendDailySummary() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // นับจำนวนผู้สมัครวันนี้
    const today = new Date();
    const todayStr = today.toLocaleDateString('th-TH');
    
    let todayCount = 0;
    let todayRegistrations = [];
    
    for (let i = 1; i < data.length; i++) { // ข้าม header
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
    
    const subject = `📊 สรุปผู้สมัคร Gym Battle - ${todayStr}`;
    const message = `
📊 <b>สรุปผู้สมัคร Gym Battle ประจำวัน</b>

📅 <b>วันที่:</b> ${todayStr}
👥 <b>จำนวนผู้สมัคร:</b> ${todayCount} คน

${todayRegistrations.length > 0 ? `
📋 <b>รายชื่อผู้สมัคร:</b>
${todayRegistrations.map((reg, index) => 
  `${index + 1}. ${reg.nickname} (${reg.phone}) - ${reg.level} - ${reg.selectedDate}`
).join('\n')}
` : '📝 ยังไม่มีผู้สมัครวันนี้'}

---
📊 <b>ตรวจสอบรายชื่อทั้งหมด:</b> https://your-website.com/gymbattle.html
    `;
    
    GmailApp.sendEmail(
      EMAIL_ADDRESS,
      subject,
      message,
      {
        htmlBody: message,
        name: "Gym Battle System - Daily Summary"
      }
    );
    
    console.log(`✅ ส่งสรุปประจำวันสำเร็จ - ${todayCount} คน`);
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการส่งสรุป:", error);
  }
}
