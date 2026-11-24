import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CONSENT_COOKIE, CONSENT_MAX_AGE, parseChoice, choiceCookie, saveChoice, getChoice } from '../src/consent.ts';
import { metadataFor, jsonForHtml } from '../src/seo.ts';

const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const manifest = JSON.parse(await readFile('src/data/routes.json', 'utf8'));
const now = 1800000000000;
const cookie = value => `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}`;

test('missing, imported, malformed, wrong-version and expired choices never authorise media', () => {
  for (const header of ['', 'aa_cookie_consent=accepted', `${CONSENT_COOKIE}=%broken`, cookie({ version: 2, externalMedia: true, savedAt: now }), cookie({ version: 1, externalMedia: 'true', savedAt: now }), cookie({ version: 1, externalMedia: true, savedAt: now + 1 }), cookie({ version: 1, externalMedia: true, savedAt: now - CONSENT_MAX_AGE * 1000 })]) {
    assert.equal(parseChoice(header, now), null, header);
  }
});

test('valid accept and reject choices round-trip, including among other cookies', () => {
  for (const externalMedia of [true, false]) {
    const value = { version: 1, externalMedia, savedAt: now - 100 };
    assert.deepEqual(parseChoice(`other=value; ${cookie(value)}; another=value`, now), value);
    const stored = choiceCookie(value, true);
    assert.match(stored, /Max-Age=15552000; SameSite=Lax; Secure$/);
    assert.doesNotMatch(stored, /Domain=/);
    assert.doesNotMatch(choiceCookie(value, false), /Secure/);
  }
});

test('saving and withdrawing media consent takes effect immediately and removes the imported preference', () => {
  const old = { document: globalThis.document, location: globalThis.location, window: globalThis.window };
  const jar = new Map([['aa_cookie_consent', 'accepted']]);
  const writes = [];
  globalThis.document = { get cookie() { return [...jar].map(([name, value]) => `${name}=${value}`).join('; '); }, set cookie(value) { writes.push(value); const [pair] = value.split(';'); const at = pair.indexOf('='); if (value.includes('Max-Age=0')) jar.delete(pair.slice(0, at)); else jar.set(pair.slice(0, at), pair.slice(at + 1)); } };
  globalThis.location = { protocol: 'https:' };
  globalThis.window = new EventTarget();
  try {
    assert.equal(getChoice(), null);
    assert.equal(saveChoice(true), true);
    assert.equal(getChoice().externalMedia, true);
    assert.equal(jar.has('aa_cookie_consent'), false);
    assert.equal(saveChoice(false), true);
    assert.equal(getChoice().externalMedia, false);
    assert.equal(parseChoice(document.cookie).externalMedia, false);
    assert.ok(writes.every(value => value.includes('Secure')));
    globalThis.document = { get cookie() { throw Error('Storage blocked'); }, set cookie(_) { throw Error('Storage blocked'); } };
    assert.equal(saveChoice(true), false);
    assert.equal(getChoice().externalMedia, true, 'Choice still applies for this visit');
  } finally { Object.assign(globalThis, old); }
});

test('every route has consistent, distinct Fyntix search and sharing metadata', () => {
  const titles = new Set();
  for (const [path, route] of Object.entries(manifest)) {
    const metadata = metadataFor(path, site, route);
    assert.ok(route.title.includes('Fyntix'), path);
    assert.ok(route.description.length > 60, path);
    assert.ok(!titles.has(route.title), `Duplicate title: ${route.title}`);
    titles.add(route.title);
    assert.equal(new URL(metadata.canonical).origin, site.origin);
    const fields = new Map(metadata.fields.map(([, key, value]) => [key, value]));
    assert.equal(fields.get('og:title'), route.title);
    assert.equal(fields.get('twitter:description'), route.description);
    assert.equal(fields.get('og:url'), metadata.canonical);
    assert.match(fields.get('og:image'), /^https:\/\//);
    assert.doesNotMatch(route.title + route.description, /RCCO|andabove\.com|London|Tesco|Faculty|engineers embedded/i, path);
    if (route.archived) { assert.equal(metadata.graph, null); assert.match(fields.get('robots'), /noindex/); }
    else { assert.equal(metadata.graph['@graph'][0].email, 'info@fyntix.com'); assert.match(fields.get('robots'), /^index/); }
  }
});

test('article metadata is cleared when moving to a normal, archived or missing page', () => {
  const articlePath = Object.keys(manifest).find(path => path.startsWith('/feed/') && !manifest[path].archived);
  const article = new Map(metadataFor(articlePath, site, manifest[articlePath]).fields.map(([, key, value]) => [key, value]));
  assert.equal(article.get('og:type'), 'article');
  assert.ok(article.get('article:modified_time'));
  for (const path of ['/', '/agent-mesh', '/missing-route']) {
    const metadata = metadataFor(path, site, manifest[path]);
    const fields = new Map(metadata.fields.map(([, key, value]) => [key, value]));
    assert.equal(fields.get('og:type'), 'website');
    assert.equal(fields.get('article:modified_time'), '');
    assert.equal(fields.get('article:author'), '');
  }
  const missing = metadataFor('/missing-route', site);
  assert.equal(missing.canonical, ''); assert.equal(missing.graph, null);
  assert.equal(missing.title, 'Page not found | Fyntix');
});

test('structured data cannot close its script element', () => {
  const value = { name: '</script><script>alert(1)</script>&' };
  const output = jsonForHtml(value);
  assert.ok(!output.includes('<'));
  assert.deepEqual(JSON.parse(output), value);
});

test('generated route HTML agrees with runtime metadata, and archived URLs stay out of the sitemap', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  for (const [path, route] of Object.entries(manifest)) {
    const metadata = metadataFor(path, site, route);
    const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8');
    const page = JSON.parse(await readFile(`dist${route.file}`, 'utf8'));
    assert.equal(page.title, route.title, path);
    assert.equal(page.description, route.description, path);
    assert.ok(html.includes(metadata.canonical), path);
    assert.ok(html.includes(route.archived ? 'content="noindex, follow"' : 'content="index, follow, max-image-preview:large"'), path);
    assert.equal(sitemap.includes(`<loc>${metadata.canonical}</loc>`), !route.archived, path);
    for (const section of page.sections) {
      for (const footer of section.html.match(/<footer\b[\s\S]*?<\/footer>/g) ?? []) {
        assert.doesNotMatch(footer, /href="\/(?:agent-mesh|agent-run-websites)\/?"/, path);
        assert.ok(footer.includes('footer-cookie-settings'), path);
      }
    }
  }
});

test('legal pages use Fyntix contact details and describe the actual form and cookie behaviour', async () => {
  for (const slug of ['privacy-policy', 'terms', 'cookie-policy', 'data-protection']) {
    const page = JSON.parse(await readFile(`dist/page-data/${slug}.json`, 'utf8'));
    const html = page.sections[0].html;
    assert.ok(html.includes('info@fyntix.com'), slug);
    assert.doesNotMatch(html, /RCCO|andabove\.com|Copperfield|Data Protection Act 2018|28 days|5 years/, slug);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, slug);
  }
  const privacy = await readFile('dist/page-data/privacy-policy.json', 'utf8');
  assert.ok(privacy.includes('not currently connected to a submission service'));
  const cookiePolicy = await readFile('dist/page-data/cookie-policy.json', 'utf8');
  assert.ok(cookiePolicy.includes('180 days'));
  assert.ok(cookiePolicy.includes('blocked until you allow external media'));
});
