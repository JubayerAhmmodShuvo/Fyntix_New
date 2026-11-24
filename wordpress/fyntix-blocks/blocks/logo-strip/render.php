<?php
/**
 * Logo Strip Block Template
 *
 * @param array $attributes Block attributes
 */

$title = $attributes['title'] ?? 'Trusted by ambitious global teams';
$logos = $attributes['logos'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-logo-strip',
	'id' => 'section-clients',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-logo-strip__container container">
		<?php if ($title): ?>
		<h2 class="fyntix-logo-strip__title">
			<?php echo esc_html($title); ?>
		</h2>
		<?php endif; ?>
		
		<div class="fyntix-logo-strip__grid">
			<?php if (!empty($logos)): ?>
				<?php foreach ($logos as $logo): ?>
					<?php if (isset($logo['url'])): ?>
					<div class="fyntix-logo-strip__item">
						<img src="<?php echo esc_url($logo['url']); ?>" 
							 alt="<?php echo esc_attr($logo['alt'] ?? ''); ?>"
							 loading="lazy"
							 decoding="async" />
					</div>
					<?php endif; ?>
				<?php endforeach; ?>
			<?php else: ?>
				<!-- Default placeholder logos -->
				<div class="fyntix-logo-strip__item fyntix-logo-strip__placeholder">
					<div class="fyntix-logo-strip__placeholder-box">Client Logo</div>
				</div>
				<div class="fyntix-logo-strip__item fyntix-logo-strip__placeholder">
					<div class="fyntix-logo-strip__placeholder-box">Client Logo</div>
				</div>
				<div class="fyntix-logo-strip__item fyntix-logo-strip__placeholder">
					<div class="fyntix-logo-strip__placeholder-box">Client Logo</div>
				</div>
				<div class="fyntix-logo-strip__item fyntix-logo-strip__placeholder">
					<div class="fyntix-logo-strip__placeholder-box">Client Logo</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>

<style>
.fyntix-logo-strip {
	padding: 4rem 0;
	background-color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-logo-strip__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-logo-strip__title {
	margin: 0 0 3rem;
	font-size: 1.125rem;
	font-weight: 400;
	text-align: center;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-logo-strip__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 2rem;
	align-items: center;
	justify-items: center;
}

.fyntix-logo-strip__item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 4.75rem;
}

.fyntix-logo-strip__item img {
	max-width: 12rem;
	max-height: 4.75rem;
	width: auto;
	height: auto;
	object-fit: contain;
	opacity: 0.7;
	transition: opacity 0.2s ease;
}

.fyntix-logo-strip__item img:hover {
	opacity: 1;
}

.fyntix-logo-strip__placeholder-box {
	padding: 1rem 2rem;
	border: 2px dashed var(--wp--preset--color--haze-300, #e0e0e0);
	border-radius: 0.5rem;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
	font-size: 0.875rem;
}

@media (max-width: 767px) {
	.fyntix-logo-strip {
		padding: 2.5rem 0;
	}
	
	.fyntix-logo-strip__grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}
}
</style>
