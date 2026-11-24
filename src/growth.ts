import gsap from 'gsap';

export function connectGrowth(main: HTMLElement): () => void {
  const section = main.querySelector<HTMLElement>('#section-growth');
  if (!section || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const tweens: gsap.core.Tween[] = [];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const element = entry.target as HTMLElement;
      if (element.hasAttribute('data-growth-card')) {
        tweens.push(gsap.fromTo(element, { opacity: 0, y: 48 }, {
          opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'opacity,transform',
        }));
        continue;
      }
      for (const number of element.querySelectorAll<HTMLElement>('[data-growth-counter]')) {
        const target = Number(number.dataset.growthCounter);
        const decimals = Number(number.dataset.growthDecimals ?? 0);
        if (!Number.isFinite(target)) continue;
        const state = { value: 0 };
        number.textContent = state.value.toFixed(decimals);
        tweens.push(gsap.to(state, {
          value: target, duration: 1.6, ease: 'power3.out',
          onUpdate: () => { number.textContent = state.value.toFixed(decimals); },
          onComplete: () => { number.textContent = target.toFixed(decimals); },
        }));
      }
    }
  }, { threshold: .2 });

  const card = section.querySelector<HTMLElement>('[data-growth-card]');
  if (card) observer.observe(card);
  for (const counter of section.querySelectorAll<HTMLElement>('[data-framer-name^="Counter ·"]')) observer.observe(counter);

  return () => {
    observer.disconnect();
    tweens.forEach(tween => tween.kill());
  };
}
