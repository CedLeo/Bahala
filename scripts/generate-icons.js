/**
 * PWA Icon Generator for Bahala
 * Run: node scripts/generate-icons.js
 * 
 * This creates PNG icons from an SVG template.
 * Requires: sharp (npm install sharp --save-dev)
 */

const fs = require('fs');
const path = require('path');

// SVG template for the Bahala app icon (water droplet on blue)
const generateSVG = (size, maskable = false) => {
  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const dropScale = innerSize / 512;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${maskable ? 0 : size * 0.15}"/>
  <g transform="translate(${cx - 80 * dropScale}, ${cy - 120 * dropScale}) scale(${dropScale})">
    <path d="M80 20 C80 20 20 120 20 170 C20 220 45 240 80 240 C115 240 140 220 140 170 C140 120 80 20 80 20Z" fill="white" opacity="0.95"/>
    <path d="M60 180 C60 200 70 210 80 210 C90 210 100 200 100 180" fill="none" stroke="rgba(37,99,235,0.5)" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`;
};

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Try to use sharp for PNG conversion, fall back to SVG
async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('sharp not installed. Generating SVG icons as fallback (rename to .png for PWA).');
    console.log('Install sharp for PNG generation: npm install sharp --save-dev');
    
    // Write SVG files that will work
    for (const size of sizes) {
      const svg = generateSVG(size, false);
      fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
      // Also write as .png extension SVG (browsers handle this gracefully)
      fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), svg);
    }
    
    // Maskable icons
    for (const size of [192, 512]) {
      const svg = generateSVG(size, true);
      fs.writeFileSync(path.join(iconsDir, `icon-maskable-${size}x${size}.svg`), svg);
      fs.writeFileSync(path.join(iconsDir, `icon-maskable-${size}x${size}.png`), svg);
    }
    
    console.log('Generated SVG icons in public/icons/');
    return;
  }

  // With sharp available, create proper PNGs
  for (const size of sizes) {
    const svg = generateSVG(size, false);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Maskable icons
  for (const size of [192, 512]) {
    const svg = generateSVG(size, true);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(iconsDir, `icon-maskable-${size}x${size}.png`));
    console.log(`Generated icon-maskable-${size}x${size}.png`);
  }

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
