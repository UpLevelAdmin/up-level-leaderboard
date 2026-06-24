import {
    collection, doc, query, where, getDocs,
    updateDoc, addDoc, runTransaction, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { calculateRank } from '@/lib/gameConfig';

// ─── Add EXP to a user (by userId = Firebase Auth UID) ──────────────────────
export const addExpToUser = async (
    userId: string,
    amount: number,
    adminEmail: string,
    reason: string
) => {
    const userRef = doc(db, 'users', userId);

    await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) throw new Error(`User ${userId} not found`);

        const data = snap.data();
        const oldExp = Number(data.exp || 0);
        const newExp = oldExp + amount;
        const rebirthCount = Number(data.rebirthCount || 0);
        const newRank = calculateRank(newExp, rebirthCount);

        // Update user exp + auto recalc rank
        tx.update(userRef, {
            exp: newExp,
            rank: newRank,
            lastUpdated: serverTimestamp(),
        });

        // Write activity log
        const logRef = doc(collection(db, 'activity_logs'));
        tx.set(logRef, {
            userId,
            type: amount >= 0 ? 'exp_added' : 'exp_deducted',
            description: reason,
            expDelta: amount,
            expBefore: oldExp,
            expAfter: newExp,
            rankBefore: data.rank || 'Rookie',
            rankAfter: newRank,
            adminBy: adminEmail,
            timestamp: serverTimestamp(),
        });
    });
};

// ─── Add EXP by phone (lookup helper) ───────────────────────────────────────
export const addExpToUserByPhone = async (
    phone: string,
    amount: number,
    adminEmail: string,
    reason: string
) => {
    const q = query(collection(db, 'users'), where('phone', '==', phone));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error(`ไม่พบ user ที่มีเบอร์ ${phone}`);
    return addExpToUser(snap.docs[0].id, amount, adminEmail, reason);
};

// ─── Add Party Points ────────────────────────────────────────────────────────
export const addPartyPoints = async (
    partyName: string,
    amount: number,
    adminEmail: string,
    reason: string
) => {
    const q = query(collection(db, 'parties'), where('name', '==', partyName));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error(`ไม่พบปาร์ตี้ชื่อ ${partyName}`);

    const partyRef = snap.docs[0].ref;
    const current = Number(snap.docs[0].data().points || 0);

    await updateDoc(partyRef, {
        points: current + amount,
        lastUpdated: serverTimestamp(),
    });

    await addDoc(collection(db, 'activity_logs'), {
        type: 'party_points',
        partyName,
        pointsDelta: amount,
        description: reason,
        adminBy: adminEmail,
        timestamp: serverTimestamp(),
    });
};
