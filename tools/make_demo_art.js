"use strict";
// Generates placeholder demo art (pure node: zlib + hand-rolled PNG chunks).
// 48x48 slime bounce (8f) + 6-cell hero run sheet. Programmer art, but it
// reads clearly in motion and makes the demo runnable out of the box.
// Run from anywhere: node tools/make_demo_art.js
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const OUT = path.join(__dirname, "..", "demo", "img", "framemaster") + path.sep;

const CRC_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 0);
  return Buffer.concat([head, data, crc]);
}
function png(w, h, rgba) {
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // filter: none
    Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4)
      .copy(raw, y * (1 + w * 4) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}
function canvas(w, h) {
  return { w, h, px: new Uint8ClampedArray(w * h * 4) };
}
function dot(c, x, y, col) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  const o = (y * c.w + x) * 4;
  c.px[o] = col[0]; c.px[o + 1] = col[1]; c.px[o + 2] = col[2]; c.px[o + 3] = col[3];
}
function blob(c, cx, cy, rx, ry, col) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) dot(c, x, y, col);
    }
  }
}
function thickLine(c, x0, y0, x1, y1, r, col) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    blob(c, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, r, col);
  }
}

const BODY = [74, 200, 178, 255], DARK = [26, 105, 96, 255];
const LITE = [205, 255, 244, 255], EYE = [18, 28, 40, 255];
// Slime bounce: squash & stretch + blink on frame 5.
for (let n = 0; n < 8; n++) {
  const p = (n / 8) * Math.PI * 2;
  const s = Math.sin(p);
  const c = canvas(48, 48);
  const cy = 30 - 5 * Math.max(0, s);
  const rx = 13 - 3 * s, ry = 11 + 3 * s;
  blob(c, 24, cy, rx + 2, ry + 2, DARK);
  blob(c, 24, cy, rx, ry, BODY);
  blob(c, 18, cy - 5, 4, 3, LITE);
  const ey = cy - 2;
  if (n === 5) { // blink frame
    thickLine(c, 17, ey, 21, ey, 1, EYE);
    thickLine(c, 27, ey, 31, ey, 1, EYE);
  } else {
    blob(c, 19, ey, 2, 3, EYE);
    blob(c, 29, ey, 2, 3, EYE);
  }
  fs.writeFileSync(OUT + "slime_" + n + ".png", png(48, 48, c.px));
}
// Hero run sheet: 6 cells, limbs swing in run cycle.
const SUIT = [70, 120, 250, 255], SKIN = [250, 210, 170, 255], SHOE = [30, 30, 50, 255];
for (let n = 0; n < 6; n++) {
  const p = (n / 6) * Math.PI * 2;
  const c = canvas(48, 48);
  const lean = 3 * Math.sin(p);
  const hipX = 24, hipY = 28, shX = 24 + lean, shY = 17;
  const s1 = Math.sin(p), s2 = Math.sin(p + Math.PI);
  // legs (opposite phase), feet lift
  const f1x = hipX + 9 * s1, f1y = 44 - Math.max(0, 7 * Math.cos(p));
  const f2x = hipX + 9 * s2, f2y = 44 - Math.max(0, 7 * Math.cos(p + Math.PI));
  thickLine(c, hipX, hipY, (hipX + f1x) / 2 + 1, (hipY + f1y) / 2, 2.4, SUIT);
  thickLine(c, (hipX + f1x) / 2 + 1, (hipY + f1y) / 2, f1x, f1y, 2.4, SUIT);
  dot(c, f1x, f1y - 1, SHOE); dot(c, f1x + 1, f1y - 1, SHOE); dot(c, f1x - 1, f1y - 1, SHOE);
  thickLine(c, hipX, hipY, (hipX + f2x) / 2 - 1, (hipY + f2y) / 2, 2.4, SUIT);
  thickLine(c, (hipX + f2x) / 2 - 1, (hipY + f2y) / 2, f2x, f2y, 2.4, SUIT);
  dot(c, f2x, f2y - 1, SHOE); dot(c, f2x + 1, f2y - 1, SHOE); dot(c, f2x - 1, f2y - 1, SHOE);
  // torso + head
  thickLine(c, hipX, hipY, shX, shY, 3, SUIT);
  blob(c, shX, shY - 6, 5, 5, SKIN);
  // arms (counter-swing)
  thickLine(c, shX, shY + 1, shX + 7 * s2, shY + 8, 2, SUIT);
  thickLine(c, shX, shY + 1, shX + 7 * s1, shY + 8, 2, SUIT);
  const cells = [];
  if (n === 0) global.__sheet = [];
  global.__sheet.push(c);
}
const sheet = canvas(288, 48);
for (let n = 0; n < 6; n++) {
  const c = global.__sheet[n];
  for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) {
    const s = (y * 48 + x) * 4, d = (y * 288 + (n * 48 + x)) * 4;
    sheet.px[d] = c.px[s]; sheet.px[d + 1] = c.px[s + 1];
    sheet.px[d + 2] = c.px[s + 2]; sheet.px[d + 3] = c.px[s + 3];
  }
}
fs.writeFileSync(OUT + "hero_run_sheet.png", png(288, 48, sheet.px));
function xEyes(c, x1, x2, y) {
  for (const ex of [x1, x2]) {
    thickLine(c, ex - 2, y - 2, ex + 2, y + 2, 1, EYE);
    thickLine(c, ex - 2, y + 2, ex + 2, y - 2, 1, EYE);
  }
}
function slimeBase(c, cx, cy, rx, ry, eyes) {
  blob(c, cx, cy, rx + 2, ry + 2, DARK);
  blob(c, cx, cy, rx, ry, BODY);
  blob(c, cx - 6, cy - 5, 4, 3, LITE);
  if (eyes === "x") xEyes(c, cx - 5, cx + 5, cy - 2);
  else if (eyes === "shut") {
    thickLine(c, cx - 7, cy - 2, cx - 3, cy - 2, 1, EYE);
    thickLine(c, cx + 3, cy - 2, cx + 7, cy - 2, 1, EYE);
  } else {
    blob(c, cx - 5, cy - 2, 2, 3, EYE);
    blob(c, cx + 5, cy - 2, 2, 3, EYE);
  }
}
// Battle moves: lunge (attack), squash (hit), puddle (die).
{
  const a0 = canvas(48, 48);
  slimeBase(a0, 24, 30, 13, 11, "open");
  fs.writeFileSync(OUT + "satk_0.png", png(48, 48, a0.px));
  const a1 = canvas(48, 48);
  slimeBase(a1, 28, 32, 17, 8, "open");
  fs.writeFileSync(OUT + "satk_1.png", png(48, 48, a1.px));
  const a2 = canvas(48, 48);
  slimeBase(a2, 26, 30, 14, 10, "open");
  fs.writeFileSync(OUT + "satk_2.png", png(48, 48, a2.px));
  const h0 = canvas(48, 48);
  slimeBase(h0, 24, 34, 15, 7, "x");
  fs.writeFileSync(OUT + "shit_0.png", png(48, 48, h0.px));
  const h1 = canvas(48, 48);
  slimeBase(h1, 24, 30, 13, 11, "shut");
  fs.writeFileSync(OUT + "shit_1.png", png(48, 48, h1.px));
  const d0 = canvas(48, 48);
  slimeBase(d0, 24, 33, 14, 8, "x");
  fs.writeFileSync(OUT + "sdie_0.png", png(48, 48, d0.px));
  const d1 = canvas(48, 48);
  slimeBase(d1, 24, 36, 16, 6, "x");
  fs.writeFileSync(OUT + "sdie_1.png", png(48, 48, d1.px));
  const d2 = canvas(48, 48);
  slimeBase(d2, 24, 40, 18, 4, "x");
  fs.writeFileSync(OUT + "sdie_2.png", png(48, 48, d2.px));
}
console.log("demo art written");
