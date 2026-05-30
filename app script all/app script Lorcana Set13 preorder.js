/**
 * =============================================
 *  Lorcana Set 13 — "Attack of the Vine" Preorder
 *  Up Level Academy — Google Apps Script
 *
 *  Receives JSON from lorcana-set13-preorder.html
 *  Saves slip to Drive, verifies via SlipOK, logs to sheet,
 *  notifies Telegram channel.
 *
 *  Sheet: 1IpEqQgX6IuMoENzD1lfR8BsfBwgecGYHUD5WDqSlyiM
 *  Tab:   Responses
 *
 *  No quota limit. No member check. Unlimited preorder.
 *  Preorder closes 2026-06-05 23:59 Asia/Bangkok.
 * =============================================
 */

const SCRIPT_VERSION = "lorcana13.v7";

// ===== Config =====
const SHEET_NAME      = "Responses";
const SLIP_FOLDER_ID  = "1-KShlgHqTIvlnxeNgZDBy0CI53Ue-WsL";

const SLIPOK_API_KEY  = "SLIPOKE2TSLQJ";
const BRANCH_ID       = "58927";

const BOT_TOKEN       = "8124787979:AAEWOqfiEACRxkrtZSWdTNuvGQr7uff_UoI";
const CHAT_ID         = "-4911555842";
const TELEGRAM_URL    = `https://api.telegram.org/bot${BOT_TOKEN}`;

const CLOSE_AT_ISO    = "2026-05-31T23:59:00+07:00";  // Bangkok
const SHIPPING_FEE    = 100;
const DUP_WINDOW_MS   = 60000;
const DEPOSIT_RATE    = 0.5;   // 50% มัดจำ
const BOOSTER_KEY     = "booster_box";
const BOOSTER_LIMIT   = 4;     // 1 case = 4 boxes ต่อคน

// SKU caps + kill-switches live in Script Properties so admin can edit live
// from the dashboard without redeploying. Keys:
//   sku_caps_json        e.g. {"booster_box": 100, "playmat_mike": 50}  (omit = unlimited)
//   sku_closed_json      e.g. {"booster_box": true}  (omit/false = open)
// Defaults below are only used the first time before Properties exist.
const DEFAULT_SKU_CAPS    = { "booster_box": 100 };
const DEFAULT_SKU_CLOSED  = { "booster_box": true };

// ===== SKU catalog (must match frontend) =====
const SKUS = [
  { key: "booster_box",      name: "Booster Box",                                price: 4700 },
  { key: "playmat_mike",     name: "Playmat — Mike, Sulley & Boo",               price: 700  },
  { key: "playmat_circle",   name: "Playmat — Circle of Life",                   price: 700  },
  { key: "starter_rapunzel", name: "Collection Starter — Rapunzel Edition",      price: 900  },
  { key: "beast_giftbox",    name: "Beast Gift Box",                             price: 900  },
  { key: "quest_hunny",      name: "Illumineer's Quest — Great Hunny Rescue",    price: 1800 },
  { key: "portfolio_mickey", name: "Mickey & Minnie Fabled Portfolio",           price: 750  }
];

// ===== Column layout (1-based) =====
const COL_TIMESTAMP   = 1;
const COL_NAME        = 2;
const COL_PHONE       = 3;
const COL_SHIPPING    = 4;
const COL_ADDRESS     = 5;
const COL_QTY_START   = 6;                          // F..L = 7 SKU qty columns
const COL_QTY_END     = COL_QTY_START + SKUS.length - 1;
const COL_SUBTOTAL    = COL_QTY_END + 1;            // M
const COL_SHIP_FEE    = COL_SUBTOTAL + 1;           // N
const COL_TOTAL       = COL_SHIP_FEE + 1;           // O  ยอดเต็ม
const COL_DEPOSIT     = COL_TOTAL + 1;              // P  มัดจำ 50%
const COL_REMAINING   = COL_DEPOSIT + 1;            // Q  ยอดคงเหลือ
const COL_SLIP        = COL_REMAINING + 1;          // R
const COL_TRANSREF    = COL_SLIP + 1;               // S
const COL_SENDER      = COL_TRANSREF + 1;           // T
const COL_STATUS      = COL_SENDER + 1;             // U
const COL_NOTES       = COL_STATUS + 1;             // V
// Phase 2 columns — appended when allocation is committed + remaining payment flow
const COL_ALLOC_JSON    = COL_NOTES + 1;            // W  {"sku_key": qty}
const COL_FINAL_AMOUNT  = COL_ALLOC_JSON + 1;       // X  subtotal allocated + shipFee
const COL_PHASE2_DUE    = COL_FINAL_AMOUNT + 1;     // Y  final − depositPaid (can be negative)
const COL_PHASE2_SLIP   = COL_PHASE2_DUE + 1;       // Z  slip URL for phase 2
const COL_PHASE2_REF    = COL_PHASE2_SLIP + 1;      // AA SlipOK transRef for phase 2
const COL_PHASE2_STATUS = COL_PHASE2_REF + 1;       // AB phase 2 status string
// Round 2 column — appended at end so existing rows/columns don't shift
const COL_ORDER_ROUND   = COL_PHASE2_STATUS + 1;    // AC "R1" (default) or "R2" (round-2 full-payment)

// Workflow phases (single Script Property `workflow_phase`)
const PHASE_COLLECTING            = "collecting";
const PHASE_CLOSED_AWAITING_ALLOC = "closed_awaiting_alloc";
const PHASE_ALLOC_COMMITTED       = "alloc_committed";
const PHASE_PHASE2_OPEN           = "phase2_open";
const PHASE_DONE                  = "done";
const VALID_PHASES = [
  PHASE_COLLECTING, PHASE_CLOSED_AWAITING_ALLOC, PHASE_ALLOC_COMMITTED,
  PHASE_PHASE2_OPEN, PHASE_DONE
];
const PHASE_TRANSITIONS = {
  collecting:            ["closed_awaiting_alloc"],
  closed_awaiting_alloc: ["alloc_committed", "collecting"],
  alloc_committed:       ["phase2_open", "closed_awaiting_alloc"],
  phase2_open:           ["done", "alloc_committed"],
  done:                  ["phase2_open"]
};

