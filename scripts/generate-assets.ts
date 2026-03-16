import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function generateSpritesheet() {
  // Create a 128x128 spritesheet (plenty of room)
  const sheet = new Jimp({ width: 128, height: 128, color: 0x00000000 });

  // 1. Doodler Left (32x32)
  const doodlerLeft = new Jimp({ width: 32, height: 32, color: 0x00000000 });
  // Body (Greenish)
  for (let x = 4; x < 28; x++) {
    for (let y = 4; y < 28; y++) {
      doodlerLeft.setPixelColor(0x99CC00FF, x, y);
    }
  }
  // Eyes
  doodlerLeft.setPixelColor(0x000000FF, 8, 10);
  doodlerLeft.setPixelColor(0x000000FF, 14, 10);
  // Nose/Snout
  for (let x = 2; x < 8; x++) doodlerLeft.setPixelColor(0x99CC00FF, x, 16);
  
  sheet.composite(doodlerLeft, 0, 0);

  // 2. Doodler Right (32x32)
  const doodlerRight = doodlerLeft.clone().flip({ horizontal: true, vertical: false });
  sheet.composite(doodlerRight, 32, 0);

  // 3. Platform Green (48x16)
  const platGreen = new Jimp({ width: 48, height: 16, color: 0x00000000 });
  for (let x = 2; x < 46; x++) {
    for (let y = 2; y < 14; y++) {
      platGreen.setPixelColor(0x66BB66FF, x, y);
    }
  }
  sheet.composite(platGreen, 0, 32);

  // 4. Platform Blue (48x16)
  const platBlue = new Jimp({ width: 48, height: 16, color: 0x00000000 });
  for (let x = 2; x < 46; x++) {
    for (let y = 2; y < 14; y++) {
      platBlue.setPixelColor(0x6666BBFF, x, y);
    }
  }
  sheet.composite(platBlue, 48, 32);

  // 5. Platform Brown (48x16)
  const platBrown = new Jimp({ width: 48, height: 16, color: 0x00000000 });
  for (let x = 2; x < 46; x++) {
    for (let y = 2; y < 14; y++) {
      platBrown.setPixelColor(0x8B4513FF, x, y);
    }
  }
  sheet.composite(platBrown, 0, 48);

  await sheet.write(path.join(ASSETS_DIR, 'spritesheet.png') as any);

  // Generate Atlas JSON
  const atlas = {
    frames: {
      'doodler_left': { frame: { x: 0, y: 0, w: 32, h: 32 } },
      'doodler_right': { frame: { x: 32, y: 0, w: 32, h: 32 } },
      'platform_green': { frame: { x: 0, y: 32, w: 48, h: 16 } },
      'platform_blue': { frame: { x: 48, y: 32, w: 48, h: 16 } },
      'platform_brown': { frame: { x: 0, y: 48, w: 48, h: 16 } }
    },
    meta: {
      image: 'spritesheet.png',
      format: 'RGBA8888',
      size: { w: 128, h: 128 },
      scale: '1'
    }
  };

  fs.writeFileSync(path.join(ASSETS_DIR, 'atlas.json'), JSON.stringify(atlas, null, 2));
  console.log('Spritesheet and Atlas generated.');
}

function generateWav(filename: string, duration: number, freqFunc: (t: number) => number) {
  const sampleRate = 8000;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate, 28); // Byte rate
  buffer.writeUInt16LE(1, 32); // Block align
  buffer.writeUInt16LE(8, 34); // Bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = freqFunc(t);
    const sample = Math.floor(128 + 127 * Math.sin(2 * Math.PI * freq * t));
    buffer.writeUInt8(sample, 44 + i);
  }

  fs.writeFileSync(path.join(ASSETS_DIR, filename), buffer);
}

async function main() {
  await generateSpritesheet();

  // Jump sound: rising frequency
  generateWav('jump.wav', 0.2, (t) => 400 + t * 2000);
  
  // Fall sound: falling frequency
  generateWav('fall.wav', 0.5, (t) => 800 - t * 1200);

  // Break sound: noise-like
  generateWav('break.wav', 0.1, (t) => Math.random() * 1000);

  console.log('Assets generated successfully.');
}

main().catch(console.error);
