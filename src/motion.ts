import gsap from 'gsap';
import Embla from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { particleField, sceneBackground, type Field, type Scene, type Shape } from './particles';
import { vimeo, type Video } from './chrome';
import { getChoice, CONSENT_EVENT } from './consent';
import { productMotion } from './product-motion';

type Cleanup = () => void;
export type ShowVideo = (video: Video) => void;
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const stats = [
  ['$3.25bn Raised', "Funding rounds we've supported through product & design"],
  ['6x Acquisitions', 'Six of our long-term partnerships led to acquisition'],
  ['26+ Markets', "We've launched products in over 26 markets globally."],
];
const testimonials = [
  { name: 'Julie Jeancolas', role: 'Global Head of Product, Tesco', company: 'Tesco', logo: '/content-media/clients/tesco-logo.gen.webp', logoHeight: 'h-10', poster: 'tesco', video: '1131671885', quote: "I would recommend Fyntix to anyone who's got ambitious plans to accelerate their roadmap, or is looking to build an AI-powered product from scratch." },
  { name: 'Fred Jones', role: 'CEO, Outra & Upstix', company: 'Upstix', logo: '/content-media/clients/upstix-logo.gen.webp', logoHeight: 'h-6', poster: 'upstix', video: '1131671936', quote: 'Fyntix embraced the scale-up challenge. Integrating with our marketing and technical team to drive a significant uplift in performance.' },
  { name: 'Thomas Heldarskard-Winnerskjold', role: 'Group CEO, Nacos Marine', company: 'Nacos Marine', logo: '/_nuxt/nacos-marine-logo.DDhF2jyg.svg', logoHeight: 'h-8', poster: 'nacos', video: '1131671989', quote: 'From the first workshops to the final design choices, Fyntix understood our challenges and helped turn them into strengths.' },
];
const mobius: Scene = { shape: 'mobius', profile: 'hero-near', palette: 'sparkMonoOnLight' };
const service: Scene = { shape: 'henneberg', profile: 'accent-right-large', palette: 'gradientSparkBloomOnLight' };
const scenes: Record<string, Scene> = {
  '/': { ...mobius, profile: 'hero-deep' }, '/work': mobius, '/agent-mesh': mobius,
  '/feed': { ...mobius, palette: 'brandOnCharcoal' }, '/feed/press': { ...mobius, palette: 'brandOnCharcoal' },
  '/services': service, '/about': { shape: 'fyntix-y', profile: 'intro-offset-near', palette: 'gradientSparkBloomOnGrey' },
  '/contact': { shape: 'earth', profile: 'accent-right-large', palette: 'gradientBrandOnLight' },
  '/careers': { shape: 'Logo_&A', profile: 'side-offset-far', palette: 'gradientBrandOnHaze' },
  '/brand': { shape: 'tunnel', profile: 'hero-deep', palette: 'solidCharcoal' },
};
const startScene = (path: string) => scenes[path] ?? (path.startsWith('/services/') ? service : undefined);
export const backgroundFor = (path: string) => sceneBackground(startScene(path));

function fixed(main: HTMLElement, host: HTMLElement, path: string, intro: boolean): Cleanup {
  const first = startScene(path);
  if (!first || first.palette === 'solidCharcoal') return () => {};
  const mobile = matchMedia('(max-width: 767px)');
  let field: Field | undefined, key = '';
  function sceneAtScroll(): Scene {
    const panel = path === '/services' ? main.querySelector('#pillar-paid-media-and-content') : path === '/about' ? main.querySelector('#section-careers') : null;
    if (panel && panel.getBoundingClientRect().top <= (path === '/about' ? innerHeight / 2 : innerHeight)) {
      return path === '/about' ? { ...scenes['/careers'], shape: first!.shape } : { shape: 'tunnel', profile: 'section-soft', palette: 'whiteOnWhite' };
    }
    return mobile.matches && first!.profile.startsWith('hero-') ? { ...first!, profile: `${first!.profile}-mobile` } : first!;
  }
  const update = () => {
    if (!field) return;
    const scene = sceneAtScroll(), next = `${scene.shape}:${scene.profile}:${scene.palette}`;
    if (next !== key) { key = next; field.set(scene); }
  };
  const start = () => {
    const scene = sceneAtScroll();
    key = `${scene.shape}:${scene.profile}:${scene.palette}`;
    field = particleField(host, scene, { background: true, parallax: true, intro });
    host.classList.add('replica-canvas-in');
  };
  const timer = intro && !reduce() ? setTimeout(start, mobile.matches ? 850 : 1480) : 0;
  if (!timer) start();
  window.addEventListener('scroll', update, { passive: true }); mobile.addEventListener('change', update);
  return () => { clearTimeout(timer); window.removeEventListener('scroll', update); mobile.removeEventListener('change', update); field?.dispose(); host.classList.remove('replica-canvas-in'); };
}

