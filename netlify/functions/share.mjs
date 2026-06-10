// Dynamic OG redirect for Line OpenChat / Telegram / FB.
// Fetches live counts from GAS, embeds them in og:title + og:description,
// then meta-refreshes to the real static page.

const GAS_URL = "https://script.google.com/macros/s/AKfycbxrA_liPtTEbS--KATaAutfffycMg3mVeyaORHyAgQO-ZOureLNVoaFHGHmiho39Kb5/exec?type=json";
const ON_DEMAND = "On-demand · นัดเล่น (ครบ 4 คนจัดเลย)";
const TARGET = "https://uplevelguild.netlify.app/lorcana-weekly";
const OG_IMAGE = "https://ravensburger.cloud/cms/gallery/lorcana-web/products/s12-wild-unknown/dlc_s12_stubpage_1080x1080_mobile_hero.png";

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

export default async (req) => {
  let title = "🔥 Lorcana Weekly Play";
  let desc = "On-demand · นัดเล่นได้ทุกวัน · จ.19:00 · ส.13:00";

  try {
    const res = await fetch(GAS_URL, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    const grouped = (data && data.groupedData) || {};

    // ─── On-demand slots ───
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
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const slotList = Object.values(slots)
      .filter(s => !s.d || new Date(s.d + "T00:00:00") >= today)
      .sort((a, b) => (a.d + a.t).localeCompare(b.d + b.t));

    // ─── Next scheduled Mon/Sat ───
    const scheduledKeys = Object.keys(grouped).filter(k => k !== ON_DEMAND);
    const upcoming = scheduledKeys
      .map(k => ({ key: k, dt: parseThaiScheduledDate(k), list: grouped[k] }))
      .filter(x => x.dt && x.dt >= today)
      .sort((a, b) => a.dt - b.dt)[0];

    const parts = [];

    if (slotList.length) {
      const top = slotList[0];
      const ready = top.n >= 4 ? " ✅" : "";
      const evIcon = top.ev === "Pack" ? "📦" : "⚔️";
      title = `🔥 ${evIcon} ${top.n}/4 · ${formatThai(top.d, true)} ${top.t || ""}${ready}`;
      const slotLines = slotList.slice(0, 4).map(s => {
        const ic = s.ev === "Pack" ? "📦" : "⚔️";
        return `${ic} ${formatThai(s.d)} ${s.t || ""} · ${s.n}/4${s.n >= 4 ? "✅" : ""}`;
      });
      parts.push(slotLines.join(" │ "));
    } else {
      title = "🔥 Lorcana Weekly · ยังไม่มี On-demand เปิด";
      parts.push("เปิดตี้ของคุณได้เลย");
    }

    if (upcoming) {
      const list = upcoming.list || [];
      const p = list.filter(x => String(x.eventType || "").toLowerCase().includes("pack")).length;
      const c = list.length - p;
      parts.push(`ถัดไป: ${upcoming.key} · 📦${p} ⚔️${c}`);
    }

    parts.push("💰 Pack 400 / Core 200");
    desc = parts.join(" · ");
  } catch (e) {
    desc = `${desc} · (เช็คยอดสดที่หน้าเวป)`;
  }

  const html = `<!DOCTYPE html>
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
<meta property="og:url" content="${TARGET}">
<meta property="og:site_name" content="Up Level Guild · Lorcana Weekly">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(desc)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta http-equiv="refresh" content="0; url=${TARGET}">
<link rel="canonical" href="${TARGET}">
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#0E1A26;color:#F4EAD6;margin:0;padding:2rem;text-align:center}a{color:#D4B568;font-weight:700}</style>
</head>
<body>
<h1>${escape(title)}</h1>
<p>${escape(desc)}</p>
<p><a href="${TARGET}">→ ไปหน้าสมัคร</a></p>
<script>location.replace(${JSON.stringify(TARGET)})</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Tell Line/FB crawlers + their caches: revalidate every 60s
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
};
