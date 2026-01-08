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
    // Check if already initialized to avoid error
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
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

        // --- TARGET: Member Dashboard (The Real Source of Truth) ---
        const targetSheet = "Member Dashboard";
        if (workbook.SheetNames.includes(targetSheet)) {
            console.log(`\n🚀 Processing Sheet: ${targetSheet}`);
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheet], { header: 1 });

            // Expected Headers (Row 1):
            // Name | Phone | Codename | Rank | EXP | Party | Rebirth Count | EXP Multiplier

            const batch = db.batch();
            let count = 0;
            let batchCount = 0;

            // Start from Row 2 (Index 1)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                // Check Phone (Column Index 1)
                if (!row || !row[1]) continue;

                let phone = String(row[1]).replace(/-/g, '').trim();
                if (phone.length < 9) continue; // Skip invalid phone

                // Map Columns
                const name = row[0] || '';
                const codename = row[2] || '';
                const rank = row[3] || 'Rookie';
                const exp = typeof row[4] === 'number' ? row[4] : 0;
                const party = row[5] || '';

                // New Critical Fields
                const rebirthCount = typeof row[6] === 'number' ? row[6] : 0;
                const expMultiplier = typeof row[7] === 'number' ? row[7] : 1.0;

                const docRef = db.collection('legacy_users').doc(phone);
                batch.set(docRef, {
                    phone,
                    displayName: name,
                    codename,
                    rank,
                    exp,
                    party,
                    rebirthCount, // เก็บ Rebirth
                    expMultiplier, // เก็บตัวคูณ
                    sourceSheet: targetSheet,
                    lastSynced: new Date().toISOString()
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
            console.log(`✅ Finished: ${count} users synced from ${targetSheet}.`);
        } else {
            console.error(`❌ Sheet "${targetSheet}" not found!`);
        }

    } catch (error) {
        console.error("Migration Failed:", error);
    }
}

migrateData();
