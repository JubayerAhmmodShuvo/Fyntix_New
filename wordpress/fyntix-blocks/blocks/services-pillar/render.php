<?php
/**
 * Services Pillar Block Template
 */

$title = $attributes['title'] ?? 'Search & AI Visibility';
$subtitle = $attributes['subtitle'] ?? 'Get found in search and AI answers';
$description = $attributes['description'] ?? '';
$services = $attributes['services'] ?? [];
$bg_color = $attributes['backgroundColor'] ?? 'charcoal';

$text_color = $bg_color === 'charcoal' ? 'chalk' : 'slatecolor';

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-services-pillar has-' . esc_attr($bg_color) . '-background-color',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-services-pillar__container container">
		<div class="fyntix-services-pillar__header">
			<h2 class="fyntix-services-pillar__title has-<?php echo esc_attr($text_color); ?>-color">
				<?php echo esc_html($title); ?>
			</h2>
			<p class="fyntix-services-pillar__subtitle has-<?php echo esc_attr($text_color); ?>-color">
				<?php echo esc_html($subtitle); ?>
			</p>
			<?php if ($description): ?>
			<p class="fyntix-services-pillar__description">
				<?php echo esc_html($description); ?>
			</p>
			<?php endif; ?>
		</div>
		
		<?php if (!empty($services)): ?>
		<div class="fyntix-services-pillar__grid">
			<?php foreach ($services as $service): ?>
			<article class="fyntix-service-card">
				<h3 class="fyntix-service-card__title">
					<?php echo esc_html($service['title']); ?>
				</h3>
				<p class="fyntix-service-card__description">
					<?php echo esc_html($service['description']); ?>
				</p>
			</article>
			<?php endforeach; ?>
		</div>
		<?php endif; ?>
	</div>
</section>

<style>
.fyntix-services-pillar {
	padding: 8rem 0;
	position: relative;
}

.fyntix-services-pillar.has-charcoal-background-color {
	background-color: var(--wp--preset--color--charcoal, #141414);
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-services-pillar.has-soft-grey-background-color {
	background-color: var(--wp--preset--color--soft-grey, #f8f8f8);
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-services-pillar__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-services-pillar__header {
	max-width: 50rem;
	margin-bottom: 4rem;
}

.fyntix-services-pillar__title {
	margin: 0 0 1rem;
	font-size: clamp(2rem, 4vw, 2.25rem);
	font-weight: 400;
	line-height: 1.2;
	color: var(--wp--preset--color--spark, #f75d3b);
}

.fyntix-services-pillar__subtitle {
	margin: 0 0 1.5rem;
	font-size: 1.5rem;
	font-weight: 400;
	line-height: 1.3;
}

.fyntix-services-pillar__description {
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.8);
}

.has-soft-grey-background-color .fyntix-services-pillar__description {
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-services-pillar__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
}

.fyntix-service-card {
	padding: 2.5rem;
	border-radius: 1rem;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.has-soft-grey-background-color .fyntix-service-card {
	background: var(--wp--preset--color--chalk, #fff);
	border-color: var(--wp--preset--color--haze-300, #e0e0e0);
}

.fyntix-service-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.fyntix-service-card__title {
	margin: 0 0 0.75rem;
	font-size: 1.5rem;
	font-weight: 400;
	line-height: 1.3;
	color: var(--wp--preset--color--spark, #f75d3b);
}

.fyntix-service-card__description {
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.8);
}

.has-soft-grey-background-color .fyntix-service-card__description {
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

@media (max-width: 767px) {
	.fyntix-services-pillar {
		padding: 4rem 0;
	}
	
	.fyntix-services-pillar__header {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-services-pillar__grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	
	.fyntix-service-card {
		padding: 1.5rem;
	}
}
</style>
