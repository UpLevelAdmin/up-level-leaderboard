/**
 * Lorcana Day Pairing — 2-League Swiss Tournament System
 * Sheet: Lorcana Day Pairing
 * ID: 1IHzi9_7JUjNKSnrRSE2vCJPvkUrE-Jp436nkby64ouA
 *
 * Architecture: 1 sheet, 8 tabs (4 per league × 2 leagues)
 *   Newbie_Players, Newbie_Pairing, Newbie_Standing, Newbie_Bucket
 *   Open_Players,   Open_Pairing,   Open_Standing,   Open_Bucket
 *
 * Web endpoint (doGet) returns both leagues in one payload:
 *   { newbie: {pairing, players, standings}, open: {pairing, players, standings} }
 */

// ============================================================
// CONSTANTS
// ============================================================
const LEAGUES = ['Newbie', 'Open'];

const HEADERS = {
  Players:  ['Player_id', 'Name', 'TR_ID', 'Tel'],
  Pairing:  ['ROUND', 'TABLE', 'P1_ID', 'PLAYER 1', 'WIN_P1', 'DRAW', 'WIN_P2', 'Double Loss',
             'P2_ID', 'PLAYER 2', 'RESULT', 'STATUS', 'Drop', 'Hide Standing', '', 'SLOW GAME'],
  Standing: ['Rank', 'Player ID', 'Player Name', 'TR_ID', 'Played', 'Win', 'Draw', 'Loss',
             'Points', 'Win Rate', 'OW%', 'OOW%', 'Slow Games', 'H2H', 'Win 2 รอบแรก', 'Pairing History'],
  Bucket:   ['Player ID', 'Player Name', 'TR_ID', 'Status', 'Played', 'Win', 'Draw', 'Loss', 'Points', 'MAX_NAME_LENGTH']
};

// Pairing column shortcuts (1-based)
const COL = {
  ROUND: 1, TABLE: 2, P1_ID: 3, P1_NAME: 4,
  WIN_P1: 5, DRAW: 6, WIN_P2: 7, DOUBLE_LOSS: 8,
  P2_ID: 9, P2_NAME: 10, RESULT: 11, STATUS: 12,
  DROP: 13, HIDE_HEADER: 14, HIDE_CHECK: 15, SLOW: 16
};

// ============================================================
// SHEET HELPERS
// ============================================================
function sheetName(league, type) { return league + '_' + type; }

function getSheet(league, type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(sheetName(league, type));
}

function getSheetOrFail(league, type) {
  const sh = getSheet(league, type);
  if (!sh) throw new Error('ไม่พบชีท ' + sheetName(league, type));
  return sh;
}

/** Detect league from a sheet name. Returns 'Newbie'|'Open'|null. */
function leagueFromSheetName(name) {
  for (var i = 0; i < LEAGUES.length; i++) {
    if (name.indexOf(LEAGUES[i] + '_') === 0) return LEAGUES[i];
  }
  return null;
}

// ============================================================
// SETUP — create all 8 tabs on first run
// ============================================================
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let created = 0, existing = 0;

  LEAGUES.forEach(league => {
    Object.keys(HEADERS).forEach(type => {
      const name = sheetName(league, type);
      let sh = ss.getSheetByName(name);
      if (!sh) {
        sh = ss.insertSheet(name);
        created++;
      } else {
        existing++;
      }
      // Write header row if empty
      const headers = HEADERS[type];
      const firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
      const hasHeader = firstRow.some(c => c && c.toString().trim() !== '');
      if (!hasHeader) {
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
        const headerRange = sh.getRange(1, 1, 1, headers.length);
        headerRange.setBackground(league === 'Newbie' ? '#4A9FCB' : '#E66B1F');
        headerRange.setFontColor('#ffffff');
        headerRange.setFontWeight('bold');
        headerRange.setHorizontalAlignment('center');
      }
    });
  });

  // Delete default "Sheet1" if it exists and is empty
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getLastRow() <= 1 && ss.getSheets().length > 1) {
    ss.deleteSheet(sheet1);
  }

  SpreadsheetApp.getUi().alert('✅ Setup เสร็จ\n\nสร้างใหม่: ' + created + ' tabs\nมีอยู่แล้ว: ' + existing + ' tabs');
}

