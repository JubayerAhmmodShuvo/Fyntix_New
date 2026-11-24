<?php
/**
 * Logo Strip - Exact copy from original site
 */

$wrapper_attributes = get_block_wrapper_attributes([
	'id' => 'section-clients',
	'class' => 'section-shell relative pointer-events-auto',
]);

// Real client logos from live site
$logos = [
	['file' => 'fanshawe-driving-school.webp', 'alt' => 'Fanshawe Driving School'],
	['file' => 'possible.png', 'alt' => 'Possible'],
	['file' => 'the-family-plumber.svg', 'alt' => 'The Family Plumber'],
	['file' => 'morcos-law-group.png', 'alt' => 'Morcos Law Group'],
	['file' => 'total-restoration.svg', 'alt' => 'Total Restoration'],
	['file' => 'survey-works.png', 'alt' => 'Survey Works'],
	['file' => 'pifi.webp', 'alt' => 'PiFi'],
	['file' => 'client-logo.svg', 'alt' => 'Client'],
];
?>

<section <?php echo $wrapper_attributes; ?> data-v-1c6297c3="">
	<div class="section-shell-padding px-gutter max-md:px-gutter-mobile md:py-28 max-md:py-20" data-v-1c6297c3="">
		<h2 class="section-heading section-heading--secondary text-center mb-12 md:mb-16" data-v-5ed0f8b6="">
			Trusted by ambitious global teams to build what's next.
		</h2>
		<div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-20 md:gap-y-14">
			<?php foreach ($logos as $logo): ?>
			<div class="fyntix-client-logo-wrapper flex-shrink-0">
				<img 
					src="<?php echo esc_url(plugins_url('assets/client-logos/' . $logo['file'], dirname(__DIR__))); ?>" 
					alt="<?php echo esc_attr($logo['alt']); ?>" 
					class="fyntix-client-logo" 
					loading="lazy"
					decoding="async"
				/>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<style>
/* Exact CSS from original src/replica.css */
#section-clients .fyntix-client-logo {
	max-width: min(16rem, 100%);
	max-height: 4.75rem;
	object-fit: contain;
	transform: scale(0.7);
	transform-origin: center;
	opacity: 0.6;
	transition: opacity 0.2s ease;
}

#section-clients .fyntix-client-logo:hover {
	opacity: 1;
}

#section-clients .fyntix-client-logo[src$="/possible.png"],
#section-clients .fyntix-client-logo[src$="/the-family-plumber.svg"] {
	transform: scale(0.77);
}

#section-clients .fyntix-client-logo--monochrome {
	filter: brightness(0);
}

.section-heading--secondary {
	font-size: clamp(1.125rem, 2vw, 1.375rem);
	font-weight: 500;
	line-height: 1.3;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
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
</style>
