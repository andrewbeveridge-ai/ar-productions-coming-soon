/* One-time OG image generator for /insights/ai-music-labels-control
 * Run: node scripts/generate-og.js
 * Output: og/ai-music-labels-control.png (1200x630)
 * Rasterizes an SVG with sharp (libvips). Commit the PNG as a static asset.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const GOLD = '#D4AF37';
const MUTED_GOLD = '#9a7e2e';
const WHITE = '#FAFAFA';
const BG = '#0A0A0A';

const titleLines = [
  'Are Major Labels Losing Control',
  'of the AI Music Boom?'
];

const cx = W / 2;
const dividerW = 320;
const dx1 = cx - dividerW / 2;
const dx2 = cx + dividerW / 2;

const titleStartY = 316;
const lineGap = 74;
const titleSpans = titleLines
  .map((t, i) => `<text x="${cx}" y="${titleStartY + i * lineGap}" text-anchor="middle"
        font-family="sans-serif" font-size="56" font-weight="700" fill="${WHITE}"
        letter-spacing="0.5">${t}</text>`)
  .join('\n    ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <text x="${cx}" y="178" text-anchor="middle"
        font-family="sans-serif" font-size="30" font-weight="600" fill="${GOLD}"
        letter-spacing="9">INDUSTRY INSIGHT</text>

  <line x1="${dx1}" y1="222" x2="${dx2}" y2="222" stroke="${GOLD}" stroke-width="1.5" opacity="0.7"/>

  ${titleSpans}

  <line x1="${dx1}" y1="468" x2="${dx2}" y2="468" stroke="${GOLD}" stroke-width="1.5" opacity="0.7"/>

  <text x="${cx}" y="548" text-anchor="middle"
        font-family="sans-serif" font-size="26" font-weight="500" fill="${MUTED_GOLD}"
        letter-spacing="3">anotherrealmproductions.com</text>
</svg>`;

const outDir = path.join(__dirname, '..', 'og');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'ai-music-labels-control.png');

sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)
  .then(info => console.log('Wrote', outPath, info.width + 'x' + info.height))
  .catch(err => { console.error(err); process.exit(1); });