// ============================================================
// MENU
// ============================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('⚙️ Setup')
    .addItem('🔧 Setup Sheets (รันครั้งแรก)', 'setupSheets')
    .addToUi();

  ui.createMenu('🐣 Newbie League')
    .addItem('🆔 สร้าง Player ID', 'newbieGeneratePlayerIDs')
    .addItem('🎲 จับคู่รอบแรก', 'newbiePairFirstRound')
    .addItem('➡️ จับคู่รอบถัดไป', 'newbiePairNextRound')
    .addItem('🔁 อัปเดต Standings', 'newbieUpdateStandings')
    .addItem('↩️ ย้อนรอบล่าสุด', 'newbieUndoLastPairing')
    .addSeparator()
    .addItem('🚫 Drop ผู้เล่น', 'newbieDropPlayer')
    .addItem('✅ ยกเลิก Drop', 'newbieCancelDrop')
    .addSeparator()
    .addItem('🗑️ เคลียร์ Pairing', 'newbieClearPairing')
    .addToUi();

  ui.createMenu('⚔️ Open League')
    .addItem('🆔 สร้าง Player ID', 'openGeneratePlayerIDs')
    .addItem('🎲 จับคู่รอบแรก', 'openPairFirstRound')
    .addItem('➡️ จับคู่รอบถัดไป', 'openPairNextRound')
    .addItem('🔁 อัปเดต Standings', 'openUpdateStandings')
    .addItem('↩️ ย้อนรอบล่าสุด', 'openUndoLastPairing')
    .addSeparator()
    .addItem('🚫 Drop ผู้เล่น', 'openDropPlayer')
    .addItem('✅ ยกเลิก Drop', 'openCancelDrop')
    .addSeparator()
    .addItem('🗑️ เคลียร์ Pairing', 'openClearPairing')
    .addToUi();
}

// League-bound menu wrappers
function newbieGeneratePlayerIDs() { generatePlayerIDs('Newbie'); }
function newbiePairFirstRound()    { pairFirstRound('Newbie'); }
function newbiePairNextRound()     { pairNextRound('Newbie'); }
function newbieUpdateStandings()   { updateStandings('Newbie'); }
function newbieUndoLastPairing()   { undoLastPairing('Newbie'); }
function newbieDropPlayer()        { dropPlayerFromList('Newbie'); }
function newbieCancelDrop()        { cancelPlayerDrop('Newbie'); }
function newbieClearPairing()      { clearPairing('Newbie'); }

function openGeneratePlayerIDs() { generatePlayerIDs('Open'); }
function openPairFirstRound()    { pairFirstRound('Open'); }
function openPairNextRound()     { pairNextRound('Open'); }
function openUpdateStandings()   { updateStandings('Open'); }
function openUndoLastPairing()   { undoLastPairing('Open'); }
function openDropPlayer()        { dropPlayerFromList('Open'); }
function openCancelDrop()        { cancelPlayerDrop('Open'); }
function openClearPairing()      { clearPairing('Open'); }

