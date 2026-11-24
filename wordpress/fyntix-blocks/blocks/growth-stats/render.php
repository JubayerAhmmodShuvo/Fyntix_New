<?php
/**
 * Growth Stats Block - Exact match to original
 */

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-growth-stats relative py-24 bg-chalk',
	'id' => 'section-growth',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="container px-gutter max-md:px-gutter-mobile">
		<!-- Watermark "Growth" -->
		<div class="growth-watermark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none" aria-hidden="true">
			<span class="text-[20rem] font-bold tracking-tight">Growth</span>
		</div>

		<div class="relative z-10">
			<div class="text-center mb-16 max-w-4xl mx-auto">
				<h2 class="text-4xl md:text-5xl font-normal leading-tight mb-4 text-slatecolor">
					Growth you can measure, not just likes
				</h2>
				<p class="text-xl text-haze-800">
					Every number comes from a real client account and lands in your report each month.
				</p>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<!-- Stat 1: 2.4B organic views -->
				<div class="fyntix-growth-stat bg-gradient-to-br from-chalk to-haze-50 p-8 rounded-2xl border border-haze-300" data-growth-card>
					<div class="mb-4">
						<svg class="w-12 h-12 text-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
						</svg>
					</div>
					<div class="fyntix-growth-stat__value text-6xl font-semibold text-spark mb-2" data-growth-counter="2.4" data-growth-decimals="1">
						2.4B
					</div>
					<div class="fyntix-growth-stat__label text-lg font-medium text-slatecolor mb-1">
						organic views
					</div>
					<div class="fyntix-growth-stat__description text-sm text-haze-800">
						across client accounts in 2025
					</div>
				</div>

				<!-- Stat 2: 9 days -->
				<div class="fyntix-growth-stat bg-gradient-to-br from-chalk to-haze-50 p-8 rounded-2xl border border-haze-300" data-growth-card>
					<div class="mb-4">
						<svg class="w-12 h-12 text-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
						</svg>
					</div>
					<div class="fyntix-growth-stat__value text-6xl font-semibold text-spark mb-2" data-growth-counter="9" data-growth-decimals="0">
						9 days
					</div>
					<div class="fyntix-growth-stat__label text-lg font-medium text-slatecolor mb-1">
						from kickoff call to your first Reel
					</div>
					<div class="fyntix-growth-stat__description text-sm text-haze-800">
						Day 9 · live
					</div>
				</div>

				<!-- Stat 3: 38M for brands -->
				<div class="fyntix-growth-stat bg-gradient-to-br from-chalk to-haze-50 p-8 rounded-2xl border border-haze-300" data-growth-card>
					<div class="mb-4">
						<svg class="w-12 h-12 text-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<div class="fyntix-growth-stat__value text-6xl font-semibold text-spark mb-2" data-growth-counter="38" data-growth-decimals="0">
						38M
					</div>
					<div class="fyntix-growth-stat__label text-lg font-medium text-slatecolor mb-1">
						for brands since 2021
					</div>
					<div class="fyntix-growth-stat__description text-sm text-haze-800">
						reported monthly, never rounded up
					</div>
				</div>

				<!-- Stat 4: 4.1× average ROAS -->
				<div class="fyntix-growth-stat bg-gradient-to-br from-chalk to-haze-50 p-8 rounded-2xl border border-haze-300" data-growth-card>
					<div class="mb-4">
						<svg class="w-12 h-12 text-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
						</svg>
					</div>
					<div class="fyntix-growth-stat__value text-6xl font-semibold text-spark mb-2" data-growth-counter="4.1" data-growth-decimals="1">
						4.1×
					</div>
					<div class="fyntix-growth-stat__label text-lg font-medium text-slatecolor mb-1">
						average ROAS
					</div>
					<div class="fyntix-growth-stat__description text-sm text-haze-800">
						return on ad spend
					</div>
				</div>
			</div>

			<div class="text-center mt-12">
				<a href="/#our-work" class="inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium border-2 border-charcoal text-charcoal bg-transparent hover:bg-charcoal hover:text-chalk transition-colors">
					See our results
				</a>
			</div>
		</div>
	</div>
</section>

<style>
.px-gutter {
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}
@media (max-width: 767px) {
	.max-md\:px-gutter-mobile {
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
}
.growth-watermark span {
	font-family: var(--wp--preset--font-family--inter-display, sans-serif);
	color: var(--wp--preset--color--haze-300, #e0e0e0);
}
</style>
