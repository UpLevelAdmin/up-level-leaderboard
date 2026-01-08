const XLSX = require('xlsx');
const EXCEL_FILE = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/Up Level Guild Data.xlsx';
const workbook = XLSX.readFile(EXCEL_FILE);
console.log("📑 Found Sheets:", workbook.SheetNames.join(", "));
