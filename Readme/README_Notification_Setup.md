# 📱 คู่มือการตั้งค่าระบบแจ้งเตือน Gym Battle

## 🎯 ภาพรวม
ระบบแจ้งเตือนนี้จะส่งการแจ้งเตือนทันทีเมื่อมีคนสมัคร Gym Battle ผ่าน Google Form

## 🚀 ทางเลือกการแจ้งเตือน

### 1. 📧 อีเมลแจ้งเตือน (แนะนำสำหรับผู้เริ่มต้น)
**ข้อดี:** ตั้งค่าง่าย ไม่ต้องใช้ API ภายนอก
**ข้อเสีย:** อาจไม่สะดวกเท่าแอปอื่นๆ

### 2. 💬 Discord Webhook (แนะนำสำหรับทีม)
**ข้อดี:** ตั้งค่าง่าย มีการแจ้งเตือนแบบ real-time
**ข้อเสีย:** ต้องใช้ Discord

### 3. 📱 Telegram Bot (แนะนำสำหรับการใช้งานส่วนตัว)
**ข้อดี:** ฟีเจอร์ครบครัน ตั้งค่าง่าย
**ข้อเสีย:** ต้องใช้ Telegram

### 4. 📲 LINE Messaging API (แนะนำสำหรับผู้ใช้ LINE)
**ข้อดี:** ใช้ LINE ได้เหมือนเดิม
**ข้อเสีย:** ต้องสร้าง LINE Official Account

---

## 📧 วิธีตั้งค่าอีเมลแจ้งเตือน

### ขั้นตอนที่ 1: เตรียม Google Form และ Google Sheets
1. สร้าง Google Form สำหรับสมัคร Gym Battle
2. เชื่อมต่อ Google Form กับ Google Sheets
3. เปิด Google Sheets ที่เชื่อมกับฟอร์ม

### ขั้นตอนที่ 2: เพิ่ม Google Apps Script
1. ใน Google Sheets ไปที่ **Extensions** > **Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. คัดลอกโค้ดจากไฟล์ `Gym Battle Notification Script.js`
4. แก้ไข `EMAIL_ADDRESS` เป็นอีเมลที่ต้องการรับการแจ้งเตือน

### ขั้นตอนที่ 3: ตั้งค่า Trigger
1. ใน Apps Script ไปที่ **Triggers** (ไอคอนนาฬิกา)
2. คลิก **Add Trigger**
3. ตั้งค่าดังนี้:
   - **Function:** `onFormSubmit`
   - **Event source:** `From spreadsheet`
   - **Event type:** `On form submit`
4. คลิก **Save**

### ขั้นตอนที่ 4: ทดสอบระบบ
1. ใน Apps Script ไปที่ **Run** > `testEmailNotification`
2. ตรวจสอบอีเมลที่ตั้งค่าไว้
3. ทดสอบส่งฟอร์มจริง

---

## 💬 วิธีตั้งค่า Discord Webhook

### ขั้นตอนที่ 1: สร้าง Discord Webhook
1. เปิด Discord Server ของคุณ
2. ไปที่ Channel ที่ต้องการรับการแจ้งเตือน
3. คลิก **Settings** (⚙️) > **Integrations** > **Webhooks**
4. คลิก **Create Webhook**
5. คัดลอก **Webhook URL**

### ขั้นตอนที่ 2: ตั้งค่า Google Apps Script
1. ใช้โค้ดจากไฟล์ `Discord Webhook Notification.js`
2. แก้ไข `DISCORD_WEBHOOK_URL` เป็น URL ที่คัดลอกมา
3. ตั้งค่า Trigger เหมือนกับอีเมล

---

## 📱 วิธีตั้งค่า Telegram Bot

### ขั้นตอนที่ 1: สร้าง Telegram Bot
1. เปิด Telegram และค้นหา `@BotFather`
2. ส่งข้อความ `/newbot`
3. ตั้งชื่อบอท (เช่น "Gym Battle Notifier")
4. ตั้ง username (เช่น "gymbattle_notifier_bot")
5. คัดลอก **Bot Token**

