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
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scroll$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScrollText$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/scroll-text.js [app-client] (ecmascript) <export default as ScrollText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// --- Utils ---
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
    const [explorerTitle, setExplorerTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [explorerMenu, setExplorerMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Menu structure
    const [loadingExplorer, setLoadingExplorer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Processing
    const [processingReqId, setProcessingReqId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- Init ---
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
                // Fetch System Data Menu (List of docs)
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'system_data')).then({
                    "AdminControlPanel.useEffect": (snap)=>{
                        const items = snap.docs.map({
                            "AdminControlPanel.useEffect.items": (d)=>({
                                    id: d.id,
                                    ...d.data()
                                })
                        }["AdminControlPanel.useEffect.items"]);
                        // Group by Category
                        const groups = {};
                        items.forEach({
                            "AdminControlPanel.useEffect": (item)=>{
                                const cat = item.category || 'Uncategorized';
                                if (!groups[cat]) groups[cat] = [];
                                groups[cat].push(item);
                            }
                        }["AdminControlPanel.useEffect"]);
                        setExplorerMenu(Object.entries(groups));
                    }
                }["AdminControlPanel.useEffect"]);
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
    const loadSystemData = async (docId, title)=>{
        setLoadingExplorer(true);
        setExplorerTitle(title);
        setExplorerData([]);
        try {
            const docRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'system_data', docId);
            const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(docRef);
            if (snap.exists()) {
                setExplorerData(snap.data().items || []);
            }
        } catch (e) {
            console.error(e);
        } finally{
            setLoadingExplorer(false);
        }
    };
    // --- Action Handlers (Same as before) ---
    const handleApproveClaim = async (req)=>{
        if (!confirm(`Approve ${req.currentDisplayName}?`)) return;
        setProcessingReqId(req.id);
        try {
            const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', req.uid);
            const requestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'claim_requests', req.id);
            const legacyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'legacy_users', req.requestedPhone);
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
            batch.delete(legacyRef);
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
        lineNumber: 116,
        columnNumber: 25
    }, this);
    const CategoryIcon = ({ cat })=>{
        if (cat.includes('Config')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            className: "w-4 h-4 text-orange-400"
        }, void 0, false, {
            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
            lineNumber: 119,
            columnNumber: 44
        }, this);
        if (cat.includes('Party')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            className: "w-4 h-4 text-pink-400"
        }, void 0, false, {
            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
            lineNumber: 120,
            columnNumber: 43
        }, this);
        if (cat.includes('Logs')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scroll$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScrollText$3e$__["ScrollText"], {
            className: "w-4 h-4 text-slate-400"
        }, void 0, false, {
            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
            lineNumber: 121,
            columnNumber: 42
        }, this);
        if (cat.includes('Rank')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
            className: "w-4 h-4 text-yellow-400"
        }, void 0, false, {
            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
            lineNumber: 122,
            columnNumber: 42
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            className: "w-4 h-4"
        }, void 0, false, {
            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
            lineNumber: 123,
            columnNumber: 16
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#1e1e24] text-slate-200 font-sans pb-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#2b2d42] px-6 py-4 shadow-xl sticky top-0 z-20 flex justify-between items-center border-b border-slate-700/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 font-bold text-white text-lg tracking-tight",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                    className: "w-5 h-5 text-white fill-white/20"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 131,
                                columnNumber: 21
                            }, this),
                            "Admin Portal"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 130,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/dashboard'),
                        className: "text-xs bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors font-medium border border-slate-600",
                        children: "Client View"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 129,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 pt-6 pb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex bg-[#23232a] p-1 rounded-2xl w-fit border border-slate-700/50",
                    children: [
                        'OVERVIEW',
                        'EXPLORER',
                        'REQUESTS'
                    ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab(tab),
                            className: `px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeTab === tab ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`,
                            children: [
                                tab,
                                tab === 'REQUESTS' && requests.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] border-2 border-[#1e1e24]",
                                    children: requests.length
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 75
                                }, this)
                            ]
                        }, tab, true, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                            lineNumber: 143,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                    lineNumber: 141,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 140,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4",
                children: [
                    activeTab === 'OVERVIEW' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-blue-600/20 to-blue-900/10 p-5 rounded-2xl border border-blue-500/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] font-bold text-blue-300 mb-1",
                                                children: "TOTAL WAITING"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-black text-white",
                                                children: legacyUsers.length
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 160,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-br from-green-600/20 to-green-900/10 p-5 rounded-2xl border border-green-500/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[10px] font-bold text-green-300 mb-1",
                                                children: "ACTIVE USERS"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-3xl font-black text-white",
                                                children: users.filter((u)=>u.phone).length
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 157,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2b2d42] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-[#23232a]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-white text-sm",
                                                children: "Unclaimed Members"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded",
                                                children: "Source: Sheet"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-[60vh] overflow-y-auto custom-scrollbar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full text-left text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "bg-[#2a2a35] text-slate-500 sticky top-0 z-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-4",
                                                                children: "Rank"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-4",
                                                                children: "Profile"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 74
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "p-4 text-right",
                                                                children: "EXP"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 176,
                                                                columnNumber: 106
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    className: "divide-y divide-slate-700/20",
                                                    children: legacyUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-white/5 transition-colors group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-4 text-2xl text-center w-16 bg-black/10 group-hover:bg-transparent transition-colors",
                                                                    children: getRankEmoji(u.rank)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 181,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-bold text-white text-sm",
                                                                            children: u.displayName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                            lineNumber: 183,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[10px] text-slate-500 mt-1 font-mono",
                                                                            children: [
                                                                                u.codename,
                                                                                " • ",
                                                                                u.phone
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                            lineNumber: 184,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "p-4 text-right font-mono text-yellow-400 font-bold text-sm bg-black/10 group-hover:bg-transparent",
                                                                    children: u.exp?.toLocaleString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 186,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, u.phone, true, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 168,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 156,
                        columnNumber: 21
                    }, this),
                    activeTab === 'EXPLORER' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-12 gap-6 h-[75vh] animate-in fade-in",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-3 bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-y-auto custom-scrollbar p-2",
                                children: [
                                    explorerMenu.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-4 text-slate-500 text-xs",
                                        children: "Loading Menu..."
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 59
                                    }, this),
                                    explorerMenu.map(([catName, items])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                            cat: catName
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 41
                                                        }, this),
                                                        " ",
                                                        catName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>loadSystemData(item.id, item.title),
                                                            className: `w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${explorerTitle === item.title ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`,
                                                            children: [
                                                                item.title,
                                                                explorerTitle === item.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "w-3 h-3 text-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 213,
                                                                    columnNumber: 82
                                                                }, this)
                                                            ]
                                                        }, item.id, true, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 210,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, catName, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 204,
                                            columnNumber: 33
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 201,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-9 bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col shadow-2xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 border-b border-slate-700/50 bg-[#23232a] flex justify-between items-center h-16 shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-white text-sm flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                        className: "w-4 h-4 text-indigo-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 37
                                                    }, this),
                                                    explorerTitle || "Select a Data Source"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 225,
                                                columnNumber: 33
                                            }, this),
                                            explorerData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded",
                                                children: [
                                                    explorerData.length,
                                                    " records"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 61
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 224,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-auto bg-[#1e1e24]/50 relative",
                                        children: loadingExplorer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 flex items-center justify-center text-slate-500 text-xs gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 41
                                                }, this),
                                                " Loading data..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 235,
                                            columnNumber: 37
                                        }, this) : explorerData.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full text-xs whitespace-nowrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "bg-[#23232a] text-slate-400 sticky top-0 z-10 shadow-sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: Object.keys(explorerData[0]).map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold border-b border-slate-700/50 bg-[#23232a]",
                                                                children: k
                                                            }, k, false, {
                                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                lineNumber: 241,
                                                                columnNumber: 88
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    className: "divide-y divide-slate-700/20",
                                                    children: explorerData.map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-white/5 transition-colors",
                                                            children: Object.values(row).map((v, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 text-slate-300 border-r border-slate-700/30 last:border-0 max-w-[200px] truncate",
                                                                    title: String(v),
                                                                    children: String(v)
                                                                }, j, false, {
                                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 92
                                                                }, this))
                                                        }, i, false, {
                                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 49
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full text-slate-600 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                    className: "w-12 h-12 opacity-20"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs",
                                                    children: "Select a sheet from the sidebar to view data"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                            lineNumber: 252,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 233,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 222,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 198,
                        columnNumber: 21
                    }, this),
                    activeTab === 'REQUESTS' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-3xl mx-auto space-y-4 animate-in fade-in",
                        children: requests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-20 text-slate-500 bg-[#2b2d42] rounded-2xl border border-slate-700/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                    className: "w-12 h-12 mx-auto mb-3 opacity-20 text-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 267,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "All clear! No pending requests."
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                    lineNumber: 268,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                            lineNumber: 266,
                            columnNumber: 29
                        }, this) : requests.map((req)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2b2d42] p-5 rounded-2xl border border-slate-700 shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 rounded-full bg-slate-700 overflow-hidden ring-2 ring-slate-600",
                                                children: req.profileImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: req.profileImage,
                                                    className: "w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 65
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                    className: "w-6 h-6 m-auto text-slate-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 124
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-bold text-white text-lg",
                                                        children: req.currentDisplayName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-slate-400 font-mono",
                                                        children: req.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 278,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ml-auto text-[10px] uppercase font-bold tracking-wider bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20",
                                                children: "Action Required"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 282,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 274,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#1e1e24] p-4 rounded-xl mb-4 border border-slate-700/50 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] text-slate-500 uppercase tracking-wide mb-1",
                                                        children: "Requesting to Link"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xl font-mono font-bold text-white tracking-widest",
                                                        children: req.requestedPhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 285,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] text-slate-500 uppercase tracking-wide mb-1",
                                                        children: "Legacy Rank"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-bold text-white bg-slate-800 px-2 py-1 rounded inline-flex items-center gap-2",
                                                        children: [
                                                            getRankEmoji(req.legacyData?.rank),
                                                            " ",
                                                            req.legacyData?.rank || 'Unknown'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 289,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleRejectClaim(req.id),
                                                disabled: !!processingReqId,
                                                className: "flex-1 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 disabled:opacity-50 font-bold transition-all hover:shadow-lg hover:shadow-red-900/20",
                                                children: "Decline"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 297,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleApproveClaim(req),
                                                disabled: !!processingReqId,
                                                className: "flex-[2] py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 font-bold shadow-lg shadow-indigo-900/30 transition-all hover:scale-[1.02]",
                                                children: "Approve & Link"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                                lineNumber: 298,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, req.id, true, {
                                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                                lineNumber: 272,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                        lineNumber: 264,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
                lineNumber: 152,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/admin/page.tsx",
        lineNumber: 127,
        columnNumber: 9
    }, this);
}
_s(AdminControlPanel, "GxZcFtPf/0MvuS5GAQebxhPJNuI=", false, function() {
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
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LayoutGrid
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
        "rect",
        {
            width: "7",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "1g98yp"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "14",
            y: "3",
            rx: "1",
            key: "6d4xhi"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "14",
            y: "14",
            rx: "1",
            key: "nxv5o0"
        }
    ],
    [
        "rect",
        {
            width: "7",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "1bb6yr"
        }
    ]
];
const LayoutGrid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("layout-grid", __iconNode);
;
 //# sourceMappingURL=layout-grid.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutGrid",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript)");
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Database
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
        "ellipse",
        {
            cx: "12",
            cy: "5",
            rx: "9",
            ry: "3",
            key: "msslwz"
        }
    ],
    [
        "path",
        {
            d: "M3 5V19A9 3 0 0 0 21 19V5",
            key: "1wlel7"
        }
    ],
    [
        "path",
        {
            d: "M3 12A9 3 0 0 0 21 12",
            key: "mv7ke4"
        }
    ]
];
const Database = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("database", __iconNode);
;
 //# sourceMappingURL=database.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Database",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript)");
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>FileText
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
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }
    ],
    [
        "path",
        {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }
    ],
    [
        "path",
        {
            d: "M10 9H8",
            key: "b1mrlr"
        }
    ],
    [
        "path",
        {
            d: "M16 13H8",
            key: "t4e002"
        }
    ],
    [
        "path",
        {
            d: "M16 17H8",
            key: "z1uh3a"
        }
    ]
];
const FileText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("file-text", __iconNode);
;
 //# sourceMappingURL=file-text.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileText",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript)");
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings
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
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings", __iconNode);
;
 //# sourceMappingURL=settings.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)");
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trophy
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
            d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
            key: "1n3hpd"
        }
    ],
    [
        "path",
        {
            d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
            key: "rfe1zi"
        }
    ],
    [
        "path",
        {
            d: "M18 9h1.5a1 1 0 0 0 0-5H18",
            key: "7xy6bh"
        }
    ],
    [
        "path",
        {
            d: "M4 22h16",
            key: "57wxv0"
        }
    ],
    [
        "path",
        {
            d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
            key: "1mhfuq"
        }
    ],
    [
        "path",
        {
            d: "M6 9H4.5a1 1 0 0 1 0-5H6",
            key: "tex48p"
        }
    ]
];
const Trophy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trophy", __iconNode);
;
 //# sourceMappingURL=trophy.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trophy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript)");
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronRight
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
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }
    ]
];
const ChevronRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-right", __iconNode);
;
 //# sourceMappingURL=chevron-right.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Documents_Cursor_up-level-leaderboard_up-level-web-app_c16dace3._.js.map