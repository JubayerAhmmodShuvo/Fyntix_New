import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { Definitions, Navigation, VideoDialog, type Video } from './chrome';
import { CookieConsent } from './privacy';
import './privacy.css';
import { HumanContent, connectContent, type Page } from './content';
import { backgroundFor, connectMotion, type ShowVideo } from './motion';
import routeManifest from './data/routes.json';
import site from './data/site.json';
import { metadataFor, jsonForHtml, type RouteMetadata } from './seo';
import './data/reference.css';
import './replica.css';
import './taffy-growth.css';
import './taffy-results.css';
import './taffy-process.css';
import './taffy-process-typography.css';
import './taffy-report.css';
import './section-headings.css';
import './bw-law-charts.css';
import './buttons.css';
import './smartrent-thumbnail.css';
import './sidekik-thumbnail.css';
import './spartan-thumbnail.css';
import './spartan-charts.css';
import './sidekik-charts.css';
import './pmt-case-study.css';
import './blogs.css';
import './brown-boys-case-study.css';
import './kent-state-case-study.css';

const manifest = routeManifest as Record<string, RouteMetadata>;
const pages = new Map<string, Promise<Page>>();
const pathFor = (path: string) => path.replace(/\/+$/, '') || '/';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function load(path: string) {
  const existing = pages.get(path); if (existing) return existing;
  const data = manifest[path];
  if (!data) return Promise.resolve<Page>({ path, title: `Page not found | ${site.name}`, description: '', classes: 'page-shell relative min-h-screen pointer-events-auto', sections: [] });
  const pending = fetch(data.file).then(async (response) => {
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return await response.json() as Page;
  }).catch((err) => { pages.delete(path); throw err; });
  pages.set(path, pending); return pending;
}
function metadata(page: Page) {
  const metadata = metadataFor(page.path, site, manifest[page.path]);
  document.title = metadata.title;
  for (const [attribute, key, value] of metadata.fields) {
    const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!value) { existing?.remove(); continue; }
    const node = existing ?? document.createElement('meta');
    node.setAttribute(attribute, key); node.content = value;
    if (!existing) document.head.append(node);
  }
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!metadata.canonical) existing?.remove();
  else {
    const node = existing ?? document.createElement('link');
    node.rel = 'canonical'; node.href = metadata.canonical;
    if (!existing) document.head.append(node);
  }
  const structured = document.getElementById('fyntix-structured-data');
  if (!metadata.graph) structured?.remove();
  else {
    const node = structured ?? document.createElement('script');
    node.id = 'fyntix-structured-data'; node.setAttribute('type', 'application/ld+json');
    node.textContent = jsonForHtml(metadata.graph);
    if (!structured) document.head.append(node);
  }
}
function viewport() {
  let width = 0;
  const update = () => {
    const root = document.documentElement;
    if (innerWidth !== width || !matchMedia('(pointer: coarse)').matches) { width = innerWidth; root.style.setProperty('--vv-stable-height', `${innerHeight}px`); }
    root.style.setProperty('--vv-offset-top', `${visualViewport?.offsetTop ?? 0}px`);
  };
  update(); window.addEventListener('resize', update); visualViewport?.addEventListener('resize', update); visualViewport?.addEventListener('scroll', update);
  return () => { window.removeEventListener('resize', update); visualViewport?.removeEventListener('resize', update); visualViewport?.removeEventListener('scroll', update); };
}
function jump(hash: string, smooth: boolean) {
  let id: string;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const node = document.getElementById(id); if (!node) return;
  const offset = location.pathname === '/agent-run-websites' ? 72 : (innerWidth < 768 ? 5.5 : 7) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  window.scrollTo({ top: scrollY + node.getBoundingClientRect().top - offset, behavior: smooth && !reduced() ? 'smooth' : 'instant' });
}

