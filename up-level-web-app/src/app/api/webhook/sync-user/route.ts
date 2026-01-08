import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Ensure you have this lib setup, otherwise import from where you initialize firebase
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';

// Secret key check to prevent unauthorized access
const API_SECRET = process.env.API_SECRET_KEY || 'up-level-secret-key-1234';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { secret, data } = body;

        // 1. Security Check
        if (secret !== API_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!data || !data.phone) {
            return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
        }

        // Normalize phone (ensure it has 10 digits/starts with 0 if Thai) - Optional, assume Sheet sends good data
        const phone = data.phone.toString().trim();

        // 2. Prepare User Data
        const userData = {
            phone: phone,
            displayName: data.name || '',
            codename: data.codename || '',
            rank: data.rank || 'Rookie',
            exp: Number(data.exp) || 0,
            party: data.party || '',
            lastUpdated: new Date().toISOString(),
            source: 'google_sheet_sync'
        };

        console.log(`Syncing user: ${phone} - ${userData.codename}`);

        // 3. Strategy: 
        //    A. Check if this user has already "Claimed" their account (exists in 'users' collection with this phone)
        //    B. If yes, UPDATE their Main Account immediately.
        //    C. If no, UPSERT into 'legacy_users' collection for future claiming.

        // A. Check Main 'users' collection
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // B. User has already claimed! Update their real account.
            const userDoc = querySnapshot.docs[0];
            await updateDoc(userDoc.ref, {
                rank: userData.rank,
                exp: userData.exp,
                party: userData.party,
                lastSynced: new Date().toISOString()
            });
            return NextResponse.json({ success: true, message: 'Updated existing claimed user', uid: userDoc.id });
        } else {
            // C. Update/Create in 'legacy_users'
            // We use Phone number as the ID for legacy_users for easy lookup
            await setDoc(doc(db, 'legacy_users', phone), userData);
            return NextResponse.json({ success: true, message: 'Synced to legacy_users' });
        }

    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
