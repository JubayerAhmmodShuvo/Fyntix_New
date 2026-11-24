import { readFile, writeFile, readdir } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');
const json = async path => JSON.parse(await read(path));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const plain = text => text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replaceAll('**', '').replace(/\s+/g, ' ').trim();
const origin = (await json('src/data/site.json')).origin;
const revised = '2026-11-24';
const revisedLabel = '24 Nov 2026';
const manifest = await json('src/data/routes.json');
const mapping = await json('content/blog-map.json');
const topics = {
  'Growth strategy': { theme: 'strategy', cover: 'Connect the dots.', service: '/services', group: 'Search, paid media & content' },
  'SEO': { theme: 'seo', cover: 'Be found.', service: '/services#service-seo', group: 'Search & AI Visibility' },
  'AI search visibility': { theme: 'ai', cover: 'Answer clearly.', service: '/services#service-ai-search-visibility', group: 'Search & AI Visibility' },
  'Google Ads': { theme: 'ads', cover: 'Reach intent.', service: '/services#service-google-ads', group: 'Paid Media & Content' },
  'Meta & TikTok Ads': { theme: 'social', cover: 'Make it relevant.', service: '/services#service-paid-social', group: 'Paid Media & Content' },
  'Content strategy': { theme: 'content', cover: 'Make it useful.', service: '/services#service-content-strategy', group: 'Paid Media & Content' },
  'Measurement': { theme: 'measurement', cover: 'Know what changed.', service: '/services', group: 'Growth planning & reporting' },
};