// =============================================
//  SKU config (caps + kill-switches) — Properties-backed
// =============================================
function readJsonProp(key, fallback) {
  try {
    const raw = PropertiesService.getScriptProperties().getProperty(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJsonProp(key, obj) {
  PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(obj || {}));
}

function getSkuCaps()    { return readJsonProp("sku_caps_json",   DEFAULT_SKU_CAPS); }
function getSkuClosed()  { return readJsonProp("sku_closed_json", DEFAULT_SKU_CLOSED); }
function saveSkuCaps(o)  { writeJsonProp("sku_caps_json",   o); }
function saveSkuClosed(o){ writeJsonProp("sku_closed_json", o); }

// Round 2 (extra-stock) — orthogonal flag, runs alongside phase2_open or alloc_committed.
// extra_stock_open: "true"/"false" (string). sku_extra_caps_json: { skuKey: cap }.
function isExtraStockOpen() {
  return PropertiesService.getScriptProperties().getProperty("extra_stock_open") === "true";
}
function setExtraStockOpen(open) {
  PropertiesService.getScriptProperties().setProperty("extra_stock_open", open ? "true" : "false");
}
function getSkuExtraCaps()   { return readJsonProp("sku_extra_caps_json", {}); }
function saveSkuExtraCaps(o) { writeJsonProp("sku_extra_caps_json", o); }

// Workflow phase — single source of truth in ScriptProperty.
// Falls back to closed_awaiting_alloc once CLOSE_AT_ISO has passed (so even
// if the auto-trigger never fired, the site flips correctly).
function getWorkflowPhase() {
  const p = PropertiesService.getScriptProperties().getProperty("workflow_phase");
  if (p && VALID_PHASES.indexOf(p) >= 0) return p;
  return isPreorderClosed() ? PHASE_CLOSED_AWAITING_ALLOC : PHASE_COLLECTING;
}
function setWorkflowPhase(next, meta) {
  if (VALID_PHASES.indexOf(next) < 0) throw new Error("invalid_phase:" + next);
  const props = PropertiesService.getScriptProperties();
  props.setProperty("workflow_phase",    next);
  props.setProperty("workflow_phase_at", new Date().toISOString());
  if (meta && meta.deadline) props.setProperty("phase2_deadline_iso", String(meta.deadline));
}
function getPhase2Deadline() {
  return PropertiesService.getScriptProperties().getProperty("phase2_deadline_iso") || "";
}
function getWorkflowPhaseAt() {
  return PropertiesService.getScriptProperties().getProperty("workflow_phase_at") || "";
}

// Admin auth — token stored in Script Properties as "admin_token".
// Set once via setupAdminToken() menu item.
function getAdminToken() {
  return PropertiesService.getScriptProperties().getProperty("admin_token") || "";
}
function checkAdminAuth(e) {
  const expected = getAdminToken();
  if (!expected) return false;  // not configured → deny
  const provided =
    (e && e.parameter && e.parameter.token) ||
    (e && e.postData && e.postData.contents && safeParseToken(e.postData.contents)) || "";
  return provided && provided === expected;
}
function safeParseToken(raw) {
  try { const j = JSON.parse(raw); return j && j.token; } catch (e) { return ""; }
}

// Count active (non-refunded/cancelled) units per SKU.
// `roundFilter` (optional): "R1" or "R2" → count only rows of that round.
// "R1" includes legacy rows with empty order_round (pre-R2 deployment).
// Returns { [skuKey]: number }
function countActiveSkuTotals(sheet, roundFilter) {
  const data = sheet.getDataRange().getValues();
  const totals = {};
  SKUS.forEach(s => { totals[s.key] = 0; });
  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    if (!row[COL_NAME - 1]) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;
    if (roundFilter) {
      const round = String(row[COL_ORDER_ROUND - 1] || "R1");
      const norm = round === "" ? "R1" : round;
      if (norm !== roundFilter) continue;
    }
    for (let s = 0; s < SKUS.length; s++) {
      const q = parseInt(row[COL_QTY_START - 1 + s]) || 0;
      if (q > 0) totals[SKUS[s].key] += q;
    }
  }
  return totals;
}

// Build per-SKU sold-out + remaining map from caps + active counts.
// activeTotals: { [key]: number } (from countActiveSkuTotals — R1 + R2 combined or unfiltered)
// r2Totals:     { [key]: number } (from countActiveSkuTotals(sheet, "R2"))
function buildSkuStock(activeTotals, r2Totals) {
  const caps      = getSkuCaps();
  const closed    = getSkuClosed();
  const extraCaps = getSkuExtraCaps();
  const out = {};
  SKUS.forEach(s => {
    const cap        = (typeof caps[s.key] === "number" && caps[s.key] > 0) ? caps[s.key] : null;
    const isClosed   = closed[s.key] === true;
    const active     = activeTotals ? (activeTotals[s.key] || 0) : 0;
    const remaining  = cap !== null ? Math.max(0, cap - active) : null;
    const extraCap        = (typeof extraCaps[s.key] === "number" && extraCaps[s.key] > 0) ? extraCaps[s.key] : 0;
    const extraActive     = r2Totals ? (r2Totals[s.key] || 0) : 0;
    const extraRemaining  = Math.max(0, extraCap - extraActive);
    out[s.key] = {
      cap:        cap,
      active:     active,
      remaining:  remaining,
      forceClosed: isClosed,
      soldOut:    isClosed || (cap !== null && remaining <= 0),
      extraCap:       extraCap,
      extraActive:    extraActive,
      extraRemaining: extraRemaining,
      extraSoldOut:   extraCap > 0 && extraRemaining <= 0
    };
  });
  return out;
}

// =============================================
//  Helpers
// =============================================
function normalizePhone(p) {
  let s = String(p || "").replace(/[^\d]/g, "");
  if (s.length === 11 && s.startsWith("66")) s = s.substring(2);
  if (s.length === 9 && /^[689]/.test(s))    s = "0" + s;
  return s;
}

function normalizeName(s) {
  return String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
}

const NAME_PREFIXES = [
  "นาย", "นาง", "นางสาว", "น.ส.", "นส.", "นส",
  "ด.ช.", "ด.ญ.", "ดช.", "ดญ.", "ดร.", "ดร",
  "mr.", "mr", "mrs.", "mrs", "ms.", "ms", "dr.", "dr"
];
function stripPrefix(name) {
  let n = normalizeName(name);
  if (!n) return "";
  for (let i = 0; i < 3; i++) {
    let stripped = false;
    for (const p of NAME_PREFIXES) {
      const lp = p.toLowerCase();
      if (n === lp || n.startsWith(lp + " ") || n.startsWith(lp)) {
        n = n.substring(lp.length).trim();
        stripped = true;
        break;
      }
    }
    if (!stripped) break;
  }
  return n;
}

function firstWord(name) {
  const n = stripPrefix(name);
  if (!n) return "";
  return n.split(" ")[0];
}

// ===== Sender name matching (fuzzy + TH/EN aliases) =====
// Common Thai nickname ↔ English/Thai romanization variants.
// Extend as we see real bank-side names that the basic matcher misses.
const NAME_ALIASES = {
  "champ":  ["แชมป์", "แชมป", "เเชมป์"],
  "boom":   ["บูม", "บูมบูม"],
  "ice":    ["ไอซ์", "ไอท์"],
  "leo":    ["ลีโอ"],
  "tan":    ["แทน", "ตัน", "ธัญ"],
  "ploy":   ["พลอย"],
  "mind":   ["มายด์", "มาย"],
  "earth":  ["เอิร์ธ", "เอิร์ท"],
  "fern":   ["เฟิร์น"],
  "may":    ["เมย์", "เม"],
  "june":   ["จูน"],
  "ohm":    ["โอม", "โอห์ม"],
  "first":  ["เฟิร์ส", "เฟิรส"],
  "guy":    ["กาย"],
  "knight": ["ไนท์"],
  "bank":   ["แบงค์", "แบงก์"],
  "best":   ["เบสท์", "เบส"],
  "ploy":   ["พลอย"],
  "nine":   ["นาย"],
  "win":    ["วิน"],
  "ohh":    ["โอ๊ะ", "โอ"],
  "pun":    ["ปัน", "พัน"],
  "team":   ["ทีม"],
  "view":   ["วิว"],
  "ken":    ["เคน"],
  "kim":    ["กิม"],
  "nut":    ["นัท", "ณัฐ"],
  "noon":   ["นุ่น"],
  "non":    ["โน่น", "นน"],
  "namo":   ["นะโม"],
  "title":  ["ไทเทิล"],
  "tee":    ["ตี๋"],
  "top":    ["ท็อป"],
  "x":      ["เอ็กซ์"]
};

// Map Thai consonants → roman equivalents (RTGS-ish).
// Used to build a consonant-only skeleton so "ชวณัฐ" ↔ "Chawanut" can match
// without maintaining per-person alias entries.
// Single-char roman per consonant — practical romanization
// (drops RTGS aspiration "h" so ค→k, ท→t, พ→p which is what real bank names look like).
const TH_CONSONANT_MAP = {
  "ก":"k","ข":"k","ฃ":"k","ค":"k","ฅ":"k","ฆ":"k",
  "ง":"ng",
  "จ":"ch","ฉ":"ch","ช":"ch","ซ":"s","ฌ":"ch",
  "ญ":"y",
  "ฎ":"d","ฏ":"t","ฐ":"t","ฑ":"t","ฒ":"t","ณ":"n",
  "ด":"d","ต":"t","ถ":"t","ท":"t","ธ":"t",
  "น":"n",
  "บ":"b","ป":"p","ผ":"p","ฝ":"f","พ":"p","ฟ":"f","ภ":"p",
  "ม":"m",
  "ย":"y","ร":"r","ล":"l","ว":"w",
  "ศ":"s","ษ":"s","ส":"s","ห":"h","ฬ":"l","อ":"","ฮ":"h"
};

// Final-position roman per Thai consonant (per RTGS, simplified).
// Different from initial: ด→t (not d), บ→p (not b), ย→i, ว→o, etc.
const TH_FINAL = {
  "ก":"k","ข":"k","ค":"k","ฆ":"k",
  "ง":"ng",
  "จ":"t","ช":"t","ซ":"t","ศ":"t","ษ":"t","ส":"t",
  "ฎ":"t","ฏ":"t","ฐ":"t","ฑ":"t","ฒ":"t","ด":"t","ต":"t","ถ":"t","ท":"t","ธ":"t",
  "ญ":"n","ณ":"n","น":"n","ร":"n","ล":"n","ฬ":"n",
  "บ":"p","ป":"p","พ":"p","ฟ":"p","ภ":"p","ผ":"p",
  "ม":"m",
  "ย":"i","ว":"o"
};

// Thai vowels by position.
const TH_VOWEL_DIACRITIC = { "ั":"a","ิ":"i","ี":"i","ึ":"ue","ื":"ue","ุ":"u","ู":"u","็":"" };
const TH_VOWEL_INLINE    = { "ะ":"a","า":"a","ำ":"am" };
const TH_VOWEL_PRE       = { "เ":"e","แ":"ae","โ":"o","ใ":"ai","ไ":"ai" };
const TH_TONE_MARKS      = "่้๊๋";

function isToneOrSilencer(ch) {
  return ch === "์" || TH_TONE_MARKS.indexOf(ch) >= 0;
}

// Approximate RTGS romanization of a Thai (or mixed) token.
// Rules applied:
//   - ์ silencer drops the preceding consonant
//   - tone marks ignored
//   - pre-vowels (เ แ โ ใ ไ) attach AFTER the next initial consonant
//   - consonant with no vowel + more consonants remaining  → initial + implicit "a"
//   - consonant with no vowel at end of token             → use FINAL map
//   - latin chars pass through unchanged (lowercased)
// Imperfect (no lexicon), but produces strings close enough that
// Levenshtein on the result lines up with real ID-card spellings.
function thaiRomanize(s, implicitVowel) {
  if (!s) return "";
  const implicit = implicitVowel || "a";
  const chars = String(s).toLowerCase().split("");
  const silent = new Array(chars.length).fill(false);
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === "์") silent[i - 1] = true;
  }
  function consonantsRemainingFrom(k) {
    let n = 0;
    for (let i = k; i < chars.length; i++) {
      if (silent[i]) continue;
      if (Object.prototype.hasOwnProperty.call(TH_CONSONANT_MAP, chars[i])) n++;
    }
    return n;
  }

  let out = "";
  let i = 0;
  let preVowel = "";

  while (i < chars.length) {
    const ch = chars[i];
    if (silent[i] || isToneOrSilencer(ch)) { i++; continue; }

    if (Object.prototype.hasOwnProperty.call(TH_VOWEL_PRE, ch)) {
      preVowel = TH_VOWEL_PRE[ch];
      i++;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(TH_CONSONANT_MAP, ch)) {
      // Look ahead past silent/tone marks for the next significant char.
      let j = i + 1;
      while (j < chars.length && (silent[j] || isToneOrSilencer(chars[j]))) j++;
      const nextCh = j < chars.length ? chars[j] : "";

      const hasDiacritic = Object.prototype.hasOwnProperty.call(TH_VOWEL_DIACRITIC, nextCh);
      const hasInline    = Object.prototype.hasOwnProperty.call(TH_VOWEL_INLINE, nextCh);
      const hasPre       = preVowel !== "";
      const hasVowel     = hasDiacritic || hasInline || hasPre;

      if (hasVowel) {
        out += TH_CONSONANT_MAP[ch];
        if (hasPre)       { out += preVowel; preVowel = ""; }
        if (hasDiacritic) { out += TH_VOWEL_DIACRITIC[nextCh]; i = j + 1; continue; }
        if (hasInline)    { out += TH_VOWEL_INLINE[nextCh];    i = j + 1; continue; }
        i = j;
        continue;
      }

      const remaining = consonantsRemainingFrom(i + 1);
      if (remaining > 0) {
        // Implicit vowel between consonants. Thai unmarked syllables default
        // to "a" in most cases but "o" in many common names (สม→Som, กร→Kor,
        // ทร→Thor). Both candidates are tested by the matcher.
        out += TH_CONSONANT_MAP[ch] + implicit;
      } else {
        // End of token — use FINAL form.
        out += (Object.prototype.hasOwnProperty.call(TH_FINAL, ch) ? TH_FINAL[ch] : TH_CONSONANT_MAP[ch]);
      }
      i++;
      continue;
    }

    if (/[a-z]/.test(ch)) { out += ch; i++; continue; }
    i++;
  }
  // Flush any dangling pre-vowel (malformed input).
  if (preVowel) out += preVowel;
  return out;
}

// Build a consonant-only skeleton from a single token (TH, EN, or mixed).
// Strips Thai vowels/tone marks; for roman letters, drops a/e/i/o/u/y.
// Handles the Thai silencer "์" — the preceding consonant becomes silent.
function consonantSkeleton(s) {
  if (!s) return "";
  const lower = String(s).toLowerCase();
  const chars = lower.split("");
  const silent = new Array(chars.length).fill(false);
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === "์") silent[i - 1] = true; // ์ thanthakhat
  }
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    if (silent[i]) continue;
    const ch = chars[i];
    if (Object.prototype.hasOwnProperty.call(TH_CONSONANT_MAP, ch)) {
      out += TH_CONSONANT_MAP[ch];
    } else if (/[a-z]/.test(ch)) {
      if (!/[aeiouy]/.test(ch)) out += ch;
    }
    // ignore Thai vowels, tone marks, digits, punctuation
  }
  return out;
}

function levenshtein(a, b) {
  a = a || ""; b = b || "";
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[n];
}

function nameTokens(name) {
  const n = stripPrefix(name);
  if (!n) return [];
  return n.split(/\s+/).filter(t => t.length > 0);
}

// Check if two single tokens are "the same name" — exact, substring, fuzzy, or alias.
function tokensMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  // Substring (only if base token is >= 3 chars to avoid trivial matches)
  if (a.length >= 3 && b.indexOf(a) >= 0) return true;
  if (b.length >= 3 && a.indexOf(b) >= 0) return true;
  // Levenshtein — tolerant for short tokens (1 edit) and longer (2 edits)
  const maxLen = Math.max(a.length, b.length);
  const threshold = maxLen <= 4 ? 1 : 2;
  if (levenshtein(a, b) <= threshold) return true;
  // TH ↔ EN alias table
  const aliasesA = NAME_ALIASES[a] || [];
  if (aliasesA.indexOf(b) >= 0) return true;
  const aliasesB = NAME_ALIASES[b] || [];
  if (aliasesB.indexOf(a) >= 0) return true;
  // Consonant skeleton — catches Thai given name ↔ EN romanization
  // (e.g. ชวณัฐ→"chwnth" vs Chawanut→"chwnt")
  const skA = consonantSkeleton(a);
  const skB = consonantSkeleton(b);
  if (skA.length >= 3 && skB.length >= 3) {
    if (skA === skB) return true;
    const skMax = Math.max(skA.length, skB.length);
    const skThreshold = skMax <= 4 ? 1 : 2;
    if (levenshtein(skA, skB) <= skThreshold) return true;
  }
  // Full RTGS-ish romanization with vowels — closer to ID-card spelling.
  // Try both implicit-vowel variants ("a" and "o") since Thai unmarked syllables
  // can take either depending on the word (สม→Som, ทร→Thor vs สา→Sa).
  const variantsA = [thaiRomanize(a, "a"), thaiRomanize(a, "o")];
  const variantsB = [thaiRomanize(b, "a"), thaiRomanize(b, "o")];
  for (let i = 0; i < variantsA.length; i++) {
    for (let j = 0; j < variantsB.length; j++) {
      if (romanizeMatch(variantsA[i], variantsB[j])) return true;
      // จ has two common romanizations: "ch" (RTGS) and "j" (informal — e.g. จิรา→Jira).
      const rA = variantsA[i], rB = variantsB[j];
      if (rA.indexOf("ch") === 0 || rB.indexOf("ch") === 0) {
        const altA = rA.indexOf("ch") === 0 ? "j" + rA.substring(2) : rA;
        const altB = rB.indexOf("ch") === 0 ? "j" + rB.substring(2) : rB;
        if (romanizeMatch(altA, altB)) return true;
      }
    }
  }
  return false;
}

function romanizeMatch(rA, rB) {
  if (rA.length < 3 || rB.length < 3) return false;
  if (rA === rB) return true;
  const cA = canonicalRoman(rA);
  const cB = canonicalRoman(rB);
  if (cA === cB) return true;
  const rMax = Math.max(cA.length, cB.length);
  const rThreshold = rMax <= 4 ? 1 : rMax <= 7 ? 2 : rMax <= 10 ? 3 : 4;
  return levenshtein(cA, cB) <= rThreshold;
}

// Collapse common romanization variants to one canonical form so
// "Thaksin" (RTGS aspirated) and "Taksin" (simplified) compare equal.
//   kh/ph/th/bh → k/p/t/b   (drop aspiration h)
//   ee → i                  (long ee written for อี)
//   v → w                   (Pali/royal V-spellings like Vajira)
function canonicalRoman(r) {
  if (!r) return "";
  return r.toLowerCase()
    .replace(/([kptb])h/g, "$1")
    .replace(/ee/g, "i")
    .replace(/v/g, "w");
}

