/**
 * One-off / maintenance: resize OG art to 1200×630 for Facebook/WhatsApp validators.
 * Run: node scripts/resize-og.mjs
 */
import sharp from "sharp";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "public/images/og-image/og.png");
const out = resolve(root, "public/images/og-image/og.png");

await sharp(src)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(out + ".tmp");

import { renameSync, unlinkSync } from "fs";
renameSync(out + ".tmp", out);
console.log("[resize-og] wrote 1200×630 →", out);
