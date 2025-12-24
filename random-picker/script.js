// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const pickerScreen = document.getElementById('picker-screen');
const itemsInput = document.getElementById('items-input');
const startBtn = document.getElementById('start-btn');
const pickBtn = document.getElementById('pick-btn');
const resetBtn = document.getElementById('reset-btn');
const editBtn = document.getElementById('edit-btn');
const itemCountSpan = document.getElementById('item-count');
const historyList = document.getElementById('history-list');
const historyCountSpan = document.getElementById('history-count');
const resultModal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const closeModalBtn = document.getElementById('close-modal-btn');
const jarElement = document.getElementById('jar');
const papersContainer = document.getElementById('papers-container');

// State
let items = [];
let history = [];

// Audio (Optional, placeholder for now)
// const shakeSound = new Audio('shake.mp3'); 

// Initialization
function init() {
    loadState();
    if (items.length > 0 || history.length > 0) {
        // If we have items or history, we probably want to be in the picker screen
        // But if items are 0 and history is 0, stay on setup.
        // If items 0 but history > 0, we are in picker screen (empty jar).
        if (items.length > 0 || history.length > 0) {
            showPickerScreen();
        }
    }
}

// Event Listeners
startBtn.addEventListener('click', () => {
    const text = itemsInput.value;
    const lines = text.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
        alert('กรุณาใส่รายการอย่างน้อย 1 รายการ');
        return;
    }

    // Whether we are starting fresh or editing, we update items
    items = lines;
    // If we were in setup mode from scratch, history is probably empty.
    // If we clicked "Edit", history is preserved unless we clear it? 
    // The user requirement: "Edit jar" -> modifies the jar.
    // Usually "Start" from setup implies a new session or applying edits.
    // If we want to support "Edit", we need to know if we are "Starting new" or "Saving edits".
    // For simplicity: The setup screen IS the edit screen. 
    // If you edit and click Start, it just saves the current text area as the CURRENT items in jar.
    // It does NOT touch history. History is separate.

    saveState();
    showPickerScreen();
});

pickBtn.addEventListener('click', pickItem);

closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
    // Save state after closing modal just to be sure
    saveState();
});

editBtn.addEventListener('click', () => {
    // GM Only warning?
    if (confirm('คุณต้องการแก้ไขขวดโหลใช่หรือไม่? (GM Only: หน้าจอจะแสดงรายการทั้งหมด)')) {
        showSetupScreen();
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('ต้องการเริ่มใหม่ทั้งหมดหรือไม่? (ประวัติจะถูกล้าง)')) {
        // If we reset, do we want to put history back in jar? Or clear everything?
        // Usually "Restart" means "Reset the game with SAME items".
        // Let's ask: "Restart with same items" or "Clear all".
        // For now, I'll assume "Restart with ALL items (including picked ones)"

        // Combine items and history back to items
        items = [...items, ...history];
        history = [];
        saveState();
        updateUI();
        // We stay on picker screen, just jar is full again
    }
});

// Functions

function showSetupScreen() {
    // Populate textarea with current items
    itemsInput.value = items.join('\n');

    pickerScreen.classList.remove('active');
    pickerScreen.classList.add('hidden');

    setupScreen.classList.remove('hidden');
    setupScreen.classList.add('active');
}

function showPickerScreen() {
    setupScreen.classList.remove('active');
    setupScreen.classList.add('hidden');

    pickerScreen.classList.remove('hidden');
    pickerScreen.classList.add('active');

    updateUI();
}

function updateUI() {
    // Update Counts
    itemCountSpan.textContent = items.length;
    historyCountSpan.textContent = history.length;

    // Update History List
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });

    // Update Jar Visuals
    renderJarParticles();
}

function renderJarParticles() {
    papersContainer.innerHTML = '';
    // Limit particles for performance
    const count = Math.min(items.length, 50);

    for (let i = 0; i < count; i++) {
        const paper = document.createElement('div');
        paper.classList.add('paper-scrap');

        // Random position, rotation, and color slight variation
        const left = Math.random() * 80 + 10; // 10% to 90%
        const top = Math.random() * 80 + 15; // 15% to 95%
        const rot = Math.random() * 360;

        paper.style.left = `${left}%`;
        paper.style.top = `${top}%`;
        paper.style.transform = `rotate(${rot}deg)`;

        // Randomize specific paper color slightly?
        // Let's just keep uniform style for now, maybe size variation

        papersContainer.appendChild(paper);
    }
}

function pickItem() {
    if (items.length === 0) {
        alert('ขวดโหลว่างเปล่าแล้ว!');
        return;
    }

    // Disable button
    pickBtn.disabled = true;

    // Animate Shake
    jarElement.classList.add('shake');

    // Logic
    setTimeout(() => {
        jarElement.classList.remove('shake');
        pickBtn.disabled = false;

        const randomIndex = Math.floor(Math.random() * items.length);
        const picked = items[randomIndex];

        // Remove from items
        items.splice(randomIndex, 1);

        // Add to history
        history.push(picked);

        // Show Result
        showResult(picked);

        // Update UI
        updateUI();
        saveState();

    }, 1000); // 1.0s shake
}

function showResult(text) {
    resultText.textContent = text;
    resultModal.classList.remove('hidden');
    // You could confirm picking here, but user asked to simple "Pick and Show".
}

// Storage
function saveState() {
    localStorage.setItem('magicJar_items', JSON.stringify(items));
    localStorage.setItem('magicJar_history', JSON.stringify(history));
}

function loadState() {
    const storedItems = localStorage.getItem('magicJar_items');
    const storedHistory = localStorage.getItem('magicJar_history');

    if (storedItems) items = JSON.parse(storedItems);
    if (storedHistory) history = JSON.parse(storedHistory);
}

// Run init
init();
