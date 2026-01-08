const admin = require('firebase-admin');
const fs = require('fs');

// --- CONFIG ---
const SERVICE_ACCOUNT = '/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/service-account.json';

try {
    if (!fs.existsSync(SERVICE_ACCOUNT)) throw new Error('Key not found');
    const serviceAccount = require(SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (e) {
    console.error(e.message);
    process.exit(1);
}

const db = admin.firestore();

async function cleanLegacy() {
    console.log("🧹 Cleaning 'legacy_users' collection...");
    const snapshot = await db.collection('legacy_users').get();

    if (snapshot.empty) {
        console.log("Empty collection.");
        return;
    }

    const batchSize = 400;
    let batch = db.batch();
    let count = 0;
    let totalDeleted = 0;

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        count++;

        if (count >= batchSize) {
            await batch.commit();
            totalDeleted += count;
            console.log(`Deleted ${totalDeleted} docs...`);
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
        totalDeleted += count;
    }

    console.log(`✅ Completely deleted ${totalDeleted} legacy users.`);
}

cleanLegacy();
