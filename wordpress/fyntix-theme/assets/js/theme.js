/**
 * Fyntix Theme JavaScript
 * Minimal JavaScript for theme functionality
 */

(function() {
	'use strict';
	
	// Smooth scroll for anchor links
	document.addEventListener('click', function(e) {
		const target = e.target.closest('a[href^="#"]');
		if (!target) return;
		
		const href = target.getAttribute('href');
		if (href === '#') return;
		
		e.preventDefault();
		
		const element = document.querySelector(href);
		if (!element) return;
		
		const offset = window.innerWidth < 768 ? 88 : 112; // Mobile vs desktop nav height
		const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
		const offsetPosition = elementPosition - offset;
		
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	});
	
	// Add loaded class for any CSS transitions
	window.addEventListener('load', function() {
		document.documentElement.classList.add('loaded');
	});
	
})();