function embedded(main: HTMLElement, path: string): Cleanup {
  const setups = new Map<HTMLElement, { scene: Scene; drag?: boolean; scrim?: boolean }>();
  const add = (selector: string, map: (node: HTMLElement, i: number) => Scene, drag = false, scrim = false) => {
    main.querySelectorAll<HTMLElement>(selector).forEach((node, i) => setups.set(node, { scene: map(node, i), drag: drag && node.classList.contains('cursor-grab'), scrim }));
  };
  add('.section-particle-background', (e) => ({ shape: path === '/about' ? 'gyroid' : path.startsWith('/industries/') || e.closest('section[id$="cta"]') ? 'diffuseSphere' : 'earth', profile: path.startsWith('/industries/') ? 'band-globe-rising' : 'accent-right-medium', palette: 'gradientBrandOnCharcoal' }), false, true);
  add('.pillar-particle-field', (e, i) => {
    const shapes: Shape[] = ['diffuseSphere', 'crossClusters', 'doubleRing'];
    const id = e.closest('section')?.id ?? '';
    return { shape: id.includes('paid-media-and-content') || id.includes('product-development') ? 'crossClusters' : id.includes('search-and-ai-visibility') || id.includes('workflows-and-agents') ? 'diffuseSphere' : shapes[i % shapes.length], profile: e.classList.contains('cursor-grab') ? 'card-interactive' : 'pillar-backdrop', palette: 'sparkMono' };
  }, true);
  add('.results-particle-field', () => ({ shape: 'tunnel', profile: 'results-tunnel-field', palette: 'gradientBrandOnWhite' }));
  add('.footer-particle-field', () => ({ shape: 'fyntix', profile: 'footer-immersive', palette: 'brandOnCharcoal' }));
  const fields = new Map<HTMLElement, { field: Field; layer?: HTMLElement }>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const host = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        const spec = setups.get(host);
        if (!spec || fields.has(host)) continue;
        let layer: HTMLElement | undefined;
        if (host.classList.contains('footer-particle-field')) {
          layer = document.createElement('div');
          layer.className = 'footer-particle-field__fade absolute inset-0';
          layer.setAttribute('data-v-6f09573d', ''); host.append(layer);
        }
        const field = particleField(layer ?? host, { ...spec.scene }, { embedded: true, drag: spec.drag, scrim: spec.scrim, preserveDrawingBuffer: !!layer });
        fields.set(host, { field, layer });
      } else if (fields.has(host)) {
        const active = fields.get(host)!;
        active.field.dispose(); active.layer?.remove(); fields.delete(host);
      }
    }
  }, { rootMargin: '400px' });
  setups.forEach((_, element) => observer.observe(element));
  return () => { observer.disconnect(); fields.forEach(({ field, layer }) => { field.dispose(); layer?.remove(); }); };
}

