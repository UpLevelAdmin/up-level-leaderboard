'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut as firebaseSignOut,
    User
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<User | undefined>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const syncUserToFirestore = async (user: User, displayNameOverride?: string) => {
        if (!db) return;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: displayNameOverride || user.displayName || 'Adventurer',
                email: user.email || '',
                photoURL: user.photoURL || '',
                rank: 'Rookie',
                exp: 0,
                coins: 100,
                partyId: null,
                createdAt: new Date(),
                phone: null
            });
        }
    };

    const signInWithGoogle = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, provider);
            await syncUserToFirestore(res.user);
        } catch (error: any) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const signInWithFacebook = async () => {
        if (!auth) return;
        // Standard Facebook Provider (Works perfectly with "Consumer" App Type)
        const provider = new FacebookAuthProvider();

        try {
            const res = await signInWithPopup(auth, provider);
            await syncUserToFirestore(res.user);
        } catch (error: any) {
            console.error("Facebook Login Error:", error);
            // Handle account exists with different credential error
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert("อีเมลนี้ถูกใช้งานแล้วด้วยวิธีอื่น (เช่น Google หรือ Email) กรุณาล็อกอินด้วยวิธีนั้น");
            } else {
                alert("Facebook Login Failed: " + error.message);
            }
        }
    };

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        if (!auth) return;
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        // Try to send verification, but don't block
        try { await sendEmailVerification(res.user); } catch (e) { }
        await syncUserToFirestore(res.user, name);
        return res.user;
    };

    const loginWithEmail = async (email: string, pass: string) => {
        if (!auth) return;
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signOut = async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, loading,
            signInWithGoogle, signInWithFacebook,
            registerWithEmail, loginWithEmail, signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};
