# 👁️ Hide Standing Feature

## 📋 ภาพรวม
ฟีเจอร์ "Hide Standing" ช่วยให้คุณสามารถซ่อนตารางคะแนน (Standings) ในหน้าเว็บได้ โดยใช้ checkbox เดียวที่ช่อง L1 ในชีท Standing

## 🎯 การใช้งาน

### 1. ใน Google Sheets
1. เปิดชีท "Standing" ใน Google Sheets
2. ใช้ checkbox ที่ช่อง **L1** (คอลัมน์ L, แถว 1)
3. **ติ๊กถูก checkbox ที่ L1** = ซ่อน Standings ในหน้าเว็บ
4. **เอาติ๊กถูกออกจาก L1** = แสดง Standings ปกติ

### 2. การควบคุมการแสดงผล
- **ติ๊กถูก checkbox ที่ L1** = ซ่อน Standings (แสดงเฉพาะการจับคู่)
- **ไม่ติ๊กถูก checkbox ที่ L1** = แสดง Standings ปกติ

### 3. ในหน้าเว็บ
- หน้าเว็บจะตรวจสอบสถานะ Hide Standing ทุก 30 วินาที
- หากซ่อน Standings จะแสดงข้อความแจ้งเตือนแทน
- สามารถกดปุ่ม 🔄 เพื่อรีเฟรชข้อมูลได้

## 🔧 การทำงาน

### การตรวจสอบสถานะ
```javascript
function checkHideStandingStatus() {
  // ตรวจสอบ checkbox ที่ช่อง L1
  const hideStandingCell = standingSheet.getRange(1, 12); // L1
  const isChecked = hideStandingCell.getValue() === true;
  
  return { hideStanding: isChecked };
}
```

### การสร้าง checkbox อัตโนมัติ
```javascript
function setupHideStandingCheckbox() {
  // สร้าง checkbox ที่ช่อง L1 ถ้ายังไม่มี
  const hideStandingCell = standingSheet.getRange(1, 12);
  hideStandingCell.insertCheckboxes();
  hideStandingCell.uncheck(); // Default: ไม่ติ๊กถูก
}
```

## 📊 สถานะต่างๆ

### ซ่อน Standings (Hide Standing = true)
```
👁️ ตารางคะแนนถูกซ่อนไว้
ตารางคะแนนถูกซ่อนไว้ตามการตั้งค่าใน Google Sheets
กรุณาเอาติ๊กถูกออกจากช่อง L1 ในชีท Standing เพื่อแสดงตารางคะแนน
```

### แสดง Standings (Hide Standing = false)
- แสดงการจับคู่ปกติ
- แสดง Standings
- แสดงสถิติการแข่งขัน

## 🎨 การจัดรูปแบบ

### Checkbox ที่ L1
- พื้นหลังสีเหลืองอ่อน (#fef3c7)
- ขอบสีเหลือง (#fcd34d)
- จัดกึ่งกลางและตัวหนา

### ข้อความแจ้งเตือน
- พื้นหลังสีเหลืองอ่อน (#fef3c7)
- ขอบสีเหลือง (#fcd34d)
- ข้อความสีส้มเข้ม (#92400e)

## 🔄 Auto-refresh
- หน้าเว็บจะรีเฟรชข้อมูลทุก 30 วินาที
- ปุ่มรีเฟรชมี animation เมื่อกด
- รองรับการรีเฟรชเมื่อเชื่อมต่ออินเทอร์เน็ตกลับมา

## 🐛 การแก้ไขปัญหา

### ไม่เห็น checkbox ที่ L1
1. รีเฟรชหน้า Google Sheets
2. ระบบจะสร้าง checkbox อัตโนมัติเมื่อเปิดชีท
3. ตรวจสอบว่าช่อง L1 ว่างเปล่า

### ไม่เห็นการเปลี่ยนแปลง
1. ตรวจสอบว่า checkbox ที่ L1 ทำงานถูกต้อง
2. กดปุ่มรีเฟรช 🔄
3. รอ 30 วินาทีให้ auto-refresh ทำงาน

### หน้าเว็บไม่อัปเดต
1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
2. กดปุ่มรีเฟรช 🔄
3. ตรวจสอบ Console ใน Developer Tools

## 📝 หมายเหตุ
- ฟีเจอร์นี้ใช้ checkbox เดียวที่ช่อง L1
- ระบบจะสร้าง checkbox อัตโนมัติเมื่อเปิดชีท
- Default: ไม่ติ๊กถูก (แสดง Standings)
- การซ่อน Standings จะไม่ส่งผลต่อข้อมูลใน Google Sheets
- สามารถเปิด/ปิดการแสดงผลได้ตลอดเวลา
- ทำงานกับทั้ง Swiss Tournament และ Round Robin Tournament 