// Cross-compare every sender token against every customer token.
// If ANY pair matches, treat as same person (not a mismatch).
function isSenderMismatch(senderName, customerName) {
  const sTokens = nameTokens(senderName);
  const cTokens = nameTokens(customerName);
  if (sTokens.length === 0 || cTokens.length === 0) return false;
  for (let i = 0; i < sTokens.length; i++) {
    for (let j = 0; j < cTokens.length; j++) {
      if (tokensMatch(sTokens[i], cTokens[j])) return false;
    }
  }
  return true;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isPreorderClosed() {
  return Date.now() >= new Date(CLOSE_AT_ISO).getTime();
}

// =============================================
//  doGet — Router
// =============================================
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  try {
    if (action === "order_status") {
      return jsonResponse(getOrderStatus(e.parameter.phone));
    }
    if (action === "recent") {
      return jsonResponse(getRecentOrders(parseInt(e.parameter.limit) || 5));
    }
    if (action === "dashboard") {
      return jsonResponse(getDashboardSummary());
    }
    if (action === "shipping_list") {
      return jsonResponse(getShippingList());
    }
    if (action === "admin_config") {
      if (!checkAdminAuth(e)) return jsonResponse({ error: "unauthorized" });
      return jsonResponse(getAdminConfig());
    }
    if (action === "phase") {
      // Public: storefront can poll for current phase without admin token
      return jsonResponse({
        phase:          getWorkflowPhase(),
        phaseAt:        getWorkflowPhaseAt(),
        phase2Deadline: getPhase2Deadline()
      });
    }
    if (action === "phase2_csv") {
      if (!checkAdminAuth(e)) return jsonResponse({ error: "unauthorized" });
      return ContentService
        .createTextOutput(getPhase2BroadcastCsv())
        .setMimeType(ContentService.MimeType.PLAIN_TEXT);
    }
    return jsonResponse(getSummary());
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

// Admin config payload — read by champ-hq dashboard
function getAdminConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const activeTotals = sheet ? countActiveSkuTotals(sheet) : null;
  const r2Totals     = sheet ? countActiveSkuTotals(sheet, "R2") : null;
  const stock = buildSkuStock(activeTotals, r2Totals);
  return {
    updatedAt:      new Date().toISOString(),
    skus:           SKUS.map(s => ({ key: s.key, name: s.name, price: s.price })),
    caps:           getSkuCaps(),
    closed:         getSkuClosed(),
    extraCaps:      getSkuExtraCaps(),
    extraStockOpen: isExtraStockOpen(),
    stock:          stock
  };
}

// =============================================
//  Phase 2 workflow — admin handlers
// =============================================

// Admin: set workflow phase. body { phase, deadline?, token }
function adminSetPhase(body) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (e) { return { success: false, error: "busy_try_again" }; }
  try {
    const prev = getWorkflowPhase();
    const next = String((body && body.phase) || "");
    const allowed = PHASE_TRANSITIONS[prev] || [];
    if (allowed.indexOf(next) < 0) throw new Error("bad_transition:" + prev + "->" + next);
    setWorkflowPhase(next, { deadline: body && body.deadline });

    if (next === PHASE_CLOSED_AWAITING_ALLOC) {
      sendTelegram(
        "🔒 *Lorcana 13 — ปิดพรีออเดอร์แล้ว (manual)*\n" +
        "รอคอนเฟิร์มยอดจากตัวแทน → เปิด champ-hq บันทึก allocation"
      );
    } else if (next === PHASE_PHASE2_OPEN) {
      const dl = getPhase2Deadline();
      sendTelegram(
        "📢 *Lorcana 13 — เปิด Phase 2 ชำระยอดคงเหลือ*\n" +
        "กำหนดชำระภายใน " + (dl || "(ไม่กำหนด)") + "\n" +
        "→ Download CSV ใน dashboard ไป broadcast LINE/FB"
      );
    } else if (next === PHASE_DONE) {
      sendTelegram("✅ *Lorcana 13 — ปิดรอบ*\nรอบนี้จบ → เริ่มจัดส่ง");
    } else if (next === PHASE_COLLECTING) {
      sendTelegram("↩️ *Lorcana 13 — เปิดรับพรีออเดอร์อีกครั้ง*\n(rollback จาก " + prev + ")");
    } else if (next === PHASE_ALLOC_COMMITTED) {
      sendTelegram("💾 *Lorcana 13 — Allocation rolled back to committed state*\n(จาก " + prev + ")");
    }
    return { success: true, phase: next, phaseAt: getWorkflowPhaseAt(), phase2Deadline: getPhase2Deadline() };
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

// Admin: commit allocation. body { allocations: { "<phone>": { "<sku>": qty } }, token }
// Writes per-row allocated_qty (greedy across that customer's rows), final_amount, phase2_due.
// Phase must be closed_awaiting_alloc or alloc_committed (allows re-commit).
function adminCommitAllocation(body) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (e) { return { success: false, error: "busy_try_again" }; }
  try {
    const phase = getWorkflowPhase();
    if (phase !== PHASE_CLOSED_AWAITING_ALLOC && phase !== PHASE_ALLOC_COMMITTED) {
      throw new Error("bad_phase_for_commit:" + phase);
    }
    const allocByPhone = (body && body.allocations) || {};
    if (typeof allocByPhone !== "object") throw new Error("invalid_allocations");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("sheet_not_found");
    ensureHeaders(sheet);
    const data = sheet.getDataRange().getValues();

    // Group sheet rows by phone (in row order), skip refund/cancel
    const rowsByPhone = {};
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[COL_NAME - 1]) continue;
      const ph = normalizePhone(row[COL_PHONE - 1]);
      if (!ph) continue;
      const status = String(row[COL_STATUS - 1] || "");
      if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;
      (rowsByPhone[ph] = rowsByPhone[ph] || []).push(i + 1);  // sheet row number (1-based)
    }

    let customers = 0, touched = 0, totalFinal = 0, totalDue = 0, refundCount = 0;
    Object.keys(allocByPhone).forEach(phone => {
      const ph = normalizePhone(phone);
      const rows = rowsByPhone[ph];
      if (!rows || !rows.length) return;
      customers++;

      // Snapshot per-row ordered qty per SKU
      const perRowOrdered = rows.map(rowNum => {
        const arr = {};
        SKUS.forEach((s, sIdx) => {
          arr[s.key] = parseInt(data[rowNum - 1][COL_QTY_START - 1 + sIdx]) || 0;
        });
        return arr;
      });
      const perRowAlloc = rows.map(() => {
        const o = {};
        SKUS.forEach(s => { o[s.key] = 0; });
        return o;
      });

      // Distribute per-customer allocated qty greedily across this phone's rows.
      // UI is now the source of truth (override allowed > ordered), so we do
      // NOT cap at perRowOrdered. Dump leftover into the LAST row of the phone
      // so it remains traceable even if it exceeds the original order.
      const wantedByPhone = allocByPhone[phone] || {};
      SKUS.forEach(s => {
        let remaining = parseInt(wantedByPhone[s.key]) || 0;
        if (remaining < 0) remaining = 0;
        for (let r = 0; r < rows.length && remaining > 0; r++) {
          const isLastRow = (r === rows.length - 1);
          const give = isLastRow ? remaining : Math.min(remaining, perRowOrdered[r][s.key]);
          perRowAlloc[r][s.key] = give;
          remaining -= give;
        }
      });

      // Compute per-row final + due, write
      rows.forEach((rowNum, r) => {
        const allocMap = perRowAlloc[r];
        const subtotal = SKUS.reduce((sum, s) => sum + (allocMap[s.key] || 0) * s.price, 0);
        const shipFee  = parseFloat(data[rowNum - 1][COL_SHIP_FEE - 1]) || 0;
        const final    = subtotal + (subtotal > 0 ? shipFee : 0);  // no ship fee if nothing allocated
        const deposit  = parseFloat(data[rowNum - 1][COL_DEPOSIT - 1]) || 0;
        const status1  = String(data[rowNum - 1][COL_STATUS - 1] || "");
        const depositPaid = status1.indexOf("มัดจำแล้ว") >= 0 ? deposit : 0;
        const due      = final - depositPaid;

        sheet.getRange(rowNum, COL_ALLOC_JSON  ).setValue(JSON.stringify(allocMap));
        sheet.getRange(rowNum, COL_FINAL_AMOUNT).setValue(final);
        sheet.getRange(rowNum, COL_PHASE2_DUE  ).setValue(due);
        if (due < 0) {
          sheet.getRange(rowNum, COL_PHASE2_STATUS).setValue("💸 รอคืนเงิน");
          refundCount++;
        } else {
          // Clear stale status if previous commit set refund
          const existing = String(data[rowNum - 1][COL_PHASE2_STATUS - 1] || "");
          if (existing.indexOf("รอคืนเงิน") >= 0) {
            sheet.getRange(rowNum, COL_PHASE2_STATUS).setValue("");
          }
        }
        totalFinal += final;
        totalDue   += Math.max(0, due);
        touched++;
      });
    });

    SpreadsheetApp.flush();
    setWorkflowPhase(PHASE_ALLOC_COMMITTED);

    // Auto-populate R2 (extra) caps from leftover stock = received − totalAllocated per SKU.
    // Only writes if UI sent `receivedTotals` (mapping skuKey → received qty from supplier).
    let extraCaps = null;
    if (body.receivedTotals && typeof body.receivedTotals === "object") {
      const allocTotalsBySku = {};
      SKUS.forEach(s => { allocTotalsBySku[s.key] = 0; });
      Object.keys(allocByPhone).forEach(phone => {
        const map = allocByPhone[phone] || {};
        SKUS.forEach(s => { allocTotalsBySku[s.key] += parseInt(map[s.key]) || 0; });
      });
      extraCaps = {};
      SKUS.forEach(s => {
        const recv = parseInt(body.receivedTotals[s.key]) || 0;
        const left = Math.max(0, recv - allocTotalsBySku[s.key]);
        if (left > 0) extraCaps[s.key] = left;
      });
      saveSkuExtraCaps(extraCaps);
    }

    sendTelegram(
      "💾 *Lorcana 13 — บันทึก Allocation แล้ว*\n" +
      "รวม " + customers + " ลูกค้า / " + touched + " แถว\n" +
      "ยอด final รวม " + totalFinal.toLocaleString() + " บาท · ต้องเก็บเพิ่ม " + totalDue.toLocaleString() + " บาท\n" +
      (refundCount > 0 ? "💸 ต้องคืนเงิน " + refundCount + " แถว\n" : "") +
      (extraCaps && Object.keys(extraCaps).length > 0
        ? "🆕 R2 stock พร้อมขาย: " + Object.keys(extraCaps).map(k => k + "×" + extraCaps[k]).join(", ") + "\n"
        : "") +
      "→ ตรวจในชีท แล้วกด \"เปิด Phase 2\" เพื่อแจ้งลูกค้า"
    );
    return { success: true, customers: customers, touched: touched, totalFinal: totalFinal, totalDue: totalDue, refundCount: refundCount, extraCaps: extraCaps };
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

// Admin: per-row status action. body { rowIndex, action, note?, token }
// Supported actions:
//   - mark_refunded:         status → "💰 คืนเงินแล้ว" (removes row from active counts)
//   - mark_cancelled:        status → "🚫 ยกเลิก"
//   - approve_mismatch:      status → "✅ มัดจำแล้ว (อนุมัติ admin)"   (treat ยอดไม่ตรง as accepted)
//   - mark_phase2_refunded:  phase2Status → "💰 คืน Phase 2 แล้ว"
//   - reopen:                clear cancel/refund → "⏳ รอตรวจสอบสลิป"
function adminRowAction(body) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (e) { return { success: false, error: "busy_try_again" }; }
  try {
    const rowIndex = parseInt(body && body.rowIndex);
    const action   = String((body && body.action) || "");
    const note     = String((body && body.note) || "").trim();
    if (!rowIndex || rowIndex < 2) return { success: false, error: "invalid_row" };
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return { success: false, error: "sheet_not_found" };
    if (rowIndex > sheet.getLastRow()) return { success: false, error: "row_out_of_range" };
    const row = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    const oldStatus       = String(row[COL_STATUS - 1] || "");
    const oldPhase2Status = String(row[COL_PHASE2_STATUS - 1] || "");
    const customerName    = String(row[COL_NAME - 1] || "");
    const phone           = String(row[COL_PHONE - 1] || "");

    let newStatus = oldStatus;
    let newPhase2Status = oldPhase2Status;
    let tgIcon = "✏️";
    let tgLabel = action;

    if (action === "mark_refunded") {
      newStatus = "💰 คืนเงินแล้ว" + (note ? " · " + note : "");
      tgIcon = "💰"; tgLabel = "คืนเงิน (มัดจำ R1)";
    } else if (action === "mark_cancelled") {
      newStatus = "🚫 ยกเลิก" + (note ? " · " + note : "");
      tgIcon = "🚫"; tgLabel = "ยกเลิกออเดอร์";
    } else if (action === "approve_mismatch") {
      if (oldStatus.indexOf("ยอดไม่ตรง") < 0) {
        return { success: false, error: "not_a_mismatch_row", status: oldStatus };
      }
      newStatus = "✅ มัดจำแล้ว (อนุมัติ admin)" + (note ? " · " + note : "");
      tgIcon = "✅"; tgLabel = "อนุมัติยอดไม่ตรง";
    } else if (action === "mark_phase2_refunded") {
      newPhase2Status = "💰 คืน Phase 2 แล้ว" + (note ? " · " + note : "");
      tgIcon = "💰"; tgLabel = "คืน Phase 2";
    } else if (action === "reopen") {
      newStatus = "⏳ รอตรวจสอบสลิป" + (note ? " · " + note : "");
      tgIcon = "↩️"; tgLabel = "เปิดออเดอร์ใหม่";
    } else {
      return { success: false, error: "unknown_action:" + action };
    }

    if (newStatus !== oldStatus) {
      sheet.getRange(rowIndex, COL_STATUS).setValue(newStatus);
    }
    if (newPhase2Status !== oldPhase2Status) {
      sheet.getRange(rowIndex, COL_PHASE2_STATUS).setValue(newPhase2Status);
    }
    SpreadsheetApp.flush();

    sendTelegram(
      tgIcon + " *Lorcana 13 — " + tgLabel + "*\n" +
      "👤 " + customerName + " (" + phone + ")\n" +
      "📋 row " + rowIndex + "\n" +
      "ก่อน: " + (oldStatus || "-") + "\n" +
      "หลัง: " + (newStatus || oldStatus) +
      (newPhase2Status !== oldPhase2Status ? "\nPhase 2: " + newPhase2Status : "") +
      (note ? "\nหมายเหตุ: " + note : "")
    );

    return { success: true, rowIndex: rowIndex, status: newStatus, phase2Status: newPhase2Status };
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

// Customer-facing: submit phase 2 slip. body { phone, slipBase64 }
// Writes to first active row for that phone; charges against summed phase2_due.
function submitPhase2Payment(body) {
  if (getWorkflowPhase() !== PHASE_PHASE2_OPEN) {
    return { success: false, error: "phase2_not_open" };
  }
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (e) { return { success: false, error: "busy_try_again" }; }
  try {
    const ph = normalizePhone(body && body.phone);
    if (!ph) return { success: false, error: "no_phone" };
    if (!body.slipBase64) return { success: false, error: "missing_slip" };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return { success: false, error: "sheet_not_found" };
    const data = sheet.getDataRange().getValues();

    // Find first active row + sum phase2_due across all active rows for this phone
    let firstRow = -1;
    let totalDue = 0;
    let alreadyPaid = false;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[COL_NAME - 1]) continue;
      if (normalizePhone(row[COL_PHONE - 1]) !== ph) continue;
      const st = String(row[COL_STATUS - 1] || "");
      if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(st)) continue;
      if (firstRow < 0) firstRow = i + 1;
      totalDue += parseFloat(row[COL_PHASE2_DUE - 1]) || 0;
      const p2 = String(row[COL_PHASE2_STATUS - 1] || "");
      if (p2.indexOf("ชำระยอดคงเหลือแล้ว") >= 0) alreadyPaid = true;
    }
    if (firstRow < 0) return { success: false, error: "no_order" };
    if (alreadyPaid)  return { success: false, error: "already_paid_phase2" };
    if (totalDue <= 0) return { success: false, error: "no_amount_due", totalDue: totalDue };

    const slipUrl = saveImageToDrive(body.slipBase64, body.phone, "phase2slip");
    let status = "⏳ รอตรวจสลิป Phase 2";
    let transRef = "";
    let verifiedAmount = null;

    if (slipUrl) {
      const verified = verifySlip(slipUrl);
      if (verified && verified.success) {
        const amt = parseFloat(verified.data.amount);
        transRef = verified.data.transRef || "";
        // Dup-check both phase-1 and phase-2 trans refs
        if (transRef) {
          for (let i = 1; i < data.length; i++) {
            const r1 = String(data[i][COL_TRANSREF    - 1] || "").trim();
            const r2 = String(data[i][COL_PHASE2_REF  - 1] || "").trim();
            if ((r1 && r1 === transRef) || (r2 && r2 === transRef)) {
              return { success: false, error: "duplicate_slip", transRef: transRef, atRow: i + 1 };
            }
          }
        }
        if (Math.abs(amt - totalDue) < 1) {
          status = "✅ ชำระยอดคงเหลือแล้ว";
          verifiedAmount = amt;
        } else {
          status = "⚠️ ยอดไม่ตรง Phase2 (" + amt + "/" + totalDue + ")";
        }
      }
    }

    sheet.getRange(firstRow, COL_PHASE2_SLIP  ).setValue(slipUrl);
    sheet.getRange(firstRow, COL_PHASE2_REF   ).setValue(transRef);
    sheet.getRange(firstRow, COL_PHASE2_STATUS).setValue(status);
    SpreadsheetApp.flush();

    sendTelegram(
      "💴 *Lorcana 13 Phase 2 — สลิปใหม่*\n" +
      "📱 " + body.phone + "\n" +
      "💰 ต้องชำระ " + totalDue.toLocaleString() + " บาท\n" +
      "📊 " + status + "\n" +
      (slipUrl ? "🧾 [Slip](" + slipUrl + ")" : "")
    );

    return {
      success:  true,
      status:   status,
      slipUrl:  slipUrl,
      totalDue: totalDue,
      verified: status === "✅ ชำระยอดคงเหลือแล้ว",
      transRef: transRef
    };
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

// Save admin config — body { caps: {...}, closed: {...}, token: "..." }
// Replaces both maps atomically. Caller sends complete maps.
function saveAdminConfig(body) {
  if (!body || typeof body !== "object") throw new Error("invalid_body");
  const caps           = (body.caps           && typeof body.caps           === "object") ? body.caps           : null;
  const closed         = (body.closed         && typeof body.closed         === "object") ? body.closed         : null;
  const extraCaps      = (body.extraCaps      && typeof body.extraCaps      === "object") ? body.extraCaps      : null;
  const hasExtraToggle = typeof body.extraStockOpen === "boolean";
  if (!caps && !closed && !extraCaps && !hasExtraToggle) throw new Error("nothing_to_update");

  // Sanitize: only known SKU keys, numbers >= 0 for caps, booleans for closed
  if (caps) {
    const clean = {};
    SKUS.forEach(s => {
      if (Object.prototype.hasOwnProperty.call(caps, s.key)) {
        const n = parseInt(caps[s.key]);
        if (!isNaN(n) && n > 0) clean[s.key] = n;
        // n <= 0 or missing → unlimited (no key)
      }
    });
    saveSkuCaps(clean);
  }
  if (closed) {
    const clean = {};
    SKUS.forEach(s => {
      if (closed[s.key] === true) clean[s.key] = true;
    });
    saveSkuClosed(clean);
  }
  if (extraCaps) {
    const clean = {};
    SKUS.forEach(s => {
      if (Object.prototype.hasOwnProperty.call(extraCaps, s.key)) {
        const n = parseInt(extraCaps[s.key]);
        if (!isNaN(n) && n > 0) clean[s.key] = n;
      }
    });
    saveSkuExtraCaps(clean);
  }
  if (hasExtraToggle) {
    const prev = isExtraStockOpen();
    setExtraStockOpen(!!body.extraStockOpen);
    if (prev !== !!body.extraStockOpen) {
      sendTelegram(body.extraStockOpen
        ? "🆕 *Lorcana 13 — เปิด Round 2 (ขายของเหลือ จ่ายเต็ม)*"
        : "🔒 *Lorcana 13 — ปิด Round 2*");
    }
  }
  return getAdminConfig();
}

// Return last N orders with PII masked (first 5 chars of name, last-4 hidden phone)
function getRecentOrders(limit) {
  const n = Math.min(Math.max(1, limit || 5), 10);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { found: false, orders: [] };

  const data = sheet.getDataRange().getValues();
  const out  = [];
  // Walk from newest to oldest (bottom to top)
  for (let i = data.length - 1; i >= 1 && out.length < n; i--) {
    const row = data[i];
    const name   = String(row[COL_NAME - 1] || "").trim();
    if (!name) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;

    const phoneRaw = normalizePhone(row[COL_PHONE - 1]);
    const phoneMasked = phoneRaw.length >= 7
      ? phoneRaw.substring(0, 3) + "-XXX-" + phoneRaw.substring(phoneRaw.length - 4)
      : "xxx-xxx-xxxx";

    // First word (or first 5 Thai chars) of name + …
    const stripped = stripPrefix(name);
    const namePart = stripped.length > 5 ? stripped.substring(0, 5) + "…" : stripped;

    // Item summary (count of all SKU qty)
    let itemQty = 0;
    for (let s = 0; s < SKUS.length; s++) itemQty += parseInt(row[COL_QTY_START - 1 + s]) || 0;

    const ts = row[COL_TIMESTAMP - 1];
    out.push({
      name:      namePart,
      phone:     phoneMasked,
      items:     itemQty,
      verified:  status.indexOf("มัดจำแล้ว") >= 0,
      timestamp: ts instanceof Date ? ts.toISOString() : String(ts)
    });
  }
  return { found: out.length > 0, count: out.length, orders: out };
}

function getSummary() {
  let stock = {};
  let activeTotals = null;
  let r2Totals = null;
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (sheet) {
      activeTotals = countActiveSkuTotals(sheet);
      r2Totals     = countActiveSkuTotals(sheet, "R2");
      stock = buildSkuStock(activeTotals, r2Totals);
    } else {
      stock = buildSkuStock(null, null);
    }
  } catch (err) {
    stock = buildSkuStock(null, null);
  }
  // Back-compat: keep boosterSoldOut at top level so older clients still work
  const boosterStock = stock[BOOSTER_KEY] || { soldOut: false };
  return {
    version:        SCRIPT_VERSION,
    closeAt:        CLOSE_AT_ISO,
    closed:         isPreorderClosed(),
    skus:           SKUS,
    shipping:       SHIPPING_FEE,
    depositRate:    DEPOSIT_RATE,
    boosterLimit:   BOOSTER_LIMIT,
    boosterSoldOut: !!boosterStock.soldOut,
    stock:          stock,
    phase:          getWorkflowPhase(),
    phaseAt:        getWorkflowPhaseAt(),
    phase2Deadline: getPhase2Deadline(),
    extraStockOpen: isExtraStockOpen()
  };
}

