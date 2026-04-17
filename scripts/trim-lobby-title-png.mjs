/**
 * Trims transparent margins from the lobby title PNG (alpha-based).
 * Usage: node scripts/trim-lobby-title-png.mjs [inputPath] [outputPath]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input =
  process.argv[2] ??
  path.join(root, "public/images/brand/cafe-2048-title-2.png");
const output = process.argv[3] ?? input;

async function main() {
  if (!fs.existsSync(input)) {
    console.error("Missing file:", input);
    process.exit(1);
  }
  const bufIn = fs.readFileSync(input);
  const before = await sharp(bufIn).metadata();
  const trimmed = await sharp(bufIn).trim().png({ compressionLevel: 9 }).toBuffer();
  const after = await sharp(trimmed).metadata();
  fs.writeFileSync(output, trimmed);
  console.log("trim-lobby-title-png:", path.relative(root, input));
  console.log(
    `  ${before.width}×${before.height} → ${after.width}×${after.height} (${fs.statSync(output).size} bytes)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
