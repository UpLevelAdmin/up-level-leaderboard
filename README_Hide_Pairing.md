# 👁️ Hide Standing Feature

## 📋 ภาพรวม
ฟีเจอร์ "Hide Standing" ช่วยให้คุณสามารถซ่อนตารางคะแนน (Standings) ในหน้าเว็บได้ โดยใช้ checkbox ที่มีอยู่แล้วในคอลัมน์ "Hide Standing" ของชีท Standing

## 🎯 การใช้งาน

### 1. ใน Google Sheets
1. เปิดชีท "Standing" ใน Google Sheets
2. ใช้คอลัมน์ "Hide Standing" (คอลัมน์ K) ที่มีอยู่แล้ว
3. คอลัมน์นี้มี checkbox สำหรับทุกผู้เล่น
4. **ติ๊กถูก checkbox ใดๆ** = ซ่อน Standings ในหน้าเว็บ
5. **เอาติ๊กถูกออกทั้งหมด** = แสดง Standings ปกติ

### 2. การควบคุมการแสดงผล
- **มี checkbox ที่ติ๊กถูก** = ซ่อน Standings (แสดงเฉพาะการจับคู่)
- **ไม่มี checkbox ที่ติ๊กถูก** = แสดง Standings ปกติ

### 3. ในหน้าเว็บ
- หน้าเว็บจะตรวจสอบสถานะ Hide Standing ทุก 30 วินาที
- หากซ่อน Standings จะแสดงข้อความแจ้งเตือนแทน
- สามารถกดปุ่ม 🔄 เพื่อรีเฟรชข้อมูลได้

## 🔧 การทำงาน

### การตรวจสอบสถานะ
```javascript
function checkHideStandingStatus() {
  // ตรวจสอบคอลัมน์ K (Hide Standing)
  const hideStandingCol = 11;
  const checkboxValues = checkboxRange.getValues();
  
  // ตรวจสอบว่ามี checkbox ที่ติ๊กถูกหรือไม่
  const hasCheckedBox = checkboxValues.some(value => value[0] === true);
  
  return { hideStanding: hasCheckedBox };
}
```

### การส่งข้อมูล
```javascript
// ส่งสถานะไปยังหน้าเว็บ
return {
  pairing: pairingData,
  standings: standingsData,
  hideStanding: hideStandingStatus
};
```

## 📊 สถานะต่างๆ

### ซ่อน Standings (Hide Standing = true)
```
👁️ ตารางคะแนนถูกซ่อนไว้
ตารางคะแนนถูกซ่อนไว้ตามการตั้งค่าใน Google Sheets
กรุณาเอาติ๊กถูกออกจากคอลัมน์ "Hide Standing" ในชีท Standing เพื่อแสดงตารางคะแนน
```

### แสดง Standings (Hide Standing = false)
- แสดงการจับคู่ปกติ
- แสดง Standings
- แสดงสถิติการแข่งขัน

## 🎨 การจัดรูปแบบ

### ข้อความแจ้งเตือน
- พื้นหลังสีเหลืองอ่อน (#fef3c7)
- ขอบสีเหลือง (#fcd34d)
- ข้อความสีส้มเข้ม (#92400e)

## 🔄 Auto-refresh
- หน้าเว็บจะรีเฟรชข้อมูลทุก 30 วินาที
- ปุ่มรีเฟรชมี animation เมื่อกด
- รองรับการรีเฟรชเมื่อเชื่อมต่ออินเทอร์เน็ตกลับมา

## 🐛 การแก้ไขปัญหา

### ไม่เห็นการเปลี่ยนแปลง
1. ตรวจสอบว่า checkbox ในคอลัมน์ "Hide Standing" ทำงานถูกต้อง
2. กดปุ่มรีเฟรช 🔄
3. รอ 30 วินาทีให้ auto-refresh ทำงาน

### หน้าเว็บไม่อัปเดต
1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
2. กดปุ่มรีเฟรช 🔄
3. ตรวจสอบ Console ใน Developer Tools

### Checkbox ไม่ทำงาน
1. ตรวจสอบว่า Apps Script มีสิทธิ์แก้ไข Google Sheets
2. ลองรีเฟรชหน้า Google Sheets
3. ตรวจสอบว่าไม่มีข้อมูลในคอลัมน์ที่ขัดแย้ง

## 📝 หมายเหตุ
- ฟีเจอร์นี้ทำงานกับคอลัมน์ "Hide Standing" ที่มีอยู่แล้ว
- การซ่อน Standings จะไม่ส่งผลต่อข้อมูลใน Google Sheets
- สามารถเปิด/ปิดการแสดงผลได้ตลอดเวลา
- ทำงานกับทั้ง Swiss Tournament และ Round Robin Tournament 