// ============================================================
// PLAYER ID GENERATION
// ============================================================
function generatePlayerIDs(league) {
  const sh = getSheetOrFail(league, 'Players');
  if (sh.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('❌ ไม่มีข้อมูลผู้เล่น\nกรอกชื่อ + TR_ID + Tel ใน tab ' + sheetName(league, 'Players') + ' ก่อน');
    return;
  }

  const data = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
  let valid = 0;
  const errors = [];
  const trIdSet = new Set();

  for (let i = 0; i < data.length; i++) {
    const name = data[i][1], trId = data[i][2], tel = data[i][3];
    const rowErrs = [];
    if (!name || name.toString().trim() === '') rowErrs.push('ไม่มีชื่อ');
    // TR_ID optional (Lorcana ไม่มี) — แต่ถ้ามี ห้ามซ้ำ
    if (trId && trId.toString().trim() !== '') {
      const t = trId.toString().trim().toLowerCase();
      if (trIdSet.has(t)) rowErrs.push('TR_ID ซ้ำ');
      else trIdSet.add(t);
    }
    if (!tel || tel.toString().trim() === '') {
      rowErrs.push('ไม่มีเบอร์โทร');
    } else if (tel.toString().trim().replace(/\D/g, '').length < 9) {
      rowErrs.push('เบอร์โทรสั้นเกิน');
    }

    if (rowErrs.length) errors.push('แถว ' + (i + 2) + ': ' + rowErrs.join(', '));
    else valid++;
  }

  if (errors.length) {
    SpreadsheetApp.getUi().alert('❌ ข้อมูลไม่ครบ ' + errors.length + ' แถว\n\n' + errors.slice(0, 10).join('\n'));
    return;
  }
  if (valid === 0) {
    SpreadsheetApp.getUi().alert('❌ ไม่พบข้อมูล');
    return;
  }

  const resp = SpreadsheetApp.getUi().alert(
    league + ' League: สร้าง Player ID',
    'พบ ' + valid + ' คน → สร้าง P001, P002, ...\n(TR_ID optional — ถ้ามีจะ prepend, ไม่มีก็ใช้ชื่อล้วน)\nต่อหรือไม่?',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  let counter = 1;
  for (let i = 0; i < data.length; i++) {
    const name = data[i][1], trId = data[i][2], tel = data[i][3];
    if (!name || !tel) continue;

    const playerId = 'P' + String(counter).padStart(3, '0');
    const cleanName = formatPlayerName(name.toString().trim());
    const hasTrId = trId && trId.toString().trim() !== '';
    const trIdLower = hasTrId ? trId.toString().trim().toLowerCase() : '';
    const finalName = hasTrId ? (trIdLower + '_' + cleanName) : cleanName;

    sh.getRange(i + 2, 1).setValue(playerId);
    sh.getRange(i + 2, 2).setValue(finalName);
    sh.getRange(i + 2, 3).setValue(trIdLower);

    let phone = tel.toString().trim().replace(/\D/g, '');
    if (phone.length === 9) phone = '0' + phone;
    const telCell = sh.getRange(i + 2, 4);
    telCell.setNumberFormat('@');
    telCell.setValue(phone);

    counter++;
  }

  SpreadsheetApp.getUi().alert('✅ สร้าง Player ID เสร็จ ' + (counter - 1) + ' คน');
}

function formatPlayerName(fullName) {
  const parts = fullName.split(' ').filter(p => p.trim() !== '');
  if (parts.length === 1) return parts[0];
  return parts[0] + ' ' + parts[parts.length - 1].charAt(0).toUpperCase() + '.';
}

// ============================================================
// PAIR FIRST ROUND
// ============================================================
function pairFirstRound(league) {
  const pairingSheet = getSheetOrFail(league, 'Pairing');
  const playersSheet = getSheetOrFail(league, 'Players');

  if (pairingSheet.getLastRow() > 1) {
    const resp = SpreadsheetApp.getUi().alert(
      league + ' League: มี Pairing อยู่แล้ว',
      'ลบของเดิม + จับคู่รอบใหม่?',
      SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    if (resp !== SpreadsheetApp.getUi().Button.YES) return;
    pairingSheet.getRange(2, 1, pairingSheet.getLastRow() - 1, pairingSheet.getLastColumn()).clearContent();
  }

  if (playersSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('❌ ไม่มีผู้เล่น');
    return;
  }

  const playersData = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 4).getValues();
  const dropList = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                              .getValues().flat().filter(x => x);
  const dropSet = new Set(dropList.map(x => x.toString().trim()));

  const active = playersData.filter(r => r[0] && r[1] && !dropSet.has(r[0]) && !dropSet.has(r[1]));

  if (active.length < 2) {
    SpreadsheetApp.getUi().alert('❌ ผู้เล่นน้อยเกินไป (' + active.length + ' คน)');
    return;
  }

  // Fisher-Yates shuffle
  for (let i = active.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [active[i], active[j]] = [active[j], active[i]];
  }

  let byePlayer = null;
  if (active.length % 2 !== 0) {
    byePlayer = active.pop();
  }

  const output = [];
  for (let i = 0; i < active.length; i += 2) {
    const p1 = active[i], p2 = active[i + 1];
    output.push([
      1, i / 2 + 1,
      p1[0], p1[1], false, false, false, false,
      p2[0], p2[1], '', '', '', false, false, false
    ]);
  }
  if (byePlayer) {
    output.push([
      1, output.length + 1,
      byePlayer[0], byePlayer[1], true, false, false, false,
      'BYE', 'BYE', '1:0', '✅ BYE', '', false, false, false
    ]);
  }

  const startRow = pairingSheet.getLastRow() + 1;
  pairingSheet.getRange(startRow, 1, output.length, output[0].length).setValues(output);
  addPairingCheckboxes(pairingSheet, startRow, output.length);
  formatRoundColor(pairingSheet, startRow, output.length, 1);

  updateStandings(league);
  SpreadsheetApp.getUi().alert('✅ จับคู่รอบ 1 เสร็จ (' + output.length + ' โต๊ะ)');
}

function addPairingCheckboxes(sheet, startRow, rowCount) {
  // WIN_P1, DRAW, WIN_P2, DOUBLE_LOSS = cols 5-8
  sheet.getRange(startRow, COL.WIN_P1, rowCount, 4).insertCheckboxes();
  // SLOW GAME = col 16
  sheet.getRange(startRow, COL.SLOW, rowCount, 1).insertCheckboxes();
  for (let i = startRow; i < startRow + rowCount; i++) {
    sheet.setRowHeight(i, 32);
  }
}

function formatRoundColor(sheet, startRow, rowCount, roundNum) {
  const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
                  '#e0f2f1', '#f1f8e9', '#fff8e1', '#e8eaf6', '#ffebee'];
  const bg = colors[(roundNum - 1) % colors.length];
  const range = sheet.getRange(startRow, 1, rowCount, sheet.getLastColumn());
  range.setBackground(bg);
  range.setBorder(true, true, true, true, true, true, '#d1d5db', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(startRow, COL.P1_NAME, rowCount, 1).setHorizontalAlignment('left');
  sheet.getRange(startRow, COL.P2_NAME, rowCount, 1).setHorizontalAlignment('left');
}

// ============================================================
// PAIR NEXT ROUND — Swiss with bracket pairing + backtracking
// ============================================================
function pairNextRound(league) {
  const pairingSheet = getSheetOrFail(league, 'Pairing');
  const playersSheet = getSheetOrFail(league, 'Players');

  const allPairingData = pairingSheet.getDataRange().getValues();
  if (allPairingData.length <= 1) {
    SpreadsheetApp.getUi().alert('❌ ยังไม่มีรอบไหนเลย → ใช้ "จับคู่รอบแรก"');
    return;
  }

  // Find last round and verify all results filled
  const roundsCol = allPairingData.slice(1).map(r => r[0]).filter(r => r);
  if (roundsCol.length === 0) {
    SpreadsheetApp.getUi().alert('❌ ไม่พบ round ใน Pairing');
    return;
  }
  const lastRound = Math.max.apply(null, roundsCol);
  const nextRound = lastRound + 1;

  const incomplete = [];
  for (let i = 1; i < allPairingData.length; i++) {
    const row = allPairingData[i];
    if (row[0] !== lastRound) continue;
    if (row[COL.P2_ID - 1] === 'BYE') continue;
    if (!row[COL.RESULT - 1] || row[COL.RESULT - 1].toString().trim() === '') {
      incomplete.push(row[COL.TABLE - 1]);
    }
  }
  if (incomplete.length) {
    SpreadsheetApp.getUi().alert('❌ รอบ ' + lastRound + ' ยังไม่ครบ\nโต๊ะค้าง: ' + incomplete.join(', '));
    return;
  }

  // Update standings before pairing
  updateStandings(league);

  // Get current standings (with points)
  const standingSheet = getSheet(league, 'Standing');
  if (!standingSheet || standingSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('❌ ไม่มี Standing');
    return;
  }
  const standingData = standingSheet.getRange(2, 1, standingSheet.getLastRow() - 1, 9).getValues();

  // Build drop set
  const dropList = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                              .getValues().flat().filter(x => x);
  const dropSet = new Set(dropList.map(x => x.toString().trim()));

  // Active players from standings
  const active = standingData
    .filter(r => {
      const rank = r[0], id = r[1], name = r[2];
      if (rank === 'DROP') return false;
      if (!id || !name) return false;
      if (dropSet.has(id) || dropSet.has(name)) return false;
      return true;
    })
    .map(r => ({ id: r[1], name: r[2], points: r[8] || 0 }));

  if (active.length < 2) {
    SpreadsheetApp.getUi().alert('❌ ผู้เล่น active น้อยเกิน (' + active.length + ' คน)');
    return;
  }

  // Build match history (ใครเจอใครมาแล้ว)
  const history = {};
  const byeHistory = [];
  for (let i = 1; i < allPairingData.length; i++) {
    const row = allPairingData[i];
    const p1 = row[COL.P1_ID - 1], p2 = row[COL.P2_ID - 1];
    if (!p1) continue;
    if (p2 === 'BYE') {
      byeHistory.push(p1);
      continue;
    }
    if (!history[p1]) history[p1] = [];
    if (!history[p2]) history[p2] = [];
    history[p1].push(p2);
    history[p2].push(p1);
  }

  // Sort by points desc + random tie
  active.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return Math.random() - 0.5;
  });

  // Pick BYE player if odd
  let byePlayer = null;
  if (active.length % 2 === 1) {
    // Lowest points + not yet BYE
    for (let i = active.length - 1; i >= 0; i--) {
      if (byeHistory.indexOf(active[i].id) === -1) {
        byePlayer = active[i];
        active.splice(i, 1);
        break;
      }
    }
    if (!byePlayer) {
      byePlayer = active.pop();
    }
  }

  // Backtracking pair
  const used = new Set();
  const paired = [];
  const startTime = Date.now();
  const MAX_TIME = 15000;

  function tryPair(players) {
    if (Date.now() - startTime > MAX_TIME) return false;
    const remaining = players.filter(p => !used.has(p.id));
    if (remaining.length === 0) return true;
    if (remaining.length === 1) return false;

    const p1 = remaining[0];
    // Candidates sorted by point diff
    const candidates = remaining.slice(1).filter(p => {
      return !(history[p1.id] && history[p1.id].indexOf(p.id) !== -1);
    });
    candidates.sort((a, b) => {
      const da = Math.abs(p1.points - a.points);
      const db = Math.abs(p1.points - b.points);
      if (da !== db) return da - db;
      return Math.random() - 0.5;
    });

    for (let i = 0; i < candidates.length; i++) {
      const p2 = candidates[i];
      used.add(p1.id); used.add(p2.id);
      paired.push([p1, p2]);
      if (tryPair(players)) return true;
      paired.pop();
      used.delete(p1.id); used.delete(p2.id);
    }
    return false;
  }

  let success = tryPair(active);

  // Fallback: allow rematch if needed
  if (!success) {
    used.clear();
    paired.length = 0;
    function tryPairLoose(players) {
      if (Date.now() - startTime > MAX_TIME) return false;
      const remaining = players.filter(p => !used.has(p.id));
      if (remaining.length === 0) return true;
      if (remaining.length === 1) return false;
      const p1 = remaining[0];
      const candidates = remaining.slice(1);
      candidates.sort((a, b) => Math.abs(p1.points - a.points) - Math.abs(p1.points - b.points));
      for (let i = 0; i < candidates.length; i++) {
        const p2 = candidates[i];
        used.add(p1.id); used.add(p2.id);
        paired.push([p1, p2]);
        if (tryPairLoose(players)) return true;
        paired.pop();
        used.delete(p1.id); used.delete(p2.id);
      }
      return false;
    }
    success = tryPairLoose(active);
  }

  if (!success) {
    SpreadsheetApp.getUi().alert('❌ จับคู่ไม่สำเร็จ (timeout)');
    return;
  }

  // Sort pairs: table 1 = highest combined points
  paired.sort((a, b) => {
    const maxA = Math.max(a[0].points, a[1].points);
    const maxB = Math.max(b[0].points, b[1].points);
    return maxB - maxA;
  });

  const output = [];
  let table = 1;
  paired.forEach(pair => {
    const p1 = pair[0], p2 = pair[1];
    output.push([
      nextRound, table++,
      p1.id, p1.name, false, false, false, false,
      p2.id, p2.name, '', '', '', false, false, false
    ]);
  });
  if (byePlayer) {
    output.push([
      nextRound, table,
      byePlayer.id, byePlayer.name, true, false, false, false,
      'BYE', 'BYE', '1:0', '✅ BYE', '', false, false, false
    ]);
  }

  const startRow = pairingSheet.getLastRow() + 1;
  pairingSheet.getRange(startRow, 1, output.length, output[0].length).setValues(output);
  addPairingCheckboxes(pairingSheet, startRow, output.length);
  formatRoundColor(pairingSheet, startRow, output.length, nextRound);

  updateStandings(league);
  SpreadsheetApp.getUi().alert('✅ จับคู่รอบ ' + nextRound + ' เสร็จ (' + output.length + ' โต๊ะ)');
}

