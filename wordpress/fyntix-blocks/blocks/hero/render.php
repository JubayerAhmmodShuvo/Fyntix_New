<?php
/**
 * Hero Block - Exact match to original
 */

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-hero page-shell relative min-h-screen flex items-center justify-center',
	'id' => 'section-hero',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-hero__content container text-center px-gutter max-md:px-gutter-mobile py-32">
		<h1 class="fyntix-hero__title text-6xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6">
			Business growth that gets you <em class="font-serif italic font-normal">seen</em>
		</h1>
		
		<p class="fyntix-hero__subtitle text-xl md:text-2xl text-slatecolor max-w-3xl mx-auto mb-12">
			Fyntix is a business growth agency. We make sure your customers find you everywhere, from Google Search to ChatGPT.
		</p>
		
		<div class="fyntix-hero__actions flex gap-4 justify-center flex-wrap">
			<a href="/contact" class="inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium bg-charcoal text-chalk hover:bg-slate-dark transition-colors shadow-button">
				Contact
			</a>
			<a href="/#our-work" class="inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-medium border-2 border-haze-300 text-slatecolor bg-chalk hover:bg-haze transition-colors">
				Our work
			</a>
		</div>
	</div>
</section>

<style>
.fyntix-hero {
	position: relative;
	z-index: 1;
	background: transparent !important;
}
.fyntix-hero__title {
	color: var(--wp--preset--color--slatecolor, #262626);
	font-family: var(--wp--preset--font-family--inter-display, sans-serif);
	letter-spacing: -0.04em;
}
.fyntix-hero__title em {
	font-family: var(--wp--preset--font-family--instrument-serif, serif);
	font-style: italic;
	font-weight: 400;
}
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
.shadow-button {
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
