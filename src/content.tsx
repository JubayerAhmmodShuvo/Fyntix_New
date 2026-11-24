import { createElement, memo } from 'react';
import gsap from 'gsap';
import { copy } from './chrome';
import prompt from './data/ask.json';
import type { ShowVideo } from './motion';
import { connectGrowth } from './growth';
import { connectPostResults } from './results';
import { connectBwLawCharts, connectCaseCharts } from './bw-law-charts';

export type Page = { path: string; title: string; description: string; classes: string; sections: { tag: string; attributes: Record<string, string>; html: string }[] };
export const HumanContent = memo(function HumanContent({ page }: { page: Page }) {
  return page.sections.map(({ tag, attributes, html }, i) => {
    const { class: className, style, ...props } = attributes;
    const styleProps = style ? Object.fromEntries(style.split(';').filter(Boolean).map((s) => { const at = s.indexOf(':'); return [s.slice(0, at).trim(), s.slice(at + 1).trim()]; })) : undefined;
    return createElement(tag, { ...props, className, style: styleProps, key: i, dangerouslySetInnerHTML: { __html: html } });
  });
});

type Dispose = () => void;
function contact(main: HTMLElement): Dispose {
  const tabList = main.querySelector<HTMLElement>('[role=tablist][aria-label="Type of enquiry"]');
  if (!tabList) return () => {};
  const tabs = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role=tab]'));
  const indicator = tabList.querySelector<HTMLElement>('.contact-tabs-indicator');
  let current = Math.max(0, tabs.findIndex((t) => t.id === `contact-tab-${new URL(location.href).searchParams.get('enquiry')}`));
  const align = () => {
    if (!indicator || !tabs[current]) return;
    const a = tabs[current].getBoundingClientRect(), b = tabList.getBoundingClientRect();
    Object.assign(indicator.style, { width: `${a.width}px`, height: `${a.height}px`, opacity: '1', transform: `translate(${a.x - b.x}px,${a.y - b.y}px)` });
  };
  const select = (next: number, input: boolean) => {
    const old = current; current = next;
    tabs.forEach((tab, i) => {
      const selected = i === current; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle('text-chalk', selected); tab.classList.toggle('text-charcoal', !selected); tab.classList.toggle('hover:bg-charcoal/5', !selected);
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? ''); if (!panel) return;
      panel.style.display = selected ? '' : 'none';
      if (selected && old !== next && input && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(panel, { opacity: 0, x: next > old ? 24 : -24 }, { opacity: 1, x: 0, duration: .32, ease: 'power2.out', clearProps: 'transform,opacity' });
    });
    align();
    if (input) {
      const url = new URL(location.href);
      if (!next) url.searchParams.delete('enquiry'); else url.searchParams.set('enquiry', tabs[next].id.replace('contact-tab-', ''));
      history.replaceState(history.state, '', url);
    }
  };
  const click = (e: MouseEvent) => { const tab = (e.target as Element).closest<HTMLButtonElement>('[role=tab]'); if (tab && tabs.includes(tab)) select(tabs.indexOf(tab), true); };
  const key = (e: KeyboardEvent) => {
    const target = { ArrowLeft: (current + tabs.length - 1) % tabs.length, ArrowRight: (current + 1) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (target === undefined) return; e.preventDefault(); select(target, true); tabs[target].focus();
  };
  select(current, false); const resize = new ResizeObserver(align); resize.observe(tabList); tabs.forEach((e) => resize.observe(e));
  tabList.addEventListener('click', click); tabList.addEventListener('keydown', key);
  return () => { resize.disconnect(); tabList.removeEventListener('click', click); tabList.removeEventListener('keydown', key); };
}
function status(host: HTMLElement, text: string, error = false) {
  let message = host.querySelector<HTMLElement>(':scope > [data-replica-status]');
  if (!message) { message = document.createElement('p'); message.dataset.replicaStatus = ''; message.setAttribute('role', 'status'); host.append(message); }
  message.className = `text-sm ${error ? 'text-ember' : 'text-haze-800'}`; message.textContent = text; return message;
}
function forms(main: HTMLElement): Dispose {
  const clean: Dispose[] = [];
  for (const form of main.querySelectorAll<HTMLFormElement>('form')) {
    const submit = (event: SubmitEvent) => { event.preventDefault(); if (!form.reportValidity()) return; status(form.querySelector('[type=submit]')?.parentElement ?? form, 'This preview cannot send your enquiry.', true); };
    form.addEventListener('submit', submit); clean.push(() => form.removeEventListener('submit', submit));
    for (const input of form.querySelectorAll<HTMLInputElement>('input[type=file]')) {
      const drop = input.parentElement, button = drop?.querySelector('button'); if (!drop || !button) continue;
      const choose = () => input.click();
      const update = () => {
        const file = input.files?.[0]; if (!file) { status(drop, ''); return; }
        if (file.size > 10 * 1024 ** 2 || !input.accept.split(',').some((ext) => file.name.toLowerCase().endsWith(ext))) { input.value = ''; status(drop, 'Choose a PDF, DOC, PPT, image or ZIP under 10MB.', true); return; }
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'ml-3 underline'; remove.textContent = 'Remove'; remove.onclick = () => { input.value = ''; update(); };
        status(drop, file.name).append(remove);
      };
      const hover = (e: DragEvent) => { e.preventDefault(); drop.classList.add('replica-drop'); };
      const leave = () => drop.classList.remove('replica-drop');
      const dropped = (e: DragEvent) => { e.preventDefault(); leave(); const file = e.dataTransfer?.files[0]; if (file) { const data = new DataTransfer(); data.items.add(file); input.files = data.files; update(); } };
      button.addEventListener('click', choose); input.addEventListener('change', update); drop.addEventListener('dragover', hover); drop.addEventListener('dragleave', leave); drop.addEventListener('drop', dropped);
      clean.push(() => { button.removeEventListener('click', choose); input.removeEventListener('change', update); drop.removeEventListener('dragover', hover); drop.removeEventListener('dragleave', leave); drop.removeEventListener('drop', dropped); });
    }
  }
  return () => clean.forEach((fn) => fn());
}

