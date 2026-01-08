
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