function navigationTone(main: HTMLElement, path: string, setDark: (dark: boolean) => void): Cleanup {
  let frame = 0;
  const background = path === '/agent-run-websites' ? '#141414' : backgroundFor(path);
  const channel = (number: number) => { const n = number / 255; return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; };
  function luminance(color: string) {
    if (color.startsWith('#')) {
      const value = color.length === 4 ? color.slice(1).split('').map((c) => c + c).join('') : color.slice(1);
      const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(value.slice(i, i + 2), 16)));
      return .2126 * r + .7152 * g + .0722 * b;
    }
    const parts = color.match(/[\d.]+/g)?.map(Number);
    if (!parts || parts.length < 3 || (parts[3] ?? 1) <= .02) return undefined;
    return .2126 * channel(parts[0]) + .7152 * channel(parts[1]) + .0722 * channel(parts[2]);
  }
  function median(values: number[]) {
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  }
  const surfaces = new Map<Element, number | undefined>();
  const surface = (element: Element) => {
    if (surfaces.has(element)) return surfaces.get(element);
    const style = getComputedStyle(element);
    const gradient = [...style.backgroundImage.matchAll(/#[\da-f]{3,8}\b|rgba?\([^)]+\)/gi)].map(([color]) => luminance(color)).filter((n) => n !== undefined);
    const light = luminance(style.backgroundColor) ?? (gradient.length ? median(gradient) : undefined);
    surfaces.set(element, light); return light;
  };
  const fallback = luminance(background) ?? 1;
  function update() {
    const nav = document.querySelector('.site-nav-bar,.arw-nav')?.getBoundingClientRect();
    if (!nav?.height) { setDark(fallback < .45); return; }
    surfaces.clear();
    const levels = [];
    for (let y = 0; y < 5; y++) for (let x = 0; x < 11; x++) {
      let found: number | undefined;
      const row = Math.max(0, Math.min(innerHeight - 1, nav.top + (y + .5) * nav.height * 1.3 / 5));
      for (const hit of document.elementsFromPoint((x + .5) * innerWidth / 11, row)) {
        if (!main.contains(hit) || !(hit instanceof HTMLElement) || hit instanceof HTMLImageElement) continue;
        const box = hit.getBoundingClientRect();
        if (box.width < 64 || box.height < 64) continue;
        for (let element: Element | null = hit; element && main.contains(element); element = element.parentElement) {
          found = surface(element);
          if (found !== undefined) break;
        }
        if (found !== undefined) break;
      }
      levels.push(found ?? fallback);
    }
    setDark(median(levels) < .45);
  }
  const queue = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
  update(); window.addEventListener('scroll', queue, { passive: true }); window.addEventListener('resize', queue);
  return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
}

function reveals(main: HTMLElement): Cleanup {
  const clean: Cleanup[] = [];
  for (const img of main.querySelectorAll<HTMLImageElement>('img.content-image__main')) {
    const load = () => {
      if (!img.naturalWidth) return;
      img.classList.add('content-image__main--loaded');
      img.closest('.content-image')?.querySelector('.content-image__placeholder')?.classList.add('content-image__placeholder--hidden');
    };
    if (img.complete) load();
    img.addEventListener('load', load); clean.push(() => img.removeEventListener('load', load));
  }
  const groups = main.querySelectorAll<HTMLElement>('.text-reveal-pending');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const host = entry.target;
      observer.unobserve(host);
      if (reduce()) { host.classList.remove('text-reveal-pending'); continue; }
      const tween = gsap.fromTo(host.querySelectorAll('.text-reveal-word'), { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, stagger: .05, ease: 'power3.out', onComplete: () => host.classList.remove('text-reveal-pending') });
      clean.push(() => tween.kill());
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: .35 });
  groups.forEach((group) => observer.observe(group));
  return () => { observer.disconnect(); clean.forEach((fn) => fn()); };
}

function galleries(main: HTMLElement): Cleanup {
  const clean: Cleanup[] = [];
  for (const host of main.querySelectorAll<HTMLElement>('.media-carousel__viewport,.media-section__stage > .cursor-grab')) {
    if (!host.firstElementChild || host.firstElementChild.children.length < 2) continue;
    const story = host.parentElement?.classList.contains('media-section__stage');
    const autoplay = story && !reduce() ? Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }) : undefined;
    const gallery = Embla(host, { loop: true, align: story ? 'start' : 'center', duration: 25 }, autoplay ? [autoplay] : []);
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .25 });
    observer.observe(host);
    const key = (event: KeyboardEvent) => {
      if (!visible || !(event.key === 'ArrowLeft' || event.key === 'ArrowRight') || (event.target instanceof Element && event.target.closest('input,select,textarea,button,a,[contenteditable]'))) return;
      event.preventDefault(); if (event.key === 'ArrowRight') gallery.scrollNext(); else gallery.scrollPrev(); autoplay?.reset();
    };
    window.addEventListener('keydown', key);
    clean.push(() => { observer.disconnect(); gallery.destroy(); window.removeEventListener('keydown', key); });
  }
  return () => clean.forEach((fn) => fn());
}

