module.exports = [
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdventureMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
'use client';
;
;
;
function AdventureMap() {
    const locations = [
        {
            id: 1,
            name: 'Rookie Village',
            x: 20,
            y: 80,
            status: 'unlocked',
            type: 'village'
        },
        {
            id: 2,
            name: 'Training Gym',
            x: 45,
            y: 60,
            status: 'unlocked',
            type: 'gym'
        },
        {
            id: 3,
            name: 'Crystal Cave',
            x: 75,
            y: 45,
            status: 'locked',
            type: 'dungeon'
        },
        {
            id: 4,
            name: 'Grand Arena',
            x: 50,
            y: 15,
            status: 'locked',
            type: 'arena'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#7AC0E7] relative overflow-hidden pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    x: [
                        -100,
                        500
                    ]
                },
                transition: {
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                },
                className: "absolute top-10 left-0 text-white opacity-40 text-6xl",
                children: "☁️"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    x: [
                        -100,
                        500
                    ]
                },
                transition: {
                    repeat: Infinity,
                    duration: 25,
                    ease: "linear",
                    delay: 10
                },
                className: "absolute top-40 left-0 text-white opacity-30 text-8xl",
                children: "☁️"
            }, void 0, false, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 p-6 pt-12 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold font-poppins drop-shadow-md",
                        children: "Adventure Map"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "opacity-90 font-nunito",
                        children: "Explore the world of Up Level!"
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-[60vh] mt-4",
                children: [
                    locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                delay: 0.2 * loc.id,
                                type: 'spring'
                            },
                            className: "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer",
                            style: {
                                left: `${loc.x}%`,
                                top: `${loc.y}%`
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    whileHover: {
                                        scale: 1.2
                                    },
                                    whileTap: {
                                        scale: 0.9
                                    },
                                    className: `
                w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white
                ${loc.status === 'locked' ? 'bg-gray-400 grayscale' : 'bg-[#FFD700] text-[#1F2E4A]'}
              `,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "w-6 h-6 fill-current"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                                        lineNumber: 59,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `
              bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1F2E4A] shadow-sm whitespace-nowrap
              ${loc.status === 'locked' ? 'opacity-60' : ''}
            `,
                                    children: loc.name
                                }, void 0, false, {
                                    fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                                    lineNumber: 62,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, loc.id, true, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                            lineNumber: 43,
                            columnNumber: 21
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M 20% 80% Q 30% 70% 45% 60% T 75% 45% T 50% 15%",
                            fill: "none",
                            stroke: "white",
                            strokeWidth: "4",
                            strokeDasharray: "8 8"
                        }, void 0, false, {
                            fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                            lineNumber: 73,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                        lineNumber: 72,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/src/app/map/page.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>MapPin
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
            key: "1r0f0z"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "10",
            r: "3",
            key: "ilqhr7"
        }
    ]
];
const MapPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("map-pin", __iconNode);
;
 //# sourceMappingURL=map-pin.js.map
}),
"[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapPin",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$Cursor$2f$up$2d$level$2d$leaderboard$2f$up$2d$level$2d$web$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/Cursor/up-level-leaderboard/up-level-web-app/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Documents_Cursor_up-level-leaderboard_up-level-web-app_0b72fa02._.js.map