const posts = await Promise.all(mapping.map(async entry => {
  const source = await read(entry.file);
  const match = source.match(/^---\ncategory: ([^\n]+)\nsummary: ([^\n]+)\n---\n# ([^\n]+)\n([\s\S]*)$/);
  if (!match) throw Error(`Invalid article source: ${entry.file}`);
  const [, category, summary, title, body] = match;
  if (!topics[category]) throw Error(`Unknown article category: ${category}`);
  const wordCount = plain(body).split(/\s+/).filter(Boolean).length;
  if (wordCount < 340) throw Error(`Article needs a full rewrite: ${entry.file} (${wordCount} words)`);
  const oldPage = await json(`public${manifest[entry.route].file}`);
  const oldHeading = oldPage.sections[0].html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim();
  return { ...entry, category, summary, title, body: body.trim(), wordCount, readingTime: Math.max(2, Math.ceil(wordCount / 210)), oldHeading };
}));
if (posts.length !== 58 || new Set(posts.map(post => post.route)).size !== 58) throw Error('Expected 58 unique articles.');
const byRoute = new Map(posts.map(post => [post.route, post]));

function inline(text) {
  return escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (!/^(https:\/\/|\/|#)/.test(href)) throw Error('Unsupported article link.');
    return `<a href="${href}"${href.startsWith('https:') ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
}

function renderBody(post) {
  const blocks = post.body.split(/\n\s*\n/);
  const contents = [];
  let heading = 0;
  const html = blocks.map(block => {
    if (block.startsWith('## ')) {
      const title = block.slice(3).trim();
      const id = `blog-${post.id}-section-${++heading}`;
      contents.push({ title, id });
      return `<h2 id="${id}">${inline(title)}</h2>`;
    }
    if (block.startsWith('|')) {
      const rows = block.split('\n').map(row => row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
      const [head, , ...body] = rows;
      return `<div class="blog-table-scroll"><table><thead><tr>${head.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr>${row.map((cell, i) => i ? `<td>${inline(cell)}</td>` : `<th scope="row">${inline(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    if (block.startsWith('- ')) return `<ul>${block.split('\n').map(line => `<li>${inline(line.replace(/^- /, ''))}</li>`).join('')}</ul>`;
    return `<p>${inline(block.replaceAll('\n', ' '))}</p>`;
  }).join('\n');
  return { html, contents };
}

function cover(post) {
  const topic = topics[post.category];
  const art = {
    strategy: '<path d="M50 210H170V100H310V155H510"/><circle cx="50" cy="210" r="16"/><circle cx="170" cy="100" r="16"/><circle cx="310" cy="155" r="16"/><circle cx="510" cy="155" r="16"/>',
    seo: '<rect x="75" y="176" width="80" height="90" rx="14"/><rect x="190" y="120" width="80" height="146" rx="14"/><rect x="305" y="60" width="80" height="206" rx="14"/><path d="M65 284H500"/>',
    ai: '<rect x="75" y="55" width="350" height="180" rx="35"/><path d="M130 110H350M130 150H310M130 190H265M340 235L390 280V235"/>',
    ads: '<circle cx="300" cy="160" r="120"/><circle cx="300" cy="160" r="75"/><circle cx="300" cy="160" r="27"/><path d="M50 160H120M480 160H550"/>',
    social: '<rect x="95" y="55" width="150" height="220" rx="30" transform="rotate(-10 170 165)"/><rect x="285" y="35" width="150" height="220" rx="30" transform="rotate(9 360 145)"/><circle cx="170" cy="140" r="37"/><path d="M320 115H390M320 150H375M145 205H195"/>',
    content: '<rect x="125" y="35" width="300" height="245" rx="28"/><path d="M185 100H350M185 145H365M185 190H315M185 235H275"/>',
    measurement: '<path d="M65 260H520M95 260V165H165V260M240 260V110H310V260M385 260V60H455V260"/><path d="M100 100L250 55L430 20"/>',
  }[topic.theme];
  return `<div class="blog-cover blog-cover--${topic.theme}" aria-hidden="true"><span class="blog-cover-topic">${escape(post.category)}</span><svg viewBox="0 0 600 320" focusable="false">${art}</svg><span class="blog-cover-word">${escape(topic.cover)}</span></div>`;
}

function card(post) {
  return `<a class="blog-card" href="${post.route}">${cover(post)}<div class="blog-card-copy"><p class="blog-card-title">${escape(post.title)}</p><p class="blog-card-summary">${escape(post.summary)}</p><p class="blog-card-meta">Fyntix Editorial · ${post.readingTime} min read</p></div></a>`;
}

function related(post) {
  const same = posts.filter(other => other.id !== post.id && other.category === post.category);
  const different = posts.filter(other => other.id !== post.id && other.category !== post.category);
  return [...same.slice(0, 2), ...different].slice(0, 3);
}

function footerBlogs(html) {
  return html.replace(/(<nav\b[^>]*aria-label="Inside Fyntix"[^>]*>)([\s\S]*?)(<\/nav>)/g, (_, open, contents, close) => {
    const without = contents.replace(/<a\b[^>]*href="\/feed\/?"[^>]*>[\s\S]*?<\/a>/g, '');
    const about = without.match(/<a\b[^>]*href="\/about\/?"[^>]*>[\s\S]*?<\/a>/)?.[0];
    if (!about) throw Error('Inside Fyntix footer needs an About link.');
    const blogs = about.replace(/href="\/about\/?"/, 'href="/feed"').replace(/>About</g, '>Blogs<');
    return open + without.replace(about, about + blogs) + close;
  });
}

const services = await json('public/page-data/services.json');
const footer = structuredClone(services.sections.at(-1));
footer.html = footerBlogs(footer.html);

function articlePage(post) {
  const body = renderBody(post);
  const topic = topics[post.category];
  const toc = `<nav class="blog-contents" aria-label="On this page"><p>On this page</p><ol>${body.contents.map(item => `<li><a href="#${item.id}">${escape(item.title)}</a></li>`).join('')}</ol></nav>`;
  const article = `<div class="w-full bg-chalk"><section class="blog-reading-shell pointer-events-auto" data-v-1c6297c3><nav class="blog-breadcrumb" aria-label="Breadcrumb"><a href="/feed">Blogs</a><span aria-hidden="true">/</span><span>${escape(post.category)}</span></nav><article aria-labelledby="blog-${post.id}-title"><header class="blog-article-header"><p class="blog-eyebrow">${escape(topic.group)}</p><h1 id="blog-${post.id}-title">${escape(post.title)}</h1><p class="blog-article-summary">${escape(post.summary)}</p><p class="blog-byline">Fyntix Editorial · Updated <time datetime="${revised}">${revisedLabel}</time> · ${post.readingTime} min read</p></header>${toc}<div class="blog-prose">${body.html}</div><aside class="blog-service-callout" aria-label="Work with Fyntix"><p class="blog-eyebrow">Put the idea into practice</p><h2>Plan your next step with Fyntix.</h2><p>Connect your audience and offer with a practical plan for search visibility, paid media and useful content.</p><div class="blog-callout-links"><a href="/contact" class="inline-flex items-center justify-center rounded-full">Book a free strategy call</a><a href="${topic.service}">Explore the relevant service</a></div></aside></article></section></div>`;
  const next = `<aside class="blog-related bg-charcoal pointer-events-auto" aria-labelledby="blog-related-heading"><section class="blog-index-shell" data-v-1c6297c3><p class="blog-eyebrow">Keep reading</p><h2 id="blog-related-heading" class="blog-section-heading">More useful growth ideas.</h2><div class="blog-index-grid">${related(post).map(card).join('')}</div></section></aside>`;
  return { path: post.route, title: `${post.title} | Fyntix`, description: post.summary, classes: 'page-shell w-full relative min-h-screen pointer-events-auto', sections: [
    { tag: 'div', attributes: { class: 'view-mode-section view-mode-section__branch view-mode-section__branch--human' }, html: article },
    { tag: 'div', attributes: { class: 'view-mode-section view-mode-section__branch view-mode-section__branch--human' }, html: next },
    structuredClone(footer),
  ] };
}

const featuredIds = [2, 48, 30, 34, 22, 50, 11, 36, 54, 12, 39, 57];
const featured = featuredIds.map(id => posts.find(post => post.id === id));
const archived = posts.filter(post => !featuredIds.includes(post.id));
const topicList = Object.keys(topics).map(name => `<span>${escape(name)}</span>`).join('');
const indexHtml = `<div class="w-full bg-charcoal"><section class="blog-index-shell blog-index-intro pointer-events-auto" data-v-1c6297c3><header class="blog-index-header"><p class="blog-eyebrow">Blogs</p><h1>Practical ideas for<br><em>business growth.</em></h1><p>Search &amp; AI Visibility. Paid Media &amp; Content.<br>Useful guidance for being found, understood and chosen.</p><div class="blog-topic-list" aria-label="Topics covered">${topicList}</div></header><h2 class="blog-section-heading">Start here</h2><div class="blog-index-grid">${featured.map(card).join('')}</div></section><section class="blog-index-shell blog-archive pointer-events-auto" aria-labelledby="blog-archive-heading"><div class="blog-archive-heading"><h2 id="blog-archive-heading" class="blog-section-heading">More articles</h2><p>${posts.length} practical guides across Fyntix's services.</p></div><ul>${archived.map(post => `<li><a href="${post.route}"><div><span class="blog-archive-category">${escape(post.category)}</span><h3>${escape(post.title)}</h3><p>${escape(post.summary)}</p></div><span class="blog-archive-time">${post.readingTime} min read</span></a></li>`).join('')}</ul></section></div>`;
const home = { path: '/feed', title: 'Blogs | Fyntix', description: 'Practical Fyntix guides to SEO, AI search visibility, Google Ads, Meta and TikTok campaigns, content strategy and growth reporting.', classes: 'page-shell w-full relative min-h-screen pointer-events-auto', sections: [
  { tag: 'div', attributes: { class: 'view-mode-section view-mode-section__branch view-mode-section__branch--human' }, html: indexHtml },
  structuredClone(footer),
] };

for (const post of posts) {
  const page = articlePage(post);
  await writeJson(`public${manifest[post.route].file}`, page);
  manifest[post.route] = { ...manifest[post.route], title: page.title, description: page.description };
}
await writeJson('public/page-data/feed.json', home);
manifest['/feed'] = { ...manifest['/feed'], title: home.title, description: home.description };
await writeJson('src/data/routes.json', manifest);

// Retain existing pages while updating their shared footer and article references.
for (const file of await readdir('public/page-data')) {
  if (!file.endsWith('.json')) continue;
  const path = `public/page-data/${file}`;
  const page = await json(path);
  let changed = false;
  for (const section of page.sections) {
    let html = footerBlogs(section.html);
    if (!byRoute.has(page.path) && page.path !== '/feed') {
      html = html.replace(/<a\b([^>]*\bhref="(\/feed\/[^"#]+)"[^>]*)>([\s\S]*?)<\/a>/g, (whole, attrs, route, inner) => {
        const post = byRoute.get(route.replace(/\/$/, ''));
        if (!post) return whole;
        if (/class="[^"]*media-card/.test(attrs)) return card(post);
        const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (text === post.oldHeading) return `<a${attrs}>${escape(post.title)}</a>`;
        return whole;
      });
    }
    if (html !== section.html) { changed = true; section.html = html; }
  }
  if (changed) await writeJson(path, page);
}

const footerMd = `\n## Footer\n\n### Pages\n\n- [Home](${origin}/)\n- [Work](${origin}/work/)\n- [Services](${origin}/services/)\n\n### Inside Fyntix\n\n- [About](${origin}/about/)\n- [Blogs](${origin}/feed/)\n- [Careers](${origin}/careers/)\n\n### Legal\n\n- [Privacy](${origin}/privacy-policy/)\n- [T&C](${origin}/terms/)\n\n248 Coronation Dr, Scarborough, ON M1E 2J4, Canada\n`;
for (const post of posts) {
  const relatedMd = related(post).map(item => `- [${item.title}](${origin}${item.route}/)`).join('\n');
  const md = `---\ntitle: ${JSON.stringify(`${post.title} | Fyntix`)}\ncanonical_url: ${JSON.stringify(`${origin}${post.route}/`)}\nlast_updated: ${revised}\nmeta:\n  description: ${JSON.stringify(post.summary)}\n---\n\n# ${post.title}\n\n${post.category} · Fyntix Editorial · Updated ${revisedLabel}\n\n${post.summary}\n\n${post.body}\n\n## Work with Fyntix\n\n[Explore the relevant service](${origin}${topics[post.category].service})\n\n[Book a free strategy call](${origin}/contact/)\n\n## Related articles\n\n${relatedMd}\n${footerMd}`;
  await writeFile(`public${post.route}.md`, md);
}
const listingMd = `---\ntitle: "Blogs | Fyntix"\ncanonical_url: "${origin}/feed/"\nlast_updated: ${revised}\nmeta:\n  description: ${JSON.stringify(home.description)}\n---\n\n# Blogs\n\nPractical ideas for business growth.\n\nSearch & AI Visibility. Paid Media & Content.\n\n${posts.map(post => `## ${post.title}\n\n${post.category} · ${post.readingTime} min read\n\n${post.summary}\n\n[Read article](${origin}${post.route}/)`).join('\n\n')}\n${footerMd}`;
await writeFile('public/feed.md', listingMd);

const markdownPaths = [];
for (const route of Object.keys(manifest)) {
  const path = `public${route === '/' ? '/index' : route}.md`;
  let text;
  try { text = await read(path); } catch { continue; }
  text = text.replace(/### (?:Studio|Inside Fyntix)\n[\s\S]*?(?=\n#{1,3} |$)/g, `### Inside Fyntix\n\n- [About](${origin}/about/)\n- [Blogs](${origin}/feed/)\n- [Careers](${origin}/careers/)\n`);
  text = text.replace(/\[Feed\]\((?:https?:\/\/[^/]+)?\/feed(?:\.md|\/)?\)/g, `[Blogs](${origin}/feed/)`);
  await writeFile(path, text);
  markdownPaths.push({ route, path, text });
}
const sitemapPath = 'public/sitemap.xml';
let sitemap = await read(sitemapPath);
sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g, block => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) return block;
  const route = new URL(loc).pathname.replace(/\/$/, '') || '/';
  if (route !== '/feed' && !byRoute.has(route)) return block;
  return block.replace(/\s*<image:image>[\s\S]*?<\/image:image>/g, '').replace(/\s*<lastmod>[^<]+<\/lastmod>/g, '').replace('</url>', `    <lastmod>${revised}</lastmod>\n    </url>`);
});
await writeFile(sitemapPath, sitemap);

const groups = [['Pages', Object.entries(manifest).filter(([route]) => !route.startsWith('/feed/') && !route.startsWith('/work/'))], ['Work', Object.entries(manifest).filter(([route]) => route.startsWith('/work/'))], ['Blogs', posts.map(post => [post.route, manifest[post.route]])]];
const llms = `# Fyntix\n\n> Fyntix is a business growth agency offering Search & AI Visibility and Paid Media & Content.\n\nCanonical Origin: ${origin}/\n\nServices cover SEO, GEO, AEO, AIO, AI search visibility, Google Ads, Meta Ads, TikTok Ads, content strategy and creation, articles and blogs.\n\n[Full content](${origin}/llms-full.txt) · [Sitemap](${origin}/sitemap.xml)\n\n${groups.map(([name, entries]) => `## ${name}\n\n${entries.map(([route, meta]) => `- [${meta.title.replace(/ \| Fyntix$/, '')}](${origin}${route === '/' ? '/' : `${route}/`}): ${meta.description}`).join('\n')}`).join('\n\n')}\n`;
await writeFile('public/llms.txt', llms);
await writeFile('public/llms-full.txt', `# Fyntix\n\nSearch & AI Visibility · Paid Media & Content\n\n${markdownPaths.map(({ route, text }) => `---\n\nCanonical: ${origin}${route === '/' ? '/' : `${route}/`}\n\n${text}`).join('\n\n')}\n`);
console.log(`Compiled ${posts.length} service-focused articles (${posts.reduce((sum, post) => sum + post.wordCount, 0).toLocaleString()} words), Blogs listing, related links and footer navigation.`);
