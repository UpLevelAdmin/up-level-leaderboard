// ─── Rank System ────────────────────────────────────────────────────────────
// ตรงกับระบบเก่าใน Google Sheets (app script)

export const BASE_RANK_THRESHOLDS = {
    Rookie: 0,
    Bronze: 5,
    Silver: 15,
    Gold: 30,
    Platinum: 50,
    Diamond: 75,
    Grandmaster: 120,
    Legend: 200,
} as const;

export const RANK_ORDER = ['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend'] as const;

export const REBIRTH_SUFFIX = ['', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII', ' IX', ' X'];

/**
 * คำนวณ EXP ที่ต้องใช้ขึ้น Rank แต่ละขั้น ตาม Multiplier (Rebirth)
 * multiplier = min(rebirthCount + 1, 5)
 */
export const getRequiredExp = (multiplier: number) => {
    const m = Math.min(Math.max(multiplier, 1), 5);
    return {
        Rookie: 0,
        Bronze: 5 * m,
        Silver: 15 * m,
        Gold: 30 * m,
        Platinum: 50 * m,
        Diamond: 75 * m,
        Grandmaster: 120 * m,
        Legend: 200 * m,
    };
};

/**
 * คำนวณ Rank จาก EXP + rebirthCount
 * ตรงกับ calculateCorrectRank() ในระบบเก่า
 */
export const calculateRank = (exp: number, rebirthCount: number = 0): string => {
    const multiplier = Math.min(rebirthCount + 1, 5);
    const thresholds = getRequiredExp(multiplier);
    const suffix = REBIRTH_SUFFIX[rebirthCount] ?? ` ${rebirthCount}`;

    let base = 'Rookie';
    if (exp >= thresholds.Legend) base = 'Legend';
    else if (exp >= thresholds.Grandmaster) base = 'Grandmaster';
    else if (exp >= thresholds.Diamond) base = 'Diamond';
    else if (exp >= thresholds.Platinum) base = 'Platinum';
    else if (exp >= thresholds.Gold) base = 'Gold';
    else if (exp >= thresholds.Silver) base = 'Silver';
    else if (exp >= thresholds.Bronze) base = 'Bronze';

    return base + suffix;
};

/**
 * EXP ที่ต้องใช้ rebirth (ขึ้นต่อจากจำนวนครั้งที่จุติแล้ว)
 * rebirthCount = 0 → ต้องมี 200 EXP (Legend)
 * rebirthCount = 1 → ต้องมี 400 EXP (Legend II)
 */
export const getRebirthRequiredExp = (currentRebirthCount: number): number => {
    return 200 * (currentRebirthCount + 1);
};

/**
 * ตรวจว่า rebirth ได้มั้ย
 */
export const canRebirth = (rank: string, exp: number, rebirthCount: number): boolean => {
    const isLegend = rank === 'Legend' || rank.startsWith('Legend ');
    const required = getRebirthRequiredExp(rebirthCount);
    return isLegend && exp >= required;
};

// ─── Avatar Tiers ────────────────────────────────────────────────────────────
export const AVATAR_TIERS = {
    STARTER: [
        { id: 'starter-grass', name: 'Bulbasaur', type: 'grass', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 'starter-fire', name: 'Charmander', type: 'fire', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 'starter-water', name: 'Squirtle', type: 'water', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    ],
    SILVER: [
        { id: 'silver-1', name: 'Ivysaur', type: 'grass', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
        { id: 'silver-2', name: 'Charmeleon', type: 'fire', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
        { id: 'silver-3', name: 'Wartortle', type: 'water', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
    ],
    GOLD: [
        { id: 'gold-1', name: 'Venusaur', type: 'grass', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
        { id: 'gold-2', name: 'Charizard', type: 'fire', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 'gold-3', name: 'Blastoise', type: 'water', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
    ],
    LEGEND: [
        { id: 'legend-1', name: 'Mewtwo', type: 'psychic', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
        { id: 'legend-2', name: 'Mew', type: 'psychic', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
        { id: 'legend-3', name: 'Rayquaza', type: 'dragon', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' },
    ]
};

export const getUnlockedAvatars = (rank: string) => {
    let unlocked = [...AVATAR_TIERS.STARTER];

    const r = rank?.toLowerCase() || 'rookie';

    if (['silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'legend'].some(t => r.includes(t))) {
        unlocked = [...unlocked, ...AVATAR_TIERS.SILVER];
    }
    if (['gold', 'platinum', 'diamond', 'master', 'grandmaster', 'legend'].some(t => r.includes(t))) {
        unlocked = [...unlocked, ...AVATAR_TIERS.GOLD];
    }
    if (['legend'].some(t => r.includes(t))) {
        unlocked = [...unlocked, ...AVATAR_TIERS.LEGEND];
    }

    return unlocked;
};