// Derive a customer-facing "next step" hint from raw sheet status
function deriveNextAction(status) {
  const s = String(status || "");
  if (s.indexOf("มัดจำแล้ว") >= 0) {
    return {
      kind: "done",
      label: "เสร็จเรียบร้อย",
      text:  "ไม่ต้องทำอะไรเพิ่ม — ทางร้านจะคอนเฟิร์มยอดสินค้าจริงหลังปิดพรีออเดอร์ และแจ้งชำระยอดคงเหลืออีกครั้ง"
    };
  }
  if (s.indexOf("ยอดไม่ตรง") >= 0) {
    return {
      kind: "warn",
      label: "ยอดโอนไม่ตรง",
      text:  "ยอดที่โอนไม่ตรงกับมัดจำที่ระบบคำนวณ — กรุณาทักแอดมินทาง LINE / Facebook เพื่อแก้ไข"
    };
  }
  if (s.indexOf("รอตรวจ") >= 0) {
    return {
      kind: "pending",
      label: "รอตรวจสลิป",
      text:  "ทางร้านจะตรวจสลิปและยืนยันออเดอร์ภายใน 24 ชม. — ไม่ต้องส่งซ้ำ"
    };
  }
  if (s.indexOf("คืนเงิน") >= 0) {
    return {
      kind: "refund",
      label: "คืนเงินแล้ว",
      text:  "ออเดอร์นี้ถูกคืนเงิน — ติดต่อแอดมินถ้ามีคำถาม"
    };
  }
  if (s.indexOf("ยกเลิก") >= 0 || s.indexOf("เกินโควต้า") >= 0) {
    return {
      kind: "cancel",
      label: "ออเดอร์ถูกยกเลิก",
      text:  "ติดต่อแอดมินทาง LINE / Facebook เพื่อสอบถามรายละเอียด"
    };
  }
  return {
    kind: "unknown",
    label: "ติดต่อแอดมิน",
    text:  "สถานะไม่ชัดเจน — กรุณาทักแอดมินเพื่อยืนยันออเดอร์"
  };
}

