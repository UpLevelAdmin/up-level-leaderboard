/**
 * backup-firestore.js
 * Export all Firestore collections to JSON backup files
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const SERVICE_ACCOUNT = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/service-account.json';

// Collections to backup
const COLLECTIONS = [
    'users',
    'legacy_users',
    'claim_requests',
    'activity_logs',
    'activities',
    'rebirth_requests',
    'parties',
    'system_data',
    'public_payments',
    'admin_logs',
    'quests',
    'shop',
];

// Init Firebase Admin
const serviceAccount = require(SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(__dirname, `../backup_${timestamp}`);
    fs.mkdirSync(backupDir, { recursive: true });

    console.log(`\n📦 Starting Firestore Backup → ${backupDir}\n`);

    const summary = {};

    for (const colName of COLLECTIONS) {
        try {
            const snap = await db.collection(colName).get();
            if (snap.empty) {
                console.log(`⬜ ${colName}: (empty)`);
                summary[colName] = 0;
                continue;
            }

            const docs = {};
            snap.forEach(doc => { docs[doc.id] = doc.data(); });

            const filePath = path.join(backupDir, `${colName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));
            console.log(`✅ ${colName}: ${snap.size} docs`);
            summary[colName] = snap.size;
        } catch (err) {
            console.log(`❌ ${colName}: ${err.message}`);
            summary[colName] = 'ERROR';
        }
    }

    // Write summary
    fs.writeFileSync(
        path.join(backupDir, '_summary.json'),
        JSON.stringify({ timestamp, summary }, null, 2)
    );

    console.log('\n🎉 Backup Complete!\n');
    console.log('Summary:');
    Object.entries(summary).forEach(([col, count]) => {
        console.log(`  ${col}: ${count}`);
    });
    console.log(`\n📁 Saved to: ${backupDir}`);
    process.exit(0);
}

backup().catch(err => {
    console.error('Backup failed:', err);
    process.exit(1);
});