function mobileFeatureGrids(main: HTMLElement): Dispose {
  const track = main.querySelector<HTMLUListElement>('#section-agent-mesh-use-cases .feature-grid__items');
  const included = main.querySelector<HTMLUListElement>('#section-agent-mesh-included .feature-grid__items');
  if (!track || !included) return () => {};
  const mobile = matchMedia('(max-width: 767px)');
  const scope = 'data-v-072d457c';
  const trackClass = track.className;
  const slides = Array.from(track.querySelectorAll<HTMLLIElement>(':scope > li'));
  const extra = Array.from(included.querySelectorAll<HTMLLIElement>(':scope > li')).slice(5);
  const pips = document.createElement('div');
  pips.className = 'mt-6 flex items-center gap-2';
  const reveal = document.createElement('div');
  reveal.className = 'feature-grid__reveal';
  reveal.setAttribute(scope, '');
  const revealContent = document.createElement('div'), list = document.createElement('ul');
  list.className = 'feature-grid__items feature-grid__items--four grid gap-5 pt-5';
  list.setAttribute(scope, '');
  revealContent.append(list); reveal.append(revealContent);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-spark py-4 text-base font-medium text-spark';
  toggle.innerHTML = '<svg class="feature-grid__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const chevron = toggle.firstElementChild!;
  chevron.setAttribute(scope, '');
  const label = document.createTextNode('');
  toggle.prepend(label);
  let expanded = false, drag: { pointer: number; x: number; scroll: number } | undefined, frame = 0;
  const offset = (slide: HTMLElement) => slide.offsetLeft;
  const nearest = () => slides.reduce((best, slide, i) => Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[best]) - track.scrollLeft) ? i : best, 0);
  const go = (index: number) => {
    cancelAnimationFrame(frame);
    const from = track.scrollLeft, distance = offset(slides[index]) - from;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { track.scrollLeft = from + distance; return; }
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / 380);
      track.scrollLeft = from + distance * (1 - (1 - progress) ** 3);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
  };
  const buttons = slides.map((slide, i) => {
    const button = document.createElement('button'), dot = document.createElement('span');
    button.type = 'button'; button.className = 'feature-grid__pip-hit'; button.setAttribute(scope, '');
    button.setAttribute('aria-label', 'Go to ' + slide.querySelector('h3')?.textContent?.trim());
    dot.setAttribute(scope, ''); button.append(dot); pips.append(button);
    button.onclick = () => go(i);
    return { button, dot };
  });
  const scroll = () => {
    const active = nearest();
    buttons.forEach(({ button, dot }, index) => {
      const current = index === active;
      button.setAttribute('aria-current', String(current));
      dot.className = 'feature-grid__pip ' + (current ? 'feature-grid__pip--active' : 'feature-grid__pip--idle');
    });
  };
  const press = (e: PointerEvent) => {
    if (!mobile.matches || !e.isPrimary || e.button !== 0) return;
    cancelAnimationFrame(frame);
    drag = { pointer: e.pointerId, x: e.clientX, scroll: track.scrollLeft };
    track.classList.add('feature-grid__track--dragging'); track.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (drag?.pointer === e.pointerId) track.scrollLeft = drag.scroll - (e.clientX - drag.x);
  };
  const release = (e: PointerEvent) => {
    if (drag?.pointer !== e.pointerId) return;
    drag = undefined; track.classList.remove('feature-grid__track--dragging');
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    go(nearest());
  };
  const show = () => {
    toggle.setAttribute('aria-expanded', String(expanded));
    label.data = expanded ? 'Show less ' : '+' + extra.length + ' more ';
    reveal.classList.toggle('feature-grid__reveal--open', expanded);
    chevron.classList.toggle('feature-grid__chevron--up', expanded);
  };
  toggle.onclick = () => { expanded = !expanded; show(); };
  const resize = () => {
    if (mobile.matches) {
      track.className = 'feature-grid__track mt-16 flex';
      slides.forEach((slide) => slide.classList.add('feature-grid__slide'));
      track.after(pips); list.append(...extra); included.after(reveal, toggle);
      show(); scroll();
    } else {
      cancelAnimationFrame(frame); drag = undefined;
      track.className = trackClass;
      slides.forEach((slide) => slide.classList.remove('feature-grid__slide'));
      included.append(...extra); pips.remove(); reveal.remove(); toggle.remove();
    }
  };
  track.addEventListener('scroll', scroll, { passive: true });
  track.addEventListener('pointerdown', press); track.addEventListener('pointermove', move);
  track.addEventListener('pointerup', release); track.addEventListener('pointercancel', release);
  mobile.addEventListener('change', resize); resize();
  return () => {
    cancelAnimationFrame(frame); mobile.removeEventListener('change', resize);
    track.removeEventListener('scroll', scroll);
    track.removeEventListener('pointerdown', press); track.removeEventListener('pointermove', move);
    track.removeEventListener('pointerup', release); track.removeEventListener('pointercancel', release);
  };
}