// Customer-safe order lookup (no slip URL, no address)
function getOrderStatus(phone) {
  const normPhone = normalizePhone(phone);
  if (!normPhone) return { found: false, reason: "no_phone" };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { found: false, reason: "sheet_not_found" };

  const data   = sheet.getDataRange().getValues();
  const orders = [];
  for (let i = 1; i < data.length; i++) {
    const row      = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;

    const items = [];
    for (let s = 0; s < SKUS.length; s++) {
      const q = parseInt(row[COL_QTY_START - 1 + s]) || 0;
      if (q > 0) items.push({ name: SKUS[s].name, qty: q });
    }

    const ts     = row[COL_TIMESTAMP - 1];
    const status = String(row[COL_STATUS - 1] || "");
    // Phase 2 fields — present only after allocation is committed
    let allocated = null;
    try {
      const raw = String(row[COL_ALLOC_JSON - 1] || "");
      if (raw) allocated = JSON.parse(raw);
    } catch (e) { allocated = null; }
    orders.push({
      rowIndex:   i + 1,  // 1-based sheet row (admin only — for row-action endpoint)
      timestamp:  ts instanceof Date ? ts.toISOString() : String(ts),
      name:       String(row[COL_NAME - 1] || ""),
      shipping:   String(row[COL_SHIPPING - 1] || ""),
      address:    String(row[COL_ADDRESS - 1] || ""),
      items:      items,
      total:      parseFloat(row[COL_TOTAL - 1]) || 0,
      deposit:    parseFloat(row[COL_DEPOSIT - 1]) || 0,
      remaining:  parseFloat(row[COL_REMAINING - 1]) || 0,
      status:     status,
      nextAction: deriveNextAction(status),
      slipUrl:      String(row[COL_SLIP - 1] || ""),
      transRef:     String(row[COL_TRANSREF - 1] || ""),
      senderName:   String(row[COL_SENDER - 1] || ""),
      orderRound:   String(row[COL_ORDER_ROUND - 1] || "R1") || "R1",
      allocated:    allocated,
      finalAmount:  parseFloat(row[COL_FINAL_AMOUNT - 1]) || 0,
      phase2Due:    parseFloat(row[COL_PHASE2_DUE - 1])   || 0,
      phase2Slip:   String(row[COL_PHASE2_SLIP - 1] || ""),
      phase2Status: String(row[COL_PHASE2_STATUS - 1] || "")
    });
  }

  // Aggregated view across all active (non-cancelled, non-refunded) orders
  // for shipping consolidation — "รวมทั้งหมดของคุณ"
  const active = orders.filter(o => {
    const s = o.status || "";
    return s.indexOf("คืนเงิน") < 0 && s.indexOf("ยกเลิก") < 0 && s.indexOf("เกินโควต้า") < 0;
  });

  const itemMap = {};   // name -> qty
  const allocItemMap = {};  // name -> alloc qty (post-allocation)
  let aggTotal = 0, aggDeposit = 0, aggRemaining = 0, aggQty = 0;
  let aggFinal = 0, aggPhase2Due = 0;
  let paidCount = 0, pendingCount = 0;
  let phase2Paid = false, phase2Refund = false;
  active.forEach(o => {
    aggTotal     += o.total     || 0;
    aggDeposit   += o.deposit   || 0;
    aggRemaining += o.remaining || 0;
    aggFinal     += o.finalAmount || 0;
    aggPhase2Due += o.phase2Due   || 0;
    (o.items || []).forEach(it => {
      itemMap[it.name] = (itemMap[it.name] || 0) + (it.qty || 0);
      aggQty += it.qty || 0;
    });
    if (o.allocated && typeof o.allocated === "object") {
      SKUS.forEach(s => {
        const q = parseInt(o.allocated[s.key]) || 0;
        if (q > 0) allocItemMap[s.name] = (allocItemMap[s.name] || 0) + q;
      });
    }
    if (String(o.status || "").indexOf("มัดจำแล้ว") >= 0) paidCount++;
    else pendingCount++;
    const p2 = String(o.phase2Status || "");
    if (p2.indexOf("ชำระยอดคงเหลือแล้ว") >= 0) phase2Paid = true;
    if (p2.indexOf("รอคืนเงิน") >= 0) phase2Refund = true;
  });

  const aggItems      = Object.keys(itemMap).map(name => ({ name: name, qty: itemMap[name] }));
  const aggAllocItems = Object.keys(allocItemMap).map(name => ({ name: name, qty: allocItemMap[name] }));
  const allPaid       = active.length > 0 && paidCount === active.length;

  return {
    found:         orders.length > 0,
    count:         orders.length,
    orders:        orders,
    workflowPhase: getWorkflowPhase(),
    phase2Deadline: getPhase2Deadline(),
    aggregated: {
      orderCount:     active.length,
      paidCount:      paidCount,
      pendingCount:   pendingCount,
      allPaid:        allPaid,
      totalQty:       aggQty,
      total:          aggTotal,
      deposit:        aggDeposit,
      remaining:      aggRemaining,
      items:          aggItems,
      // Phase 2 aggregate
      finalAmount:    aggFinal,
      phase2Due:      aggPhase2Due,
      phase2Paid:     phase2Paid,
      phase2Refund:   phase2Refund,
      allocatedItems: aggAllocItems
    }
  };
}

// =============================================
//  Quantity / cart helpers
// =============================================
function readQtyMap(body) {
  const items = body && body.items ? body.items : {};
  const qtyArr = SKUS.map(s => Math.max(0, parseInt(items[s.key]) || 0));
  const totalQty = qtyArr.reduce((a, b) => a + b, 0);
  const subtotal = SKUS.reduce((sum, s, i) => sum + qtyArr[i] * s.price, 0);
  return { qtyArr, totalQty, subtotal };
}

function findDuplicateTransRef(sheet, transRef) {
  if (!transRef) return -1;
  const tr = String(transRef).trim();
  if (!tr) return -1;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const existing = String(data[i][COL_TRANSREF - 1] || "").trim();
    if (existing && existing === tr) return i + 1;
  }
  return -1;
}

// Count active booster boxes ordered by a phone (skip cancelled/refunded rows)
function countBoosterForPhone(sheet, normPhone) {
  const boosterIdx = SKUS.findIndex(s => s.key === BOOSTER_KEY);
  if (boosterIdx < 0) return 0;
  const col  = COL_QTY_START + boosterIdx;
  const data = sheet.getDataRange().getValues();
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;
    total += parseInt(row[col - 1]) || 0;
  }
  return total;
}

function isRecentDuplicate(sheet, normPhone) {
  const data = sheet.getDataRange().getValues();
  const now  = Date.now();
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    const rowPhone = normalizePhone(row[COL_PHONE - 1]);
    if (rowPhone !== normPhone) continue;
    const ts = row[COL_TIMESTAMP - 1];
    let t = NaN;
    if (ts instanceof Date) t = ts.getTime();
    else if (ts) { const d = new Date(ts); t = d.getTime(); }
    if (!isNaN(t) && (now - t) < DUP_WINDOW_MS) return true;
  }
  return false;
}

