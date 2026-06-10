// /lorcana-weekly — same URL, but smart.
//   • Social OG crawlers (Line, FB, Twitter, Telegram, Discord, Slack, etc.)
//     get HTML with live counts baked into og:title + og:description.
//   • Real browsers get the static lorcana-weekly.html file unchanged.

const GAS_URL = "https://script.google.com/macros/s/AKfycbxrA_liPtTEbS--KATaAutfffycMg3mVeyaORHyAgQO-ZOureLNVoaFHGHmiho39Kb5/exec?type=json";
const ON_DEMAND = "On-demand · นัดเล่น (ครบ 4 คนจัดเลย)";
const PAGE_URL = "https://uplevelguild.netlify.app/lorcana-weekly";
const STATIC_URL = "https://uplevelguild.netlify.app/lorcana-weekly.html";
const OG_IMAGE = "https://ravensburger.cloud/cms/gallery/lorcana-web/products/s12-wild-unknown/dlc_s12_stubpage_1080x1080_mobile_hero.png";

const BOT_UA_PATTERN = /facebookexternalhit|facebookcatalog|line-poker|line-bot|twitterbot|telegrambot|discordbot|slackbot|whatsapp|skypeuripreview|linkedinbot|googlebot|bingbot|applebot|pinterest|tumblr|redditbot|embedly|iframely|opengraph|baiduspider|msnbot|yandexbot/i;

const TH_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const TH_MONTHS_SHORT = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function formatThai(iso, withDay) {
  if (!iso) return "ไม่ระบุวัน";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  const dayLabel = withDay ? `${TH_DAYS[d.getDay()].slice(0, 2)}. ` : "";
  return `${dayLabel}${d.getDate()} ${TH_MONTHS_SHORT[d.getMonth() + 1]}`;
}

function parseThaiScheduledDate(str) {
  const months = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const m = String(str).match(/(\d{1,2}) (\S+) (\d{4})/);
  if (!m) return null;
  return new Date(parseInt(m[3], 10) - 543, months.indexOf(m[2]) - 1, parseInt(m[1], 10));
}

function escape(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function buildOgHtml() {
  let title = "Lorcana Weekly — สนใจลงได้";
  let desc = "Pack 400 / Core 200 · จ.19:00 · ส.13:00";

  try {
    const res = await fetch(GAS_URL, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    const grouped = (data && data.groupedData) || {};

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString().slice(0, 10);

    // ── Today's on-demand slots ──
    const od = grouped[ON_DEMAND] || [];
    const slots = {};
    for (const p of od) {
      const d = p.odDate || "";
      const t = p.odTime || "";
      const isPack = String(p.eventType || "").toLowerCase().includes("pack");
      const ev = isPack ? "Pack" : "Core";
      const key = `${d}|${t}|${ev}`;
      if (!slots[key]) slots[key] = { d, t, ev, n: 0 };
      slots[key].n++;
    }
    const todaySlots = Object.values(slots)
      .filter(s => s.d === todayIso)
      .sort((a, b) => (a.t || "").localeCompare(b.t || ""));

    // ── Next scheduled Mon/Sat ──
    const scheduledKeys = Object.keys(grouped).filter(k => k !== ON_DEMAND);
    const upcoming = scheduledKeys
      .map(k => ({ key: k, dt: parseThaiScheduledDate(k), list: grouped[k] }))
      .filter(x => x.dt && x.dt >= today)
      .sort((a, b) => a.dt - b.dt)[0];

    let upPack = 0, upCore = 0, upLabel = "";
    if (upcoming) {
      const list = upcoming.list || [];
      upPack = list.filter(x => String(x.eventType || "").toLowerCase().includes("pack")).length;
      upCore = list.length - upPack;
      // Strip "วัน" prefix + Buddhist year if present for shorter label
      upLabel = upcoming.key.replace(/^วัน/, "").replace(/ 25\d{2}$/, "");
    }

    // ── Build focused title ──
    // Priority: next scheduled · today's on-demand summary
    const titleParts = [];
    if (upcoming) {
      titleParts.push(`📅 ${upLabel}: 📦${upPack} ⚔️${upCore}`);
    }
    if (todaySlots.length) {
      const sum = todaySlots.map(s => {
        const ic = s.ev === "Pack" ? "📦" : "⚔️";
        const ready = s.n >= 4 ? "✅" : "";
        return `${ic}${s.n}/4 ${s.t || ""}${ready}`;
      }).join(" ");
      titleParts.push(`🔥 วันนี้ ${sum}`);
    } else if (upcoming) {
      titleParts.push("วันนี้ยังไม่มี on-demand");
    }
    if (titleParts.length) title = titleParts.join(" · ");

    // ── Build short desc ──
    const descParts = [];
    if (todaySlots.length) {
      descParts.push("สนใจลงร่วม on-demand วันนี้ได้");
    } else {
      descParts.push("วันนี้ยังว่าง — เปิดตี้ on-demand ได้");
    }
    descParts.push("Pack 400 / Core 200 · จ.19:00 · ส.13:00");
    desc = descParts.join(" · ");
  } catch (e) {
    desc = `${desc} · (เช็คยอดสดที่หน้าเวป)`;
  }

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>${escape(title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(desc)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1080">
<meta property="og:url" content="${PAGE_URL}">
<meta property="og:site_name" content="Up Level Guild · Lorcana Weekly">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(desc)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta http-equiv="refresh" content="0; url=${STATIC_URL}">
<link rel="canonical" href="${PAGE_URL}">
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#0E1A26;color:#F4EAD6;margin:0;padding:2rem;text-align:center}a{color:#D4B568;font-weight:700}</style>
</head>
<body>
<h1>${escape(title)}</h1>
<p>${escape(desc)}</p>
<p><a href="${STATIC_URL}">→ ไปหน้าสมัคร</a></p>
<script>location.replace(${JSON.stringify(STATIC_URL)})</script>
</body>
</html>`;
}

export default async (req) => {
  const ua = req.headers.get("user-agent") || "";
  const isBot = BOT_UA_PATTERN.test(ua);

  if (isBot) {
    const html = await buildOgHtml();
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  }

  // Real browser → serve the static page directly
  try {
    const staticRes = await fetch(STATIC_URL, {
      headers: { "User-Agent": "Netlify-Function-Loopback" },
      signal: AbortSignal.timeout(8000),
    });
    const body = await staticRes.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    // Fallback: redirect to the .html if loopback fails
    return new Response(null, {
      status: 302,
      headers: { Location: STATIC_URL },
    });
  }
};