function App({ first }: { first: Page }) {
  const firstIntro = useRef(first.path === '/' && !reduced());
  const [page, setPage] = useState(first), [intro, setIntro] = useState(firstIntro.current);
  const [cookie, setCookie] = useState(0), [dark, setDark] = useState(['/feed', '/feed/press', '/brand', '/agent-run-websites'].includes(first.path));
  const [video, setVideo] = useState<Video>(), [failed, setFailed] = useState(false);
  const main = useRef<HTMLElement>(null), background = useRef<HTMLDivElement>(null), wrapper = useRef<HTMLDivElement>(null), blur = useRef<HTMLDivElement>(null);
  const current = useRef(first.path), epoch = useRef(0), oldPositions = useRef(new Map<string, number>());
  const pendingPosition = useRef<number | 'anchor'>(location.hash ? 'anchor' : 0), initialized = useRef(false);
  const openVideo = useCallback<ShowVideo>((item) => setVideo(item), []);
  useLayoutEffect(viewport, []);
  useLayoutEffect(() => { document.documentElement.classList.add('glass-liquid-enabled'); }, []);
  useEffect(() => { if (intro) { const timer = setTimeout(() => setIntro(false), 1960); return () => clearTimeout(timer); } }, [intro]);
  useLayoutEffect(() => {
    if (!main.current || !background.current) return;
    const host = main.current;
    const clean = connectContent(host, () => setCookie((n) => n + 1), openVideo);
    const motion = connectMotion(host, background.current, page.path, firstIntro.current && page.path === '/', setDark, openVideo);
    firstIntro.current = false;
    return () => { clean(); motion(); };
  }, [page, openVideo]);
  useLayoutEffect(() => {
    metadata(page);
    if (pendingPosition.current === 'anchor') { jump(location.hash, false); void document.fonts.ready.then(() => jump(location.hash, false)); }
    else window.scrollTo({ top: pendingPosition.current, behavior: 'instant' });
    if (!initialized.current) { initialized.current = true; return; }
    if (wrapper.current && !reduced()) {
      const animation = gsap.fromTo(wrapper.current, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: .32, ease: 'power2.out', clearProps: 'opacity,filter' });
      return () => { animation.kill(); };
    }
  }, [page]);
  useEffect(() => {
    const update = () => { if (blur.current) blur.current.style.opacity = String(Math.min(1, scrollY / (2 * parseFloat(getComputedStyle(document.documentElement).fontSize)))); };
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [page]);

  const navigate = useCallback((target: string, pop = false) => {
    const url = new URL(target, location.origin), path = pathFor(url.pathname);
    const previous = current.current;
    const revision = ++epoch.current;
    const restored = pop ? oldPositions.current.get(path) ?? 0 : 0;
    oldPositions.current.set(previous, scrollY);
    if (!pop) history.pushState({}, '', url.pathname + url.search + url.hash);
    if (previous === path) {
      if (url.hash) jump(url.hash, !pop); else window.scrollTo({ top: restored, behavior: 'instant' });
      return;
    }
    const transition = wrapper.current && !reduced() ? gsap.to(wrapper.current, { opacity: 0, filter: 'blur(8px)', duration: .16, ease: 'power2.in', overwrite: true }).then() : Promise.resolve();
    void Promise.all([load(path), transition]).then(([next]) => {
      if (revision !== epoch.current) return;
      pendingPosition.current = url.hash ? 'anchor' : restored; current.current = path;
      setIntro(false); setFailed(false); setVideo(undefined); setPage(next);
    }).catch(() => {
      if (revision !== epoch.current) return;
      setFailed(true); if (wrapper.current) gsap.set(wrapper.current, { clearProps: 'opacity,filter' });
    });
  }, []);
  useEffect(() => {
    const pop = () => navigate(location.href, true);
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || (!manifest[pathFor(url.pathname)] && !link.getAttribute('href')?.startsWith('#'))) return;
      event.preventDefault(); navigate(url.href);
    };
    const prefetch = (event: PointerEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link) return;
      const url = new URL(link.href), path = pathFor(url.pathname);
      if (url.origin === location.origin && manifest[path] && current.current !== path) void load(path).catch(() => {});
    };
    history.scrollRestoration = 'manual'; window.addEventListener('popstate', pop);
    document.addEventListener('click', click); document.addEventListener('pointerover', prefetch, { passive: true });
    return () => { window.removeEventListener('popstate', pop); document.removeEventListener('click', click); document.removeEventListener('pointerover', prefetch); };
  }, [navigate]);
  return <>
    <Definitions />
    <div ref={background} id="canvas-wrapper" className="replica-background fixed-visual-viewport pointer-events-none z-0" style={{ backgroundColor: backgroundFor(page.path) }} aria-hidden="true" />
    <div className="replica-shell">
      <div ref={blur} className="scroll-top-blur-bar pointer-events-none fixed inset-x-0 z-20 h-8" data-v-211cc619="" aria-hidden="true" />
      <div ref={wrapper} className="relative w-full pointer-events-none">
        <main key={page.path} ref={main} id="main-content" className={page.classes}>
          {!manifest[page.path] ? <section className="px-gutter max-md:px-gutter-mobile flex min-h-screen flex-col items-center justify-center gap-6 pointer-events-auto"><h1 className="text-7xl">Page not found</h1><a href="/" className="underline">Back to home</a></section> : <HumanContent page={page} />}
        </main>
      </div>
    </div>
    <Navigation path={page.path} dark={dark} intro={intro} navigate={navigate} />
    <CookieConsent request={cookie} />
    {video && <VideoDialog {...video} close={() => { video.onClose?.(); setVideo(undefined); }} />}
    {failed && <p role="alert" className="replica-toast">This page could not load. <button className="underline" type="button" onClick={() => location.reload()}>Retry</button></p>}
  </>;
}

const root = createRoot(document.getElementById('root')!);
void load(pathFor(location.pathname)).then((first) => root.render(<App first={first} />)).catch(() => root.render(<main className="px-gutter py-32"><h1>Page could not load</h1><button type="button" onClick={() => location.reload()}>Retry</button></main>));
