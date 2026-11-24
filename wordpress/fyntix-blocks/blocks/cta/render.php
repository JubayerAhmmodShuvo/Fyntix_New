<?php
/**
 * CTA Block Template
 */

$title = $attributes['title'] ?? 'Ready to grow?';
$description = $attributes['description'] ?? '';
$button_text = $attributes['buttonText'] ?? 'Get started';
$button_url = $attributes['buttonUrl'] ?? '/contact';
$bg_color = $attributes['backgroundColor'] ?? 'charcoal';

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-cta has-' . esc_attr($bg_color) . '-background-color',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-cta__container container">
		<div class="fyntix-cta__content">
			<h2 class="fyntix-cta__title">
				<?php echo esc_html($title); ?>
			</h2>
			
			<?php if ($description): ?>
			<p class="fyntix-cta__description">
				<?php echo esc_html($description); ?>
			</p>
			<?php endif; ?>
			
			<div class="fyntix-cta__button">
				<a href="<?php echo esc_url($button_url); ?>" class="wp-block-button__link wp-element-button">
					<?php echo esc_html($button_text); ?>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
.fyntix-cta {
	padding: 6rem 0;
	text-align: center;
}

.fyntix-cta.has-charcoal-background-color {
	background-color: var(--wp--preset--color--charcoal, #141414);
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-cta.has-soft-grey-background-color {
	background-color: var(--wp--preset--color--soft-grey, #f8f8f8);
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-cta__container {
	max-width: 50rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-cta__content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
}

.fyntix-cta__title {
	margin: 0;
	font-size: clamp(2.5rem, 5vw, 4rem);
	font-weight: 400;
	line-height: 1.1;
}

.fyntix-cta__description {
	margin: 0;
	font-size: 1.25rem;
	line-height: 1.6;
	max-width: 40rem;
}

.has-charcoal-background-color .fyntix-cta__description {
	color: rgba(255, 255, 255, 0.8);
}

.has-soft-grey-background-color .fyntix-cta__description {
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-cta__button .wp-block-button__link {
	background-color: var(--wp--preset--color--spark, #f75d3b);
	color: var(--wp--preset--color--chalk, #fff);
	padding: 1rem 2rem;
	font-size: 1.125rem;
	font-weight: 500;
	border-radius: 9999px;
	text-decoration: none;
	transition: background-color 0.2s ease, transform 0.2s ease;
	display: inline-block;
}

.fyntix-cta__button .wp-block-button__link:hover {
	background-color: #e14b2b;
	transform: translateY(-2px);
}

@media (max-width: 767px) {
	.fyntix-cta {
		padding: 3rem 0;
	}
	
	.fyntix-cta__content {
		gap: 1.5rem;
	}
}
</style>
