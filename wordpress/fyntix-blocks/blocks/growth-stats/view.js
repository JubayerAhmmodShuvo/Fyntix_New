/**
 * Growth Stats Block View Script - GSAP Counter Animations
 * Adapted from original growth.ts
 */
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#section-growth');
  if (!section || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const tweens = [];
  
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      
      const element = entry.target;
      
      // Animate card entry
      if (element.hasAttribute('data-growth-card') || element.classList.contains('fyntix-growth-stat')) {
        tweens.push(gsap.fromTo(element, 
          { opacity: 0, y: 48 },
          { 
            opacity: 1,
            y: 0,
            duration: .7,
            ease: 'power3.out',
            clearProps: 'opacity,transform'
          }
        ));
      }
      
      // Animate counters
      const counters = element.querySelectorAll('[data-growth-counter], .fyntix-growth-stat__value');
      for (const number of counters) {
        const targetText = number.dataset.growthCounter || number.dataset.value || number.textContent.trim();
        const target = parseFloat(targetText.replace(/[^\d.-]/g, ''));
        const decimals = Number(number.dataset.growthDecimals || 0);
        
        if (!Number.isFinite(target)) continue;
        
        const state = { value: 0 };
        number.textContent = state.value.toFixed(decimals);
        
        tweens.push(gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            const formatted = state.value.toFixed(decimals);
            // Preserve suffix from original
            const suffix = targetText.match(/[^\d.-]+$/)?.[0] || '';
            number.textContent = formatted + suffix;
          },
          onComplete: () => {
            number.textContent = targetText;
          }
        }));
      }
    }
  }, { threshold: .2 });
  
  // Observe all stat cards
  const cards = section.querySelectorAll('.fyntix-growth-stat, [data-growth-card]');
  cards.forEach(card => observer.observe(card));
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    tweens.forEach(tween => tween.kill());
  });
});
