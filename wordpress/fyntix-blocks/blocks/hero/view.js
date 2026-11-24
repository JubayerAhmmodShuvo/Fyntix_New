/**
 * Hero Block View Script - Particles + Text Reveal
 * Adapted from original motion.ts
 */
import { particleField } from '../../src/particles.js';

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('#section-hero');
  if (!hero) return;
  
  // Find or create particle container
  let particleContainer = document.querySelector('#canvas-wrapper');
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.id = 'canvas-wrapper';
    particleContainer.className = 'replica-background fixed-visual-viewport pointer-events-none z-0';
    particleContainer.setAttribute('aria-hidden', 'true');
    particleContainer.style.cssText = 'position: fixed; inset: 0; z-index: 0; pointer-events: none;';
    document.body.prepend(particleContainer);
  }
  
  // Initialize particle field with mobius shape
  const isMobile = matchMedia('(max-width: 767px)').matches;
  const scene = {
    shape: 'mobius',
    profile: isMobile ? 'hero-deep-mobile' : 'hero-deep',
    palette: 'sparkMonoOnLight'
  };
  
  const field = particleField(particleContainer, scene, {
    background: true,
    parallax: true,
    intro: true
  });
  
  // Update profile on resize
  const mediaQuery = matchMedia('(max-width: 767px)');
  const handleResize = () => {
    field.set({
      shape: 'mobius',
      profile: mediaQuery.matches ? 'hero-deep-mobile' : 'hero-deep',
      palette: 'sparkMonoOnLight'
    });
  };
  mediaQuery.addEventListener('change', handleResize);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    field.dispose();
  });
});
