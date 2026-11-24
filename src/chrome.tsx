import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import glassFilter from './data/glass.svg?raw';
import { particleField } from './particles';
import { usePrivacyChoice } from './privacy';
import { openPrivacySettings } from './consent';

const wordmark = '/brand-assets/logos/wordmark/fyntix-navbar.png';
export const links = [['/work', 'Work'], ['/services', 'Services'], ['/feed', 'Blogs'], ['/about', 'About']];
export const buttonClass = 'relative inline-flex items-center justify-center overflow-hidden rounded-full tracking-tight cursor-pointer transition-all duration-150 ease-out text-center outline-hidden focus-visible:ring-2 focus-visible:ring-spark border font-normal text-lg py-3';
const filled = `${buttonClass} border-transparent text-chalk bg-slate-dark shadow-button hover:bg-portal-surface px-4`;
const outline = `${buttonClass} border-haze-300 text-slatecolor bg-chalk hover:bg-haze px-6`;
const fast = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const input = Object.assign(document.createElement('textarea'), { value: text });
    input.setAttribute('readonly', '');
    Object.assign(input.style, { position: 'fixed', left: '-9999px' });
    document.body.append(input); input.select();
    const ok = document.execCommand('copy'); input.remove(); return ok;
  }
}

export function Definitions() {
  return <div className="replica-defs" aria-hidden="true" dangerouslySetInnerHTML={{ __html: glassFilter }} />;
}

function NavbarWordmark() {
  return <span className="replica-nav-wordmark">
    <img src={wordmark} width={2048} height={616} alt="" />
  </span>;
}

function Logo({ home }: { home: () => void }) {
  const [menu, setMenu] = useState<[number, number]>();
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(undefined);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('click', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', key); };
  }, [menu]);
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(''), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  async function copyLogo() {
    setMenu(undefined);
    try {
      const image = fetch(wordmark).then((response) => {
        if (!response.ok) throw new Error('Logo could not be loaded');
        return response.blob();
      });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': image })]);
      setCopyStatus('Logo copied as PNG');
    } catch {
      setCopyStatus('Could not copy the logo');
    }
  }
  return <div className="site-nav-brand shrink-0" data-v-1a89f4a0="">
    <button type="button" className="site-nav-logo-button" data-v-1a89f4a0="" aria-label="Home" onClick={home} onContextMenu={(event) => { event.preventDefault(); setMenu([Math.min(innerWidth - 175, event.clientX), event.clientY]); }}><NavbarWordmark /></button>
    {menu && createPortal(<div className="replica-dropdown" role="menu" style={{ position: 'fixed', left: menu[0], top: menu[1] }}><button type="button" role="menuitem" onClick={() => void copyLogo()}>Copy logo as PNG</button><a href="/brand" role="menuitem">View Fyntix brand assets</a></div>, document.body)}
    {copyStatus && createPortal(<p className="replica-toast" role="status">{copyStatus}</p>, document.body)}
  </div>;
}

function Part({ name, mobile, children }: { name: string; mobile?: boolean; children: React.ReactNode }) {
  return <div {...(mobile ? { 'data-v-dd149853': '' } : { 'data-v-93ade45b': '' })} data-glass-part={name} className={`site-nav-glass-segment site-nav-glass-segment--${name} flex shrink-0 self-stretch`}>{children}</div>;
}

