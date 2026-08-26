import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reads a PNG/WEBP/JPEG file's real pixel dimensions straight from its
 * header, so gallery `<img>` tags can carry width/height and the browser
 * reserves the right space before the image loads (prevents CLS) — without
 * hand-maintaining a dimensions list that drifts from the actual files.
 *
 * Runs at build time only (Node `fs`), against files in `public/`. Returns
 * `null` on any unsupported format or read failure — callers must treat a
 * missing size as "omit the attribute," not a build error.
 */
export function getImageDimensions(publicPath: string): { width: number; height: number } | null {
  const filePath = join(process.cwd(), 'public', publicPath);
  if (!existsSync(filePath)) return null;

  try {
    const data = readFileSync(filePath);
    const ext = publicPath.toLowerCase().split('.').pop();

    if (ext === 'png') {
      if (data.length < 24) return null;
      return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    }

    if (ext === 'jpg' || ext === 'jpeg') {
      let i = 2;
      while (i < data.length - 8) {
        if (data[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = data[i + 1] as number;
        // SOF0..SOF3 / SOF5..SOF7 / SOF9..SOF11 / SOF13..SOF15 carry dimensions.
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: data.readUInt16BE(i + 5), width: data.readUInt16BE(i + 7) };
        }
        const segmentLength = data.readUInt16BE(i + 2);
        i += 2 + segmentLength;
      }
      return null;
    }

    if (ext === 'webp') {
      const chunk = data.subarray(12, 16).toString('ascii');
      if (chunk === 'VP8 ' && data.length >= 30) {
        return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
      }
      if (chunk === 'VP8L' && data.length >= 25) {
        const bits = data.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (chunk === 'VP8X' && data.length >= 30) {
        const width = 1 + (data[24]! | (data[25]! << 8) | (data[26]! << 16));
        const height = 1 + (data[27]! | (data[28]! << 8) | (data[29]! << 16));
        return { width, height };
      }
      return null;
    }

    // SVGs are intentionally not handled here — browsers use the SVG's own
    // viewBox for intrinsic aspect ratio when width/height attrs are absent.
    return null;
  } catch {
    return null;
  }
}
