const admin = require('firebase-admin');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// --- CONFIG (ABSOLUTE PATHS) ---
const EXCEL_FILE = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/Up Level Guild Data.xlsx';
const SERVICE_ACCOUNT = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/service-account.json';

// --- INIT FIREBASE ---
try {
    if (!fs.existsSync(SERVICE_ACCOUNT)) {
        throw new Error(`Service Account file not found at: ${SERVICE_ACCOUNT}`);
    }
    const serviceAccount = require(SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized");
} catch (e) {
    console.error("❌ Init Error:", e.message);
    process.exit(1);
}

const db = admin.firestore();

async function migrateData() {
    try {
        if (!fs.existsSync(EXCEL_FILE)) throw new Error(`Excel file not found at: ${EXCEL_FILE}`);

        console.log(`📖 Reading Excel...`);
        const workbook = XLSX.readFile(EXCEL_FILE);

        // --- 1. MIGRATE PROFILES (Member Dashboard) ---
        const dashboardSheetName = workbook.SheetNames.find(n => n.includes('Dashboard') || n.includes('Member'));
        if (dashboardSheetName) {
            console.log(`\n🚀 Processing Sheet: ${dashboardSheetName}`);
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[dashboardSheetName], { header: 1 });

            const batch = db.batch();
            let count = 0;
            let batchCount = 0;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || !row[1]) continue;

                let phone = String(row[1]).replace(/-/g, '').trim();

                const name = row[0] || '';
                const codename = row[2] || '';
                const rank = row[3] || 'Rookie';
                const exp = parseInt(row[4] || 0);
                const party = row[5] || '';

                const docRef = db.collection('legacy_users').doc(phone);
                batch.set(docRef, {
                    phone, displayName: name, codename, rank, exp, party,
                    migratedAt: new Date().toISOString()
                }, { merge: true });

                count++;
                batchCount++;

                if (batchCount >= 400) {
                    await batch.commit();
                    console.log(`   - Saved batch of ${batchCount} users`);
                    batchCount = 0;
                }
            }
            if (batchCount > 0) await batch.commit();
            console.log(`✅ Finished Profiles: ${count} users synced.`);
        }

        // --- 2. MIGRATE LOGS (EXP Log) ---
        const logSheetName = workbook.SheetNames.find(n => n.includes('Log') || n.includes('EXP'));
        if (logSheetName) {
            console.log(`\n📜 Processing Sheet: ${logSheetName}`);
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[logSheetName], { header: 1 });

            let logCount = 0;
            let batchOpCount = 0;
            let currentBatch = db.batch();

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];

                // Find Phone Column (heuristic: starts with 0 and length >=9)
                let phone = '';
                const possiblePhoneIdx = row.findIndex(c => String(c).replace(/-/g, '').match(/^0\d{8,9}$/));
                if (possiblePhoneIdx !== -1) {
                    phone = String(row[possiblePhoneIdx]).replace(/-/g, '').trim();
                } else {
                    continue;
                }

                if (!phone) continue;

                // Find Amount and Activity
                let amount = 0;
                const amountIdx = row.findIndex(c => typeof c === 'number');
                if (amountIdx !== -1) amount = row[amountIdx];
                const activity = row[amountIdx - 1] || 'Activity';
                const timestamp = row[0] || new Date().toISOString();

                // Create Log in Sub-collection
                const logRef = db.collection('legacy_users').doc(phone).collection('history').doc();
                currentBatch.set(logRef, {
                    action: activity,
                    expChange: amount,
                    timestamp: timestamp,
                    imported: true
                });

                batchOpCount++;
                logCount++;

                if (batchOpCount >= 400) {
                    await currentBatch.commit();
                    process.stdout.write('.');
                    currentBatch = db.batch();
                    batchOpCount = 0;
                }
            }
            if (batchOpCount > 0) await currentBatch.commit();
            console.log(`\n✅ Finished Logs: ${logCount} entries synced.`);
        }

    } catch (error) {
        console.error("Migration Failed:", error);
    }
}

migrateData();