// ============================================================
// UPDATE STANDINGS
// ============================================================
function updateStandings(league) {
  const pairingSheet = getSheet(league, 'Pairing');
  const playersSheet = getSheet(league, 'Players');
  const standingSheet = getSheet(league, 'Standing');
  const bucketSheet = getSheet(league, 'Bucket');
  if (!pairingSheet || !playersSheet || !standingSheet) return;

  const playersData = playersSheet.getLastRow() > 1
    ? playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 4).getValues()
    : [];
  const allPairing = pairingSheet.getDataRange().getValues();

  const dropList = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                              .getValues().flat().filter(x => x);
  const dropSet = new Set(dropList.map(x => x.toString().trim()));

  // Init player map
  const stats = {};
  const trIdMap = {};
  playersData.forEach(r => {
    if (r[0] && r[1]) {
      stats[r[0]] = { name: r[1], trId: r[2] || '', played: 0, win: 0, draw: 0, loss: 0 };
      trIdMap[r[0]] = r[2] || '';
    }
  });

  const oppHistory = {};

  // Process results
  for (let i = 1; i < allPairing.length; i++) {
    const row = allPairing[i];
    const p1 = row[COL.P1_ID - 1], p2 = row[COL.P2_ID - 1];
    const p1Name = row[COL.P1_NAME - 1], p2Name = row[COL.P2_NAME - 1];
    const result = row[COL.RESULT - 1];
    if (!p1 || !p2 || !result) continue;

    if (!stats[p1]) stats[p1] = { name: p1Name, trId: '', played: 0, win: 0, draw: 0, loss: 0 };
    if (!oppHistory[p1]) oppHistory[p1] = [];

    if (p2 === 'BYE') {
      stats[p1].played++;
      stats[p1].win++;
      continue;
    }
    if (!stats[p2]) stats[p2] = { name: p2Name, trId: '', played: 0, win: 0, draw: 0, loss: 0 };
    if (!oppHistory[p2]) oppHistory[p2] = [];

    oppHistory[p1].push(p2);
    oppHistory[p2].push(p1);
    stats[p1].played++;
    stats[p2].played++;

    if (result === '1:0') { stats[p1].win++; stats[p2].loss++; }
    else if (result === '0:1') { stats[p2].win++; stats[p1].loss++; }
    else if (result === '1:1') { stats[p1].draw++; stats[p2].draw++; }
    else if (result === '0:0') { stats[p1].loss++; stats[p2].loss++; }
  }

  // OW% / OOW%
  function owPct(id) {
    const opps = oppHistory[id] || [];
    if (opps.length === 0) return 0;
    let wins = 0, games = 0;
    opps.forEach(o => {
      if (stats[o]) { wins += stats[o].win; games += stats[o].played; }
    });
    return games > 0 ? Math.min(100, Math.round(wins / games * 100)) : 0;
  }
  function oowPct(id) {
    const opps = oppHistory[id] || [];
    if (opps.length === 0) return 0;
    let wins = 0, games = 0;
    opps.forEach(o => {
      const oo = oppHistory[o] || [];
      oo.forEach(o2 => {
        if (o2 !== id && stats[o2]) { wins += stats[o2].win; games += stats[o2].played; }
      });
    });
    return games > 0 ? Math.min(100, Math.round(wins / games * 100)) : 0;
  }

  // Win 2 รอบแรก
  function win2First(id) {
    let cnt = 0;
    for (let i = 1; i < allPairing.length; i++) {
      const row = allPairing[i];
      if (row[0] !== 1 && row[0] !== 2) continue;
      const p1 = row[COL.P1_ID - 1], p2 = row[COL.P2_ID - 1], res = row[COL.RESULT - 1];
      if (p1 === id) {
        if (res === '1:0' || (p2 === 'BYE')) cnt++;
      } else if (p2 === id) {
        if (res === '0:1') cnt++;
      }
    }
    return cnt;
  }

  // Pairing history
  function pairingHist(id) {
    const out = [];
    for (let i = 1; i < allPairing.length; i++) {
      const row = allPairing[i];
      const p1 = row[COL.P1_ID - 1], p2 = row[COL.P2_ID - 1];
      const p1Name = row[COL.P1_NAME - 1], p2Name = row[COL.P2_NAME - 1];
      const res = row[COL.RESULT - 1], round = row[0];
      if (!res) continue;
      if (p1 === id) {
        const opp = p2 === 'BYE' ? 'BYE' : (p2Name || p2);
        const r = p2 === 'BYE' ? 'W' : (res === '1:0' ? 'W' : res === '0:1' ? 'L' : res === '1:1' ? 'D' : 'L');
        out.push('R' + round + ':' + opp + '(' + r + ')');
      } else if (p2 === id) {
        const opp = p1Name || p1;
        const r = res === '0:1' ? 'W' : res === '1:0' ? 'L' : res === '1:1' ? 'D' : 'L';
        out.push('R' + round + ':' + opp + '(' + r + ')');
      }
    }
    return out.join(', ');
  }

  // Slow games count
  function slowGames(id) {
    let cnt = 0;
    for (let i = 1; i < allPairing.length; i++) {
      const row = allPairing[i];
      const p1 = row[COL.P1_ID - 1], p2 = row[COL.P2_ID - 1], slow = row[COL.SLOW - 1];
      if ((p1 === id || p2 === id) && slow === true) cnt++;
    }
    return cnt;
  }

  // Build rows
  const active = [], dropped = [];
  Object.keys(stats).forEach(id => {
    const s = stats[id];
    const points = s.win * 3 + s.draw;
    const winRate = s.played > 0 ? Math.min(100, Math.round(s.win / s.played * 100)) : 0;
    const ow = owPct(id), oow = oowPct(id);
    const slow = slowGames(id), w2 = win2First(id), hist = pairingHist(id);
    const row = [
      0, id, s.name, trIdMap[id] || s.trId || '',
      s.played, s.win, s.draw, s.loss, points,
      winRate + '%', ow + '%', oow + '%',
      slow, '', w2, hist
    ];
    if (dropSet.has(id) || dropSet.has(s.name)) dropped.push(row);
    else active.push(row);
  });

  // Sort active
  active.sort((a, b) => {
    if (b[8] !== a[8]) return b[8] - a[8];
    const wA = parseInt(a[9]), wB = parseInt(b[9]);
    if (wB !== wA) return wB - wA;
    const owA = parseInt(a[10]), owB = parseInt(b[10]);
    if (owB !== owA) return owB - owA;
    const oowA = parseInt(a[11]), oowB = parseInt(b[11]);
    if (oowB !== oowA) return oowB - oowA;
    return (a[2] || '').toString().localeCompare((b[2] || '').toString());
  });
  dropped.sort((a, b) => b[8] - a[8]);

  // Assign ranks (with ties)
  let rank = 1;
  for (let i = 0; i < active.length; i++) {
    if (i === 0) {
      active[i][0] = 1;
    } else {
      const prev = active[i - 1];
      if (prev[8] === active[i][8] && prev[9] === active[i][9] && prev[10] === active[i][10] && prev[11] === active[i][11]) {
        active[i][0] = prev[0];
      } else {
        active[i][0] = i + 1;
      }
    }
  }
  dropped.forEach(r => r[0] = 'DROP');

  const final = active.concat(dropped);
  if (final.length === 0) return;

  standingSheet.clearContents();
  standingSheet.getRange(1, 1, 1, HEADERS.Standing.length).setValues([HEADERS.Standing]);
  const hdrRange = standingSheet.getRange(1, 1, 1, HEADERS.Standing.length);
  hdrRange.setBackground(league === 'Newbie' ? '#4A9FCB' : '#E66B1F');
  hdrRange.setFontColor('#ffffff');
  hdrRange.setFontWeight('bold');
  hdrRange.setHorizontalAlignment('center');
  standingSheet.getRange(2, 1, final.length, HEADERS.Standing.length).setValues(final);

  // Update bucket cache
  if (bucketSheet) {
    bucketSheet.clearContents();
    bucketSheet.getRange(1, 1, 1, HEADERS.Bucket.length).setValues([HEADERS.Bucket]);
    let maxNameLen = 0;
    const bucketRows = [];
    Object.keys(stats).forEach(id => {
      const s = stats[id];
      const status = (dropSet.has(id) || dropSet.has(s.name)) ? 'DROPPED' : 'ACTIVE';
      const points = s.win * 3 + s.draw;
      if (s.name) maxNameLen = Math.max(maxNameLen, s.name.length);
      bucketRows.push([id, s.name, trIdMap[id] || s.trId || '', status, s.played, s.win, s.draw, s.loss, points, '']);
    });
    if (bucketRows.length > 0) {
      bucketRows[0][9] = maxNameLen;
      bucketSheet.getRange(2, 1, bucketRows.length, HEADERS.Bucket.length).setValues(bucketRows);
    }
  }

  // Update SAVING status to OK
  const lastRow = pairingSheet.getLastRow();
  if (lastRow > 1) {
    const statusRange = pairingSheet.getRange(2, COL.STATUS, lastRow - 1, 1);
    const statuses = statusRange.getValues();
    let updated = false;
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i][0] === '⏳ SAVING...') {
        statuses[i][0] = '✅ OK';
        updated = true;
      }
    }
    if (updated) statusRange.setValues(statuses);
  }
}

