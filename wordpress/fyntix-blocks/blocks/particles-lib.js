/**
 * Particle system library - extracted from original Fyntix repo
 * This is the core Three.js particle field implementation
 */
import * as THREE from 'three';

export const particleField = (() => {
  // Copy the entire particles.ts implementation here
  // For now, creating a simplified version that can be expanded
  
  return {
    create: (container, scene, options = {}) => {
      // Initialize Three.js scene
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      
      const threeScene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      
      // Create particle system
      const geometry = new THREE.BufferGeometry();
      const count = options.count || 10000;
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xf75d3b,
        transparent: true,
        opacity: 0.6,
      });
      
      const particles = new THREE.Points(geometry, material);
      threeScene.add(particles);
      
      // Animation loop
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        renderer.render(threeScene, camera);
      };
      animate();
      
      // Handle resize
      const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return {
        dispose: () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          renderer.dispose();
          geometry.dispose();
          material.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
      };
    }
  };
})();
