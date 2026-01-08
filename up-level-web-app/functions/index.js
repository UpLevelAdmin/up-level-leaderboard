const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

const API_SECRET = "up-level-secret-key-1234";

// Keep syncUser as Gen 1 for now (to avoid breaking anything)
exports.syncUser = functions.https.onRequest(async (req, res) => {
    const secret = req.body.secret || req.query.secret;
    if (secret !== API_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const payloadData = req.body.data;
        const items = Array.isArray(payloadData) ? payloadData : [payloadData];
        const batch = db.batch();
        let count = 0;

        for (const item of items) {
            if (!item.type || item.type === 'user') {
                const phone = String(item.phone || "").trim();
                if (!phone) continue;
                const legacyRef = db.collection("legacy_users").doc(phone);
                batch.set(legacyRef, {
                    phone: phone,
                    displayName: item.name || "",
                    codename: item.codename || "",
                    rank: item.rank || "Rookie",
                    exp: parseInt(item.exp || 0),
                    party: item.party || "",
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
                count++;
            }
            else if (item.type === 'log') {
                const phone = String(item.phone || "").trim();
                if (!phone) continue;
                const logRef = db.collection("legacy_users").doc(phone).collection("history").doc();
                batch.set(logRef, {
                    action: item.activity || "Unknown",
                    expChange: parseInt(item.amount || 0),
                    timestamp: item.timestamp || new Date().toISOString(),
                    adminName: "System Import",
                    imported: true
                });
                count++;
            }
        }
        await batch.commit();
        return res.json({ success: true, processed: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Upgrade verifySlip to Gen 2 for better CORS and public access handling
exports.verifySlip = onRequest({ cors: true, maxInstances: 10 }, async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { slipImage, userId, amount } = req.body;
        const SLIPOK_API_KEY = 'SLIPOKE2TSLQJ';
        const BRANCH_ID = '58927';

        if (!slipImage) return res.status(400).json({ error: "No image provided" });

        const base64Data = slipImage.includes(',') ? slipImage.split(',').pop() : slipImage;

        const response = await axios.post(`https://api.slipok.com/api/line/apikey/${BRANCH_ID}`, {
            files: base64Data,
            log: true,
            amount: amount || 0
        }, {
            headers: {
                'x-authorization': SLIPOK_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;

        if (result.success && userId && userId !== 'DEBUG_USER') {
            const slipData = result.data;
            if (slipData.amount >= 50) {
                await db.collection('users').doc(userId).update({
                    paymentStatus: 'paid',
                    status: 'approved',
                    role: 'member',
                    paymentVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
                    slipOkData: slipData
                }).catch(e => console.error("Firestore Update Error:", e));
            }
        }

        return res.json(result);

    } catch (error) {
        console.error("Slip Verification Error:", error.response?.data || error.message);
        const errorData = error.response?.data || { error: error.message };
        return res.status(error.response?.status || 500).json(errorData);
    }
});