function words(parent: HTMLElement, text: string, className: string) {
  const spans = text.split(/\s+/).map((word) => {
    const element = document.createElement('span'); element.className = className;
    if (className.includes('testimonial') && /\bFyntix\b/i.test(word)) element.classList.add('text-spark');
    element.textContent = word; return element;
  });
  parent.replaceChildren(...spans.flatMap((element, i) => i ? [' ', element] : [element]));
  return spans;
}

function carousel(section: HTMLElement, isStory: boolean, video: ShowVideo): Cleanup {
  const type = isStory ? 'testimonial' : 'result', interval = isStory ? 8000 : 3000;
  const dots = Array.from(section.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'));
  const controls = new Map(dots.map((dot, i) => [dot, i % 3]));
  const quote = section.querySelector<HTMLElement>('blockquote'), attribution = quote?.nextElementSibling as HTMLElement | null;
  const thumb = section.querySelector<HTMLButtonElement>('button:has(.testimonial-card__thumb)');
  const poster = thumb?.querySelector<HTMLElement>('.testimonial-card__thumb');
  const logo = section.querySelector<HTMLImageElement>('.testimonial-card__logo');
  const [value, label] = section.querySelectorAll<HTMLElement>('.results-stage p');
  let current = 0, timer = 0, inView = false, focused = false, modal = false, hovering = false, revealed = false;
  let timeline: gsap.core.Timeline | undefined, iframe: HTMLIFrameElement | undefined;
  const paused = () => !inView || focused || modal || document.hidden || reduce();
  function refresh() {
    clearTimeout(timer);
    dots.forEach((button, i) => {
      const selected = i % 3 === current, timed = selected && !reduce();
      button.setAttribute('aria-pressed', String(selected));
      const dot = button.firstElementChild as HTMLElement;
      if (!dot) return;
      dot.className = `block h-1.5 shrink-0 overflow-hidden rounded-full transition-all duration-300 ${timed ? 'w-6 bg-spark/25' : `w-1.5 bg-spark ${selected ? 'opacity-100' : 'opacity-50'}`}`;
      dot.replaceChildren();
      if (timed) {
        const fill = document.createElement('span'); fill.className = 'slide-controls__progress-fill block h-full w-full origin-left bg-spark';
        fill.style.setProperty('--slide-progress-ms', `${interval}ms`); if (paused()) fill.style.animationPlayState = 'paused'; dot.append(fill);
      }
    });
    if (!paused()) timer = window.setTimeout(() => select(current + 1, 1), interval);
  }
  function render(direction: number) {
    timeline?.kill();
    if (!isStory && value && label) {
      const a = words(value, stats[current][0], 'results-reveal-word');
      const b = words(label, stats[current][1], 'results-reveal-word');
      if (!reduce()) {
        timeline = gsap.timeline();
        timeline.fromTo(a, { opacity: 0, y: 24 * direction }, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: 'power3.out' }, 0);
        timeline.fromTo(b, { opacity: 0, y: 16 * direction }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' }, '>-0.35');
      }
      return;
    }
    if (!quote || !attribution || !poster || !logo || !thumb) return;
    iframe?.remove(); iframe = undefined;
    const slide = testimonials[current];
    const a = words(quote, slide.quote, 'testimonial-reveal-word');
    const edges = ['“', '”'].map((text) => { const el = document.createElement('span'); el.className = 'testimonial-reveal-word'; el.setAttribute('aria-hidden', 'true'); el.textContent = text; return el; });
    quote.prepend(edges[0]); quote.append(edges[1]);
    const credits = attribution.querySelectorAll('span');
    if (credits.length >= 2) { credits[0].textContent = slide.name; credits[credits.length - 1].textContent = slide.role; }
    logo.src = slide.logo; logo.alt = slide.company; logo.className = `testimonial-card__logo testimonial-reveal-block object-contain object-left ${slide.logoHeight} w-auto`;
    poster.style.backgroundImage = `url(/content-media/pages/home/stories-${slide.poster}-poster.gen.jpg)`; poster.style.opacity = '1';
    thumb.setAttribute('aria-label', `${slide.name} client testimonial video preview`);
    section.querySelector('.testimonial-reveal-pending')?.classList.remove('testimonial-reveal-pending');
    if (!reduce()) {
      timeline = gsap.timeline();
      timeline.fromTo(thumb.parentElement, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power3.out' }, 0);
      timeline.fromTo([edges[0], ...a, edges[1]], { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .6, stagger: .05, ease: 'power3.out' }, .45);
      timeline.fromTo([attribution, logo], { opacity: 0, y: 12, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .5, stagger: .1, ease: 'power3.out' }, '>-0.05');
    }
  }
  function select(index: number, direction: number) {
    const next = (index + 3) % 3;
    if (current !== next || !revealed) { current = next; revealed = true; render(direction); }
    refresh();
  }
  const play = (method: string) => iframe?.contentWindow?.postMessage(JSON.stringify({ method }), 'https://player.vimeo.com');
  const privacyChanged = () => {
    if (getChoice()?.externalMedia) return;
    iframe?.remove(); iframe = undefined;
    if (poster) poster.style.opacity = '1';
  };
  const enter = () => {
    if (!getChoice()?.externalMedia) { privacyChanged(); return; }
    if (!thumb || !poster || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    hovering = true;
    if (!iframe) {
      iframe = document.createElement('iframe'); iframe.title = `${testimonials[current].name} preview`; iframe.tabIndex = -1;
      iframe.className = 'testimonial-card__video pointer-events-none absolute inset-0 z-0 h-full w-full'; iframe.src = vimeo(testimonials[current].video, true);
      iframe.allow = 'autoplay; fullscreen; picture-in-picture'; iframe.onload = () => { if (hovering) { play('play'); poster.style.opacity = '0'; } }; thumb.prepend(iframe);
    } else { play('play'); poster.style.opacity = '0'; }
  };
  const leave = () => { hovering = false; play('pause'); if (poster) poster.style.opacity = '1'; };
  const click = (event: MouseEvent) => {
    const button = (event.target as Element).closest('button');
    if (!button) return;
    if (button === thumb) {
      const slide = testimonials[current]; modal = true; play('pause'); refresh();
      video({ id: slide.video, label: slide.company, company: `${slide.name} - ${slide.role}`, quote: slide.quote, onClose: () => { modal = false; refresh(); } }); return;
    }
    const name = button.getAttribute('aria-label');
    if (name === `Next ${type}`) select(current + 1, 1);
    else if (name === `Previous ${type}`) select(current - 1, -1);
    else if (controls.has(button)) { const next = controls.get(button)!; select(next, next < current ? -1 : 1); }
  };
  const focus = (event: FocusEvent) => {
    if (event.type === 'focusin') { if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return; focused = true; }
    else if (!(event.relatedTarget instanceof Node && section.contains(event.relatedTarget))) focused = false;
    refresh();
  };
  section.addEventListener('click', click); section.addEventListener('focusin', focus); section.addEventListener('focusout', focus);
  thumb?.addEventListener('pointerenter', enter); thumb?.addEventListener('pointerleave', leave);
  window.addEventListener(CONSENT_EVENT, privacyChanged);
  document.addEventListener('visibilitychange', refresh);
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView && !revealed) select(0, 1); else refresh(); }, { threshold: .25 });
  observer.observe(section); refresh();
  return () => { window.removeEventListener(CONSENT_EVENT, privacyChanged); observer.disconnect(); clearTimeout(timer); timeline?.kill(); iframe?.remove(); section.removeEventListener('click', click); section.removeEventListener('focusin', focus); section.removeEventListener('focusout', focus); thumb?.removeEventListener('pointerenter', enter); thumb?.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', refresh); };
}

export function connectMotion(main: HTMLElement, background: HTMLElement, path: string, intro: boolean, dark: (value: boolean) => void, video: ShowVideo): Cleanup {
  const clean = [fixed(main, background, path, intro), embedded(main, path), navigationTone(main, path, dark), reveals(main), galleries(main), productMotion(main)];
  const results = main.querySelector<HTMLElement>('#section-results'), stories = main.querySelector<HTMLElement>('#section-testimonials');
  if (results) clean.push(carousel(results, false, video));
  if (stories) clean.push(carousel(stories, true, video));
  return () => clean.forEach((fn) => fn());
}