// =============================================
//  doPost — Submit order
// =============================================
function doPost(e) {
  const action = e && e.parameter && e.parameter.action;

  // Admin config update — separate auth path, no lock needed
  if (action === "admin_config") {
    try {
      if (!checkAdminAuth(e)) return jsonResponse({ success: false, error: "unauthorized" });
      const body = JSON.parse(e.postData.contents);
      const cfg = saveAdminConfig(body);
      return jsonResponse({ success: true, config: cfg });
    } catch (err) {
      return jsonResponse({ success: false, error: String(err) });
    }
  }

  // Phase 2 workflow — admin: set_phase + commit_allocation
  if (action === "set_phase") {
    try {
      if (!checkAdminAuth(e)) return jsonResponse({ success: false, error: "unauthorized" });
      const body = JSON.parse(e.postData.contents);
      return jsonResponse(adminSetPhase(body));
    } catch (err) {
      return jsonResponse({ success: false, error: String(err) });
    }
  }
  if (action === "commit_allocation") {
    try {
      if (!checkAdminAuth(e)) return jsonResponse({ success: false, error: "unauthorized" });
      const body = JSON.parse(e.postData.contents);
      return jsonResponse(adminCommitAllocation(body));
    } catch (err) {
      return jsonResponse({ success: false, error: String(err) });
    }
  }
  if (action === "admin_row_action") {
    try {
      if (!checkAdminAuth(e)) return jsonResponse({ success: false, error: "unauthorized" });
      const body = JSON.parse(e.postData.contents);
      return jsonResponse(adminRowAction(body));
    } catch (err) {
      return jsonResponse({ success: false, error: String(err) });
    }
  }

  // Phase 2 — customer-facing remaining-payment slip submission
  if (action === "submit_phase2_payment") {
    try {
      const body = JSON.parse(e.postData.contents);
      return jsonResponse(submitPhase2Payment(body));
    } catch (err) {
      return jsonResponse({ success: false, error: String(err) });
    }
  }

  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) {
    return jsonResponse({ success: false, error: "busy_try_again" });
  }

  try {
    const currentPhase = getWorkflowPhase();
    const extraOpen    = isExtraStockOpen();
    const body         = JSON.parse(e.postData.contents);
    // Round 2 = explicit full-payment when extra_stock_open. R1 = original collecting flow.
    const isR2 = body.payment_mode === "full" && extraOpen;

    if (!isR2 && currentPhase !== PHASE_COLLECTING) {
      return jsonResponse({ success: false, error: "preorder_closed", phase: currentPhase });
    }
    if (isR2 && !extraOpen) {
      return jsonResponse({ success: false, error: "extra_stock_closed" });
    }

    if (!body.customerName || !body.phone) {
      return jsonResponse({ success: false, error: "missing_fields" });
    }

    const shipping = String(body.shipping || "").toLowerCase();
    if (shipping !== "pickup" && shipping !== "ship") {
      return jsonResponse({ success: false, error: "invalid_shipping" });
    }
    const address = String(body.address || "").trim();
    if (shipping === "ship" && address.length < 10) {
      return jsonResponse({ success: false, error: "address_required" });
    }

    const { qtyArr, totalQty, subtotal } = readQtyMap(body);
    if (totalQty <= 0) {
      return jsonResponse({ success: false, error: "empty_cart" });
    }

    const shipFee   = shipping === "ship" ? SHIPPING_FEE : 0;
    const total     = subtotal + shipFee;
    // R1: 50% มัดจำสินค้า (ค่าส่งเก็บทีหลัง). R2: จ่ายเต็มจำนวนทันที — ไม่มี Phase 2.
    const deposit   = isR2 ? total : Math.round(subtotal * DEPOSIT_RATE);
    const remaining = isR2 ? 0     : (total - deposit);

    if (!body.slipBase64) {
      return jsonResponse({ success: false, error: "missing_slip" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ success: false, error: "sheet_not_found" });
    ensureHeaders(sheet);

    const normPhone = normalizePhone(body.phone);
    if (isRecentDuplicate(sheet, normPhone)) {
      return jsonResponse({
        success: false,
        error:   "duplicate_recent",
        message: "พบการสั่งซื้อจากเบอร์นี้เมื่อสักครู่ — รอสักครู่แล้วลองใหม่"
      });
    }

    // Booster Box per-person limit (1 case = BOOSTER_LIMIT boxes)
    const boosterIdx       = SKUS.findIndex(s => s.key === BOOSTER_KEY);
    const requestedBooster = boosterIdx >= 0 ? qtyArr[boosterIdx] : 0;
    if (requestedBooster > 0) {
      const existingBooster = countBoosterForPhone(sheet, normPhone);
      if (existingBooster + requestedBooster > BOOSTER_LIMIT) {
        return jsonResponse({
          success:   false,
          error:     "booster_limit_exceeded",
          existing:  existingBooster,
          requested: requestedBooster,
          limit:     BOOSTER_LIMIT,
          message:   `Booster Box จำกัด ${BOOSTER_LIMIT} กล่อง/ท่าน (1 case) · ของท่านมีอยู่แล้ว ${existingBooster} กล่อง`
        });
      }
    }

    // Per-SKU caps + kill-switches — count ACTIVE rows (not just paid) so
    // pending/รอตรวจ submits also reserve the slot. Closes the race window
    // where 5 customers transfer for the last slot but only 1 gets confirmed.
    // R1 uses sku_caps_json + sku_closed_json. R2 uses sku_extra_caps_json
    // (kill-switch = cap===0 or absent).
    const skuCaps      = isR2 ? getSkuExtraCaps() : getSkuCaps();
    const skuClosed    = isR2 ? {} : getSkuClosed();
    const activeTotals = countActiveSkuTotals(sheet, isR2 ? "R2" : null);
    for (let s = 0; s < SKUS.length; s++) {
      const req = qtyArr[s];
      if (req <= 0) continue;
      const key = SKUS[s].key;
      const name = SKUS[s].name;

      if (skuClosed[key] === true) {
        return jsonResponse({
          success: false,
          error:   "sku_sold_out",
          skuKey:  key,
          skuName: name,
          message: `${name} ปิดรับพรีออเดอร์รอบนี้แล้ว — สินค้าอื่นยังสั่งได้ปกติ`
        });
      }

      const cap = (typeof skuCaps[key] === "number" && skuCaps[key] > 0) ? skuCaps[key] : null;
      // R2: missing cap = not for sale this round.
      if (cap === null) {
        if (isR2) {
          return jsonResponse({
            success: false,
            error:   "sku_not_in_r2",
            skuKey:  key,
            skuName: name,
            message: `${name} ไม่ได้เปิดขายใน Round 2 รอบนี้`
          });
        }
        continue;
      }

      const active = activeTotals[key] || 0;
      if (active + req > cap) {
        const left = Math.max(0, cap - active);
        return jsonResponse({
          success:   false,
          error:     "sku_sold_out",
          skuKey:    key,
          skuName:   name,
          active:    active,
          requested: req,
          cap:       cap,
          remaining: left,
          message:   left > 0
            ? `${name} เหลือเพียง ${left} ชิ้น — กรุณาลดจำนวนแล้วลองใหม่`
            : `${name} ${isR2 ? "Round 2 หมดแล้ว" : "ปิดรับพรีออเดอร์รอบนี้แล้ว"} — สินค้าอื่นยังสั่งได้ปกติ`
        });
      }
    }

    // Save slip
    const slipUrl = saveImageToDrive(body.slipBase64, body.phone, "slip");

    // SlipOK
    let status         = "⏳ รอตรวจสอบสลิป";
    let transRef       = "";
    let senderName     = "";
    let senderMismatch = false;
    let verifiedAmount = null;

    if (slipUrl) {
      const verified = verifySlip(slipUrl);
      if (verified && verified.success) {
        const amt = parseFloat(verified.data.amount);
        transRef  = verified.data.transRef || "";

        if (transRef) {
          const dupRow = findDuplicateTransRef(sheet, transRef);
          if (dupRow > 0) {
            return jsonResponse({
              success:  false,
              error:    "duplicate_slip",
              message:  `สลิปนี้เคยถูกใช้แล้ว (อ้างอิงแถว ${dupRow})`,
              transRef: transRef
            });
          }
        }

        const senderObj = verified.data.sender || {};
        senderName = String(senderObj.displayName || senderObj.name || "").trim();
        if (senderName) {
          senderMismatch = isSenderMismatch(senderName, body.customerName);
        }

        if (Math.abs(amt - deposit) < 1) {
          status         = isR2 ? "✅ ชำระเต็มแล้ว (R2)" : "✅ มัดจำแล้ว";
          verifiedAmount = amt;
        } else {
          status = `⚠️ ยอดไม่ตรง (${amt}/${deposit})`;
        }

        if (senderMismatch) status += ` ⚠️ sender:${senderName}`;
      }
    }

    // Build row — pad Phase 2 columns (W..AB) blank for R2 rows so AC lands in the right column
    const row = [
      new Date(),                  // A timestamp
      body.customerName,           // B name
      "'" + body.phone,            // C phone (text-cast)
      shipping === "ship" ? "จัดส่ง" : "รับที่ร้าน",  // D
      shipping === "ship" ? address : "",             // E
      ...qtyArr,                                       // F..L SKU qty
      subtotal,                                        // M
      shipFee,                                         // N
      total,                                           // O total full
      deposit,                                         // P deposit (R1=50%, R2=full)
      remaining,                                       // Q remaining (R2=0)
      slipUrl,                                         // R
      transRef,                                        // S
      senderName,                                      // T
      status,                                          // U
      SCRIPT_VERSION,                                  // V
      "",                                              // W Allocated JSON
      "",                                              // X final amount
      "",                                              // Y phase2 due
      "",                                              // Z phase2 slip
      "",                                              // AA phase2 ref
      "",                                              // AB phase2 status
      isR2 ? "R2" : "R1"                               // AC order round
    ];
    sheet.appendRow(row);
    SpreadsheetApp.flush();

    // Telegram
    const itemLines = SKUS
      .map((s, i) => qtyArr[i] > 0 ? `   • ${s.name} × ${qtyArr[i]}` : "")
      .filter(Boolean)
      .join("\n");
    const shipLine = shipping === "ship"
      ? `🚚 จัดส่ง (+${SHIPPING_FEE} บาท)\n📍 ${address}`
      : `🏬 รับที่ร้าน`;
    const senderLine = senderMismatch ? `⚠️ Sender ไม่ตรง: ${senderName}\n` : "";

    const headerEmoji = isR2 ? "🆕" : "🌿";
    const headerLabel = isR2 ? "Lorcana Set 13 — Round 2 ออเดอร์ใหม่ (จ่ายเต็ม)!" : "Lorcana Set 13 — ออเดอร์ใหม่!";
    const moneyLine = isR2
      ? `💰 จ่ายเต็มจำนวน ${total.toLocaleString()} บาท (Round 2 — ไม่มี Phase 2)\n`
      : `💰 ยอดเต็ม ${total.toLocaleString()} บาท\n💵 มัดจำ 50% สินค้า = ${deposit.toLocaleString()} บาท (คงเหลือ + ค่าส่ง ${remaining.toLocaleString()})\n`;
    sendTelegram(
      `${headerEmoji} *${headerLabel}*\n\n` +
      `👤 ${body.customerName}\n` +
      `📱 ${body.phone}\n` +
      `${shipLine}\n` +
      `🛒 รายการ (${totalQty} ชิ้น):\n${itemLines}\n` +
      moneyLine +
      `📊 ${status}\n` +
      senderLine +
      (slipUrl ? `🧾 [Slip](${slipUrl})` : "")
    );

    return jsonResponse({
      success:    true,
      status:     status,
      slipUrl:    slipUrl,
      verified:   status.indexOf("✅") === 0,
      total:      total,
      deposit:    deposit,
      remaining:  remaining,
      subtotal:   subtotal,
      shipFee:    shipFee,
      itemCount:  totalQty,
      orderRound: isR2 ? "R2" : "R1"
    });
  } catch (err) {
    console.error("doPost error:", err);
    return jsonResponse({ success: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// =============================================
//  Headers
// =============================================
function ensureHeaders(sheet) {
  const headers = [
    "Timestamp",
    "ชื่อ - นามสกุล",
    "เบอร์ติดต่อ",
    "วิธีรับสินค้า",
    "ที่อยู่จัดส่ง"
  ];
  SKUS.forEach(s => headers.push(s.name));
  headers.push("ยอดสินค้า", "ค่าส่ง", "ยอดรวม", "มัดจำ 50%", "คงเหลือ", "สลิป URL", "Slip TransRef", "ชื่อผู้โอน", "สถานะ", "Version");
  // Phase 2 (post-allocation) columns
  headers.push("Allocated JSON", "ยอดสุทธิหลังจัดสรร", "ยอด Phase2 ต้องโอน", "Slip Phase 2 URL", "Phase2 TransRef", "สถานะ Phase 2");
  // Round tag — R1 (default 50% deposit) or R2 (full-payment extra-stock round)
  headers.push("Order Round");

  for (let c = 0; c < headers.length; c++) {
    const cell = sheet.getRange(1, c + 1);
    if (!cell.getValue()) cell.setValue(headers[c]);
  }
  // Optional: bold + freeze row 1 once
  try {
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1);
  } catch (e) {}
}

// =============================================
//  Drive — save base64 image
// =============================================
function saveImageToDrive(base64Str, phone, prefix) {
  try {
    const match = base64Str.match(/^data:(.+);base64,(.+)$/);
    if (!match) return "";
    const mimeType = match[1];
    const bytes    = Utilities.base64Decode(match[2]);
    const ext = mimeType.includes("png") ? "png"
            : ((mimeType.includes("jpeg") || mimeType.includes("jpg")) ? "jpg" : "img");
    const blob = Utilities.newBlob(bytes, mimeType, `${prefix}_${normalizePhone(phone)}_${Date.now()}.${ext}`);
    const folder = DriveApp.getFolderById(SLIP_FOLDER_ID);
    const file   = folder.createFile(blob);
    return file.getUrl();
  } catch (err) {
    console.error("saveImageToDrive error:", err);
    return "";
  }
}

// =============================================
//  SlipOK
// =============================================
function verifySlip(fileUrl) {
  try {
    const fileId = extractFileId(fileUrl);
    if (!fileId) return null;
    const blob = DriveApp.getFileById(fileId).getBlob();
    const res  = UrlFetchApp.fetch(
      `https://api.slipok.com/api/line/apikey/${BRANCH_ID}`,
      {
        method:  "post",
        headers: { "x-authorization": SLIPOK_API_KEY, "Content-Type": "application/json" },
        payload: JSON.stringify({ files: Utilities.base64Encode(blob.getBytes()), log: true }),
        muteHttpExceptions: true
      }
    );
    const result = JSON.parse(res.getContentText());
    if (result.success) return { success: true, data: result.data };
    return null;
  } catch (e) {
    console.error("SlipOK Error:", e);
    return null;
  }
}

function extractFileId(url) {
  if (!url) return null;
  if (url.includes("?id=")) return url.split("?id=")[1].split("&")[0];
  const m = url.match(/[-\w]{25,}/);
  return m ? m[0] : null;
}

// =============================================
//  Telegram
// =============================================
function sendTelegram(text) {
  try {
    UrlFetchApp.fetch(`${TELEGRAM_URL}/sendMessage`, {
      method:      "POST",
      contentType: "application/json",
      payload:     JSON.stringify({
        chat_id:                  CHAT_ID,
        text,
        parse_mode:               "Markdown",
        disable_web_page_preview: true
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error("Telegram Error:", e);
  }
}

// =============================================
//  Shipping list — aggregated per customer (for CSV export)
// =============================================
function getShippingList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: "sheet_not_found" };

  const data = sheet.getDataRange().getValues();

  // phone -> aggregated customer record
  const byPhone = {};

  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    const name   = String(row[COL_NAME - 1] || "").trim();
    if (!name) continue;

    const status = String(row[COL_STATUS - 1] || "");
    // Skip cancelled / refunded / over-quota
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;

    // R2 (extra-stock) rows already paid full — don't include in allocation pool
    const round = String(row[COL_ORDER_ROUND - 1] || "R1");
    if ((round || "R1") === "R2") continue;

    const phone     = normalizePhone(row[COL_PHONE - 1]);
    if (!phone) continue;

    const shipping  = String(row[COL_SHIPPING - 1] || "");
    const address   = String(row[COL_ADDRESS - 1] || "").trim();
    const total     = parseFloat(row[COL_TOTAL - 1])     || 0;
    const deposit   = parseFloat(row[COL_DEPOSIT - 1])   || 0;
    const remaining = parseFloat(row[COL_REMAINING - 1]) || 0;
    const ts        = row[COL_TIMESTAMP - 1];

    if (!byPhone[phone]) {
      byPhone[phone] = {
        phone:        phone,
        name:         name,
        shippingMethod: shipping,
        address:      shipping.indexOf("จัดส่ง") >= 0 ? address : "",
        items:        {},                  // sku.key -> qty
        total:        0,
        deposit:      0,
        remaining:    0,
        orderCount:   0,
        paidCount:    0,
        statuses:     [],
        firstOrderAt: ts,
        lastOrderAt:  ts
      };
    }
    const rec = byPhone[phone];

    // Prefer "จัดส่ง" + address over "รับที่ร้าน" if any row chose to ship
    if (shipping.indexOf("จัดส่ง") >= 0) {
      rec.shippingMethod = shipping;
      if (address) rec.address = address;
    }

    for (let s = 0; s < SKUS.length; s++) {
      const q = parseInt(row[COL_QTY_START - 1 + s]) || 0;
      if (q > 0) rec.items[SKUS[s].key] = (rec.items[SKUS[s].key] || 0) + q;
    }

    rec.total       += total;
    rec.deposit     += deposit;
    rec.remaining   += remaining;
    rec.orderCount  += 1;
    if (status.indexOf("มัดจำแล้ว") >= 0) rec.paidCount += 1;
    rec.statuses.push(status);

    const tsMs = ts instanceof Date ? ts.getTime() : new Date(ts).getTime();
    const firstMs = rec.firstOrderAt instanceof Date ? rec.firstOrderAt.getTime() : new Date(rec.firstOrderAt).getTime();
    const lastMs  = rec.lastOrderAt  instanceof Date ? rec.lastOrderAt.getTime()  : new Date(rec.lastOrderAt).getTime();
    if (!isNaN(tsMs)) {
      if (tsMs < firstMs) rec.firstOrderAt = ts;
      if (tsMs > lastMs)  rec.lastOrderAt  = ts;
    }
  }

  // Flatten + add SKU columns
  const customers = Object.keys(byPhone).map(p => {
    const rec = byPhone[p];
    const itemList = SKUS
      .filter(s => (rec.items[s.key] || 0) > 0)
      .map(s => ({ key: s.key, name: s.name, qty: rec.items[s.key] }));
    const totalQty = itemList.reduce((sum, it) => sum + it.qty, 0);
    return {
      phone:          rec.phone,
      name:           rec.name,
      shippingMethod: rec.shippingMethod,
      address:        rec.address,
      items:          itemList,
      itemsByKey:     rec.items,    // raw object for CSV column mapping
      totalQty:       totalQty,
      total:          rec.total,
      deposit:        rec.deposit,
      remaining:      rec.remaining,
      orderCount:     rec.orderCount,
      paidCount:      rec.paidCount,
      allPaid:        rec.paidCount === rec.orderCount,
      statuses:       rec.statuses,
      firstOrderAt:   rec.firstOrderAt instanceof Date ? rec.firstOrderAt.toISOString() : String(rec.firstOrderAt),
      lastOrderAt:    rec.lastOrderAt  instanceof Date ? rec.lastOrderAt.toISOString()  : String(rec.lastOrderAt)
    };
  });

  customers.sort((a, b) => b.total - a.total);

  return {
    updatedAt:    new Date().toISOString(),
    customerCount: customers.length,
    skus:         SKUS.map(s => ({ key: s.key, name: s.name, price: s.price })),
    customers:    customers
  };
}

// =============================================
//  Dashboard — aggregated SKU/order/revenue stats
// =============================================
const DASHBOARD_TAB = "Dashboard";

// Pure computation — returns dashboard data object (no side effects)
function computeDashboardData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();

  const skuTotals = SKUS.map(() => ({ qty: 0, revenue: 0 }));
  let totalOrders = 0, paid = 0, pending = 0, unpaid = 0, refunded = 0;
  let depositRevenue = 0, fullRevenue = 0;
  let mismatchCount = 0;
  // Phase 2 aggregates — only meaningful once allocation has been committed
  const phonePhase2 = {};   // phone -> { due, status }
  let phase2DueTotal = 0, phase2ReceivedTotal = 0;
  let phase2Paid = 0, phase2Pending = 0, phase2Refund = 0, phase2Mismatch = 0;

  const phoneSet = {};                  // unique customers
  const customerAgg = {};               // phone -> { name, qty, total }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[COL_NAME - 1]) continue;

    const status      = String(row[COL_STATUS - 1] || "");
    const orderTotal  = parseFloat(row[COL_TOTAL - 1])   || 0;
    const orderDep    = parseFloat(row[COL_DEPOSIT - 1]) || 0;
    const phone       = normalizePhone(row[COL_PHONE - 1]);
    const name        = String(row[COL_NAME - 1] || "");

    totalOrders++;

    const isRefunded = /คืนเงิน|ยกเลิก|เกินโควต้า/.test(status);
    if (isRefunded) {
      refunded++;
      continue;  // exclude from SKU + revenue counts
    }

    if (phone) phoneSet[phone] = true;

    if (status.indexOf("มัดจำแล้ว") >= 0) {
      paid++;
      depositRevenue += orderDep;
      fullRevenue    += orderTotal;
    } else if (status.indexOf("ยอดไม่ตรง") >= 0) {
      mismatchCount++;
      unpaid++;
    } else if (status.indexOf("รอตรวจ") >= 0) {
      pending++;
    } else {
      unpaid++;
    }

    let rowQty = 0;
    for (let s = 0; s < SKUS.length; s++) {
      const q = parseInt(row[COL_QTY_START - 1 + s]) || 0;
      if (q > 0) {
        skuTotals[s].qty     += q;
        skuTotals[s].revenue += q * SKUS[s].price;
        rowQty += q;
      }
    }

    if (phone) {
      if (!customerAgg[phone]) {
        customerAgg[phone] = { name: name, phone: phone, qty: 0, total: 0 };
      }
      customerAgg[phone].qty   += rowQty;
      customerAgg[phone].total += orderTotal;

      // Phase-2 per-row roll-up keyed by phone
      const due = parseFloat(row[COL_PHASE2_DUE - 1]) || 0;
      const p2  = String(row[COL_PHASE2_STATUS - 1] || "");
      if (!phonePhase2[phone]) phonePhase2[phone] = { due: 0, status: "" };
      phonePhase2[phone].due += due;
      if (p2 && !phonePhase2[phone].status) phonePhase2[phone].status = p2;
    }
  }

  const customers = Object.keys(customerAgg).map(p => customerAgg[p]);
  customers.sort((a, b) => b.total - a.total);

  // Roll up phase-2 per-phone summary
  Object.keys(phonePhase2).forEach(ph => {
    const r = phonePhase2[ph];
    const isPaid     = r.status.indexOf("ชำระยอดคงเหลือแล้ว") >= 0;
    const isPending  = r.status.indexOf("รอตรวจสลิป Phase 2") >= 0;
    const isMismatch = r.status.indexOf("ยอดไม่ตรง Phase2") >= 0;
    const isRefund   = r.status.indexOf("รอคืนเงิน") >= 0;
    if (isPaid) {
      phase2Paid++;
      phase2ReceivedTotal += Math.max(0, r.due);
    } else if (isRefund) {
      phase2Refund++;
    } else if (isPending || isMismatch) {
      phase2Pending++;
      if (isMismatch) phase2Mismatch++;
      phase2DueTotal += Math.max(0, r.due);
    } else if (r.due > 0) {
      phase2Pending++;
      phase2DueTotal += r.due;
    }
  });

  return {
    updatedAt:    new Date().toISOString(),
    totalOrders:  totalOrders,
    uniqueCustomers: Object.keys(phoneSet).length,
    paid:         paid,
    pending:      pending,
    unpaid:       unpaid,
    refunded:     refunded,
    mismatch:     mismatchCount,
    depositRevenue: depositRevenue,
    fullRevenue:  fullRevenue,
    skus:         SKUS.map((s, i) => ({
      key:     s.key,
      name:    s.name,
      price:   s.price,
      qty:     skuTotals[i].qty,
      revenue: skuTotals[i].revenue
    })),
    topCustomers: customers.slice(0, 10),
    workflowPhase:       getWorkflowPhase(),
    phase2:              {
      paid:          phase2Paid,
      pending:       phase2Pending,
      refund:        phase2Refund,
      mismatch:      phase2Mismatch,
      dueTotal:      phase2DueTotal,
      receivedTotal: phase2ReceivedTotal
    }
  };
}

// Returns JSON for ?action=dashboard
function getDashboardSummary() {
  const d = computeDashboardData();
  if (!d) return { error: "sheet_not_found" };
  return d;
}

// Writes/refreshes the "Dashboard" tab in the sheet
function updateDashboardTab() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(DASHBOARD_TAB);
  if (!sheet) sheet = ss.insertSheet(DASHBOARD_TAB);

  sheet.clear();
  const d = computeDashboardData();
  if (!d) { sheet.getRange(1, 1).setValue("❌ ไม่พบ sheet ข้อมูล"); return; }

  const tz       = ss.getSpreadsheetTimeZone() || "Asia/Bangkok";
  const updated  = Utilities.formatDate(new Date(d.updatedAt), tz, "yyyy-MM-dd HH:mm");
  const activeOrders = d.totalOrders - d.refunded;

  const rows = [];
  rows.push(["🌿 Lorcana Set 13 — Dashboard"]);
  rows.push(["อัพเดทล่าสุด: " + updated]);
  rows.push([""]);
  rows.push(["═══ สรุปออเดอร์ ═══"]);
  rows.push(["ออเดอร์ทั้งหมด",       d.totalOrders]);
  rows.push(["ลูกค้าไม่ซ้ำ (เบอร์)",  d.uniqueCustomers]);
  rows.push(["✅ มัดจำแล้ว",         d.paid]);
  rows.push(["⏳ รอตรวจ",            d.pending]);
  rows.push(["❌ รอชำระ / ผิดพลาด",   d.unpaid]);
  rows.push(["⚠️ ยอดไม่ตรง (ในนั้น)", d.mismatch]);
  rows.push(["🔄 คืนเงิน / ยกเลิก",   d.refunded]);
  rows.push([""]);
  rows.push(["═══ ยอดเงิน ═══"]);
  rows.push(["💵 มัดจำที่ verified",  d.depositRevenue]);
  rows.push(["💰 ยอดเต็มถ้าครบ",      d.fullRevenue]);
  rows.push([""]);
  rows.push(["═══ ยอดสินค้า (active orders) ═══"]);
  rows.push(["SKU", "จำนวน", "ราคา/ชิ้น", "ยอดรวม"]);
  d.skus.forEach(s => {
    rows.push([s.name, s.qty, s.price, s.revenue]);
  });
  rows.push([""]);
  rows.push(["═══ Top ลูกค้า (ตามยอดเต็ม) ═══"]);
  rows.push(["#", "ชื่อ", "เบอร์", "จำนวนชิ้น", "ยอดเต็ม"]);
  d.topCustomers.forEach((c, i) => {
    rows.push([i + 1, c.name, c.phone, c.qty, c.total]);
  });

  // Write all rows in one batch (faster than per-cell)
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 1);
  const padded  = rows.map(r => {
    const copy = r.slice();
    while (copy.length < maxCols) copy.push("");
    return copy;
  });
  sheet.getRange(1, 1, padded.length, maxCols).setValues(padded);

  // Simple formatting
  try {
    sheet.getRange(1, 1).setFontSize(16).setFontWeight("bold");
    sheet.getRange(2, 1).setFontStyle("italic").setFontColor("#666");

    // Bold the section headers (lines that start with ═══)
    for (let r = 0; r < padded.length; r++) {
      if (String(padded[r][0]).indexOf("═══") === 0) {
        sheet.getRange(r + 1, 1, 1, maxCols).setFontWeight("bold").setBackground("#1F2E4A").setFontColor("#F5C542");
      }
    }
    sheet.autoResizeColumns(1, maxCols);
  } catch (e) {}
}

