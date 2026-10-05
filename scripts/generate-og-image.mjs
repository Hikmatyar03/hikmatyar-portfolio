import fs from "fs";
import zlib from "zlib";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return ~c >>> 0;
}

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[n] = c;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// 1. Read & decompress raw PNG chunks
const srcFile = fs.readFileSync("public/brand/hikmatyar-wordmark.png");
let pos = 8;
const idatChunks = [];
while (pos < srcFile.length) {
  const len = srcFile.readUInt32BE(pos);
  const type = srcFile.toString("ascii", pos + 4, pos + 8);
  if (type === "IDAT") idatChunks.push(srcFile.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}

const compressed = Buffer.concat(idatChunks);
const rawFiltered = zlib.inflateSync(compressed);
const srcW = 924;
const srcH = 291;
const stride = 1 + srcW * 4;
const bpp = 4;

// Unfilter PNG scanlines
const srcRgba = Buffer.alloc(srcW * srcH * 4);
for (let y = 0; y < srcH; y++) {
  const filter = rawFiltered[y * stride];
  const rowIn = y * stride + 1;
  const rowOut = y * srcW * 4;
  const prevOut = (y - 1) * srcW * 4;

  for (let x = 0; x < srcW * 4; x++) {
    const val = rawFiltered[rowIn + x];
    const a = x >= bpp ? srcRgba[rowOut + x - bpp] : 0;
    const b = y > 0 ? srcRgba[prevOut + x] : 0;
    const c = (x >= bpp && y > 0) ? srcRgba[prevOut + x - bpp] : 0;

    let res = 0;
    if (filter === 0) res = val;
    else if (filter === 1) res = (val + a) & 0xff;
    else if (filter === 2) res = (val + b) & 0xff;
    else if (filter === 3) res = (val + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) res = (val + paeth(a, b, c)) & 0xff;
    srcRgba[rowOut + x] = res;
  }
}

// 2. Create 1200x630 target canvas
const dstW = 1200;
const dstH = 630;
const scale = 0.76;
const scaledW = Math.round(srcW * scale); // ~702
const scaledH = Math.round(srcH * scale); // ~221
const startX = Math.round((dstW - scaledW) / 2);
const startY = Math.round((dstH - scaledH) / 2) - 20;

const dstRaw = Buffer.alloc((1 + dstW * 4) * dstH);
const dstStride = 1 + dstW * 4;

// Fill canvas with deep black #0E0E0E (14, 14, 14, 255)
for (let y = 0; y < dstH; y++) {
  const rowOffset = y * dstStride;
  dstRaw[rowOffset] = 0; // Filter None
  for (let x = 0; x < dstW; x++) {
    const p = rowOffset + 1 + x * 4;
    dstRaw[p] = 14;     // R
    dstRaw[p + 1] = 14; // G
    dstRaw[p + 2] = 14; // B
    dstRaw[p + 3] = 255;
  }
}

// Draw subtle fine editorial border around 1200x630 card (30px inset)
const inset = 36;
for (let x = inset; x < dstW - inset; x++) {
  // top & bottom border lines
  for (const y of [inset, dstH - inset]) {
    const p = y * dstStride + 1 + x * 4;
    dstRaw[p] = 32; dstRaw[p+1] = 32; dstRaw[p+2] = 32;
  }
}
for (let y = inset; y < dstH - inset; y++) {
  // left & right border lines
  for (const x of [inset, dstW - inset]) {
    const p = y * dstStride + 1 + x * 4;
    dstRaw[p] = 32; dstRaw[p+1] = 32; dstRaw[p+2] = 32;
  }
}

// Helper for source alpha
function getAlpha(x, y) {
  if (x < 0 || x >= srcW || y < 0 || y >= srcH) return 0;
  return srcRgba[(y * srcW + x) * 4 + 3];
}

// Bilinear upscale / render wordmark
for (let dy = 0; dy < scaledH; dy++) {
  const y = startY + dy;
  if (y < 0 || y >= dstH) continue;
  const rowOffset = y * dstStride;

  for (let dx = 0; dx < scaledW; dx++) {
    const x = startX + dx;
    if (x < 0 || x >= dstW) continue;

    const sx = dx / scale;
    const sy = dy / scale;
    const x0 = Math.floor(sx);
    const x1 = Math.min(srcW - 1, x0 + 1);
    const y0 = Math.floor(sy);
    const y1 = Math.min(srcH - 1, y0 + 1);
    const fx = sx - x0;
    const fy = sy - y0;

    const a00 = getAlpha(x0, y0);
    const a10 = getAlpha(x1, y0);
    const a01 = getAlpha(x0, y1);
    const a11 = getAlpha(x1, y1);

    const a = (a00 * (1 - fx) + a10 * fx) * (1 - fy) + (a01 * (1 - fx) + a11 * fx) * fy;

    if (a > 1) {
      const alphaNorm = a / 255;
      const p = rowOffset + 1 + x * 4;
      // Interpolate from #0E0E0E (14) to #E0E0E0 (224)
      const c = Math.round(14 + (224 - 14) * alphaNorm);
      dstRaw[p] = c;
      dstRaw[p + 1] = c;
      dstRaw[p + 2] = c;
    }
  }
}

// 3. Compress and write PNG
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(dstW, 0);
ihdrData.writeUInt32BE(dstH, 4);
ihdrData[8] = 8;
ihdrData[9] = 6;
ihdrData[10] = 0;
ihdrData[11] = 0;
ihdrData[12] = 0;

const ihdrChunk = makeChunk("IHDR", ihdrData);
const idatCompressed = zlib.deflateSync(dstRaw, { level: 9 });
const idatChunk = makeChunk("IDAT", idatCompressed);
const iendChunk = makeChunk("IEND", Buffer.alloc(0));

const finalPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync("public/og-image.png", finalPng);
console.log("Successfully generated public/og-image.png with solid wordmark! Size:", finalPng.length);
