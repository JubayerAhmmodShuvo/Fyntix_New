import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const spark = '#f75d3b', pale = '#ffa18c', tau = Math.PI * 2;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n < .5 ? 4 * n ** 3 : 1 - (-2 * n + 2) ** 3 / 2;
const during = (t: number, from: number, to: number) => t > from && t < to;
type Point = [number, number];

function animateCanvas(canvas: HTMLCanvasElement, draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void, onSize?: (w: number, h: number) => void) {
  const ctx = canvas.getContext('2d'); if (!ctx) return () => {};
  let frame = 0, width = 0, height = 0, visible = false;
  function paint(time: number) {
    if (width && height && ctx) { ctx.clearRect(0, 0, width, height); draw(ctx, width, height, time / 1000); }
    frame = visible && !reduced() ? requestAnimationFrame(paint) : 0;
  }
  function resize() {
    const box = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 2);
    if (box.width !== width || box.height !== height) {
      width = box.width; height = box.height; canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0); onSize?.(width, height);
    }
    cancelAnimationFrame(frame); paint(performance.now());
  }
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resize(); });
  const observer = new ResizeObserver(resize); intersection.observe(canvas); observer.observe(canvas);
  return () => { cancelAnimationFrame(frame); intersection.disconnect(); observer.disconnect(); };
}

