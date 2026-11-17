// Builds favicons from the supplied logo (lavender mark on black, square).
import sharp from "sharp";
import { writeFileSync } from "fs";
const SRC = "public/images/logo/logo-icon-black.png";
const mark = await sharp(SRC).trim({ background: "#000000", threshold: 20 }).toBuffer();
async function icon(size) {
  const inner = Math.round(size * 0.66);
  const m = await sharp(mark).resize({ height: inner, width: inner, fit: "inside" }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#000000" } })
    .composite([{ input: m, gravity: "center" }]).png().toBuffer();
}
const sizes = { "icon-48.png": 48, "icon-96.png": 96, "icon-192.png": 192, "icon-512.png": 512, "apple-touch-icon.png": 180 };
for (const [f, s] of Object.entries(sizes)) writeFileSync(`public/${f}`, await icon(s));
const dims = [16, 32, 48];
const imgs = await Promise.all(dims.map(icon));
const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
let off = 6 + 16 * imgs.length; const dirs = [];
imgs.forEach((b, i) => { const d = Buffer.alloc(16); d[0] = dims[i]; d[1] = dims[i]; d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(b.length, 8); d.writeUInt32LE(off, 12); off += b.length; dirs.push(d); });
writeFileSync("public/favicon.ico", Buffer.concat([head, ...dirs, ...imgs]));
console.log("done");
