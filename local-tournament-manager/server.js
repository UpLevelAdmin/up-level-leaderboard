const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Determine Base Path: Current Directory for EXE, or __dirname for Dev
const isPkg = typeof process.pkg !== 'undefined';
const BASE_PATH = isPkg ? path.dirname(process.execPath) : __dirname;

const DATA_DIR = path.join(BASE_PATH, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tournament_data.json');

// Ensure Data Dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(BASE_PATH, 'public'))); // Serve public relative to exe

// Load data (Initial load)
// Hardcoded Credentials
const DEFAULT_SETTINGS = {
    sheetId: '1NANY-6Rc9SAlLvimvMyCibL_Cj7_tKmMXI1Dj5CzMR8',
    serviceAccountEmail: 'tournament-bot@tournament-manager-481306.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvM+kQ79b/aWjZ
nasP1ZFnehmeAfX6B+8QqaZV1pdMIrYre5aUhRzgq8wLJMXsUCdmO3cwWTIWt+Uq
JOrrCN+FDEtt/9zvKT61B6fV5tCnUx5tvnThxf/2ZMSWkY6xtL2cfftdHFPHSpBp
E9KtTl2/cOX6nLy8fqmgJKVG5Y6DJleQihLs/igHO4ZQJTqAHQJoiAO/+zZK3f0r
gtnTdpsHyJkYf8SZ02+HT0uKb2zjpI78WF1wxtaU/xEPyrfaumrBvO9LL8ZIsI9P
TxJRxqT7SCFSGrT6Z2FfawpIuXVvqwmBzuTQiNGJXVlW53O25CnVitK2Ny8RN0Kj
NNzqYhA9AgMBAAECggEAA7Dqx8rdv/5gnjd2cdXa6dysxHzssAQekvHLPM/rQRUS
h6KWntgzewvZ6rqVs6+FA2AP8aqEMrruFSMdxeGnRkTNJASgPkBwTBBDIDw47uvo
kqxqey/dH0YRe9eZPV/2wTvQCgy9d5OF0kgCMz2gXjOx1rX/dPaiUR0W7K6qzajgW
i6N5um3CJvhnSIYhHLKP//WNSdGNOeIFOhM+DLXq/Xrh0KkJ8Ml6M/Fv9m94OMm1
WnOiHPvWtQci/BlBR1jOTz/HQOmg+fjJyel/5/Pxrv6cXV3ZTtPuxS8japGW/ie5
IQy04IGW6Ay9oh253W3MFrw+uXRYUpxpTK/yVWiTewKBgQDadXUQw9yj8DN2slvi
jETGqypqEA2G7oi2xr/DqOvg2bjvkz+dUyIo7XypmFgcr+RHbKK9ptqn/R8uugmI
zjyuvHCCXrdqJ40Y7QgUrmRFDf0MQ1+9+N3RNLBdvCJnDBCeAJGT0Yj6vMvpTP0Y
p+uh6RvGwr9wacUpOVYO7OH+AwKBgQDNT4NV37pyxF0snCJMUnc5xTLyTTnAcwmf
5LPvCL9BMr0d/T1yO+ErfVq5jcbL1/KJk2uTn1xSVB3PThb1yvgPQtIlHWdqRr8y
w33Z5jwnf59XcI1D5rNWS9xmjeyFMYnnDPqUzKD6tNOT4xj0G10KSBPGdVF6zQ9K
ZmUAukSEvwKBgQDMstzTrcN0NeHzKeNhX7AePErNAWe7dI3UPl132DPWCAz7KA2m
vDw4/3cdbyu5DbOonYnMjak7Wbo7TYUblKxVyyrdbiUNKixTG9/DiTlZX2cqc4Ml
/ijTHDzaSCwwRKTZeIzwZpmk4P1tCX/q94WavFQTpW4+xk1BeIFEEQEdwwKBgCQO
A51wBbkj3Mz5ulg23zMo+1Jr12mBij4nFqYyngugEnASydimxVsyz1zolfG0QaaB
WhH5mWfn17hRGV0ewMNFU8wqxr92HxuWEyLR+Nxi4COl41j6SaIs/k6QO+oEEhie
Qd8htF9yo/lDl10+9O7aS4a9kYqEOlwxcSlYjLHXAoGAM4eN6BnNDUiWiBosp9Qm
0hmBz0RvnTLGkXnnjl73ENfhW8xEEWaJq80zRYGHhE99C0z57Lf1AZdB5Ed5ZBRW
SWqYB1jp35InnEWWSWhcprtDhRPmZNCk3wyI+833sLLG6EYkCYUSuoqdrYaU38/4
6/AQVpFug6cDhFDCQs/3iZc=
-----END PRIVATE KEY-----`
};

let tournamentData = {
    players: [],
    rounds: [],
    currentRound: 0,
    settings: { ...DEFAULT_SETTINGS }
};

if (fs.existsSync(DATA_FILE)) {
    try {
        const raw = fs.readFileSync(DATA_FILE);
        tournamentData = JSON.parse(raw);

        // FORCE OVERRIDE SETTINGS due to sync error issues
        // This ensures we always use the correct hardcoded credentials
        console.log('⚠️ Enforcing default credentials to fix sync error...');
        tournamentData.settings = { ...DEFAULT_SETTINGS };

        console.log('✅ Loaded existing tournament data');
        calculateStandingsInternal();
    } catch (e) {

        console.error('❌ Failed to load data:', e);
    }
} else {
    saveData(); // Create initial file
}

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tournamentData, null, 2));
}

// --- API Routes ---

// Get all data
app.get('/api/data', (req, res) => {
    // Ensure stats are fresh (e.g. if logic changed but no new match submitted)
    calculateStandingsInternal();
    res.json(tournamentData);
});

// Reset Tournament Data
app.post('/api/reset', (req, res) => {
    // Keep settings, reset everything else
    const savedSettings = tournamentData.settings;

    tournamentData = {
        players: [],
        rounds: [],
        currentRound: 0,
        settings: savedSettings // Preserve API keys and Sheet ID
    };

    saveData();
    res.json({ success: true });
});

// Update Settings
app.post('/api/settings', (req, res) => {
    tournamentData.settings = { ...tournamentData.settings, ...req.body };
    saveData();
    res.json({ success: true });
});

// Add Player
app.post('/api/players', (req, res) => {
    const { name, id } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    // Check duplicate ID
    if (tournamentData.players.find(p => p.id === id)) {
        return res.status(400).json({ error: 'Duplicate ID' });
    }

    const newPlayer = {
        id: id || `P${String(tournamentData.players.length + 1).padStart(3, '0')}`,
        name: name,
        dropped: false,
        stats: { wins: 0, draws: 0, losses: 0, points: 0 }
    };

    tournamentData.players.push(newPlayer);
    saveData();
    res.json(newPlayer);
});

// Bulk Add Players
app.post('/api/players/bulk', (req, res) => {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ error: 'No text provided' });

    const lines = rawText.split(/\r?\n/).filter(line => line.trim() !== '');
    const processedPlayers = [];

    lines.forEach(line => {
        // Simple heuristic: If tab separated, assume ID\tName or Name\tID?
        // Let's assume just Name for now, or "ID Name" if user wants.
        // For simplicity: Just Name per line, auto-ID. 
        // Or if contains tab: [ID, Name]

        let name = line.trim();
        let id = null;

        let phone = null;

        // Split by tab (or leniently by 2+ spaces if tab is lost in copy-paste)
        let parts = line.split('\t');
        if (parts.length < 2 && line.includes('  ')) {
            parts = line.split(/\s{2,}/);
        }

        if (parts.length >= 2) {
            name = parts[0].trim();
            id = parts[1].trim(); // TR_ID is the Player ID in this system

            if (parts.length >= 3) {
                phone = parts[2].trim().replace(/[^0-9]/g, ''); // Clean phone
                // Add leading 0 if missing (common input error)
                if (phone.length === 9) phone = '0' + phone;
            }
        } else {
            // Fallback for single column = Name
            name = line.trim();
        }

        if (!name) return; // Skip if no name provided in the line

        // Check availability
        let existingPlayer = null;
        if (id) {
            existingPlayer = tournamentData.players.find(p => p.id === id);
        } else {
            // If no ID provided, try finding by name (weak match)
            existingPlayer = tournamentData.players.find(p => p.name === name);
        }

        if (existingPlayer) {
            // UPDATE EXISTING PLAYER (Upsert)
            // This is critical for backfilling Phone numbers or fixing names
            if (phone) existingPlayer.phone = phone;
            // Optional: Update name if it looks like a "better" name? 
            // Let's trust the bulk input.
            if (name) existingPlayer.name = name;

            // Mark as 'updated' not 'added' for counting? 
            // We can just add to 'added' list or a new 'updated' list, 
            // but for simplicity let's just say success.
            processedPlayers.push(existingPlayer);
        } else {
            // ADD NEW PLAYER
            if (!name) return; // Skip if no name and no existing player

            // Generate ID if missing
            if (!id) {
                id = `P${String(tournamentData.players.length + processedPlayers.length + 1).padStart(3, '0')}`;
            }

            const newPlayer = {
                id: id,
                name: name,
                phone: phone || '', // Store phone
                dropped: false,
                stats: { wins: 0, draws: 0, losses: 0, points: 0 }
            };
            tournamentData.players.push(newPlayer);
            processedPlayers.push(newPlayer);
        }
    });

    saveData();
    res.json({ success: true, count: processedPlayers.length, message: 'Players processed (added/updated)' });
});

// Update Player (Name/ID)
app.post('/api/players/update', (req, res) => {
    const { oldId, name, id } = req.body;
    const player = tournamentData.players.find(p => p.id === oldId);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    // Check ID conflict if changed
    if (id !== oldId && tournamentData.players.find(p => p.id === id)) {
        return res.status(400).json({ error: 'New ID already exists' });
    }

    player.name = name;
    player.id = id;

    // Also update history if ID changed (Important!)
    if (id !== oldId) {
        tournamentData.rounds.forEach(round => {
            round.forEach(m => {
                if (m.p1 === oldId) { m.p1 = id; m.p1Name = name; }
                if (m.p2 === oldId) { m.p2 = id; m.p2Name = name; }
            });
        });
    }

    saveData();
    res.json(player);
});

// Delete Player
app.post('/api/players/delete', (req, res) => {
    const { id } = req.body;
    const idx = tournamentData.players.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Player not found' });

    // Safety: Prevent deleting if played matches?
    // User might want to force delete. Let's allow but warn in frontend.
    // If deleted, matches pointing to them might break or show old ID.
    // Let's filter out from rounds? No, keep history but maybe mark as deleted?
    // V1: Just remove from players list. History remains but might not link to player object.

    tournamentData.players.splice(idx, 1);
    saveData();
    res.json({ success: true });
});

// Move Player (Reorder)
app.post('/api/players/move', (req, res) => {
    const { id, direction } = req.body;
    const idx = tournamentData.players.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Player not found' });

    if (direction === 'up') {
        if (idx > 0) {
            // Swap with previous
            const temp = tournamentData.players[idx - 1];
            tournamentData.players[idx - 1] = tournamentData.players[idx];
            tournamentData.players[idx] = temp;
        }
    } else if (direction === 'down') {
        if (idx < tournamentData.players.length - 1) {
            // Swap with next
            const temp = tournamentData.players[idx + 1];
            tournamentData.players[idx + 1] = tournamentData.players[idx];
            tournamentData.players[idx] = temp;
        }
    }

    saveData();
    res.json({ success: true });
});

// Drop/Undrop Player
app.post('/api/players/toggle-drop', (req, res) => {
    const { id } = req.body;
    const player = tournamentData.players.find(p => p.id === id);
    if (player) {
        player.dropped = !player.dropped;
        saveData();
        res.json(player);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

// Generate Pairings (Swiss System - Simplified for V1)
// Generate Pairings (Swiss System with History Check)
app.post('/api/pairings/generate', (req, res) => {
    // 1. Check if previous round is complete
    if (tournamentData.rounds.length > 0) {
        const lastRound = tournamentData.rounds[tournamentData.rounds.length - 1];
        const incomplete = lastRound.some(m => !m.result && m.p2 !== 'BYE');
        if (incomplete) return res.status(400).json({ error: 'Previous round incomplete' });
    }

    // 2. Get active players
    const activePlayers = tournamentData.players.filter(p => !p.dropped);
    const roundNumber = tournamentData.rounds.length + 1;

    // Recalculate standings first
    calculateStandingsInternal();

    // SORTING
    if (roundNumber === 1) {
        // Random Shuffle for Round 1
        for (let i = activePlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [activePlayers[i], activePlayers[j]] = [activePlayers[j], activePlayers[i]];
        }
    } else {
        // Standard Swiss Sort: Points > OW% > OOW%
        activePlayers.sort((a, b) => {
            if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
            if (b.stats.ow !== a.stats.ow) return b.stats.ow - a.stats.ow;
            if (b.stats.oow !== a.stats.oow) return b.stats.oow - a.stats.oow;
            return 0; // Keep stable
        });
    }

    const pairings = [];

    // Handle BYE
    if (activePlayers.length % 2 !== 0) {
        // Valid Swiss BYE: Lowest ranked player who hasn't had a bye.
        // V1 Simplicity: Take the last player in the sorted list.
        const byePlayer = activePlayers.pop();
        pairings.push({
            table: '-',
            p1: byePlayer.id,
            p1Name: byePlayer.name,
            p2: 'BYE',
            p2Name: 'BYE',
            result: '1:0', // Auto win
            round: roundNumber
        });
    }

    // Pairing Logic (Avoid Rematch)
    // We clone the array to manipulate
    const pool = [...activePlayers];

    while (pool.length > 0) {
        const p1 = pool.shift(); // Takes top player

        let p2Index = -1;

        // Try to find first opaque opponent
        for (let i = 0; i < pool.length; i++) {
            const candidate = pool[i];
            // Check history
            if (!p1.stats.opponents.includes(candidate.id)) {
                p2Index = i;
                break;
            }
        }

        // If everyone played, collapse to first available (Rematch)
        if (p2Index === -1) {
            p2Index = 0;
        }

        const p2 = pool.splice(p2Index, 1)[0];

        pairings.push({
            table: pairings.length + 1,
            p1: p1.id,
            p1Name: p1.name,
            p2: p2.id,
            p2Name: p2.name,
            result: null,
            round: roundNumber
        });
    }

    tournamentData.rounds.push(pairings);
    tournamentData.currentRound = roundNumber;
    saveData();
    res.json(pairings);
});

// Clear Pairings Only (Keep Players)
app.post('/api/pairings/clear', (req, res) => {
    tournamentData.rounds = [];
    tournamentData.currentRound = 0;
    // Reset player stats
    tournamentData.players.forEach(p => {
        p.stats = { wins: 0, draws: 0, losses: 0, points: 0, played: 0, opponents: [], ow: 0, oow: 0 };
    });
    saveData();
    res.json({ success: true, message: 'All pairings cleared.' });
});

// Fix Phone Numbers (Add leading 0)
app.post('/api/players/fix-phones', (req, res) => {
    let count = 0;
    tournamentData.players.forEach(p => {
        if (p.phone && p.phone.length === 9 && !p.phone.startsWith('0')) {
            p.phone = '0' + p.phone;
            count++;
        }
    });
    saveData();
    res.json({ success: true, fixed: count });
});

// Undo Last Round Pairing
app.post('/api/pairings/undo', (req, res) => {
    if (tournamentData.rounds.length === 0) {
        return res.status(400).json({ error: 'No rounds to undo' });
    }

    // Check if subsequent rounds exist (not possible in current simple stack logic, but good practice)
    // Just pop the last round.
    const removedRound = tournamentData.rounds.pop();
    tournamentData.currentRound = tournamentData.rounds.length;

    // Recalculate standings based on remaining rounds
    calculateStandingsInternal();
    saveData();

    res.json({ success: true, round: removedRound[0].round });
});

// Submit Result
app.post('/api/results', (req, res) => {
    const { roundIndex, matchIndex, result } = req.body;
    if (tournamentData.rounds[roundIndex] && tournamentData.rounds[roundIndex][matchIndex]) {
        tournamentData.rounds[roundIndex][matchIndex].result = result;
        calculateStandingsInternal(); // Auto recalc stats
        saveData();
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// Calculate Standings Logic (Points, OW%, OOW%)
function calculateStandingsInternal() {
    // 1. Initialize & Basic Stats
    const playerMap = {};
    tournamentData.players.forEach(p => {
        p.stats = { wins: 0, draws: 0, losses: 0, points: 0, played: 0, opponents: [], ow: 0, oow: 0 };
        playerMap[p.id] = p;
    });

    // 2. Process Matches
    tournamentData.rounds.forEach(round => {
        round.forEach(match => {
            if (!match.result && match.p2 !== 'BYE') return; // Skip incomplete

            const p1 = playerMap[match.p1];

            // Handle BYE
            if (match.p2 === 'BYE') {
                if (p1) {
                    p1.stats.played++; // Usually BYE counts as played round for points
                    p1.stats.wins++;
                    p1.stats.points += 3;
                }
                return;
            }

            const p2 = playerMap[match.p2];
            if (p1 && p2) {
                p1.stats.played++;
                p2.stats.played++;
                p1.stats.opponents.push(p2.id);
                p2.stats.opponents.push(p1.id);

                if (match.result === '1:0') {
                    p1.stats.wins++;
                    p1.stats.points += 3;
                    p2.stats.losses++;
                } else if (match.result === '0:1') {
                    p2.stats.wins++;
                    p2.stats.points += 3;
                    p1.stats.losses++;
                } else if (match.result === '1:1') {
                    p1.stats.draws++;
                    p1.stats.points += 1;
                    p2.stats.draws++;
                    p2.stats.points += 1;
                } else if (match.result === '0:0') {
                    // Double Loss: Both get a loss, 0 points
                    p1.stats.losses++;
                    p2.stats.losses++;
                }
            }
        });
    });

    // 3. Calculate Win% for everyone needed for OW
    // Win% = Points / (Played * 3). If Played=0, 0.
    const getWinPct = (p) => {
        if (p.stats.played === 0) return 0;
        // Standard rule: Minimum 33% (0.33) often used, but let's stick to simple math first
        return Math.max(0.33, p.stats.points / (p.stats.played * 3));
    };

    // 4. Calculate OW% (Avg of Opponents' Win%)
    tournamentData.players.forEach(p => {
        if (p.stats.opponents.length === 0) {
            p.stats.ow = 0;
        } else {
            let sumOppWinPct = 0;
            p.stats.opponents.forEach(oppId => {
                const opp = playerMap[oppId];
                if (opp) sumOppWinPct += getWinPct(opp);
            });
            p.stats.ow = sumOppWinPct / p.stats.opponents.length;
        }
    });

    // 5. Calculate OOW% (Avg of Opponents' OW%)
    tournamentData.players.forEach(p => {
        if (p.stats.opponents.length === 0) {
            p.stats.oow = 0;
        } else {
            let sumOppOW = 0;
            p.stats.opponents.forEach(oppId => {
                const opp = playerMap[oppId];
                if (opp) sumOppOW += opp.stats.ow;
            });
            p.stats.oow = sumOppOW / p.stats.opponents.length;
        }
    });
}

// Sync to Google Sheets
app.post('/api/sync', async (req, res) => {
    // 1. Validate settings
    const { sheetId, serviceAccountEmail, privateKey } = tournamentData.settings;

    // METHOD 1: Try loading from service-account.json file
    let email, key, sheetIdToUse;
    const serviceAccountPath = path.join(BASE_PATH, 'service-account.json');

    if (fs.existsSync(serviceAccountPath)) {
        console.log('📄 Using credentials from service-account.json file');
        try {
            const creds = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            email = creds.client_email;
            key = creds.private_key;
        } catch (e) { console.error('Error reading credentials file', e); }
    }

    if (!email) {
        // METHOD 2: Fallback
        console.log('⚙️ Using credentials from settings');
        email = serviceAccountEmail;
        const pk = privateKey || '';
        key = pk.includes('\\n') ? pk.replace(/\\n/g, '\n') : pk;
    }

    sheetIdToUse = sheetId;

    if (!email || !key || !sheetIdToUse) {
        return res.status(400).json({ error: 'Missing Credentials' });
    }

    try {
        console.log('🔄 Syncing to Google Sheets...');
        const serviceAccountAuth = new JWT({
            email: email,
            key: key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(sheetIdToUse, serviceAccountAuth);
        await doc.loadInfo();

        // --- PREPARE DATA ---
        calculateStandingsInternal();

        // MAPPING: Generate App-Script-Style IDs (P001, P01, P1)
        const pidMap = new Map();
        const playerCount = tournamentData.players.length;

        const playerRows = tournamentData.players.map((p, i) => {
            const seq = i + 1;
            let pid = '';
            // Logic: <10 -> P00x, <100 -> P0x, >=100 -> Px
            if (playerCount < 10) pid = `P00${seq}`;
            else if (playerCount < 100) pid = `P0${seq}`;
            else pid = `P${seq}`;

            pidMap.set(p.id, pid); // Map local TR_ID -> Sheet P_ID

            // Format Name for Players Sheet: TR_ID + '_' + ShortName (FirstName L.)
            // Matches App Script 'formatPlayerName' logic
            const nameParts = p.name.trim().split(/\s+/);
            let shortName = p.name;
            if (nameParts.length >= 2) {
                const firstName = nameParts[0];
                const lastName = nameParts[nameParts.length - 1]; // Use last part as surname
                const initial = lastName.charAt(0).toUpperCase();
                shortName = `${firstName} ${initial}.`;
            }

            const formattedName = `${p.id.toLowerCase()}_${shortName}`;

            // Ensure Tel is string (Stored as 'phone' in tournamentData)
            const tel = p.phone ? `${p.phone}` : (p.tel ? `${p.tel}` : '');

            return [pid, formattedName, p.id, tel];
        });

        const fmtPct = (n) => (n * 100).toFixed(2) + '%';

        // 1. Players Sheet
        let playersSheet = doc.sheetsByTitle['Players'];
        if (!playersSheet) playersSheet = await doc.addSheet({ title: 'Players' });
        await playersSheet.clear();
        await playersSheet.setHeaderRow(['Player_id', 'Name', 'TR_ID', 'Tel']);
        await playersSheet.addRows(playerRows);

        // Format Players Sheet (Basic)
        try {
            const pLastRow = playerRows.length + 1;
            const requests = [
                {
                    repeatCell: {
                        range: { sheetId: playersSheet.sheetId, startRowIndex: 0, endRowIndex: 1 },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.95, green: 0.96, blue: 0.96 },
                                textFormat: { bold: true },
                                horizontalAlignment: 'CENTER'
                            }
                        },
                        fields: 'userEnteredFormat'
                    }
                },
                {
                    updateBorders: {
                        range: { sheetId: playersSheet.sheetId, startRowIndex: 0, endRowIndex: pLastRow, startColumnIndex: 0, endColumnIndex: 4 },
                        top: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        innerHorizontal: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        innerVertical: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } }
                    }
                }
            ];
            await serviceAccountAuth.request({
                method: 'POST',
                url: `https://sheets.googleapis.com/v4/spreadsheets/${doc.spreadsheetId}:batchUpdate`,
                data: { requests }
            });
        } catch (e) { console.error('Players formatting error:', e); }


        // 2. Standings
        const sortedPlayers = [...tournamentData.players].sort((a, b) => {
            if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
            if (b.stats.ow !== a.stats.ow) return b.stats.ow - a.stats.ow;
            if (b.stats.oow !== a.stats.oow) return b.stats.oow - a.stats.oow;
            return 0;
        });

        const standingRows = sortedPlayers.map((p, index) => {
            const winPct = p.stats.played > 0 ? (p.stats.points / (p.stats.played * 3)) : 0;
            const opponents = p.stats.opponents ? p.stats.opponents.map(id => pidMap.get(id) || id) : [];

            return [
                p.dropped ? 'DROP' : index + 1, // Rank
                pidMap.get(p.id), // Player ID (P...)
                p.name,
                p.id, // TR_ID
                p.stats.played,
                p.stats.wins,
                p.stats.draws,
                p.stats.losses,
                p.stats.points,
                fmtPct(winPct),
                fmtPct(p.stats.ow || 0),
                fmtPct(p.stats.oow || 0),
                0, '', '', // Slow, H2H, Win2
                JSON.stringify(opponents)
            ];
        });

        let standingSheet = doc.sheetsByTitle['Standing'];
        if (!standingSheet) standingSheet = await doc.addSheet({ title: 'Standing' });
        await standingSheet.clear(); // Safe clear
        await standingSheet.setHeaderRow([
            'Rank', 'Player ID', 'Player Name', 'TR_ID', 'Played', 'Win', 'Draw', 'Loss', 'Points',
            'Win %', 'OW%', 'OOW%', 'SLOW GAMES', 'H2H', 'WIN 2 ROUNDS', 'Pairing History'
        ]);
        await standingSheet.addRows(standingRows);
        console.log('✅ Synced Standings');


        // 3. Pairing Sheet
        let pairingSheet = doc.sheetsByTitle['Pairing'];
        if (!pairingSheet) pairingSheet = await doc.addSheet({ title: 'Pairing' });

        const pairingRows = tournamentData.rounds.flatMap((round, rIdx) => {
            return round.map(match => {
                // Match App Script Header structure
                const p1Pid = pidMap.get(match.p1) || match.p1;
                const p2Pid = match.p2 === 'BYE' ? 'BYE' : (pidMap.get(match.p2) || match.p2);

                const winP1 = match.result === '1:0';
                const draw = match.result === '1:1';
                const winP2 = match.result === '0:1';
                const doubleLoss = match.result === '0:0';

                // Col 15 (Index 14) is O (Empty/Checkbox), Col 16 (Index 15) is SLOW GAME
                return [
                    rIdx + 1,          // ROUND
                    match.table,       // TABLE
                    p1Pid,             // P1_ID (Mapped)
                    match.p1Name,      // PLAYER 1
                    winP1,             // WIN_P1
                    draw,              // DRAW
                    winP2,             // WIN_P2
                    doubleLoss,        // Double Loss
                    p2Pid,             // P2_ID (Mapped)
                    match.p2Name,      // PLAYER 2
                    match.result || '',// RESULT
                    (match.result || match.p2 === 'BYE') ? 'OK' : '', // STATUS
                    false,             // Drop (Default unchecked)
                    false,             // Hide Standing (Default unchecked)
                    false,             // (Spacer/O1 Checkbox - for header only, rows are empty)
                    false              // SLOW GAME (Default unchecked)
                ];
            });
        });

        await pairingSheet.clearRows();
        // Exact Header from App Script / Screenshot
        await pairingSheet.setHeaderRow([
            'ROUND', 'TABLE', 'P1_ID', 'PLAYER 1',
            'WIN_P1', 'DRAW', 'WIN_P2', 'Double Loss',
            'P2_ID', 'PLAYER 2', 'RESULT', 'STATUS',
            'Drop', 'Hide Standing', '', 'SLOW GAME'
        ]);

        // Validate and Format Pairing Rows (ensure booleans for checkboxes)
        const formattedPairingRows = pairingRows.map(row => {
            // Checkboxes: 4,5,6,7, 12,13, 15 (index 14 is the spacer, index 15 is SLOW GAME)
            // All these are already set to boolean true/false in the pairingRows generation
            return row;
        });

        await pairingSheet.addRows(formattedPairingRows);
        console.log('✅ Synced Pairings');

        // Formatting & Validation (Strict App Script Style)
        try {
            const lastRow = pairingRows.length + 1; // Header + Data
            const sheetId = pairingSheet.sheetId;

            const requests = [
                // 0. O1 Checkbox (Hide Standing Toggle) - Checked by default
                // This checkbox is only for the header row (O1)
                {
                    setDataValidation: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 14, endColumnIndex: 15 },
                        rule: { condition: { type: 'BOOLEAN' }, showCustomUi: true }
                    }
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 14, endColumnIndex: 15 },
                        rows: [{
                            values: [{
                                userEnteredValue: { boolValue: true }
                            }]
                        }],
                        fields: 'userEnteredValue'
                    }
                },

                // 1. Checkboxes for Results (E-H, indices 4-7)
                {
                    setDataValidation: {
                        range: { sheetId, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 4, endColumnIndex: 8 },
                        rule: { condition: { type: 'BOOLEAN' }, showCustomUi: true }
                    }
                },
                // 2. Checkboxes for Drop/Hide (M-N, indices 12-13)
                {
                    setDataValidation: {
                        range: { sheetId, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 12, endColumnIndex: 14 },
                        rule: { condition: { type: 'BOOLEAN' }, showCustomUi: true }
                    }
                },
                // Slow Game (P - Col 15, Index 15)
                {
                    setDataValidation: {
                        range: { sheetId, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 15, endColumnIndex: 16 },
                        rule: { condition: { type: 'BOOLEAN' }, showCustomUi: true }
                    }
                },

                // 3. Center Align Checkboxes (E-H)
                {
                    repeatCell: {
                        range: { sheetId, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 4, endColumnIndex: 8 },
                        cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } },
                        fields: 'userEnteredFormat.horizontalAlignment'
                    }
                },
                // Center Align (M-P, indices 12-15)
                {
                    repeatCell: {
                        range: { sheetId, startRowIndex: 1, endRowIndex: lastRow, startColumnIndex: 12, endColumnIndex: 16 },
                        cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } },
                        fields: 'userEnteredFormat.horizontalAlignment'
                    }
                },
                // 4. Header Styling (Dark Grey bg, White text, Bold)
                {
                    repeatCell: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.12, green: 0.16, blue: 0.22 }, // Dark (#1f2937 approx)
                                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                                horizontalAlignment: 'CENTER',
                                verticalAlignment: 'MIDDLE'
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
                    }
                },
                // 5. Borders for the whole table (Solid Grey)
                {
                    updateBorders: {
                        range: { sheetId, startRowIndex: 0, endRowIndex: lastRow, startColumnIndex: 0, endColumnIndex: 16 },
                        top: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        bottom: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        left: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        right: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        innerHorizontal: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } },
                        innerVertical: { style: 'SOLID', color: { red: 0.8, green: 0.8, blue: 0.8 } }
                    }
                }
            ];

            await serviceAccountAuth.request({
                method: 'POST',
                url: `https://sheets.googleapis.com/v4/spreadsheets/${doc.spreadsheetId}:batchUpdate`,
                data: { requests }
            });
            console.log('✅ Formatted Pairing (Strict App Script Style)');
        } catch (e) { console.error('Formatting error:', e); }

        res.json({ success: true, message: 'Sync Complete!' });

    } catch (error) {
        console.error('Sync Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`🚀 Tournament Server running at ${url}`);
    console.log(`📂 Data saved in: ${DATA_FILE}`);
    console.log(`📂 Serving public files from: ${path.join(BASE_PATH, 'public')}`);

    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${url}`, (err) => {
        if (err) console.log('⚠️ Please open browser manually: ' + url);
        else console.log('🌐 Browser opening...');
    });
});

// Prevent immediate close on error (for .exe users)
process.on('uncaughtException', (err) => {
    console.error('\n❌ CRASH ERROR:', err);
    console.log('... Press Ctrl+C to exit ...');
    setInterval(() => { }, 1000); // Keep process alive
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ UNHANDLED PROMISE REJECTION:', reason);
});
