import { collection, doc, query, where, getDocs, updateDoc, setDoc, increment, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { parseRankDetails } from '@/types/user';

// EXP Required for each Rank
const RANK_EXP_TABLE: Record<string, number> = {
    'Rookie': 0,
    'Bronze': 10,
    'Silver': 30, // Example values, we should match your Sheet logic
    'Gold': 60,
    'Platinum': 100,
    'Diamond': 150,
    'Grandmaster': 210,
    'Legend': 280,
    'God': 9999
};

const RANKS = ['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend', 'God'];

/**
 * Core Game Logic for calculating Rank updates
 */
export const calculateNewRank = (currentRank: string, currentExp: number): { newRank: string, leveledUp: boolean } => {
    let rankIndex = RANKS.indexOf(currentRank);
    if (rankIndex === -1) rankIndex = 0; // Default to Rookie

    // Check if can level up
    // Simple logic: If currentRank is not Max, check if EXP >= Next Rank Req
    // NOTE: This logic needs to be precise based on your game rules.
    // For now, I will assume MANUAL Rank Up by Admin mostly, or simple threshold.

    // IF your game uses automatic rank up based on EXP table:
    /*
    for (let i = rankIndex + 1; i < RANKS.length; i++) {
        const nextRank = RANKS[i];
        const req = RANK_EXP_TABLE[nextRank];
        if (currentExp >= req) {
            return { newRank: nextRank, leveledUp: true };
        }
    }
    */

    // For now, return same as is, assuming Admin triggers direct Rank Change or simple add EXP
    return { newRank: currentRank, leveledUp: false };
};

/**
 * Add EXP to a user (Unified: works for Claimed and Legacy)
 */
export const addExpToUser = async (phone: string, amount: number, adminName: string, reason: string) => {
    // 1. Find User (Check 'users' then 'legacy_users')
    let collectionName = 'users';
    let userDocId = null;
    let userData = null;

    // Check 'users' (Claimed) - Query by phone because ID might be UID
    const q1 = query(collection(db, 'users'), where('phone', '==', phone));
    const snap1 = await getDocs(q1);

    if (!snap1.empty) {
        userDocId = snap1.docs[0].id;
        userData = snap1.docs[0].data();
    } else {
        // Check 'legacy_users'
        const docRef = doc(db, 'legacy_users', phone);
        const snap2 = await getDocs(query(collection(db, 'legacy_users'), where('phone', '==', phone))); // Actually phone is ID usually
        // But let's be safe and just get by ID if phone == ID
        // Or query

        // Actually for legacy, ID is phone.
        collectionName = 'legacy_users';
        userDocId = phone;
        // Verify existence?
    }

    if (!userDocId) throw new Error(`User with phone ${phone} not found.`);

    // 2. Run Transaction to ensure consistency
    await runTransaction(db, async (transaction) => {
        const userRef = doc(db, collectionName, userDocId!);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User does not exist!");

        const currentExp = Number(userSnap.data().exp || 0);
        const newExp = currentExp + amount;

        // Update User
        transaction.update(userRef, {
            exp: newExp,
            lastUpdated: serverTimestamp()
        });

        // Create Log
        const logRef = doc(collection(db, 'system_logs')); // Auto ID
        transaction.set(logRef, {
            type: 'ADD_EXP',
            phone: phone,
            amount: amount,
            oldExp: currentExp,
            newExp: newExp,
            admin: adminName,
            reason: reason,
            timestamp: serverTimestamp()
        });
    });

    return { success: true, newExp: amount };
};

/**
 * Add Party Points
 */
export const addPartyPoints = async (partyName: string, amount: number, adminName: string, reason: string) => {
    if (!partyName) throw new Error("Party name required");

    // Party is stored in 'party_list' collection or just aggregating?
    // Based on migration, we have 'party_tracker'.
    // Let's assume 'party_list' collection where ID is Party Name.

    // If migration script mapped 'Party Tracker' -> 'party_tracker' collection
    // Let's adjust to match Firestore Structure.
    // Assuming 'system_data/party_list' or similar.

    // Let's implement robust finding.
    const partyRef = doc(db, 'party_system', partyName); // Hypothetical

    // For now, just Log it effectively, as Party Points might be calculated from Logs in real-time
    // But better to store running total.

    // Implementation:
    // Create 'log_party' entry.
    await setDoc(doc(collection(db, 'log_party')), {
        action: 'ADD_POINTS',
        party: partyName,
        amount: amount,
        admin: adminName,
        reason: reason,
        timestamp: serverTimestamp()
    });

    return { success: true };
};
