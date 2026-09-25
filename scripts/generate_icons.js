const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(size, bgColor, fgColor) {
  const width = size;
  const height = size;
  
  // Create RGBA raw buffer
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  
  const [bgR, bgG, bgB] = bgColor;
  const [fgR, fgG, fgB] = fgColor;
  
  const radius = size * 0.44;
  const centerX = size / 2;
  const centerY = size / 2;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0: None
    for (let x = 0; x < width; x++) {
      const dist = Math.hypot(x - centerX, y - centerY);
      
      // Outer rounded circular badge
      if (dist <= radius) {
        // Draw stylized sprout / leaf inside
        const isLeaf = (
          (Math.abs(x - centerX) < size * 0.15 && y > centerY - size * 0.25 && y < centerY + size * 0.25) ||
          (Math.hypot(x - (centerX - size * 0.12), y - (centerY - size * 0.05)) < size * 0.14) ||
          (Math.hypot(x - (centerX + size * 0.12), y - (centerY - size * 0.08)) < size * 0.13)
        );

        if (isLeaf) {
          rawData[offset++] = fgR;
          rawData[offset++] = fgG;
          rawData[offset++] = fgB;
          rawData[offset++] = 255;
        } else {
          rawData[offset++] = bgR;
          rawData[offset++] = bgG;
          rawData[offset++] = bgB;
          rawData[offset++] = 255;
        }
      } else {
        // Transparent outside circle
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // CRC calculation
    let c = 0xffffffff;
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      c ^= combined[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    crcBuf.writeInt32BE(~c, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Deep agricultural green [45, 122, 79] (#2d7a4f), White/Cream [250, 248, 245]
const icon192 = createPng(192, [45, 122, 79], [250, 248, 245]);
fs.writeFileSync(path.join(outDir, 'icon-192x192.png'), icon192);

const icon512 = createPng(512, [45, 122, 79], [250, 248, 245]);
fs.writeFileSync(path.join(outDir, 'icon-512x512.png'), icon512);

// Also generate favicon.ico in public/
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), createPng(32, [45, 122, 79], [250, 248, 245]));

console.log('Successfully generated PWA icons and favicon!');