type NavProps = { path: string; dark: boolean; intro: boolean; navigate: (path: string) => void };
export function Navigation({ path, intro, navigate }: NavProps) {
  const [menu, setMenu] = useState(false), [panel, setPanel] = useState(false);
  const particles = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null), itemGroup = useRef<HTMLDivElement>(null);
  const home = () => {
    setMenu(false);
    if (path !== '/') { navigate('/'); return; }
    const start = performance.now(), from = Math.min(scrollY, 1050);
    window.scrollTo({ top: from, behavior: 'instant' });
    const frame = (now: number) => {
      const progress = fast() ? 1 : Math.min(1, (now - start) / 760);
      window.scrollTo({ top: from * (1 - progress) ** 3, behavior: 'instant' });
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  useLayoutEffect(() => {
    const update = () => {
      const group = itemGroup.current, dot = indicator.current, current = group?.querySelector('[aria-current]');
      if (!dot || !group) return;
      if (!current) { dot.style.opacity = '0'; return; }
      const item = current.getBoundingClientRect(), parent = group.getBoundingClientRect();
      Object.assign(dot.style, { width: `${item.width}px`, height: `${item.height}px`, opacity: '1', transform: `translate(${item.x - parent.x}px, ${item.y - parent.y}px)` });
    };
    update(); window.addEventListener('resize', update);
    void document.fonts.ready.then(update);
    return () => window.removeEventListener('resize', update);
  }, [path]);
  useEffect(() => { setMenu(false); }, [path]);
  useEffect(() => {
    if (menu) { setPanel(true); return; }
    const timer = setTimeout(() => setPanel(false), 450);
    return () => clearTimeout(timer);
  }, [menu]);
  useEffect(() => {
    if (!menu) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); };
  }, [menu]);
  useEffect(() => {
    if (!panel || !particles.current || fast()) return;
    const field = particleField(particles.current, { shape: 'polyhedron2', profile: 'nav-mobile-accent', palette: 'gradientBrandOnWhite' }, { embedded: true });
    return field.dispose;
  }, [panel]);
  if (path === '/agent-run-websites') return <header className="arw-nav"><nav className="arw-nav__inner" aria-label="Page">
    <a href="#top" aria-label="Fyntix, back to the top" className="arw-nav__logo" onClick={(e) => { e.preventDefault(); history.replaceState(history.state, '', location.pathname); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><NavbarWordmark /></a>
    <ul className="arw-nav__links">{[['#work', 'Work'], ['#how', 'Agent-run'], ['#engine', 'Sales engine'], ['#pricing', 'Pricing']].map(([id, label]) => <li key={id}><a href={id}>{label}</a></li>)}</ul>
    <div className="arw-nav__actions"><a className="replica-book" target="_blank" rel="noopener noreferrer" href="https://andabove.link/book-call">Book a call</a></div>
  </nav></header>;
  return <div data-v-81f8b5bf="" className={`site-nav-bar replica-nav pointer-events-none fixed inset-x-0 top-10 z-nav-layer w-full select-none max-md:top-auto ${intro ? 'replica-nav-intro' : ''}`} data-nav-position="top">
    <nav className="site-nav site-nav-chrome site-nav-desktop pointer-events-none relative flex w-full flex-nowrap items-stretch justify-between box-border px-nav-gutter max-md:hidden" aria-label="Site navigation" data-v-93ade45b="">
      <div className="site-nav-row-leading" data-v-93ade45b="">
        <Part name="logo"><Logo home={home} /></Part>
        <Part name="links"><div ref={itemGroup} className="site-nav-links-indicator-root relative flex items-center">
          <span ref={indicator} className="site-nav__indicator site-nav__indicator--slide max-md:hidden" data-v-8f802f07="" />
          <div className="site-nav-links-group flex items-center" data-v-93ade45b="">{links.map(([href, text]) => {
            const active = href === path || path.startsWith(href + '/');
            return <a href={href} key={href} aria-current={active ? 'page' : undefined} className="site-nav__link relative z-10 shrink-0 cursor-pointer whitespace-nowrap text-lg font-medium leading-tight transition-opacity" data-v-f04201fc=""><span className={`site-nav__label site-nav__label--${active ? 'active' : 'inactive'}`} data-v-f04201fc="">{text}</span></a>;
          })}</div>
        </div></Part>
      </div>
      <div className="site-nav-row-trailing" data-v-93ade45b=""><Part name="contact"><a href="/contact" className={`${filled} site-nav-contact-link site-nav-contact-button shrink-0`} data-v-a59fe074=""><span className="relative z-10">Contact</span></a></Part></div>
    </nav>
    <div className="site-nav-mobile-stack pointer-events-none relative w-full md:hidden" data-v-dd149853="">
      <nav className="site-nav site-nav-chrome site-nav-mobile pointer-events-none relative box-border px-nav-gutter-mobile" aria-label="Site navigation" data-v-dd149853=""><div className="site-nav-mobile-bar flex w-full items-stretch justify-between gap-3" data-v-dd149853="">
        <div className="site-nav-row-leading" data-v-dd149853=""><Part name="logo" mobile><Logo home={home} /></Part></div>
        <div className="site-nav-row-trailing" data-v-dd149853=""><Part name="menu" mobile><button type="button" aria-expanded={menu} aria-controls="site-nav-mobile-menu-panel" className={`${filled} site-nav-menu-button shrink-0`} onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button></Part></div>
      </div></nav>
      {panel && <div className={`replica-menu ${menu ? 'replica-menu-open' : ''}`}>
        <div ref={particles} className="replica-menu-particles" aria-hidden="true" />
        <div id="site-nav-mobile-menu-panel" className="site-nav-mobile-panel-layer" data-v-dd149853="" inert={!menu}><div className="site-nav-mobile-panel" data-v-64f230a9=""><ul className="site-nav-mobile-panel-links" data-v-64f230a9="">{[...links, ['/contact', 'Contact']].map(([href, text]) => <li key={href} className={href === '/contact' ? 'site-nav-mobile-panel-contact' : ''} data-v-64f230a9=""><a href={href} className="site-nav-mobile-panel-link text-5xl font-normal" data-v-64f230a9="" onClick={() => setMenu(false)}>{text}</a></li>)}</ul></div></div>
      </div>}
    </div>
  </div>;
}

export type Video = { id: string; label: string; company: string; quote?: string; onClose?: () => void };
export const vimeo = (id: string, preview = false) => `https://player.vimeo.com/video/${id}?${preview ? 'background=1&autoplay=0&loop=1&title=0&byline=0&api=1' : 'autoplay=1&title=0&byline=0'}`;
export function VideoDialog({ id, label, company, quote, close }: Video & { close: () => void }) {
  const choice = usePrivacyChoice();
  const overlay = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false), onClose = useRef(close);
  onClose.current = close;
  function dismiss() {
    if (closing.current) return;
    closing.current = true;
    if (fast()) { onClose.current(); return; }
    gsap.timeline({ onComplete: () => onClose.current() })
      .to(overlay.current, { opacity: 0, duration: .25, ease: 'none' }, 0)
      .to(panel.current, { opacity: 0, scale: .96, y: '.5rem', duration: .25, ease: 'power1.inOut' }, 0);
  }
  useLayoutEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('button')?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', key);
    const tween = !fast() ? gsap.timeline()
      .from(overlay.current, { opacity: 0, duration: .25, ease: 'none' }, 0)
      .from(panel.current, { opacity: 0, scale: .96, y: '.5rem', duration: .25, ease: 'power1.inOut' }, 0) : undefined;
    return () => { tween?.kill(); window.removeEventListener('keydown', key); document.body.style.overflow = overflow; focused?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<div ref={overlay} className="video-modal pointer-events-auto fixed inset-0 z-modal flex items-center justify-center p-8" data-v-339421a4="" onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
    <div ref={panel} className="video-modal__panel relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slatecolor p-6 shadow-float max-md:p-4" data-v-339421a4="" role="dialog" aria-modal="true" aria-label={label}>
      <button className="absolute right-6 top-6 z-10 rounded-full border border-chalk/15 px-2 py-1 text-xs font-fono uppercase tracking-wide text-chalk transition-colors hover:border-chalk/30 max-md:right-4 max-md:top-4" type="button" onClick={dismiss} aria-label="Close video">Close</button>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-charcoal">{choice?.externalMedia ? <iframe className="h-full w-full" src={vimeo(id)} title={label} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> : <div className="fyntix-media-placeholder"><p>This video is hosted by Vimeo. Allow external media in cookie settings to load it. Vimeo will receive technical information such as your IP address and may use cookies.</p><button type="button" onClick={openPrivacySettings}>Open cookie settings</button><a href="/cookie-policy">Read the cookie policy</a></div>}</div>
      <div className="flex flex-col gap-3 pt-6 max-md:pt-4">
        {quote && <p className="text-base font-normal leading-snug tracking-tight text-chalk">"{quote.split(/(\bFyntix\b)/g).map((part, i) => part === 'Fyntix' ? <span className="text-spark" key={i}>{part}</span> : part)}"</p>}
        <p className="text-xs font-fono font-semibold uppercase tracking-wider text-chalk">{company}</p>
      </div>
    </div>
  </div>, document.body);
}
