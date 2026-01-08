(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminControlPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const getRankEmoji = (rank)=>{
    const r = (rank || '').toLowerCase();
    if (r.includes('legend')) return '🐉';
    if (r.includes('grand')) return '👑';
    if (r.includes('diamond')) return '💎';
    if (r.includes('platinum')) return '✨';
    if (r.includes('gold')) return '🥇';
    if (r.includes('silver')) return '⚔️';
    if (r.includes('bronze')) return '🛡️';
    return '🐣';
};
function AdminControlPanel() {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('OVERVIEW');
    // Data
    const [legacyUsers, setLegacyUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [requests, setRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Explorer
    const [explorerData, setExplorerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [explorerSource, setExplorerSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Processing
    const [processingReqId, setProcessingReqId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminControlPanel.useEffect": ()=>{
            if (!loading && user) {
                const unsub1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'legacy_users'), {
                    "AdminControlPanel.useEffect.unsub1": (snap)=>setLegacyUsers(snap.docs.map({
                            "AdminControlPanel.useEffect.unsub1": (d)=>({
                                    id: d.id,
                                    ...d.data()
                                })
                        }["AdminControlPanel.useEffect.unsub1"]))
                }["AdminControlPanel.useEffect.unsub1"]);
                const unsub2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users'), {
                    "AdminControlPanel.useEffect.unsub2": (snap)=>setUsers(snap.docs.map({
                            "AdminControlPanel.useEffect.unsub2": (d)=>({
                                    id: d.id,
                                    ...d.data()
                                })
                        }["AdminControlPanel.useEffect.unsub2"]))
                }["AdminControlPanel.useEffect.unsub2"]);
                const unsub3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'claim_requests'), {
                    "AdminControlPanel.useEffect.unsub3": (snap)=>setRequests(snap.docs.map({
                            "AdminControlPanel.useEffect.unsub3": (d)=>({
                                    id: d.id,
                                    ...d.data()
                                })
                        }["AdminControlPanel.useEffect.unsub3"]))
                }["AdminControlPanel.useEffect.unsub3"]);
                return ({
                    "AdminControlPanel.useEffect": ()=>{
                        unsub1();
                        unsub2();
                        unsub3();
                    }
                })["AdminControlPanel.useEffect"];
            }
        }
    }["AdminControlPanel.useEffect"], [
        user,
        loading
    ]);
    const loadSystemData = async (docName)=>{
        setExplorerSource(docName);
        setExplorerData([]);
        const docRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'system_data', docName);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(docRef);
        if (snap.exists()) setExplorerData(snap.data().items || []);
        else alert('No data found for ' + docName);
    };
    const handleApproveClaim = async (req)=>{
        if (!confirm(`Approve ${req.currentDisplayName}?`)) return;
        setProcessingReqId(req.id);
        try {
            const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', req.uid);
            const requestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'claim_requests', req.id);
            const legacyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'legacy_users', req.requestedPhone);
            // Fetch latest legacy to ensure correctness
            const legacySnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(legacyRef);
            const legacyData = legacySnap.exists() ? legacySnap.data() : req.legacyData;
            batch.update(userRef, {
                rank: legacyData.rank,
                exp: legacyData.exp,
                party: legacyData.party || '',
                phone: req.requestedPhone,
                codename: legacyData.codename || '',
                rebirthCount: legacyData.rebirthCount || 0,
                expMultiplier: legacyData.expMultiplier || 1,
                isLegacyLinked: true,
                lastSynced: new Date().toISOString()
            });
            batch.delete(requestRef);
            batch.delete(legacyRef); // Reduce count in Waiting list
            await batch.commit();
        } catch (e) {
            alert(e.message);
        } finally{
            setProcessingReqId(null);
        }
    };
    const handleRejectClaim = async (reqId)=>{
        if (!confirm('Reject?')) return;
        setProcessingReqId(reqId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'claim_requests', reqId));
        } catch (e) {
            alert(e.message);
        } finally{
            setProcessingReqId(null);
        }
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen bg-[#1e1e24] flex items-center justify-center text-white",
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
        lineNumber: 104,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#1e1e24] text-slate-200 font-sans pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#2b2d42] p-4 shadow-lg sticky top-0 z-20 flex justify-between items-center border-b border-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 font-bold text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "text-blue-500 fill-current"
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this),
                            " Admin Zone"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 111,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/dashboard'),
                        className: "text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 transition-colors",
                        children: "Client View"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 114,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 110,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 flex gap-2 overflow-x-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('OVERVIEW'),
                        className: `px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'OVERVIEW' ? 'bg-blue-600 text-white' : 'bg-[#2b2d42]'}`,
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 119,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('EXPLORER'),
                        className: `px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'EXPLORER' ? 'bg-purple-600 text-white' : 'bg-[#2b2d42]'}`,
                        children: "Explorer"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 120,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('REQUESTS'),
                        className: `px-4 py-2 rounded-xl text-sm font-bold relative ${activeTab === 'REQUESTS' ? 'bg-orange-600 text-white' : 'bg-[#2b2d42]'}`,
                        children: [
                            "Requests",
                            requests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center",
                                children: requests.length
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 123,
                                columnNumber: 45
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 121,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 118,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4",
                children: [
                    activeTab === 'OVERVIEW' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 animate-in fade-in",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#2b2d42] p-4 rounded-xl border border-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] font-bold text-slate-400",
                                                children: "WAITING TO CLAIM"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-black text-white",
                                                children: legacyUsers.length
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#2b2d42] p-4 rounded-xl border border-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] font-bold text-green-400",
                                                children: "CLAIMED (ACTIVE)"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-black text-white",
                                                children: users.filter((u)=>u.phone).length
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 131,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2b2d42] rounded-xl overflow-hidden border border-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-[#23232a] text-slate-400 text-xs font-bold uppercase",
                                        children: "Member List (Waiting)"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-[60vh] overflow-y-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full text-left text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "bg-[#2a2a35] text-slate-500 sticky top-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-3",
                                                                children: "Rank"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-3",
                                                                children: "Profile"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 74
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-3 text-right",
                                                                children: "EXP"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 106
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    className: "divide-y divide-slate-700/30",
                                                    children: legacyUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-white/5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-3 text-lg text-center w-12",
                                                                    children: getRankEmoji(u.rank)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 152,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-bold text-white",
                                                                            children: u.displayName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                            lineNumber: 154,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[10px] text-slate-500",
                                                                            children: [
                                                                                u.codename,
                                                                                " • ",
                                                                                u.phone
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                            lineNumber: 155,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 153,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-3 text-right font-mono text-yellow-500",
                                                                    children: u.exp
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 157,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, u.phone, true, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 151,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 144,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 142,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 130,
                        columnNumber: 21
                    }, this),
                    activeTab === 'EXPLORER' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 animate-in fade-in",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    'gym_standing',
                                    'rewards',
                                    'quests'
                                ].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>loadSystemData(k),
                                        className: `flex-1 p-3 rounded-xl border text-xs font-bold ${explorerSource === k ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-[#2b2d42] border-transparent text-slate-400'}`,
                                        children: k.replace('_', ' ').toUpperCase()
                                    }, k, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 170,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2b2d42] rounded-xl overflow-hidden min-h-[50vh] border border-slate-700/50",
                                children: explorerData.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-[60vh] overflow-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-xs whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#23232a] text-slate-400 sticky top-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: Object.keys(explorerData[0]).slice(0, 5).map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "p-3 text-left",
                                                            children: k
                                                        }, k, false, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 100
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 181,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-slate-700/30",
                                                children: explorerData.map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-white/5",
                                                        children: Object.values(row).slice(0, 5).map((v, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "p-3 border-r border-slate-700/30 text-slate-300",
                                                                children: String(v)
                                                            }, j, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 187,
                                                                columnNumber: 104
                                                            }, this))
                                                    }, i, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 49
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 184,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 179,
                                    columnNumber: 33
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center h-full text-slate-500 text-xs py-20",
                                    children: "Select a source above"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 177,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 169,
                        columnNumber: 21
                    }, this),
                    activeTab === 'REQUESTS' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 animate-in fade-in",
                        children: requests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-slate-500 py-10",
                            children: "No pending requests"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                            lineNumber: 201,
                            columnNumber: 50
                        }, this) : requests.map((req)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2b2d42] p-4 rounded-xl border border-slate-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-full bg-slate-700 overflow-hidden",
                                                children: req.profileImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: req.profileImage,
                                                    className: "w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 66
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 205,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-bold text-white",
                                                        children: req.currentDisplayName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-slate-400",
                                                        children: req.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ml-auto text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded",
                                                children: "PENDING"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#23232a] p-2 rounded mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] text-slate-500",
                                                children: "REQUESTING PHONE"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-mono font-bold text-white",
                                                children: req.requestedPhone
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 216,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleRejectClaim(req.id),
                                                disabled: !!processingReqId,
                                                className: "flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50",
                                                children: "Reject"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 219,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleApproveClaim(req),
                                                disabled: !!processingReqId,
                                                className: "flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 shadow-lg shadow-green-900/20",
                                                children: "Approve"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 220,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 218,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, req.id, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 203,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 200,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
        lineNumber: 107,
        columnNumber: 9
    }, this);
}
_s(AdminControlPanel, "VnlNYSnkSrdHDdYkrm1BiDAf93I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminControlPanel;
var _c;
__turbopack_context__.k.register(_c, "AdminControlPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Shield
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ]
];
const Shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shield", __iconNode);
;
 //# sourceMappingURL=shield.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Shield",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Documents_Cursor_up-level-leaderboard_up-level-web-app_bcb5a1ae._.js.map