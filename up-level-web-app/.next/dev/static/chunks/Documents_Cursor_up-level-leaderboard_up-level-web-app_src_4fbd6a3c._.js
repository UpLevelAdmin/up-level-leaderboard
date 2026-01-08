(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "app",
    ()=>app,
    "auth",
    ()=>auth,
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyAKxWv3FI7HrdrRlnJhsQbJ-97Pb_sdiOQ"),
    authDomain: ("TURBOPACK compile-time value", "up-level-guild.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "up-level-guild"),
    storageBucket: ("TURBOPACK compile-time value", "up-level-guild.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "721710985300"),
    appId: ("TURBOPACK compile-time value", "1:721710985300:web:c51e13963373a6feadbdc1"),
    measurementId: ("TURBOPACK compile-time value", "G-7Z1DPFCKNS")
};
// Initialize Firebase safely
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
// Simple check to ensure keys are loaded
if (!firebaseConfig.apiKey) {
    console.error("Firebase API Keys are missing! Check .env.local");
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContextProvider",
    ()=>AuthContextProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
const useAuth = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const AuthContextProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContextProvider.useEffect": ()=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
                // Mock auth for guest mode if keys are missing
                console.warn("Auth not initialized (missing keys). Using Guest Mode.");
                setLoading(false);
                return;
            }
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "AuthContextProvider.useEffect.unsubscribe": (currentUser)=>{
                    setUser(currentUser);
                    setLoading(false);
                }
            }["AuthContextProvider.useEffect.unsubscribe"]);
            return ({
                "AuthContextProvider.useEffect": ()=>unsubscribe()
            })["AuthContextProvider.useEffect"];
        }
    }["AuthContextProvider.useEffect"], []);
    const signInWithGoogle = async ()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"] || !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
            alert("No Firebase API Keys found! Check console.");
            return;
        }
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
            const user = result.user;
            // Check if user exists in Firestore
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
            const userSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
            if (!userSnap.exists()) {
                // Create new user profile if not exists
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    rank: 'Rookie',
                    exp: 0,
                    coins: 100,
                    partyId: null,
                    createdAt: new Date()
                });
                console.log("New adventurer registered!");
            }
        } catch (error) {
            console.error("Error signing in with Google", error);
            alert("Login Failed: " + error.message);
        }
    };
    const signInWithFacebook = async ()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"] || !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) {
            alert("No Firebase Keys! Cannot login with Facebook real account.");
            return;
        }
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FacebookAuthProvider"]();
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
            const user = result.user;
            // Check if user exists in Firestore
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
            const userSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
            if (!userSnap.exists()) {
                // Create new user profile
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(userRef, {
                    uid: user.uid,
                    displayName: user.displayName || 'Facebook Adventurer',
                    email: user.email,
                    photoURL: user.photoURL,
                    rank: 'Rookie',
                    exp: 0,
                    coins: 100,
                    partyId: null,
                    createdAt: new Date()
                });
            }
        } catch (error) {
            console.error("Error signing in with Facebook", error);
            alert("Facebook Login Failed: " + error.message);
        }
    };
    const registerWithEmail = async (email, pass, name)=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"] || !__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]) return;
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, pass);
            const user = result.user;
            // Send Verification Email
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendEmailVerification"])(user);
            // Create user profile
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid), {
                uid: user.uid,
                displayName: name || 'Adventurer',
                email: user.email,
                photoURL: '',
                rank: 'Rookie',
                exp: 0,
                coins: 100,
                partyId: null,
                createdAt: new Date()
            });
            return user;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };
    const loginWithEmail = async (email, pass)=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, pass);
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };
    const signOut = async ()=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]) {
            setUser(null);
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            signInWithGoogle,
            signInWithFacebook,
            registerWithEmail,
            loginWithEmail,
            signOut
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/context/AuthContext.tsx",
        lineNumber: 173,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthContextProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthContextProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthContextProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/gamepad-2.js [app-client] (ecmascript) <export default as Gamepad2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function LoginPage() {
    _s();
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [codename, setCodename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const { user, loading, signInWithGoogle, signInWithFacebook, registerWithEmail, loginWithEmail } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Email Auth State
    const [isLoginMode, setIsLoginMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [authLoading, setAuthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Redirect to dashboard if already logged in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginPage.useEffect": ()=>{
            if (user && !loading) {
                router.push('/dashboard');
            }
        }
    }["LoginPage.useEffect"], [
        user,
        loading,
        router
    ]);
    const handleEmailAuth = async ()=>{
        if (!email || !password) return alert("Please fill in email and password");
        setAuthLoading(true);
        try {
            if (isLoginMode) {
                await loginWithEmail(email, password);
            } else {
                if (!name) return alert("Please enter your name");
                await registerWithEmail(email, password, name);
                alert("Account created! Please check your email for verification.");
            }
        } catch (error) {
            alert(error.message);
        } finally{
            setAuthLoading(false);
        }
    };
    const handleGoogleLogin = async ()=>{
        await signInWithGoogle();
    };
    const handleFacebookLogin = async ()=>{
        await signInWithFacebook();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#1F2E4A] flex flex-col items-center justify-center p-6 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-10 left-10 w-32 h-32 bg-[#7AC0E7] rounded-full blur-[60px] opacity-40 animate-bounce"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-10 right-10 w-40 h-40 bg-[#FFD700] rounded-full blur-[60px] opacity-30"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.9,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0
                },
                transition: {
                    duration: 0.5,
                    type: 'spring'
                },
                className: "w-full max-w-md glass-card p-8 bg-white/95 backdrop-blur-xl border-4 border-white shadow-2xl rounded-3xl relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center -mt-20 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            animate: {
                                y: [
                                    0,
                                    -10,
                                    0
                                ]
                            },
                            transition: {
                                repeat: Infinity,
                                duration: 4
                            },
                            className: "w-32 h-32 rounded-full bg-gradient-to-br from-[#7AC0E7] to-[#4A90E2] border-4 border-white shadow-lg flex items-center justify-center relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__["Gamepad2"], {
                                    className: "w-16 h-16 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -right-2 -top-2 bg-[#FFD700] p-2 rounded-full border-2 border-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-5 h-5 text-[#1F2E4A]"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-[#1F2E4A] mb-2 font-poppins",
                                children: "Up Level Guild"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 font-nunito",
                                children: [
                                    "Welcome to the adventure! ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 39
                                    }, this),
                                    "Login to start your journey."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleGoogleLogin,
                                        className: "h-14 rounded-xl bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-gray-700 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-blue-500 text-xl",
                                                children: "G"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, this),
                                            " Continue with Google"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleFacebookLogin,
                                        className: "h-14 rounded-xl bg-[#1877F2] text-white border-2 border-[#1877F2] hover:bg-[#166fe5] transition-all flex items-center justify-center gap-2 font-bold shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white text-xl font-bold",
                                                children: "f"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 107,
                                                columnNumber: 15
                                            }, this),
                                            " Continue with Facebook"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-gray-200 pt-6 mt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex bg-gray-100 rounded-lg p-1 mb-4 relative z-20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsLoginMode(true),
                                                className: `flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLoginMode ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`,
                                                children: "Login"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsLoginMode(false),
                                                className: `flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLoginMode ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`,
                                                children: "Sign Up"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            !isLoginMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "absolute left-3 top-3.5 text-gray-400 w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Adventurer Name",
                                                        value: name,
                                                        onChange: (e)=>setName(e.target.value),
                                                        className: "w-full h-12 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-400 focus:bg-white pl-10 pr-4 outline-none transition-all text-gray-700 relative z-10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                        className: "absolute left-3 top-3.5 text-gray-400 w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        placeholder: "Email Address",
                                                        value: email,
                                                        onChange: (e)=>setEmail(e.target.value),
                                                        className: "w-full h-12 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-400 focus:bg-white pl-10 pr-4 outline-none transition-all text-gray-700 relative z-10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                        className: "absolute left-3 top-3.5 text-gray-400 w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        placeholder: "Password",
                                                        value: password,
                                                        onChange: (e)=>setPassword(e.target.value),
                                                        className: "w-full h-12 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-400 focus:bg-white pl-10 pr-4 outline-none transition-all text-gray-700 relative z-10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleEmailAuth,
                                                disabled: loading,
                                                className: "w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 relative z-20",
                                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        isLoginMode ? 'Enter Guild' : 'Start Adventure',
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 71
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 15
                                            }, this),
                                            !isLoginMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-center text-gray-400 mt-2",
                                                children: "* Verification email will be sent."
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mt-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>router.push('/dashboard'),
                                                    className: "text-xs text-gray-400 hover:text-gray-600 underline",
                                                    children: "Or continue as Guest (Demo)"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-xs text-gray-400 mt-6 font-semibold",
                        children: [
                            "By joining, you agree to our ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#7AC0E7] cursor-pointer hover:underline",
                                children: "Guild Rules"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                                lineNumber: 193,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/page.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "0FszywH8UrcQJPa2h6la1nt0D7A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_Cursor_up-level-leaderboard_up-level-web-app_src_4fbd6a3c._.js.map