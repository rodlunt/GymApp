const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertAssets() {
  const storeListingDir = __dirname;

  // Convert app icon (512x512)
  console.log('Converting app icon...');
  await sharp(path.join(storeListingDir, 'app-icon-512.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(storeListingDir, 'app-icon-512.png'));
  console.log('Created: app-icon-512.png');

  // Convert feature graphic (1024x500)
  console.log('Converting feature graphic...');
  await sharp(path.join(storeListingDir, 'feature-graphic.svg'))
    .resize(1024, 500)
    .png()
    .toFile(path.join(storeListingDir, 'feature-graphic.png'));
  console.log('Created: feature-graphic.png');

  console.log('\nDone! Your Play Store assets are ready in store-listing/');
}

convertAssets().catch(console.error);