export function connectContent(main: HTMLElement, cookies: () => void, video: ShowVideo): Dispose {
  const clean = [contact(main), forms(main), mobileFeatureGrids(main), connectGrowth(main), connectPostResults(main), connectBwLawCharts(main), connectCaseCharts(main, 'smartrent'), connectCaseCharts(main, 'spartan-plumbing'), connectCaseCharts(main, 'sidekik'), connectCaseCharts(main, 'property-management-toronto'), connectCaseCharts(main, 'brown-boys-motor-club'), connectCaseCharts(main, 'kent-state-university')];
  const archive = main.querySelector('#archive');
  let archiveLimit = 10;
  const cards = Array.from(main.querySelectorAll<HTMLElement>('.team-member-card article[role=button]'));
  function toggleCard(card: HTMLElement) {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const open = card.getAttribute('aria-expanded') !== 'true';
    for (const element of cards) {
      const expanded = open && element === card;
      element.setAttribute('aria-expanded', String(expanded));
      element.classList.toggle('media-card--expanded', expanded);
      element.parentElement?.classList.toggle('team-member-card--expanded', expanded);
    }
  }
  function activate(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button'), card = event.target.closest<HTMLElement>('article.media-card[role=button]');
    if (!button) { if (card && !event.target.closest('a')) toggleCard(card); return; }
    const label = button.textContent?.trim();
    if (label === 'Cookie settings') cookies();
    if (button.classList.contains('arw-quote__thumb')) video({ id: '1131671936', label: 'Upstix', company: 'Fred Jones - CEO, Outra & Upstix' });
    if (label === 'Load more' && archive?.contains(button)) {
      const items = Array.from(archive.querySelectorAll<HTMLElement>('li')); archiveLimit += 10;
      items.slice(0, archiveLimit).forEach((e) => e.style.removeProperty('display'));
      if (archiveLimit >= items.length) button.hidden = true;
    }
    if (button.classList.contains('comparison-sources__toggle')) {
      const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open));
      const items = Array.from(button.parentElement?.querySelectorAll<HTMLElement>('ul > li') ?? []);
      items.slice(5).forEach((e) => e.classList.toggle('comparison-source--hidden', !open));
      button.textContent = open ? 'Show fewer sources' : `View all ${items.length} sources`;
    }
    if (button.classList.contains('ask-about-us')) {
      const text = button.querySelector<HTMLElement>('.ask-about-us__label > span'); if (!text) return;
      if (text.parentElement && !text.parentElement.style.width) text.parentElement.style.width = `${text.offsetWidth}px`;
      void copy(prompt).then((ok) => { text.textContent = ok ? 'Copied' : 'Copy failed'; window.setTimeout(() => { text.textContent = 'Ask about us'; }, 3000); });
    }
  }
  const keydown = (event: KeyboardEvent) => { if (event.target instanceof HTMLElement && cards.includes(event.target) && ['Enter', ' '].includes(event.key)) { event.preventDefault(); toggleCard(event.target); } };
  main.addEventListener('click', activate); main.addEventListener('keydown', keydown);
  return () => { clean.forEach((fn) => fn()); main.removeEventListener('click', activate); main.removeEventListener('keydown', keydown); };
}