// Manual menu wrapper
function refreshDashboardNow() {
  updateDashboardTab();
  SpreadsheetApp.getUi().alert("🔄 อัพเดท Dashboard tab เรียบร้อย");
}

// =============================================
//  Daily Telegram summary
// =============================================
function buildSummaryText(d) {
  const tz       = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || "Asia/Bangkok";
  const updated  = Utilities.formatDate(new Date(d.updatedAt), tz, "dd/MM HH:mm");

  let txt = `🌿 *Lorcana Set 13 — สรุปยอดพรีออเดอร์*\n`;
  txt += `_อัพเดท ${updated}_\n\n`;
  txt += `📋 ออเดอร์: *${d.totalOrders}* (ลูกค้าไม่ซ้ำ ${d.uniqueCustomers})\n`;
  txt += `✅ มัดจำ ${d.paid}  ⏳ รอตรวจ ${d.pending}  ❌ รอชำระ ${d.unpaid}\n`;
  txt += `🔄 คืนเงิน/ยกเลิก ${d.refunded}\n\n`;
  txt += `💵 มัดจำ verified: *${d.depositRevenue.toLocaleString()}* บาท\n`;
  txt += `💰 ยอดเต็มถ้าครบ: *${d.fullRevenue.toLocaleString()}* บาท\n\n`;
  txt += `🛒 *ยอดสินค้า:*\n`;
  d.skus.forEach(s => {
    if (s.qty > 0) {
      txt += `• ${s.name}: *${s.qty}*  (${s.revenue.toLocaleString()} บาท)\n`;
    }
  });

  const closeMs = new Date(CLOSE_AT_ISO).getTime() - Date.now();
  if (closeMs > 0) {
    const days  = Math.floor(closeMs / 86400000);
    const hours = Math.floor((closeMs % 86400000) / 3600000);
    txt += `\n⏰ ปิดรับใน ${days} วัน ${hours} ชม.`;
  } else {
    txt += `\n⏰ ปิดรับแล้ว`;
  }
  return txt;
}

function sendDailySummary() {
  const d = computeDashboardData();
  if (!d) {
    sendTelegram("❌ Daily summary failed: sheet not found");
    return;
  }
  sendTelegram(buildSummaryText(d));
  // Refresh dashboard tab at the same time
  try { updateDashboardTab(); } catch (e) {}
}

// Manual menu wrapper — "ส่ง summary ตอนนี้"
function sendSummaryNow() {
  sendDailySummary();
  SpreadsheetApp.getUi().alert("📤 ส่ง summary ไป Telegram เรียบร้อย");
}

// Run ONCE to install the 9:00 AM trigger
function setupDailyTrigger() {
  // Clean up any existing daily summary triggers
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "sendDailySummary") {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger("sendDailySummary")
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone("Asia/Bangkok")
    .create();
  SpreadsheetApp.getUi().alert("✅ ตั้ง trigger ส่ง daily summary 9:00 น. แล้ว");
}

// =============================================
//  Phase 2 — auto-close trigger + manual menu items + CSV export
// =============================================

// Install one-shot trigger at CLOSE_AT_ISO that auto-flips to closed_awaiting_alloc
function setupCloseTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "autoClosePreorder") ScriptApp.deleteTrigger(t);
  });
  const at = new Date(CLOSE_AT_ISO);
  if (at.getTime() <= Date.now()) {
    SpreadsheetApp.getUi().alert("⚠️ CLOSE_AT_ISO อยู่ในอดีตแล้ว — ไม่ตั้ง trigger");
    return;
  }
  ScriptApp.newTrigger("autoClosePreorder").timeBased().at(at).create();
  SpreadsheetApp.getUi().alert("✅ ตั้ง trigger auto-close ที่ " + CLOSE_AT_ISO);
}
function autoClosePreorder() {
  // Idempotent — only flip if still in collecting
  if (getWorkflowPhase() !== PHASE_COLLECTING) return;
  setWorkflowPhase(PHASE_CLOSED_AWAITING_ALLOC);
  sendTelegram(
    "🔔 *Lorcana 13 — ปิดพรีออเดอร์อัตโนมัติแล้ว*\n" +
    "เวลา " + new Date().toISOString() + "\n" +
    "รอคอนเฟิร์มยอดจากตัวแทน → เปิด champ-hq บันทึก allocation"
  );
}

