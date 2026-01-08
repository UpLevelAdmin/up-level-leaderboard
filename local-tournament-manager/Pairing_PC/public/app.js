const API_URL = 'http://localhost:3000/api';
let globalPlayers = [];

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    refreshData();
    setInterval(refreshData, 5000); // Auto-refresh every 5s for multi-client feel
});

async function refreshData() {
    try {
        const res = await axios.get(`${API_URL}/data`);
        const data = res.data;
        globalPlayers = data.players;

        // Settings fill
        if (!document.getElementById('settingSheetId').value && data.settings.sheetId) {
            document.getElementById('settingSheetId').value = data.settings.sheetId;
            document.getElementById('settingEmail').value = data.settings.serviceAccountEmail;
            document.getElementById('settingKey').value = data.settings.privateKey;
        }

        renderPlayers(data.players);
        renderStanding(data.players);
        renderPairing(data.rounds, data.currentRound);

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

// --- RENDERERS ---

function renderPlayers(players) {
    const tbody = document.getElementById('playersTableBody');
    tbody.innerHTML = '';

    // Reverse for latest added on top? Or alphabetical? Let's do order added.
    players.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.className = p.dropped ? 'text-gray-400 bg-gray-50' : '';
        tr.innerHTML = `
            <td class="text-center text-gray-500">${i + 1}</td>
            <td class="font-mono text-xs">${p.id}</td>
            <td class="font-medium">${p.name}</td>
            <td class="font-mono text-xs text-gray-500">${p.phone || '-'}</td>
            <td class="text-center text-xs">
                ${p.dropped ? '<span class="bg-red-100 text-red-800 px-2 rounded-full">DROP</span>' : '<span class="bg-green-100 text-green-800 px-2 rounded-full">OK</span>'}
            </td>
            <td class="text-center flex items-center justify-center gap-1">
                <div class="flex flex-col gap-0.5 mr-2">
                    <button onclick="movePlayer('${p.id}', 'up')" class="text-[10px] leading-none text-gray-400 hover:text-gray-800">▲</button>
                    <button onclick="movePlayer('${p.id}', 'down')" class="text-[10px] leading-none text-gray-400 hover:text-gray-800">▼</button>
                </div>
                <button onclick="editPlayer('${p.id}')" class="text-xs border px-2 py-0.5 rounded hover:bg-yellow-50 text-yellow-700">Edit</button>
                <button onclick="deletePlayer('${p.id}')" class="text-xs border px-2 py-0.5 rounded hover:bg-red-50 text-red-700">Del</button>
                <button onclick="toggleDrop('${p.id}')" class="text-xs border px-2 py-0.5 rounded hover:bg-gray-100">
                    ${p.dropped ? 'Undrop' : 'Drop'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    document.getElementById('playerCount').innerText = `${players.length} Players`;
}

function renderStanding(players) {
    const tableHeaders = `
        <thead class="sticky top-0 z-10 bg-gray-50 border-b">
            <tr>
                <th class="w-12 py-2">Rank</th>
                <th class="w-24">ID</th>
                <th class="text-left pl-4">Name</th>
                <th class="w-20">Points</th>
                <th class="w-20">OW%</th>
                <th class="w-20">OOW%</th>
                <th class="w-24">W-D-L</th>
                <th class="w-24">Status</th>
            </tr>
        </thead>
    `;

    // Ensure table has header structure
    const table = document.getElementById('tab-standing').querySelector('table');
    if (table) {
        // Replace existing header if we can, or just expect static HTML update. 
        // Actually best to update the whole table content or at least the THEAD in HTML.
        // Let's assume the user uses the provided HTML structure.
        // We will inject the THEAD if missing or just overwrite the TBODY and expect header to match?
        // Let's robustly replace existing header first.
        const oldThead = table.querySelector('thead');
        if (oldThead) oldThead.outerHTML = tableHeaders.replace('<thead', '<thead id="dynamicThead"');
    }

    const tbody = document.getElementById('standingTableBody');
    tbody.innerHTML = '';

    // Sort logic (Match server logic: Points > OW > OOW)
    const sorted = [...players].sort((a, b) => {
        if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
        const owA = a.stats.ow || 0;
        const owB = b.stats.ow || 0;
        if (owB !== owA) return owB - owA;

        const oowA = a.stats.oow || 0;
        const oowB = b.stats.oow || 0;
        return oowB - oowA;
    });

    sorted.forEach((p, i) => {
        const tr = document.createElement('tr');
        if (p.dropped) tr.className = 'bg-gray-50 text-gray-400 italic';

        const formatPct = (num) => (num * 100).toFixed(2) + '%';

        tr.innerHTML = `
            <td class="text-center font-bold border-b p-1">${i + 1}</td>
            <td class="font-mono text-xs text-gray-500 border-b p-1 text-center">${p.id}</td>
            <td class="pl-4 font-medium border-b p-1">${p.name}</td>
            <td class="text-center font-bold text-blue-700 border-b p-1">${p.stats.points}</td>
            <td class="text-center text-gray-600 text-xs border-b p-1">${formatPct(p.stats.ow || 0)}</td>
            <td class="text-center text-gray-400 text-xs border-b p-1">${formatPct(p.stats.oow || 0)}</td>
            <td class="text-center text-gray-500 text-xs border-b p-1">${p.stats.wins}-${p.stats.draws}-${p.stats.losses}</td>
            <td class="text-center text-xs border-b p-1">${p.dropped ? 'DROP' : 'ACTIVE'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Store global data for rendering views
let globalRounds = [];

function renderPairing(rounds, currentRound) {
    globalRounds = rounds;
    const tbody = document.getElementById('pairingTableBody');
    const statusLabel = document.getElementById('pairingStatus');
    const select = document.getElementById('roundSelect');

    if (!rounds || rounds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-400">No active pairings. Go to Players tab to add players, then click Generate.</td></tr>';
        select.innerHTML = '<option>No Rounds</option>';
        statusLabel.innerText = "Ready to start";
        return;
    }

    // Populate Select Options (Only if length changed or first load, to preserve selection)
    // Actually simpler: re-render opts, but keep value if exists
    const currentSelection = select.value;
    select.innerHTML = '';
    rounds.forEach((_, idx) => {
        const rNum = idx + 1;
        const option = document.createElement('option');
        option.value = idx;
        option.innerText = `Round ${rNum}`;
        select.appendChild(option);
    });

    // Determine which round to show
    // If was viewing a specific round, keep it. Else default to latest.
    let indexToShow = rounds.length - 1;
    if (currentSelection && currentSelection !== '-1' && rounds[currentSelection]) {
        // Only keep selection if it's not the "Loading..." initial state
        // And if we are just submitting results, we probably want to stay on that round.
        // But if we generated a NEW round, we probably want to switch to it?
        // Let's logic: If rounds.length increased, switch to new. Else stay.
        // For simplicity in V1: Always switch to latest IF the user hasn't manually selected an old one?
        // Let's just abide by the select box unless it was recreated.
        // Actually, let's force latest on new round generation detection? 
        // Simple approach: Use passed round selector value if valid, else latest.
        indexToShow = parseInt(select.options[select.options.length - 1].value); // Default latest

        // If the user *was* viewing a previous round and we just refreshed data (background sync), stay there?
        // We need to know if this is a user action or background refresh.
        // Hack: Check if currentSelection is valid.
        if (currentSelection && currentSelection < rounds.length) {
            indexToShow = parseInt(currentSelection);
        } else {
            // If new round added, currentSelection might be old max index, so we might stay on old round?
            // Let's auto-jump to latest if we were at the previous latest?
            // Safest: default to latest.
            indexToShow = rounds.length - 1;
        }
    }

    // Override: If user select changed (triggered by onchange), we use that value.
    // But here we are inside refreshData() loop.
    // Let's use the DOM value if it exists and matches range.
    if (select.value && rounds[select.value]) {
        // It's already set by the loop above which set options.
        // We need to set the value BACK to what it was.
        if (currentSelection && rounds[currentSelection]) {
            select.value = currentSelection;
            indexToShow = parseInt(currentSelection);
        } else {
            select.value = rounds.length - 1;
        }
    } else {
        select.value = rounds.length - 1;
    }

    renderPairingTable(indexToShow);
}

function renderPairingCurrentView() {
    const select = document.getElementById('roundSelect');
    renderPairingTable(parseInt(select.value));
}

function renderPairingTable(roundIndex) {
    const tbody = document.getElementById('pairingTableBody');
    const statusLabel = document.getElementById('pairingStatus');
    const roundData = globalRounds[roundIndex];

    if (!roundData) return;

    // Check completion
    const completeCount = roundData.filter(m => m.result || m.p2 === 'BYE').length;
    const totalCount = roundData.length;
    statusLabel.innerText = `Progress: ${completeCount}/${totalCount} matches`;

    tbody.innerHTML = '';

    roundData.forEach((match, matchIdx) => {
        const tr = document.createElement('tr');

        // Result Buttons / State
        let controlHtml = '';
        if (match.p2 === 'BYE') {
            controlHtml = '<span class="text-xs font-bold text-gray-400">BYE (Auto Win)</span>';
        } else {
            // Helper to determine button style
            const btnClass = (targetRes) => {
                const isActive = match.result === targetRes;
                if (isActive) return 'bg-blue-600 text-white border-blue-600';
                return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
            };

            controlHtml = `
                <div class="flex justify-center gap-1 group">
                    <button onclick="submitResult(${roundIndex}, ${matchIdx}, '1:0')" class="w-8 py-1 rounded text-xs border ${btnClass('1:0')}">1-0</button>
                    <button onclick="submitResult(${roundIndex}, ${matchIdx}, '1:1')" class="w-8 py-1 rounded text-xs border ${btnClass('1:1')}">Draw</button>
                    <button onclick="submitResult(${roundIndex}, ${matchIdx}, '0:1')" class="w-8 py-1 rounded text-xs border ${btnClass('0:1')}">0-1</button>
                    <button onclick="submitResult(${roundIndex}, ${matchIdx}, '0:0')" title="Double Loss" class="w-8 py-1 rounded text-xs border text-red-600 border-red-200 ${btnClass('0:0')}">DL</button>
                </div>
            `;
        }

        // Added: 3. Update `renderPairingTable` to lookup the sequential ID (index + 1) using `globalPlayers`.
        const p1Index = globalPlayers.findIndex(p => p.id === match.p1);
        const p1Seq = p1Index !== -1 ? p1Index + 1 : '-';

        const p2Index = globalPlayers.findIndex(p => p.id === match.p2);
        const p2Seq = p2Index !== -1 ? p2Index + 1 : '-';

        const p1Display = `<span class="text-[10px] text-gray-400 font-mono mr-1">${p1Seq}</span>${match.p1Name}`;
        const p2Display = match.p2 === 'BYE'
            ? 'BYE'
            : `<span class="text-[10px] text-gray-400 font-mono mr-1">${p2Seq}</span>${match.p2Name}`;

        tr.innerHTML = `
            <td class="text-center font-mono text-gray-500">${match.table}</td>
            <td class="text-right pr-4 font-medium ${match.result === '1:0' ? 'text-blue-700 font-bold' : ''}">${p1Display}</td>
            <td class="text-center py-1.5">${controlHtml}</td>
            <td class="text-left pl-4 font-medium ${match.result === '0:1' ? 'text-blue-700 font-bold' : ''}">${p2Display}</td>
        `;
        tbody.appendChild(tr);
    });
}


// --- ACTIONS (Same as before mostly) ---

async function addPlayersBulk() {
    const input = document.getElementById('playerData');
    const rawText = input.value;
    if (!rawText.trim()) return;

    // Show loading
    const btn = document.querySelector('button[onclick="addPlayersBulk()"]');
    btn.innerText = '...';

    try {
        const res = await axios.post(`${API_URL}/players/bulk`, { rawText });
        input.value = '';
        refreshData();
    } catch (err) {
        alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
        btn.innerText = 'Add';
    }
}

async function movePlayer(id, direction) {
    try {
        await axios.post(`${API_URL}/players/move`, { id, direction });
        refreshData();
    } catch (err) {
        console.error(err);
    }
}

async function editPlayer(oldId) {
    // Find current data
    const res = await axios.get(`${API_URL}/data`);
    const player = res.data.players.find(p => p.id === oldId);
    if (!player) return;

    const newName = prompt('Edit Name:', player.name);
    if (newName === null) return;

    const newId = prompt('Edit ID:', player.id);
    if (newId === null) return;

    try {
        await axios.post(`${API_URL}/players/update`, {
            oldId,
            name: newName,
            id: newId
        });
        refreshData();
    } catch (err) {
        alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
}

async function deletePlayer(id) {
    if (!confirm('Delete this player? (Cannot undo if matches played!)')) return;
    try {
        await axios.post(`${API_URL}/players/delete`, { id });
        refreshData();
    } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
}

async function toggleDrop(id) {
    await axios.post(`${API_URL}/players/toggle-drop`, { id });
    refreshData();
}

async function clearPlayers() {
    if (!confirm('💥 RESET TOURNAMENT? This will delete ALL PLAYERS, ROUNDS, and RESULTS.\n(Settings will be kept)')) return;

    try {
        await axios.post(`${API_URL}/reset`);
        // Clear UI remnants
        globalRounds = [];
        document.getElementById('playerData').value = '';
        const select = document.getElementById('roundSelect');
        if (select) select.innerHTML = '<option>No Rounds</option>';
        refreshData();
        alert('✅ Tournament reset successful.');
    } catch (err) {
        alert('Data reset failed: ' + (err.response?.data?.error || err.message));
    }
}

async function generatePairings() {
    // Check if confirming
    if (!confirm('Start Next Round?')) return;
    try {
        await axios.post(`${API_URL}/pairings/generate`);
        refreshData();
        // Auto switch tab
        switchTab('pairing');
    } catch (err) {
        alert(err.response?.data?.error || err.message);
    }
}

async function undoLastPairing() {
    if (!confirm('⚠️ Undo the entire last round? All results for that round will be lost.')) return;
    try {
        await axios.post(`${API_URL}/pairings/undo`);

        // Force reset UI state locally before refresh to prevent stale rendering
        globalRounds.pop();
        const select = document.getElementById('roundSelect');
        if (select.options.length > 0) {
            select.remove(select.options.length - 1);
            // Select the new last option if available, or reset
            if (select.options.length > 0) {
                select.value = select.options.length - 1;
            } else {
                select.innerHTML = '<option>No Rounds</option>';
            }
        }

        refreshData();
        alert('Last round removed.');
    } catch (err) {
        alert(err.response?.data?.error || err.message);
    }
}

async function submitResult(rIdx, mIdx, res) {
    // Toggle logic: If clicking the same result, maybe clear it?
    // For now simple overwrite. But let's add reset capability via backend if requested later.
    await axios.post(`${API_URL}/results`, {
        roundIndex: rIdx,
        matchIndex: mIdx,
        result: res
    });
    refreshData();
}

// Settings & Sync (Modal toggles in HTML)
function showSettings() { document.getElementById('settingsModal').classList.remove('hidden'); }

async function saveSettings() {
    const sheetId = document.getElementById('settingSheetId').value.trim();
    const serviceAccountEmail = document.getElementById('settingEmail').value.trim();
    const privateKey = document.getElementById('settingKey').value.trim();
    await axios.post(`${API_URL}/settings`, { sheetId, serviceAccountEmail, privateKey });
    document.getElementById('settingsModal').classList.add('hidden');
    alert('Settings Saved');
}

async function syncToSheet() {
    const btn = document.querySelector('button[onclick="syncToSheet()"]');
    const oldText = btn.innerHTML;
    btn.innerHTML = '⏳ Syncing...';
    btn.disabled = true;
    try {
        await axios.post(`${API_URL}/sync`);
        alert('✅ Synced to Sheet!');
    } catch (err) {
        alert('❌ Sync Error: ' + (err.response?.data?.error || err.message));
    } finally {
        btn.innerHTML = oldText;
        btn.disabled = false;
    }
}

// --- TOOLKIT ACTIONS ---

async function fixPhones() {
    if (!confirm('This will add a leading "0" to all 9-digit phone numbers. Continue?')) return;
    try {
        const res = await axios.post(`${API_URL}/players/fix-phones`);
        alert(`Fixed ${res.data.fixed} phone numbers.`);
        refreshData();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function clearPairings() {
    if (!confirm('🗑️ Clear ALL Rounds and Results? Players will remain.')) return;
    try {
        await axios.post(`${API_URL}/pairings/clear`);
        // Reset UI state
        globalRounds = [];
        const select = document.getElementById('roundSelect');
        if (select) select.innerHTML = '<option>No Rounds</option>';
        refreshData();
        alert('Pairings Cleared.');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function updateStandings() {
    // Since server recalcs on get, we just refresh. 
    // But to simulate "Action", we can show a toast.
    await refreshData();
    alert('Standings Updated (Recalculated)');
}