// ============================================================
// UNDO LAST PAIRING
// ============================================================
function undoLastPairing(league) {
  const pairingSheet = getSheetOrFail(league, 'Pairing');
  const rounds = pairingSheet.getRange(2, 1, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                            .getValues().flat().filter(r => r && !isNaN(r)).map(r => parseInt(r));
  if (rounds.length === 0) {
    SpreadsheetApp.getUi().alert('ไม่มีรอบให้ย้อน');
    return;
  }
  const lastRound = Math.max.apply(null, rounds);
  const data = pairingSheet.getDataRange().getValues();
  const rowsToDelete = [];
  for (let i = 1; i < data.length; i++) {
    if (parseInt(data[i][0]) === lastRound) rowsToDelete.push(i + 1);
  }
  if (rowsToDelete.length === 0) return;

  const resp = SpreadsheetApp.getUi().alert(
    league + ' League: ย้อนรอบ ' + lastRound,
    'ลบ ' + rowsToDelete.length + ' แถว?',
    SpreadsheetApp.getUi().ButtonSet.YES_NO
  );
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(r => pairingSheet.deleteRow(r));
  updateStandings(league);
  SpreadsheetApp.getUi().alert('✅ ย้อนรอบ ' + lastRound + ' เสร็จ');
}

// ============================================================
// DROP / CANCEL DROP
// ============================================================
function dropPlayerFromList(league) {
  const pairingSheet = getSheetOrFail(league, 'Pairing');
  const playersSheet = getSheetOrFail(league, 'Players');
  if (playersSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('ไม่มีผู้เล่น');
    return;
  }
  const data = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 4).getValues();
  const dropList = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                              .getValues().flat().filter(x => x);
  const dropSet = new Set(dropList.map(x => x.toString().trim()));

  const list = data
    .filter(r => r[0] && r[1] && !dropSet.has(r[0]) && !dropSet.has(r[1]))
    .map(r => r[0] + ' - ' + r[1]).sort();
  if (list.length === 0) {
    SpreadsheetApp.getUi().alert('ไม่มีคนให้ drop');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt(
    league + ' League: Drop ผู้เล่น',
    list.map((p, i) => (i + 1) + '. ' + p).join('\n') + '\n\nกรอกหมายเลข:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const idx = parseInt(resp.getResponseText().trim()) - 1;
  if (idx < 0 || idx >= list.length) {
    ui.alert('หมายเลขผิด');
    return;
  }
  const sel = list[idx];
  const playerName = sel.split(' - ')[1];

  // Find first empty row in DROP column
  const dropCol = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1).getValues();
  let emptyRow = 2;
  for (let i = 0; i < dropCol.length; i++) {
    if (!dropCol[i][0]) { emptyRow = i + 2; break; }
    emptyRow = i + 3;
  }
  pairingSheet.getRange(emptyRow, COL.DROP).setValue(playerName);
  updateStandings(league);
  ui.alert('✅ Drop "' + playerName + '" แล้ว');
}

function cancelPlayerDrop(league) {
  const pairingSheet = getSheetOrFail(league, 'Pairing');
  const dropList = pairingSheet.getRange(2, COL.DROP, Math.max(1, pairingSheet.getLastRow() - 1), 1)
                              .getValues().flat().filter(x => x);
  if (dropList.length === 0) {
    SpreadsheetApp.getUi().alert('ไม่มีคนถูก drop');
    return;
  }
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt(
    league + ' League: ยกเลิก Drop',
    dropList.map((p, i) => (i + 1) + '. ' + p).join('\n') + '\n\nกรอกหมายเลข:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const idx = parseInt(resp.getResponseText().trim()) - 1;
  if (idx < 0 || idx >= dropList.length) {
    ui.alert('หมายเลขผิด');
    return;
  }
  const target = dropList[idx];
  // Find and clear
  const range = pairingSheet.getRange(2, COL.DROP, pairingSheet.getLastRow() - 1, 1);
  const values = range.getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === target) {
      pairingSheet.getRange(i + 2, COL.DROP).clearContent();
      break;
    }
  }
  updateStandings(league);
  ui.alert('✅ ยกเลิก Drop "' + target + '" แล้ว');
}

