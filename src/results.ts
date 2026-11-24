import gsap from 'gsap';

/** Reconnect the original Taffy post motion to Fyntix's page lifecycle. */
export function connectPostResults(main: HTMLElement): () => void {
  const section = main.querySelector<HTMLElement>('#section-post-results');
  if (!section || typeof IntersectionObserver === 'undefined') return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tweens: gsap.core.Tween[] = [];
  const floats = new Map<Element, gsap.core.Tween>();
  const playing = new Set<HTMLVideoElement>();

  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const loop = floats.get(entry.target);
      if (loop) entry.isIntersecting && !document.hidden ? loop.play() : loop.pause();
      if (!(entry.target instanceof HTMLVideoElement)) continue;
      const video = entry.target;
      if (entry.isIntersecting && !reduced) {
        playing.add(video);
        if (!document.hidden) void video.play().catch(() => {});
      } else {
        playing.delete(video);
        video.pause();
      }
    }
  }, { threshold: .05 });

  for (const video of section.querySelectorAll('video')) {
    video.muted = true;
    visibility.observe(video);
  }

  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal.unobserve(entry.target);
      if (reduced) continue;
      const element = entry.target as HTMLElement;
      if (element.hasAttribute('data-results-reveal')) {
        tweens.push(gsap.fromTo(element, {
          opacity: 0, y: Number(element.dataset.resultsReveal),
        }, {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          clearProps: 'opacity,transform',
        }));
      }
      const numbers = Array.from(element.querySelectorAll<HTMLElement>('[data-results-counter]'));
      if (!numbers.length) continue;
      const target = Number(numbers[0].dataset.resultsCounter);
      const count = { value: 0 };
      tweens.push(gsap.to(count, {
        value: target, duration: 1.6, ease: 'power3.out',
        onUpdate: () => numbers.forEach(number => { number.textContent = String(Math.round(count.value)); }),
        onComplete: () => numbers.forEach(number => { number.textContent = String(target); }),
      }));
    }
  }, { threshold: .2 });

  for (const element of section.querySelectorAll('[data-results-reveal], [data-framer-name^="Counter ·"]')) {
    reveal.observe(element);
  }
  if (!reduced) {
    for (const element of section.querySelectorAll('[data-results-float]')) {
      const loop = gsap.to(element, {
        y: -8, duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
      });
      floats.set(element, loop);
      visibility.observe(element);
    }
  }

  const onVisibility = () => {
    for (const video of playing) {
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    reveal.disconnect();
    visibility.disconnect();
    tweens.forEach(tween => tween.kill());
    floats.forEach(tween => tween.kill());
    section.querySelectorAll('video').forEach(video => video.pause());
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
