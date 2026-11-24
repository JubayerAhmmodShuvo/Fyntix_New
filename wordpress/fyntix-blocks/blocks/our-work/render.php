<?php
/**
 * Our Work Block Template
 */

$title = $attributes['title'] ?? 'Our work';
$subtitle = $attributes['subtitle'] ?? 'From pilots to products people use every day.';
$case_studies = $attributes['caseStudies'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-our-work',
	'id' => 'section-our-work',
]);
?>

<div class="fyntix-section-surface">
	<div class="section-particle-background">
		<span></span>
	</div>
	
	<section <?php echo $wrapper_attributes; ?>>
		<div class="fyntix-our-work__container container">
			<div class="fyntix-section-header">
				<h2 class="fyntix-section-heading">
					<span class="fyntix-section-heading__line">
						<span class="fyntix-section-heading__label"><?php echo esc_html($title); ?>.</span>
						<?php 
						$subtitle_parts = explode(' ', $subtitle);
						$first_part = array_slice($subtitle_parts, 0, 2);
						$second_part = array_slice($subtitle_parts, 2);
						?>
						<span class="fyntix-section-heading__body"><?php echo esc_html(implode(' ', $first_part)); ?></span>
					</span>
					<span class="fyntix-section-heading__line fyntix-section-heading__line--second">
						<span class="fyntix-section-heading__body"><?php echo esc_html(implode(' ', array_slice($second_part, 0, 1))); ?></span>
						<em class="fyntix-section-heading__accent"><?php echo esc_html(implode(' ', array_slice($second_part, 1))); ?></em>
					</span>
				</h2>
			</div>
			
			<div class="fyntix-our-work__grid">
				<?php foreach ($case_studies as $case): ?>
				<article class="fyntix-case-card">
					<?php if (!empty($case['image'])): ?>
					<div class="fyntix-case-card__image">
						<img src="<?php echo esc_url($case['image']); ?>" 
							 alt="<?php echo esc_attr($case['title']); ?>"
							 loading="lazy" 
							 decoding="async" />
					</div>
					<?php endif; ?>
					
					<div class="fyntix-case-card__content">
						<?php if (!empty($case['metric'])): ?>
						<div class="fyntix-case-card__metric">
							<div class="fyntix-case-card__metric-value"><?php echo esc_html($case['metric']); ?></div>
							<div class="fyntix-case-card__metric-label"><?php echo esc_html($case['metricLabel']); ?></div>
						</div>
						<?php endif; ?>
						
						<h3 class="fyntix-case-card__title">
							<?php echo esc_html($case['title']); ?>
						</h3>
						
						<p class="fyntix-case-card__description">
							<?php echo esc_html($case['description']); ?>
						</p>
						
						<?php if (!empty($case['link'])): ?>
						<a href="<?php echo esc_url($case['link']); ?>" class="fyntix-case-card__link">
							View case study →
						</a>
						<?php endif; ?>
					</div>
				</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
</div>

<style>
.fyntix-section-surface {
	position: relative;
	width: 100%;
	background-color: var(--wp--preset--color--charcoal, #141414);
}

.section-particle-background {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
}

.fyntix-our-work {
	position: relative;
	z-index: 10;
	padding: 8rem 0;
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-our-work__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-section-header {
	margin-bottom: 6rem;
}

.fyntix-section-heading {
	margin: 0;
	font-size: clamp(2.5rem, 5vw, 4rem);
	font-weight: 400;
	line-height: 1.1;
}

.fyntix-section-heading__line {
	display: block;
}

.fyntix-section-heading__label {
	color: var(--wp--preset--color--spark, #f75d3b);
	margin-right: 0.5rem;
}

.fyntix-section-heading__body {
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-section-heading__accent {
	font-family: 'Instrument Serif', serif;
	font-style: italic;
	font-weight: 400;
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-our-work__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.fyntix-case-card {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 1rem;
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fyntix-case-card:hover {
	transform: translateY(-8px);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.fyntix-case-card__image {
	width: 100%;
	aspect-ratio: 16/9;
	overflow: hidden;
}

.fyntix-case-card__image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.fyntix-case-card__content {
	padding: 2rem;
}

.fyntix-case-card__metric {
	margin-bottom: 1.5rem;
}

.fyntix-case-card__metric-value {
	font-size: 2rem;
	font-weight: 600;
	color: var(--wp--preset--color--spark, #f75d3b);
	line-height: 1;
	margin-bottom: 0.5rem;
}

.fyntix-case-card__metric-label {
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.7);
}

.fyntix-case-card__title {
	margin: 0 0 1rem;
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1.3;
	color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-case-card__description {
	margin: 0 0 1.5rem;
	font-size: 1rem;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.8);
}

.fyntix-case-card__link {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	color: var(--wp--preset--color--spark, #f75d3b);
	text-decoration: none;
	font-weight: 500;
	transition: gap 0.2s ease;
}

.fyntix-case-card__link:hover {
	gap: 0.75rem;
}

@media (max-width: 767px) {
	.fyntix-our-work {
		padding: 4rem 0;
	}
	
	.fyntix-section-header {
		margin-bottom: 3rem;
	}
	
	.fyntix-our-work__grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	
	.fyntix-case-card__content {
		padding: 1.5rem;
	}
}
</style>