// ============================================================
// CLEAR PAIRING
// ============================================================
function clearPairing(league) {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert(
    league + ' League: เคลียร์ Pairing + Standing + Bucket',
    'แน่ใจไหม? (ไม่กระทบ Players)',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  ['Pairing', 'Standing', 'Bucket'].forEach(type => {
    const sh = getSheet(league, type);
    if (sh && sh.getLastRow() > 1) {
      sh.deleteRows(2, sh.getLastRow() - 1);
    }
  });
  ui.alert('✅ เคลียร์เสร็จ');
}

// ============================================================
// onEdit — checkbox → result → status → update standings
// ============================================================
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const name = sheet.getName();
    const league = leagueFromSheetName(name);
    if (!league) return;
    if (name !== sheetName(league, 'Pairing')) return;

    const row = e.range.getRow();
    const col = e.range.getColumn();
    if (row === 1) return;

    // Direct edit to RESULT
    if (col === COL.RESULT) {
      const v = sheet.getRange(row, COL.RESULT).getValue();
      if (v && v !== '') {
        sheet.getRange(row, COL.STATUS).setValue('⏳ SAVING...');
        SpreadsheetApp.flush();
        updateStandings(league);
      } else {
        sheet.getRange(row, COL.STATUS).setValue('');
      }
      return;
    }

    // Checkbox edit
    if (col >= COL.WIN_P1 && col <= COL.DOUBLE_LOSS) {
      const range = sheet.getRange(row, COL.WIN_P1, 1, 4);
      const values = range.getValues()[0];
      const clickedIdx = col - COL.WIN_P1;
      if (values[clickedIdx] === true) {
        for (let i = 0; i < 4; i++) {
          if (i !== clickedIdx) values[i] = false;
        }
        range.setValues([values]);
      }

      let result = '';
      if (values[3]) result = '0:0';
      else if (values[0]) result = '1:0';
      else if (values[1]) result = '1:1';
      else if (values[2]) result = '0:1';

      sheet.getRange(row, COL.RESULT).setValue(result);
      if (result) {
        sheet.getRange(row, COL.STATUS).setValue('⏳ SAVING...');
        SpreadsheetApp.flush();
        updateStandings(league);
      } else {
        sheet.getRange(row, COL.STATUS).setValue('');
      }
    }
  } catch (err) {
    console.log('onEdit error:', err);
  }
}

// ============================================================
// doGet — web endpoint, returns both leagues
// ============================================================
function doGet(e) {
  const wanted = e && e.parameter && e.parameter.league;
  const payload = {};

  LEAGUES.forEach(league => {
    if (wanted && wanted.toLowerCase() !== league.toLowerCase()) return;
    const key = league.toLowerCase();
    const pairingSheet = getSheet(league, 'Pairing');
    const playersSheet = getSheet(league, 'Players');
    const standingSheet = getSheet(league, 'Standing');

    payload[key] = {
      pairing: pairingSheet ? pairingSheet.getDataRange().getValues() : [],
      players: playersSheet ? playersSheet.getDataRange().getValues() : [],
      standings: (standingSheet && standingSheet.getLastRow() > 1)
        ? standingSheet.getRange(1, 1, standingSheet.getLastRow(), standingSheet.getLastColumn()).getValues()
        : []
    };
  });

  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