function manualClosePreorder() {
  const ui = SpreadsheetApp.getUi();
  const prev = getWorkflowPhase();
  if (prev !== PHASE_COLLECTING) {
    ui.alert("ปิดไปแล้ว (phase ปัจจุบัน: " + prev + ")");
    return;
  }
  const resp = ui.alert("ปิดพรีออเดอร์ตอนนี้?", "Phase จะเปลี่ยน collecting → closed_awaiting_alloc\nลูกค้าจะ submit ใหม่ไม่ได้", ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;
  setWorkflowPhase(PHASE_CLOSED_AWAITING_ALLOC);
  sendTelegram("🔒 *Lorcana 13 — ปิดพรีออเดอร์แล้ว (manual)*\nรอคอนเฟิร์มยอด → เปิด champ-hq บันทึก allocation");
  ui.alert("✅ ปิดแล้ว");
}

function showPhaseStatus() {
  const phase = getWorkflowPhase();
  const at    = getWorkflowPhaseAt();
  const dl    = getPhase2Deadline();
  SpreadsheetApp.getUi().alert(
    "📊 Workflow Phase",
    "ปัจจุบัน: " + phase + "\n" +
    "เปลี่ยนเมื่อ: " + (at || "-") + "\n" +
    "Phase 2 deadline: " + (dl || "-"),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// Build CSV for Phase 2 broadcast — Champ paste into LINE OA / FB mass message
function getPhase2BroadcastCsv() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return "error,sheet_not_found";
  const data = sheet.getDataRange().getValues();

  // Aggregate per phone (active only) — sum final, due; collect item names
  const byPhone = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[COL_NAME - 1]) continue;
    const ph = normalizePhone(row[COL_PHONE - 1]);
    if (!ph) continue;
    const status = String(row[COL_STATUS - 1] || "");
    if (/คืนเงิน|ยกเลิก|เกินโควต้า/.test(status)) continue;

    if (!byPhone[ph]) byPhone[ph] = {
      name:        String(row[COL_NAME - 1] || ""),
      phone:       ph,
      finalAmount: 0,
      depositPaid: 0,
      phase2Due:   0,
      items:       {},
      phase2Status:""
    };
    const rec = byPhone[ph];
    rec.finalAmount += parseFloat(row[COL_FINAL_AMOUNT - 1]) || 0;
    rec.phase2Due   += parseFloat(row[COL_PHASE2_DUE - 1])   || 0;
    if (status.indexOf("มัดจำแล้ว") >= 0) {
      rec.depositPaid += parseFloat(row[COL_DEPOSIT - 1]) || 0;
    }
    try {
      const raw = String(row[COL_ALLOC_JSON - 1] || "");
      if (raw) {
        const alloc = JSON.parse(raw);
        SKUS.forEach(s => {
          const q = parseInt(alloc[s.key]) || 0;
          if (q > 0) rec.items[s.name] = (rec.items[s.name] || 0) + q;
        });
      }
    } catch (e) {}
    const p2 = String(row[COL_PHASE2_STATUS - 1] || "");
    if (p2 && !rec.phase2Status) rec.phase2Status = p2;
  }

  const rows = Object.keys(byPhone).map(p => byPhone[p]);
  rows.sort((a, b) => b.phase2Due - a.phase2Due);

  function csvCell(v) {
    if (v == null) return "";
    const s = String(v);
    if (s.indexOf(",") >= 0 || s.indexOf('"') >= 0 || s.indexOf("\n") >= 0) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  const lines = [];
  lines.push(["phone", "name", "final_amount", "deposit_paid", "phase2_due", "allocated_items", "phase2_status"].map(csvCell).join(","));
  rows.forEach(r => {
    const itemsTxt = Object.keys(r.items).map(n => n + " × " + r.items[n]).join(" · ");
    lines.push([r.phone, r.name, r.finalAmount, r.depositPaid, r.phase2Due, itemsTxt, r.phase2Status].map(csvCell).join(","));
  });
  return "﻿" + lines.join("\n");
}

// =============================================
//  Admin Menu
// =============================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌿 Lorcana Set 13")
    .addItem("✅ ยืนยันชำระ (Admin)",       "adminForcePaid")
    .addItem("↩️ คืนเงิน (เลือกแถว)",        "adminRefund")
    .addItem("🔍 ตรวจสลิปค้าง (เลือกแถว)",   "retriggerVerification")
    .addItem("📊 สรุปออเดอร์ (popup)",       "showOrderSummary")
    .addSeparator()
    .addItem("🔄 อัพเดท Dashboard tab",      "refreshDashboardNow")
    .addItem("📤 ส่ง Summary ไป Telegram",   "sendSummaryNow")
    .addItem("⏰ ตั้ง trigger daily 9 โมง",   "setupDailyTrigger")
    .addSeparator()
    .addItem("🔐 ตั้ง Admin Token (ครั้งแรก)", "setupAdminToken")
    .addItem("📋 ดู Caps & Stock",          "showAdminConfig")
    .addSeparator()
    .addItem("📊 ดู Phase ปัจจุบัน",        "showPhaseStatus")
    .addItem("🔒 ปิดพรีก่อนเวลา (manual)",  "manualClosePreorder")
    .addItem("⏰ ตั้ง trigger ปิดอัตโนมัติ", "setupCloseTrigger")
    .addSeparator()
    .addItem("🔧 Ensure Headers",           "manualEnsureHeaders")
    .addItem("🧪 ทดสอบ SlipOK",             "testSlipOK")
    .addSeparator()
    .addItem("🛠️ Normalize manual rows",    "normalizeManualRows")
    .addToUi();
}

// Generate a random admin token and save to Script Properties.
// Run once, then copy the token into champ-hq env LORCANA_ADMIN_TOKEN.
function setupAdminToken() {
  const ui = SpreadsheetApp.getUi();
  const existing = getAdminToken();
  if (existing) {
    const resp = ui.alert(
      "Admin token มีอยู่แล้ว",
      "Token ปัจจุบัน:\n" + existing + "\n\nสร้างใหม่ทับ? (ของเก่าจะใช้ไม่ได้)",
      ui.ButtonSet.YES_NO
    );
    if (resp !== ui.Button.YES) return;
  }
  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  PropertiesService.getScriptProperties().setProperty("admin_token", token);
  ui.alert("✅ Admin Token", "Token ใหม่:\n\n" + token + "\n\nคัดลอกใส่ LORCANA_ADMIN_TOKEN ใน champ-hq env", ui.ButtonSet.OK);
}

function showAdminConfig() {
  const cfg = getAdminConfig();
  const lines = [];
  lines.push("Caps & Stock — Lorcana Set 13");
  lines.push("อัพเดท: " + cfg.updatedAt);
  lines.push("");
  cfg.skus.forEach(s => {
    const st = cfg.stock[s.key] || {};
    const capTxt = st.cap === null ? "∞" : st.cap;
    const closedTxt = st.forceClosed ? "  [ปิดรับ]" : "";
    const remTxt = st.remaining === null ? "" : ` · เหลือ ${st.remaining}`;
    lines.push(`• ${s.name}: ${st.active}/${capTxt}${remTxt}${closedTxt}`);
  });
  SpreadsheetApp.getUi().alert("📋 Caps & Stock", lines.join("\n"), SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Fix rows that were keyed in by hand so they match the auto-saved format:
 *   - Column C (phone): re-write with leading `'` so Sheets keeps it as text
 *     (numeric phones lose the leading 0 and look wrong in filters).
 *   - Column V (script_version): blank → "manual" so we can tell hand-entered
 *     rows apart from form submissions.
 * Skips header row and rows with no customer name. Safe to run repeatedly.
 */
function normalizeManualRows() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) { ui.alert("❌ ไม่พบ sheet Responses"); return; }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) { ui.alert("ไม่มีแถวข้อมูล"); return; }

  const range  = sheet.getRange(2, 1, lastRow - 1, COL_NOTES);
  const values = range.getValues();
  let phoneFixed = 0, versionFixed = 0;

  for (let i = 0; i < values.length; i++) {
    const row    = values[i];
    const rowNum = i + 2;
    if (!String(row[COL_NAME - 1] || "").trim()) continue;

    // Phone — force text-cast if stored as number or missing leading 0
    const phoneCell = sheet.getRange(rowNum, COL_PHONE);
    const phoneVal  = phoneCell.getValue();
    const phoneStr  = phoneCell.getDisplayValue();
    const isNumber  = typeof phoneVal === "number";
    const lostZero  = !isNumber && phoneStr && /^\d{9}$/.test(phoneStr);
    if (isNumber || lostZero) {
      const digits = String(phoneStr).replace(/[^\d]/g, "");
      const padded = digits.length === 9 ? "0" + digits : digits;
      phoneCell.setValue("'" + padded);
      phoneFixed++;
    }

    // Version — blank → "manual"
    if (!String(row[COL_NOTES - 1] || "").trim()) {
      sheet.getRange(rowNum, COL_NOTES).setValue("manual");
      versionFixed++;
    }
  }

  ui.alert(`✅ Normalized\n· phones: ${phoneFixed}\n· versions: ${versionFixed}`);
}

function manualEnsureHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) { SpreadsheetApp.getUi().alert("ไม่พบ sheet"); return; }
  ensureHeaders(sheet);
  SpreadsheetApp.getUi().alert("✅ ตั้ง headers แล้ว");
}

function adminForcePaid() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const adminPrompt = ui.prompt("📌 Admin", "ชื่อแอดมิน:", ui.ButtonSet.OK_CANCEL);
  if (adminPrompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = adminPrompt.getResponseText().trim();
  if (!adminName) return;
  if (ui.alert("ยืนยัน", `Admin: ${adminName}`, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const name    = String(sheet.getRange(row, COL_NAME).getValue());
  const phone   = String(sheet.getRange(row, COL_PHONE).getValue());
  const deposit = parseFloat(sheet.getRange(row, COL_DEPOSIT).getValue()) || 0;
  const total   = parseFloat(sheet.getRange(row, COL_TOTAL).getValue()) || 0;

  sheet.getRange(row, COL_STATUS).setValue("✅ มัดจำแล้ว");
  sendTelegram(`✅ *ADMIN OVERRIDE — Lorcana 13*\n👤 ${name}\n📱 ${phone}\n💵 มัดจำ ${deposit.toLocaleString()} / เต็ม ${total.toLocaleString()}\n✍️ ${adminName}`);
  ui.alert(`🎉 ${name} → ✅ มัดจำแล้ว`);
}

function adminRefund() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const name  = String(sheet.getRange(row, COL_NAME).getValue() || "");
  const phone = String(sheet.getRange(row, COL_PHONE).getValue() || "");
  const total = parseFloat(sheet.getRange(row, COL_TOTAL).getValue()) || 0;
  if (!name) { ui.alert("⚠️ row นี้ไม่มีข้อมูลลูกค้า"); return; }

  const adminPrompt = ui.prompt("📌 Admin", "ชื่อแอดมิน:", ui.ButtonSet.OK_CANCEL);
  if (adminPrompt.getSelectedButton() !== ui.Button.OK) return;
  const adminName = adminPrompt.getResponseText().trim();
  if (!adminName) return;

  const reasonPrompt = ui.prompt("เหตุผลที่คืนเงิน", "เช่น: ลูกค้ายกเลิก / ยอดไม่ตรง", ui.ButtonSet.OK_CANCEL);
  if (reasonPrompt.getSelectedButton() !== ui.Button.OK) return;
  const reason = reasonPrompt.getResponseText().trim() || "ไม่ระบุ";

  const confirm = ui.alert(
    "ยืนยันคืนเงิน",
    `ลูกค้า: ${name}\nเบอร์: ${phone}\n💰 ${total.toLocaleString()} บาท\nAdmin: ${adminName}\nเหตุผล: ${reason}\n\n⚠️ โอนเงินคืนผ่าน KShop ก่อนแล้วค่อยกด YES`,
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  sheet.getRange(row, COL_STATUS).setValue(`🔄 คืนเงิน · ${adminName} · ${reason}`);
  sendTelegram(
    `🔄 *Lorcana 13 — คืนเงิน*\n\n👤 ${name}\n📱 ${phone}\n💰 ${total.toLocaleString()} บาท\n❌ ${reason}\n✍️ ${adminName}`
  );
  ui.alert(`🔄 บันทึกคืนเงินแล้ว`);
}

function retriggerVerification() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) { ui.alert("⚠️ คลิกแถวลูกค้าก่อน"); return; }

  const slipUrl = sheet.getRange(row, COL_SLIP).getValue();
  if (!slipUrl) { ui.alert("❌ ไม่มีลิงก์สลิป"); return; }

  const verified = verifySlip(slipUrl);
  const deposit  = parseFloat(sheet.getRange(row, COL_DEPOSIT).getValue()) || 0;

  if (verified && verified.success) {
    const amt = parseFloat(verified.data.amount);
    if (Math.abs(amt - deposit) < 1) {
      sheet.getRange(row, COL_STATUS).setValue("✅ มัดจำแล้ว");
      ui.alert(`✅ ผ่าน ยอด ${amt}`);
    } else {
      sheet.getRange(row, COL_STATUS).setValue(`⚠️ ยอดไม่ตรง (${amt}/${deposit})`);
      ui.alert(`⚠️ ยอดไม่ตรง (${amt}/${deposit})`);
    }
  } else {
    ui.alert("❌ SlipOK ไม่ผ่าน");
  }
}

function showOrderSummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let totalOrders = 0, depositRevenue = 0, fullRevenue = 0;
  let paid = 0, pending = 0, unpaid = 0, refunded = 0;
  const skuTotals = SKUS.map(() => 0);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[COL_NAME - 1]) continue;
    const status      = String(row[COL_STATUS - 1] || "");
    const orderTotal  = parseFloat(row[COL_TOTAL - 1])   || 0;
    const orderDeposit = parseFloat(row[COL_DEPOSIT - 1]) || 0;

    totalOrders++;
    if (status.includes("คืนเงิน") || status.includes("ยกเลิก")) {
      refunded++;
    } else {
      if (status.includes("มัดจำแล้ว"))    { paid++; depositRevenue += orderDeposit; fullRevenue += orderTotal; }
      else if (status.includes("รอตรวจ"))   pending++;
      else                                  unpaid++;
      for (let s = 0; s < SKUS.length; s++) {
        skuTotals[s] += parseInt(row[COL_QTY_START - 1 + s]) || 0;
      }
    }
  }

  const skuLines = SKUS.map((s, i) => `${s.name}: ${skuTotals[i]}`).join("\n");
  SpreadsheetApp.getUi().alert("📊 สรุป Lorcana Set 13",
    `📋 ออเดอร์: ${totalOrders}\n` +
    `✅ ${paid} | ⏳ ${pending} | ❌ ${unpaid} | 🔄 ${refunded}\n` +
    `💵 มัดจำที่ verified: ${depositRevenue.toLocaleString()} บาท\n` +
    `💰 ยอดเต็ม (ถ้าครบ): ${fullRevenue.toLocaleString()} บาท\n` +
    `━━━━━━━━━━━━━━\n${skuLines}`,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function testSlipOK() {
  const ui    = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveCell().getRow();
  if (row <= 1) return;
  const slipUrl = sheet.getRange(row, COL_SLIP).getValue();
  if (!slipUrl) { ui.alert("❌ ไม่มีลิงก์สลิป"); return; }
  const result = verifySlip(slipUrl);
  if (result && result.success) {
    const d = result.data;
    ui.alert(`✅ สลิปถูกต้อง\n💰 ${d.amount}\n📅 ${d.date}\n👤 ${d.sender ? d.sender.displayName : '-'}`);
  } else {
    ui.alert("❌ ตรวจไม่ผ่าน");
  }
}
