// KShop dynamic-amount QR generator (PromptPay EMVCo merchant payload).
// Decoded from KShop static QR (Tag 30 + Tag 31 merchant TLV preserved).
// Depends on: qrcode-generator (https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js)
// Usage:
//   <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
//   <script src="/assets/kshop-qr.js"></script>
//   KShopQR.renderKShopQR(canvasEl, 220);

(function (global) {
  // Reverse-engineered byte-for-byte from real K SHOP dynamic QRs (K+ app: 10/20/100฿,
  // verified identical). Whole payload constant except amount (tag 54) + CRC (tag 63).
  // Old hand-rebuilt payload was bank-rejected (wrong POI 12 + missing tags
  // 02/04/15/51/52/59/60/62). Fixed 2026-06-18.
  const KSHOP_PREFIX = "0002010102110216478772000428960304155303920004289871531343007640052044640122210000600130810016A00000067701011201150107536000315010214KB0000020931520320KPS004KB00000209315231690016A00000067701011301030040214KB0000020931520420KPS004KB00000209315251430014A00000000410100106416971021112345678901520459455303764";
  const KSHOP_SUFFIX = "5802TH5916UP LEVEL ACADEMY6004CITY62250509462478294070842210000";

  function crc16(s) {
    let crc = 0xFFFF;
    for (let i = 0; i < s.length; i++) {
      crc ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function buildKShopPayload(amount) {
    const amt = Number(amount).toFixed(2);
    const amtField = "54" + String(amt.length).padStart(2, "0") + amt;
    const payload = KSHOP_PREFIX + amtField + KSHOP_SUFFIX + "6304";
    return payload + crc16(payload);
  }

  function drawToCanvas(canvas, qr, targetSize) {
    const n = qr.getModuleCount();
    const cell = Math.max(2, Math.floor(targetSize / n));
    const px = cell * n;
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#000";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }

  function renderKShopQR(canvasEl, amount, opts) {
    if (!canvasEl) return;
    if (typeof qrcode === "undefined") {
      console.error("kshop-qr: qrcode-generator library not loaded");
      return;
    }
    const o = opts || {};
    const ec = o.errorCorrectionLevel || "M"; // L M Q H
    const size = o.size || 280;
    const payload = buildKShopPayload(amount);
    const qr = qrcode(0, ec);
    qr.addData(payload);
    qr.make();
    drawToCanvas(canvasEl, qr, size);
  }

  global.KShopQR = { buildKShopPayload, renderKShopQR, crc16 };
})(window);
