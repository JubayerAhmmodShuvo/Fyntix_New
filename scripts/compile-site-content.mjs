import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
const json = async path => JSON.parse(await read(path));
const writeJson = (path, data) => writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const site = await json('src/data/site.json');
const manifest = await json('src/data/routes.json');
const overrides = await json('content/page-metadata.json');
const revised = '2026-11-24';
const revisedLabel = '24 November 2026';

// Remove retired offerings only from shared footers; their URLs remain available.
export function footerNavigation(html) {
  return html.replace(/<footer\b[\s\S]*?<\/footer>/g, footer => {
    let updated = footer.replace(/<a\b[^>]*href="\/(?:agent-mesh|agent-run-websites)\/?"[^>]*>[\s\S]*?<\/a>/g, '');
    if (!updated.includes('footer-cookie-settings')) updated = updated.replace(/(<nav\b[^>]*aria-label="Legal"[^>]*>[\s\S]*?)(<\/nav>)/, '$1<button type="button" class="footer-cookie-settings">Cookie settings</button>$2');
    return updated;
  });
}

function inline(text) {
  return escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (!/^(https:\/\/|mailto:|\/|#)/.test(href)) throw Error('Unsupported policy link.');
    return `<a href="${href}"${href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
  });
}
function render(source) {
  return source.split(/\n\s*\n/).map(block => {
    if (block.startsWith('# ')) return '';
    if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
    if (block === '{{cookie-settings}}') return '<p><button type="button" class="footer-cookie-settings underline">Cookie settings</button></p>';
    if (block.startsWith('- ')) return `<ul>${block.split('\n').map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
    if (block.startsWith('|')) {
      const rows = block.split('\n').map(line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
      const [head, , ...body] = rows;
      return `<div class="fyntix-legal-table"><table><thead><tr>${head.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr>${row.map((cell, i) => i ? `<td>${inline(cell)}</td>` : `<th scope="row">${inline(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    return `<p>${inline(block.replaceAll('\n', ' '))}</p>`;
  }).join('\n');
}

const services = await json('public/page-data/services.json');
const footer = structuredClone(services.sections.at(-1));
footer.html = footerNavigation(footer.html);
for (const slug of ['privacy-policy', 'terms', 'cookie-policy', 'data-protection']) {
  const route = `/${slug}`;
  const source = (await read(`content/legal/${slug}.md`)).trim();
  const heading = source.match(/^# (.+)/)?.[1];
  if (!heading) throw Error(`Policy heading missing: ${slug}`);
  const metadata = overrides[route];
  manifest[route] = { ...manifest[route], file: manifest[route]?.file ?? `/page-data/${slug}.json`, ...metadata, modified: revised };
  const nav = '<nav aria-label="Fyntix legal pages"><a href="/privacy-policy">Privacy Policy</a><a href="/terms">T&amp;C</a><a href="/cookie-policy">Cookie Policy</a><a href="/data-protection">Client Data</a></nav>';
  const html = `<div class="fyntix-legal-shell"><article id="${slug}" class="fyntix-legal"><p class="fyntix-privacy-eyebrow">Fyntix · Legal</p><h1>${escape(heading)}</h1><p class="fyntix-legal-date">Updated <time datetime="${revised}">${revisedLabel}</time></p>${nav}${render(source)}</article></div>`;
  await writeJson(`public${manifest[route].file}`, { path: route, title: metadata.title, description: metadata.description, classes: 'page-shell w-full relative min-h-screen pointer-events-auto', sections: [{ tag: 'div', attributes: { class: 'view-mode-section view-mode-section__branch view-mode-section__branch--human' }, html }, structuredClone(footer)] });
  await writeFile(`public/${slug}.md`, `# ${heading}\n\nUpdated ${revisedLabel}\n\n${source.replace(/^# .+\n+/, '').replaceAll('{{cookie-settings}}', `[Cookie settings](${site.origin}/cookie-policy/)`)}\n\n## Contact Fyntix\n\ninfo@fyntix.com\n\n248 Coronation Dr, Scarborough, ON M1E 2J4, Canada\n`);
}

for (const [route, metadata] of Object.entries(overrides)) {
  if (!manifest[route]) throw Error(`Metadata refers to a missing route: ${route}`);
  manifest[route] = { ...manifest[route], ...metadata, modified: revised };
}
for (const [route, metadata] of Object.entries(manifest)) {
  if (!metadata.title.includes('Fyntix') || !metadata.description) throw Error(`Incomplete Fyntix metadata: ${route}`);
  metadata.modified ??= revised;
  const path = `public${metadata.file}`;
  const page = await json(path);
  page.title = metadata.title; page.description = metadata.description;
  page.sections = page.sections.map(section => ({ ...section, html: footerNavigation(section.html) }));
  await writeJson(path, page);
}
await writeJson('src/data/routes.json', manifest);

// Regenerate the metadata of human-readable exports rather than retaining imported company details.
const exports = [];
for (const [route, metadata] of Object.entries(manifest)) {
  const path = `public${route === '/' ? '/index' : route}.md`;
  let text;
  try { text = await read(path); } catch { continue; }
  text = text.replace(/^---\n[\s\S]*?\n---\n*/, '');
  text = text.replace(/(https?:\/\/www\.andabove\.com)(?=\/)/g, site.origin);
  const footerAt = text.indexOf('\n## Footer');
  if (footerAt !== -1) {
    text = text.slice(0, footerAt) + text.slice(footerAt).replace(/^.*\]\([^\n)]*\/(?:agent-mesh|agent-run-websites)(?:\.md|\/)?\).*\n?/gm, '');
  }
  const frontmatter = `---\ntitle: ${JSON.stringify(metadata.title)}\ncanonical_url: ${JSON.stringify(`${site.origin}${route === '/' ? '/' : `${route}/`}`)}\nlast_updated: ${revised}\nmeta:\n  description: ${JSON.stringify(metadata.description)}\n  "og:title": ${JSON.stringify(metadata.title)}\n  "og:description": ${JSON.stringify(metadata.description)}\n  "twitter:title": ${JSON.stringify(metadata.title)}\n  "twitter:description": ${JSON.stringify(metadata.description)}\n  robots: ${JSON.stringify(metadata.archived ? 'noindex, follow' : 'index, follow, max-image-preview:large')}\n---\n\n`;
  await writeFile(path, frontmatter + text.trim() + '\n');
  if (!metadata.archived) exports.push({ route, text: frontmatter + text.trim() });
}

const active = Object.entries(manifest).filter(([, metadata]) => !metadata.archived);
const canonical = route => `${site.origin}${route === '/' ? '/' : `${route}/`}`;
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${active.map(([route]) => `  <url><loc>${escape(canonical(route))}</loc><lastmod>${revised}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile('public/robots.txt', `# Fyntix public website\nUser-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
const groups = [ ['Pages', active.filter(([route]) => !route.startsWith('/feed/') && !route.startsWith('/work/'))], ['Work', active.filter(([route]) => route.startsWith('/work/'))], ['Blogs', active.filter(([route]) => route.startsWith('/feed/'))] ];
await writeFile('public/llms.txt', `# Fyntix\n\n> ${site.description}\n\nServices: ${site.services.join(', ')}.\n\nContact: ${site.email}\n\n248 Coronation Dr, Scarborough, ON M1E 2J4, Canada\n\n[Full content](${site.origin}/llms-full.txt) · [Sitemap](${site.origin}/sitemap.xml)\n\n${groups.map(([name, entries]) => `## ${name}\n\n${entries.map(([route, metadata]) => `- [${metadata.title.replace(/ \| Fyntix$/, '')}](${canonical(route)}): ${metadata.description}`).join('\n')}`).join('\n\n')}\n`);
await writeFile('public/llms-full.txt', `# Fyntix\n\n${site.description}\n\n${exports.map(({route, text}) => `---\n\nCanonical: ${canonical(route)}\n\n${text}`).join('\n\n')}\n`);
const webmanifest = await json('public/site.webmanifest');
await writeJson('public/site.webmanifest', { ...webmanifest, name: 'Fyntix', short_name: 'Fyntix', description: site.description, lang: 'en-CA', start_url: '/', scope: '/' });
console.log(`Updated Fyntix metadata on ${Object.keys(manifest).length} routes; ${active.length} indexed pages, four legal pages and all footer links synchronised.`);
