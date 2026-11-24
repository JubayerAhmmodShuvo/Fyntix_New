import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { jsonForHtml, metadataFor } from '../src/seo.ts';

const manifest = JSON.parse(await readFile('src/data/routes.json', 'utf8'));
const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const template = await readFile('dist/index.html', 'utf8');
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function render(route, data) {
  const metadata = metadataFor(route, site, data);
  const fields = metadata.fields.filter(([, , value]) => value).map(([attribute, key, content]) => `<meta ${attribute}="${key}" content="${escape(content)}" />`);
  if (metadata.canonical) fields.push(`<link rel="canonical" href="${escape(metadata.canonical)}" />`);
  if (metadata.graph) fields.push(`<script id="fyntix-structured-data" type="application/ld+json">${jsonForHtml(metadata.graph)}</script>`);
  return template.replace(/<title>.*?<\/title>/s, () => `<title>${escape(metadata.title)}</title>`).replace('<!-- Page metadata -->', () => fields.join('\n    '));
}
for (const [route, metadata] of Object.entries(manifest)) {
  const file = join('dist', route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render(route, metadata));
}
const notFound = render('/404');
await mkdir('dist/404', { recursive: true });
await writeFile('dist/404/index.html', notFound);
await writeFile('dist/404.html', notFound);
