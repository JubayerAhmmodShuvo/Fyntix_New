import gsap from 'gsap';

/** Animate the case-study snapshot without changing its reported data. */
export function connectCaseCharts(main: HTMLElement, slug: string): () => void {
  const overview = main.querySelector<HTMLElement>(`#${slug}-overview`);
  if (!overview || typeof IntersectionObserver === 'undefined') return () => {};

  const cards = Array.from(main.querySelectorAll<HTMLElement>(`#${slug}-overview [data-bw-animate], #${slug}-results [data-bw-animate]`));
  const counters = cards.flatMap(card => Array.from(card.querySelectorAll<HTMLElement>('[data-bw-counter]')));
  const originalNumbers = new Map(counters.map(counter => [counter, counter.textContent]));
  const originalStyles = new Map<Element, string | null>();
  for (const card of cards) {
    for (const element of [card, ...card.querySelectorAll('[data-bw-bar], [data-bw-ring]')]) {
      originalStyles.set(element, element.getAttribute('style'));
    }
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = overview.querySelector<HTMLButtonElement>('[data-bw-replay]');
  const replayWasHidden = replay?.hidden ?? true;
  const timelines = new Map<HTMLElement, gsap.core.Timeline>();
  const visible = new Set<HTMLElement>();
  let disposed = false;

  function makeTimeline(card: HTMLElement) {
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(card, { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: .6, ease: 'power3.out', clearProps: 'opacity,transform',
    }, 0);

    for (const counter of card.querySelectorAll<HTMLElement>('[data-bw-counter]')) {
      const target = Number(counter.dataset.bwCounter);
      const start = Number(counter.dataset.bwCounterFrom ?? 0);
      const digits = Math.min(3, Math.max(0, Math.floor(Number(counter.dataset.bwDecimals ?? 0))));
      if (![target, start, digits].every(Number.isFinite)) continue;
      const state = { value: start };
      const format = (value: number) => value.toLocaleString('en-CA', { minimumFractionDigits: digits, maximumFractionDigits: digits });
      timeline.fromTo(state, { value: start }, {
        value: target, duration: 1.6, ease: 'power3.out',
        onUpdate: () => { counter.textContent = format(state.value); },
        onComplete: () => { counter.textContent = format(target); },
      }, .12);
    }

    for (const bar of card.querySelectorAll<HTMLElement>('[data-bw-bar]')) {
      const horizontal = bar.dataset.bwBar === 'horizontal';
      timeline.fromTo(bar, horizontal ? { scaleX: 0 } : { scaleY: 0 }, {
        ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }),
        transformOrigin: horizontal ? '0% 50%' : '50% 100%',
        duration: 1.4, ease: 'power3.out', clearProps: 'transform',
      }, .18);
    }

    for (const ring of card.querySelectorAll<SVGCircleElement>('[data-bw-ring]')) {
      const circumference = Number(ring.dataset.bwRingCircumference);
      const arc = Number(ring.dataset.bwRingArc);
      if (!Number.isFinite(circumference) || !Number.isFinite(arc)) continue;
      timeline.fromTo(ring, { strokeDasharray: `0 ${circumference}` }, {
        strokeDasharray: `${arc} ${circumference - arc}`,
        duration: 1.6, ease: 'power3.out', clearProps: 'strokeDasharray',
      }, .18);
    }
    timelines.set(card, timeline);
    return timeline;
  }

  function updatePlayback() {
    if (disposed) return;
    for (const card of cards) {
      const timeline = timelines.get(card);
      if (!visible.has(card) || document.hidden || reduced.matches) timeline?.pause();
      else (timeline ?? makeTimeline(card)).play();
    }
  }

  const observer = new IntersectionObserver(entries => {
    if (disposed) return;
    for (const entry of entries) {
      const card = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(card);
      else visible.delete(card);
    }
    updatePlayback();
  }, { threshold: .15 });
  cards.forEach(card => observer.observe(card));

  const replayAnimations = () => {
    if (disposed || reduced.matches) return;
    for (const card of cards) {
      const timeline = timelines.get(card);
      if (timeline) {
        timeline.restart();
        if (!visible.has(card) || document.hidden) timeline.pause();
      }
    }
    updatePlayback();
  };
  const updatePreference = () => {
    if (replay) replay.hidden = reduced.matches;
    if (reduced.matches) {
      timelines.forEach(timeline => timeline.progress(1).pause());
      originalNumbers.forEach((text, counter) => { counter.textContent = text; });
    } else updatePlayback();
  };
  updatePreference();
  replay?.addEventListener('click', replayAnimations);
  reduced.addEventListener('change', updatePreference);
  document.addEventListener('visibilitychange', updatePlayback);

  return () => {
    disposed = true;
    observer.disconnect();
    timelines.forEach(timeline => timeline.kill());
    replay?.removeEventListener('click', replayAnimations);
    reduced.removeEventListener('change', updatePreference);
    document.removeEventListener('visibilitychange', updatePlayback);
    originalNumbers.forEach((text, counter) => { counter.textContent = text; });
    originalStyles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
    if (replay) replay.hidden = replayWasHidden;
  };
}

export function connectBwLawCharts(main: HTMLElement): () => void {
  return connectCaseCharts(main, 'bw-law');
}
