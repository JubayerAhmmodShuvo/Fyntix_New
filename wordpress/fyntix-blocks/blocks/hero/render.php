<?php
/**
 * Hero Block Template
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 */

$title = $attributes['title'] ?? 'Business growth that gets you seen';
$subtitle = $attributes['subtitle'] ?? 'Fyntix is a business growth agency. We make sure your customers find you everywhere, from Google Search to ChatGPT.';
$cta_text = $attributes['ctaText'] ?? 'Get started';
$cta_url = $attributes['ctaUrl'] ?? '/contact';
$bg_color = $attributes['backgroundColor'] ?? 'chalk';

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-hero has-' . esc_attr($bg_color) . '-background-color',
	'id' => 'section-hero',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-hero__content container">
		<div class="fyntix-hero__inner">
			<h1 class="fyntix-hero__title">
				<?php echo esc_html($title); ?>
			</h1>
			
			<p class="fyntix-hero__subtitle">
				<?php echo esc_html($subtitle); ?>
			</p>
			
			<?php if ($cta_text && $cta_url): ?>
			<div class="fyntix-hero__cta">
				<a href="<?php echo esc_url($cta_url); ?>" class="wp-block-button__link wp-element-button">
					<?php echo esc_html($cta_text); ?>
				</a>
			</div>
			<?php endif; ?>
		</div>
	</div>
</section>

<style>
.fyntix-hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 80vh;
	padding: 3rem 0;
	text-align: center;
}

.fyntix-hero__content {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-hero__inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2.75rem;
	max-width: 60rem;
	margin: 0 auto;
}

.fyntix-hero__title {
	margin: 0;
	font-family: 'Inter Display', sans-serif;
	font-size: clamp(2.5rem, 5vw, 4.75rem);
	font-weight: 500;
	font-style: normal;
	line-height: 1.05;
	letter-spacing: -0.04em;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-hero__subtitle {
	max-width: 35rem;
	margin: 0;
	font-family: 'Inter Display', sans-serif;
	font-size: 1.125rem;
	font-style: normal;
	font-weight: 400;
	line-height: 1.55;
	letter-spacing: 0;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-hero__cta {
	margin-top: 1rem;
}

.fyntix-hero__cta .wp-block-button__link {
	background-color: var(--wp--preset--color--spark, #f75d3b);
	color: var(--wp--preset--color--chalk, #fff);
	padding: 0.875rem 1.5rem;
	font-size: 1rem;
	font-weight: 500;
	border-radius: 9999px;
	text-decoration: none;
	transition: background-color 0.2s ease;
}

.fyntix-hero__cta .wp-block-button__link:hover {
	background-color: #e14b2b;
}

@media (max-width: 767px) {
	.fyntix-hero {
		min-height: 70vh;
		padding: 2rem 0;
	}
	
	.fyntix-hero__title {
		font-size: 2.5rem;
		line-height: 1.1;
	}
	
	.fyntix-hero__subtitle {
		font-size: 1rem;
	}
}
</style>
