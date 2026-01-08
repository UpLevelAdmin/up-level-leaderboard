
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // databaseURL: "https://up-level-guild.firebaseio.com" // Optional for Firestore
        });
        console.log("Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
        // Fallback for local dev if needed, or just let it fail if no creds
    }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
