import { readFile, writeFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const sitePath = 'src/data/site.json';
const site = JSON.parse(await readFile(sitePath, 'utf8'));
const argument = process.argv[2];
const candidate = argument === '--auto'
  ? process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  : argument;
if (!candidate) {
  if (site.origin === 'https://fyntix.example') console.warn('Set SITE_URL to your new public site URL before publishing. See README.md.');
  process.exit(0);
}
const url = new URL(/^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`);
if (!['https:', 'http:'].includes(url.protocol)) throw Error('Use an http or https site URL.');
const target = url.origin;
const previous = site.origin;
if (target === previous) process.exit(0);
const extensions = new Set(['.json', '.md', '.txt', '.xml', '.html', '.ts', '.tsx', '.css', '.mjs', '.svg', '.webmanifest']);
async function update(path) {
  const text = await readFile(path, 'utf8');
  const changed = text.replaceAll(previous, target);
  if (changed !== text) await writeFile(path, changed);
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && extensions.has(extname(path))) await update(path);
  }
}
for (const directory of ['src', 'content', 'public']) await walk(directory);
await update('index.html');
console.log(`Configured public site origin: ${target}`);
