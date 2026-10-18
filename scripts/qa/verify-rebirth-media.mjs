import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const strict = process.argv.includes('--strict');
const count = 12;
const missing = [];
const present = [];
for (let index = 1; index <= count; index += 1) {
  const name = `food-${String(index).padStart(2, '0')}.webp`;
  const full = resolve(process.cwd(), 'public/images/rebirth', name);
  if (!existsSync(full) || statSync(full).size === 0) missing.push(name);
  else present.push({ name, bytes: statSync(full).size });
}
console.log(`Tuscanini real food media: ${present.length}/${count} expected images committed.`);
for (const file of present) console.log(`  ✓ ${file.name} (${Math.round(file.bytes / 1024)} KiB)`);
for (const name of missing) console.warn(`  MISSING: ${name}`);
if (missing.length > 0) console.warn('INCOMPLETE MEDIA: do not approve visuals or merge as production-ready.');
if (strict && missing.length) process.exitCode = 1;
