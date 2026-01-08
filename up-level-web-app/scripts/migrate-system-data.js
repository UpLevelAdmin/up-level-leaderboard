const admin = require('firebase-admin');
const XLSX = require('xlsx');
const fs = require('fs');

// --- CONFIG ---
const EXCEL_FILE = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/Up Level Guild Data.xlsx';
const SERVICE_ACCOUNT = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/service-account.json';

try {
    if (!fs.existsSync(SERVICE_ACCOUNT)) throw new Error('Key not found');
    const serviceAccount = require(SERVICE_ACCOUNT);
    if (admin.apps.length === 0) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (e) {
    console.error(e.message); process.exit(1);
}

const db = admin.firestore();

async function migrateSystemData() {
    const workbook = XLSX.readFile(EXCEL_FILE);

    // Define Sheets to Migrate
    const TARGETS = [
        { sheet: 'Reward Catalog', col: 'system_data', doc: 'rewards' },
        { sheet: 'Quest List', col: 'system_data', doc: 'quests' },
        { sheet: 'Gym Standing', col: 'system_data', doc: 'gym_standing' }
    ];

    for (const target of TARGETS) {
        if (!workbook.SheetNames.includes(target.sheet)) {
            console.log(`⚠️ Sheet '${target.sheet}' not found. Skipping.`);
            continue;
        }

        console.log(`🚀 Processing '${target.sheet}'...`);
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[target.sheet]); // Auto-map headers

        // Save to Firestore (Overwrite entire document with new list)
        await db.collection(target.col).doc(target.doc).set({
            items: data,
            lastUpdated: new Date().toISOString()
        });

        console.log(`✅ Saved ${data.length} items to ${target.doc}`);
    }
}

migrateSystemData();
