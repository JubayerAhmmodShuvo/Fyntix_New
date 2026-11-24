/**
 * Our Work Block View Script - Particle Background
 * Adapted from original motion.ts embedded() function
 */
import { particleField } from '../../src/particles.js';

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#section-our-work');
  if (!section) return;
  
  const particleContainer = section.querySelector('.section-particle-background');
  if (!particleContainer) return;
  
  // Initialize particle field with earth shape (from original)
  const scene = {
    shape: 'earth',
    profile: 'accent-right-medium',
    palette: 'gradientBrandOnCharcoal'
  };
  
  let field = null;
  
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !field) {
      field = particleField(particleContainer, scene, {
        embedded: true,
        drag: false,
        scrim: true
      });
    } else if (!entry.isIntersecting && field) {
      field.dispose();
      field = null;
    }
  }, { rootMargin: '400px' });
  
  observer.observe(particleContainer);
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    if (field) field.dispose();
  });
});
