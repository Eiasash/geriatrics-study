#!/usr/bin/env node
/**
 * Generate PNG icons from SVG for PWA
 * Run: node scripts/generate-icons.js
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('Sharp not installed. Installing...');
    require('child_process').execSync('npm install sharp', { stdio: 'inherit' });
    sharp = require('sharp');
}

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SVG_PATH = path.join(__dirname, '../icons/icon.svg');
const ICONS_DIR = path.join(__dirname, '../icons');

async function generateIcons() {
    console.log('Generating PWA icons...');

    const svgBuffer = fs.readFileSync(SVG_PATH);

    for (const size of ICON_SIZES) {
        const outputPath = path.join(ICONS_DIR, `icon-${size}.png`);

        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);

        console.log(`  ✓ Generated icon-${size}.png`);
    }

    // Generate apple-touch-icon
    await sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));
    console.log('  ✓ Generated apple-touch-icon.png');

    // Generate favicon
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(ICONS_DIR, 'favicon-32.png'));
    console.log('  ✓ Generated favicon-32.png');

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
