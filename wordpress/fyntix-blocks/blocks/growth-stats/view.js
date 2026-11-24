/**
 * Growth Stats Animation
 * Animates numbers on scroll into view
 */

document.addEventListener('DOMContentLoaded', () => {
	const stats = document.querySelectorAll('.fyntix-growth-stat__value');
	
	if (!stats.length) return;
	
	const animateValue = (element, start, end, duration) => {
		const startTime = performance.now();
		const isDecimal = end.includes('.');
		const hasMultiplier = end.match(/([KMB×])/);
		const cleanEnd = parseFloat(end.replace(/[^\d.]/g, ''));
		
		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			// Easing function
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			const current = start + (cleanEnd - start) * easeOutQuart;
			
			let displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
			if (hasMultiplier) {
				displayValue += hasMultiplier[1];
			}
			
			element.textContent = displayValue;
			
			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				element.textContent = end;
			}
		};
		
		requestAnimationFrame(animate);
	};
	
	const observerOptions = {
		threshold: 0.5,
		rootMargin: '0px 0px -100px 0px'
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.dataset.animated) {
				entry.target.dataset.animated = 'true';
				const endValue = entry.target.dataset.value || entry.target.textContent;
				animateValue(entry.target, 0, endValue, 2000);
			}
		});
	}, observerOptions);
	
	stats.forEach(stat => observer.observe(stat));
});
