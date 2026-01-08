export interface SystemUser {
    // Identity
    uid?: string; // Firebase Auth UID (if claimed)
    phone: string; // Primary Key for Sync/Matching
    email?: string; // Optional (for claimed users)

    // Profile
    displayName: string;
    codename: string;
    avatarUrl?: string;

    // Game Stats
    rank: string;
    exp: number;
    expMultiplier: number;
    rebirthCount: number;

    // Guild
    party: string;

    // Metadata
    isClaimed: boolean; // True if in 'users' collection
    lastUpdated: any; // Firestore Timestamp
    source: 'google_sheet' | 'web_admin' | 'app';
}

// Helper to sanitize rank name (e.g. "Diamond II" -> Base: Diamond, Rebirth: 1)
export const parseRankDetails = (rankStr: string) => {
    // Logic to parse "Diamond II" -> { base: 'Diamond', rebirth: 1 } if needed
};
