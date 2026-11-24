export type RouteMetadata = { title: string; description: string; file: string; archived?: boolean; modified?: string };
export type SiteMetadata = { name: string; origin: string; description: string; email: string; previewImage: string; previewWidth: number; previewHeight: number; address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string }; services: string[] };

export function metadataFor(path: string, site: SiteMetadata, route?: RouteMetadata) {
  const title = route?.title ?? `Page not found | ${site.name}`;
  const description = route?.description ?? '';
  const canonical = route ? new URL(path === '/' ? '/' : `${path.replace(/\/$/, '')}/`, site.origin).href : '';
  const article = Boolean(route && !route.archived && (/^\/feed\/.+/.test(path) || /^\/work\/.+/.test(path)));
  const image = new URL(site.previewImage, site.origin).href;
  const fields: [string, string, string][] = [
    ['name', 'application-name', site.name],
    ['name', 'author', site.name],
    ['name', 'robots', !route || route.archived ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
    ['name', 'description', description],
    ['property', 'og:type', article ? 'article' : 'website'],
    ['property', 'og:locale', 'en_CA'],
    ['property', 'og:site_name', site.name],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', canonical],
    ['property', 'og:image', image],
    ['property', 'og:image:width', String(site.previewWidth)],
    ['property', 'og:image:height', String(site.previewHeight)],
    ['property', 'og:image:alt', 'Fyntix — Search & AI Visibility · Paid Media & Content'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', 'Fyntix — Search & AI Visibility · Paid Media & Content'],
    ['property', 'article:modified_time', article && route?.modified ? `${route.modified}T00:00:00+06:00` : ''],
    ['property', 'article:author', article ? `${site.origin}/about/` : ''],
  ];
  return { title, description, canonical, fields, graph: route && !route.archived ? structuredData(path, site, route, canonical, article) : null };
}

function structuredData(path: string, site: SiteMetadata, route: RouteMetadata, canonical: string, article: boolean) {
  const business = `${site.origin}/#organization`, website = `${site.origin}/#website`, page = `${canonical}#webpage`;
  const kind = path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : ['/work', '/feed', '/services'].includes(path) ? 'CollectionPage' : 'WebPage';
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': business, name: site.name, url: `${site.origin}/`, description: site.description, email: site.email, logo: new URL('/brand-assets/fyntix-social.png', site.origin).href, address: { '@type': 'PostalAddress', ...site.address }, knowsAbout: site.services, hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Fyntix growth services', itemListElement: site.services.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, provider: { '@id': business } } })) } },
    { '@type': 'WebSite', '@id': website, name: site.name, url: `${site.origin}/`, description: site.description, publisher: { '@id': business }, inLanguage: 'en-CA' },
    { '@type': kind, '@id': page, name: route.title, description: route.description, url: canonical, isPartOf: { '@id': website }, about: { '@id': business }, inLanguage: 'en-CA', ...(route.modified ? { dateModified: route.modified } : {}) },
  ];
  if (article) graph.push({ '@type': path.startsWith('/feed/') ? 'BlogPosting' : 'Article', '@id': `${canonical}#article`, headline: route.title.replace(/ \| Fyntix$/, ''), description: route.description, mainEntityOfPage: { '@id': page }, author: { '@id': business }, publisher: { '@id': business }, image: new URL(site.previewImage, site.origin).href, inLanguage: 'en-CA', ...(route.modified ? { dateModified: route.modified } : {}) });
  if (path !== '/') {
    const items = [{ name: 'Home', url: `${site.origin}/` }];
    const parent = path.startsWith('/feed/') ? ['/feed', 'Blogs'] : path.startsWith('/work/') ? ['/work', 'Work'] : null;
    if (parent) items.push({ name: parent[1], url: `${site.origin}${parent[0]}/` });
    items.push({ name: route.title.replace(/ \| Fyntix$/, ''), url: canonical });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumbs`, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })) });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function jsonForHtml(data: unknown) {
  return JSON.stringify(data).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
}
