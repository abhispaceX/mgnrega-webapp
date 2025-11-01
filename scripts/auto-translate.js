/**
 * Auto-Translation Script using Google Cloud Translate API
 * 
 * This script reads messages/en.json, translates all strings to Hindi and Telugu,
 * and writes the results to messages/hi.json and messages/te.json.
 * 
 * Prerequisites:
 * 1. npm install @google-cloud/translate
 * 2. Get Google Cloud Translation API key from https://console.cloud.google.com
 * 3. Add GOOGLE_TRANSLATE_API_KEY=your_key to .env
 * 
 * Usage:
 * node scripts/auto-translate.js
 * 
 * Or add to package.json:
 * "scripts": { "translate": "node scripts/auto-translate.js" }
 * Then run: npm run translate
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if @google-cloud/translate is installed
let Translate;
try {
  ({ Translate } = require('@google-cloud/translate').v2);
} catch (err) {
  console.error('❌ @google-cloud/translate is not installed.');
  console.error('Install it with: npm install @google-cloud/translate');
  process.exit(1);
}

// Check API key
const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!apiKey) {
  console.error('❌ GOOGLE_TRANSLATE_API_KEY is not set in environment variables.');
  console.error('Add it to your .env file or export it in your shell.');
  process.exit(1);
}

const translate = new Translate({ key: apiKey });

const enPath = path.join(__dirname, '../messages/en.json');
const hiPath = path.join(__dirname, '../messages/hi.json');
const tePath = path.join(__dirname, '../messages/te.json');

/**
 * Recursively translate an object's string values
 */
async function translateObject(obj, targetLang, path = '') {
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      try {
        const [translation] = await translate.translate(value, targetLang);
        translated[key] = translation;
        console.log(`  ✓ ${currentPath}: "${value}" → "${translation}"`);
      } catch (err) {
        console.error(`  ✗ Failed to translate ${currentPath}:`, err.message);
        translated[key] = value; // fallback to original
      }
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang, currentPath);
    } else {
      translated[key] = value;
    }
  }
  return translated;
}

async function translateMessages() {
  console.log('🌍 Starting auto-translation...\n');

  // Read English messages
  if (!fs.existsSync(enPath)) {
    console.error(`❌ English messages file not found at ${enPath}`);
    process.exit(1);
  }

  const enMessages = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  console.log(`📖 Loaded ${Object.keys(enMessages).length} top-level keys from en.json\n`);

  // Translate to Hindi
  console.log('🇮🇳 Translating to Hindi...');
  const hiMessages = await translateObject(enMessages, 'hi');
  try {
    const absoluteHiPath = path.resolve(hiPath);
    console.log(`Attempting to write to: ${absoluteHiPath}`);
    fs.writeFileSync(absoluteHiPath, JSON.stringify(hiMessages, null, 2), 'utf-8');
    console.log(`✅ Successfully saved to ${absoluteHiPath}\n`);
  } catch (err) {
    console.error(`❌ Failed to write to ${hiPath}:`, err);
  }

  // Translate to Telugu
  console.log('🇮🇳 Translating to Telugu...');
  const teMessages = await translateObject(enMessages, 'te');
  try {
    const absoluteTePath = path.resolve(tePath);
    console.log(`Attempting to write to: ${absoluteTePath}`);
    fs.writeFileSync(absoluteTePath, JSON.stringify(teMessages, null, 2), 'utf-8');
    console.log(`✅ Successfully saved to ${absoluteTePath}\n`);
  } catch (err) {
    console.error(`❌ Failed to write to ${tePath}:`, err);
  }

  console.log('🎉 Translation complete! You can now use hi.json and te.json in your app.');
}

translateMessages().catch((err) => {
  console.error('❌ Fatal error during translation:', err);
  process.exit(1);
});