function light(ctx: CanvasRenderingContext2D, p: Point, size: number, opacity: number) {
  ctx.globalAlpha = opacity; ctx.fillStyle = spark; ctx.shadowColor = pale; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(p[0], p[1], size, 0, tau); ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
}
function circuit(ctx: CanvasRenderingContext2D, from: Point, to: Point, y: number, size: number, t: number, start: number, draw: number, stop: number) {
  const dt = t - start;
  if (dt <= 0 || t >= stop + .5) return;
  const points: Point[] = Math.abs(from[0] - to[0]) < 2 ? [from, to] : [from, [from[0], y], [to[0], y], to];
  const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
  let remaining = ease(clamp(dt / draw)) * lengths.reduce((a, b) => a + b, 0), end = from;
  ctx.globalAlpha = .85 * (1 - clamp((t - stop) / .5)); ctx.strokeStyle = spark; ctx.lineWidth = 1.2; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...from);
  for (let i = 0; i < lengths.length && remaining > 0; i++) {
    const amount = lengths[i] ? Math.min(1, remaining / lengths[i]) : 1;
    end = [points[i][0] + (points[i + 1][0] - points[i][0]) * amount, points[i][1] + (points[i + 1][1] - points[i][1]) * amount];
    ctx.lineTo(...end); remaining -= lengths[i];
  }
  ctx.stroke(); ctx.globalAlpha = 1;
  if (dt < draw) light(ctx, end, size, 1);
}
function pulse(ctx: CanvasRenderingContext2D, p: Point, size: number, w: number, t: number, start: number) {
  const progress = (t - start) / .9; if (progress <= 0 || progress >= 1) return;
  ctx.globalAlpha = .7 * (1 - progress); ctx.strokeStyle = spark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(...p, size + progress * Math.max(14, w * .028), 0, tau); ctx.stroke(); ctx.globalAlpha = 1;
}
function connectHero(hero: HTMLElement, canvas: HTMLCanvasElement) {
  const screen = hero.querySelector<HTMLElement>('.arw-screen'); if (!screen) return () => {};
  const toggle = hero.querySelector('.arw-note--toggle'), insight = hero.querySelector('.arw-hero__notes--below > .arw-note');
  const card = hero.querySelector('.arw-pagecard'), note = card?.nextElementSibling;
  const standfirst = screen.querySelector('.arw-screen__standfirst'), agent = screen.querySelector('.arw-agentview');
  const lines = Array.from(agent?.querySelectorAll('.arw-agentview__line') ?? []), bars = Array.from(card?.querySelectorAll('.arw-pagecard__bar') ?? []);
  const control = toggle?.querySelector('.arw-toggle'), labels = control?.querySelectorAll('span');
  const old = 'We make sending money abroad and connecting with loved ones across the world easy.';
  const updated = 'Send money home in seconds, from the app that keeps you close to the people you love.';
  const mark = (node: Element | null | undefined, show: boolean) => node?.classList.toggle('arw--on', show);
  const status = (node: Element | null | undefined, label: string, done: boolean) => {
    const e = node?.querySelector('.arw-note__status'); if (!e || e.getAttribute('data-label') === label) return;
    e.setAttribute('data-label', label);
    e.innerHTML = (done ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arw-note__tick" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>' : '') + label;
  };
  let last = -1;
  return animateCanvas(canvas, (ctx, _width, _height, time) => {
    const t = time % 18, still = reduced(), agentOn = !still && during(t, 13, 16.4);
    const frame = Math.floor(t * 30);
    if (frame !== last) {
      last = frame;
      mark(insight, still || during(t, .4, 6.6)); status(insight, still || t > 4.8 ? 'Updated' : t > 1.9 ? 'Updating…' : '', still || t > 4.8);
      const showPage = still || during(t, 6.6, 12); mark(card, showPage); mark(note, showPage);
      status(note, still || t > 10.2 ? 'Live' : t > 9.2 ? 'Approved' : t > 6.8 ? 'Drafting…' : '', still || t > 9.2);
      bars.forEach((bar, i) => mark(bar, still || (during(t, 7, 12) && i < Math.ceil((t - 7) / .4))));
      mark(toggle, still || during(t, 11.8, 17.4)); status(toggle, still || t > 14.6 ? 'Live' : t > 12.2 ? 'Building…' : '', still || t > 14.6);
      control?.classList.toggle('arw-toggle--agent', agentOn); labels?.[0]?.classList.toggle('arw--current', !agentOn); labels?.[1]?.classList.toggle('arw--current', agentOn);
      mark(agent, agentOn); lines.forEach((line, i) => mark(line, agentOn && i < Math.ceil((t - 13.3) / .12)));
      mark(standfirst, still || during(t, 2.05, 17.3));
      if (standfirst) {
        const text = still || t >= 4.7 ? updated : t < 2.1 ? old : t < 3 ? old.slice(0, Math.round(82 * (1 - (t - 2.1) / .9))) : updated.slice(0, Math.round(85 * (t - 3) / 1.7));
        if (standfirst.textContent !== text || !!standfirst.firstElementChild !== (!still && during(t, 2.1, 4.7))) {
          standfirst.textContent = text;
          if (!still && during(t, 2.1, 4.7)) { const caret = document.createElement('span'); caret.className = 'arw-screen__caret'; standfirst.append(caret); }
        }
      }
    }
    const parent = hero.getBoundingClientRect();
    const bounds = (node?: Element | null) => { const r = node?.getBoundingClientRect() ?? parent; return { x: r.x - parent.x, y: r.y - parent.y, w: r.width, h: r.height }; };
    const s = bounds(screen), i = bounds(insight), a = bounds(toggle), p = bounds(card);
    const map = (x: number, y: number): Point => [s.x + x / 1584 * s.w, s.y + y / 972 * s.h];
    const anchors = [map(938, 652), map(1130, 54), map(700, 958)], bottom = s.y + s.h;
    const size = Math.max(2.4, Math.min(4, s.w / 240));
    if (!still) {
      circuit(ctx, [i.x + 3, i.y - 4], anchors[0], (bottom + i.y) / 2, size, t, 1, .9, 6.2); pulse(ctx, anchors[0], size, s.w, t, 2);
      circuit(ctx, anchors[2], [p.x + p.w / 2, p.y - 4], (bottom + p.y) / 2, size, t, 6.3, .6, 11.4); pulse(ctx, anchors[2], size, s.w, t, 6.2);
      circuit(ctx, [a.x + a.w / 2, a.y + a.h + 4], anchors[1], s.y - 10, size, t, 12.2, .6, 16.6); pulse(ctx, anchors[1], size, s.w, t, 13);
      for (let j = 0; j < 6; j++) { const step = (t - 12.4 - j * .1) / .9; if (step > 0 && step < 1) light(ctx, [s.x + s.w * (.66 - .6 * ease(step)), anchors[1][1]], size, 1 - Math.max(0, step - .8) * 5); }
    }
    anchors.forEach((p, j) => light(ctx, p, size, still ? .9 : .6 + .3 * Math.sin(t * 2.2 + j * 1.8)));
  });
}
function connectHalo(canvas: HTMLCanvasElement) {
  type Dot = { x: number; y: number; size: number; opacity: number; phase: number; speed: number; square: boolean; color: string };
  const colors = [pale, spark, spark, '#fbeae4']; let dots: Dot[] = [];
  return animateCanvas(canvas, (ctx, _width, h, t) => {
    const still = reduced();
    for (const d of dots) {
      if (d.y < 0 || d.y > h) continue;
      const y = d.y + (still ? 0 : Math.sin(t / 2.4 * d.speed + d.phase) * 2);
      ctx.globalAlpha = d.opacity * (still ? 1 : .55 + .45 * Math.sin(t * d.speed + d.phase)); ctx.fillStyle = d.color;
      if (d.square) ctx.fillRect(d.x, y, d.size, d.size); else { ctx.beginPath(); ctx.arc(d.x, y, d.size / 2, 0, tau); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }, (w, h) => { dots = Array.from({ length: Math.round(Math.min(320, Math.max(110, w / 5))) }, () => {
    const angle = Math.PI * (.04 + .92 * Math.random()), r = .78 + .4 * Math.random();
    return { x: w / 2 + Math.cos(angle) * w * .46 * r, y: h + 24 - Math.sin(angle) * h * .95 * r, size: 2 + 3 * Math.random(), square: Math.random() < .55, color: colors[Math.floor(Math.random() * (Math.random() < .2 ? 4 : 3))], opacity: .35 + .6 * Math.random(), phase: Math.random() * tau, speed: .4 + .9 * Math.random() };
  }); });
}

function connectProductCrop(frame: HTMLElement) {
  const image = frame.querySelector<HTMLImageElement>('.product-hero__screen');
  const section = frame.closest('section');
  const trigger = section?.parentElement;
  if (!image || !section || !trigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const mobile = matchMedia('(max-width: 767px)');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let context: gsap.Context | undefined, scrollFrame = 0;
  const measure = () => {
    const imageHeight = image.getBoundingClientRect().height;
    if (imageHeight === 0) return;
    const expanded = imageHeight * .94 - 10;
    const top = frame.getBoundingClientRect().top + scrollY;
    const resting = mobile.matches ? expanded : Math.min(expanded, Math.max(innerHeight - top + 4, expanded * .45));
    frame.style.setProperty('--product-hero-resting', resting + 'px');
    frame.style.setProperty('--product-hero-growth', (expanded - resting) + 'px');
    context && ScrollTrigger.refresh();
  };
  const configure = () => {
    context?.revert(); context = undefined;
    if (mobile.matches || preference.matches) {
      frame.style.setProperty('--product-hero-progress', '1');
      frame.style.setProperty('--product-hero-scrim', '0');
    } else {
      context = gsap.context(() => {
        gsap.fromTo(frame, { '--product-hero-progress': 0, '--product-hero-scrim': 1 }, {
          '--product-hero-progress': 1, '--product-hero-scrim': 0, ease: 'none',
          scrollTrigger: { trigger, start: 'top top', end: '+=70%', scrub: .4 },
        });
      }, frame);
    }
    measure();
  };
  const stopScroll = () => {
    cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    window.removeEventListener('wheel', stopScroll); window.removeEventListener('touchstart', stopScroll);
  };
  const jumpToSection = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || !(event.target instanceof Element)) return;
    const hash = event.target.closest('a')?.getAttribute('href');
    const target = hash?.startsWith('#') ? document.getElementById(hash.slice(1)) : null;
    if (!target) return;
    event.preventDefault(); history.replaceState(history.state, '', hash);
    stopScroll();
    const destination = () => target.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    const scroll = (top: number) => window.scrollTo({ top, behavior: 'instant' });
    const top = destination();
    if (preference.matches) { scroll(top); return; }
    if (Math.abs(top - scrollY) > 1050) scroll(Math.max(top - 1050, 0));
    const from = scrollY, start = performance.now();
    const step = (now: number) => {
      const progress = clamp((now - start) / 760);
      scroll(from + (destination() - from) * (1 - (1 - progress) ** 3));
      if (progress < 1) scrollFrame = requestAnimationFrame(step); else stopScroll();
    };
    window.addEventListener('wheel', stopScroll, { passive: true }); window.addEventListener('touchstart', stopScroll, { passive: true });
    scrollFrame = requestAnimationFrame(step);
  };
  const resize = new ResizeObserver(measure);
  configure(); resize.observe(image);
  section.addEventListener('click', jumpToSection);
  window.addEventListener('resize', measure); mobile.addEventListener('change', configure); preference.addEventListener('change', configure);
  return () => {
    resize.disconnect(); context?.revert(); stopScroll();
    section.removeEventListener('click', jumpToSection);
    window.removeEventListener('resize', measure); mobile.removeEventListener('change', configure); preference.removeEventListener('change', configure);
  };
}

function revealMeshLayers(main: HTMLElement) {
  const screens = main.querySelectorAll<HTMLElement>('.layer-stack__media');
  if (!screens.length || reduced()) return () => {};
  const context = gsap.context(() => gsap.set(screens, { opacity: 0, y: 28 }), main);
  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      context.add(() => gsap.to(target, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'transform,opacity' }));
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  screens.forEach((screen) => observer.observe(screen));
  return () => { observer.disconnect(); context.revert(); };
}

export function productMotion(main: HTMLElement) {
  const cropEffects = Array.from(main.querySelectorAll<HTMLElement>('.product-hero__frame'), connectProductCrop);
  cropEffects.push(revealMeshLayers(main));
  const root = main.querySelector<HTMLElement>('.arw'); if (!root) return () => cropEffects.forEach((dispose) => dispose());
  const hero = root.querySelector<HTMLElement>('.arw-hero'), canvas = hero?.querySelector<HTMLCanvasElement>('canvas'), halo = root.querySelector<HTMLCanvasElement>('.arw-engine-band__halo');
  const cleanup = [hero && canvas ? connectHero(hero, canvas) : undefined, halo ? connectHalo(halo) : undefined, ...cropEffects];
  const items = root.querySelectorAll<HTMLElement>('.arw-work__media,.arw-shot');
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) { entry.target.classList.add('arw--in'); observer.unobserve(entry.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  let frame = 0;
  function parallax() {
    frame = 0;
    items.forEach((node) => { const r = node.closest('.arw-work__field')?.getBoundingClientRect(); if (r && r.bottom >= 0 && r.top <= innerHeight) node.style.setProperty('--arw-py', `${(-18 * (r.top + r.height / 2 - innerHeight / 2) / innerHeight).toFixed(1)}px`); });
  }
  function queue() { if (!frame) frame = requestAnimationFrame(parallax); }
  if (!reduced()) {
    root.querySelectorAll<HTMLElement>('.arw-reveal').forEach((node, i) => { node.style.setProperty('--arw-d', String(i % 4)); const r = node.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) node.classList.add('arw--in'); else observer.observe(node); });
    root.classList.add('arw--motion'); window.addEventListener('scroll', queue, { passive: true }); queue();
  }
  return () => { cleanup.forEach((fn) => fn?.()); observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); };
}