### ขั้นตอนที่ 2: หา Chat ID
1. ส่งข้อความให้บอทที่สร้างขึ้น
2. เรียกใช้ฟังก์ชัน `getChatId()` ใน Apps Script
3. ดู Chat ID ใน Logs

### ขั้นตอนที่ 3: ตั้งค่า Google Apps Script
1. ใช้โค้ดจากไฟล์ `Telegram Bot Notification.js`
2. แก้ไข `BOT_TOKEN` และ `CHAT_ID`
3. ตั้งค่า Trigger

---

## 📲 วิธีตั้งค่า LINE Messaging API

### ขั้นตอนที่ 1: สร้าง LINE Official Account
1. ไปที่ [LINE Official Account Manager](https://www.linebiz.com/th/official-account/)
2. สร้างบัญชี LINE OA ใหม่
3. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
4. สร้าง Messaging API Channel
5. คัดลอก **Channel Access Token**

### ขั้นตอนที่ 2: หา User ID
1. ส่งข้อความให้ LINE OA ที่สร้างขึ้น
2. ดู User ID ใน LINE Developers Console > Messaging API > Webhook settings

### ขั้นตอนที่ 3: ตั้งค่า Google Apps Script
1. ใช้โค้ดจากไฟล์ `Line Messaging API Notification.js`
2. แก้ไข `LINE_ACCESS_TOKEN` และ `USER_ID`
3. ตั้งค่า Trigger

---

## 🔧 ฟีเจอร์เพิ่มเติม

### สรุปรายชื่อประจำวัน
ทุกสคริปต์มีฟังก์ชัน `sendDailySummary()` สำหรับส่งสรุปผู้สมัครประจำวัน

**วิธีตั้งค่า:**
1. ใน Apps Script ไปที่ **Triggers**
2. คลิก **Add Trigger**
3. ตั้งค่าดังนี้:
   - **Function:** `sendDailySummary`
   - **Event source:** `Time-driven`
   - **Type:** `Day timer`
   - **Time:** เลือกเวลาที่ต้องการ (เช่น 18:00)

### การทดสอบ
ทุกสคริปต์มีฟังก์ชันทดสอบ:
- `testEmailNotification()`
- `testDiscordNotification()`
- `testTelegramNotification()`
- `testLineNotification()`

---

## 🚨 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

**1. ไม่ได้รับการแจ้งเตือน**
- ตรวจสอบ Trigger ว่าตั้งค่าถูกต้อง
- ตรวจสอบ Logs ใน Apps Script
- ทดสอบด้วยฟังก์ชันทดสอบ

**2. ข้อผิดพลาด "Authorization failed"**
- ตรวจสอบ Token/URL ที่ใส่
- ตรวจสอบสิทธิ์การเข้าถึง

**3. ข้อผิดพลาด "Function not found"**
- ตรวจสอบชื่อฟังก์ชันใน Trigger
- ตรวจสอบการบันทึกโค้ด

### การดู Logs
1. ใน Apps Script ไปที่ **Executions**
2. คลิกที่การทำงานล่าสุด
3. ดู Logs เพื่อหาสาเหตุของปัญหา

---

## 📞 การสนับสนุน

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ Logs ใน Apps Script
2. ทดสอบด้วยฟังก์ชันทดสอบ
3. ตรวจสอบการตั้งค่า Trigger
4. ตรวจสอบสิทธิ์การเข้าถึง API

---

## 🔄 การอัปเดต

เมื่อมีการเปลี่ยนแปลงโครงสร้าง Google Form:
1. ตรวจสอบลำดับคอลัมน์ใน Google Sheets
2. แก้ไขโค้ดใน Apps Script ให้ตรงกับคอลัมน์ใหม่
3. ทดสอบระบบใหม่

---

*สร้างโดย: Gym Battle System*
*วันที่อัปเดต: กันยายน 2568*
