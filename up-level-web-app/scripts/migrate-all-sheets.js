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

// Map Sheet Name -> Firestore Document ID (Category)
const SHEET_MAPPING = {
    // --- Game Configs ---
    'Reward Catalog': { id: 'config_rewards', category: 'Game Config' },
    'Activity List': { id: 'config_activities', category: 'Game Config' },
    'Quest List': { id: 'config_quests', category: 'Game Config' },
    'Challenge': { id: 'config_challenges', category: 'Game Config' },
    'Mystery Egg Pool': { id: 'config_mystery_egg', category: 'Game Config' },

    // --- Party System ---
    'Party': { id: 'party_list', category: 'Party System' },
    'Party Tracker': { id: 'party_tracker', category: 'Party System' },
    'Party Challenge': { id: 'party_challenge', category: 'Party System' },

    // --- Logs (All History) ---
    'EXP Log': { id: 'log_exp', category: 'System Logs' },
    'Party Log': { id: 'log_party', category: 'System Logs' },
    'Quest Log': { id: 'log_quest', category: 'System Logs' },
    'Admin Log': { id: 'log_admin', category: 'System Logs' },
    'Challenge Log': { id: 'log_challenge', category: 'System Logs' },
    'Rebirth Log': { id: 'log_rebirth', category: 'System Logs' },
    'Debug Log': { id: 'log_debug', category: 'System Logs' },
    'โพสต์ Rank Up': { id: 'log_rank_up', category: 'System Logs' },

    // --- Rankings & Stats ---
    'Leaderboard': { id: 'ranking_leaderboard', category: 'Ranking & Stats' },
    'Gym Standing': { id: 'ranking_gym', category: 'Ranking & Stats' },
    'Rebirth History': { id: 'ranking_rebirth_history', category: 'Ranking & Stats' },
    'รายชื่อรอรับเสื้อ': { id: 'ranking_shirt_queue', category: 'Ranking & Stats' },
    'จับฉลากอัป Rank': { id: 'ranking_raffle', category: 'Ranking & Stats' },
};

async function migrateAll() {
    console.log("📖 Reading Excel...");
    const workbook = XLSX.readFile(EXCEL_FILE);

    for (const [sheetName, config] of Object.entries(SHEET_MAPPING)) {
        if (!workbook.SheetNames.includes(sheetName)) {
            console.log(`⚠️ Skip: '${sheetName}' (Not found)`);
            continue;
        }

        console.log(`🚀 Migrating '${sheetName}' -> [${config.category}] ${config.id}...`);

        // Read Data
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" }); // defval ensures empty cells are empty strings

        // Optimize: If data is huge (>2000 rows like Gym/Logs), maybe splitting or limiting?
        // For now, Firestore document limit is 1MB. Huge logs might exceed it.
        // Let's truncate logs to last 2000 entries if too big to be safe for this "View Only" purpose.

        let finalData = data;
        if (data.length > 2000) {
            console.log(`   (Truncating ${data.length} -> 2000 latest rows for view)`);
            finalData = data.slice(data.length - 2000);
        }

        await db.collection('system_data').doc(config.id).set({
            title: sheetName,
            category: config.category,
            items: finalData,
            lastUpdated: new Date().toISOString(),
            count: data.length
        });
    }

    console.log("✅ All Sheets Migrated!");
}

migrateAll();
