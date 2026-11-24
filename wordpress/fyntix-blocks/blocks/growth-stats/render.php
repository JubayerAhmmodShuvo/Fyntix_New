<?php
/**
 * Growth Stats Block Template
 *
 * @param array $attributes Block attributes
 */

$title = $attributes['title'] ?? 'Growth you can measure';
$subtitle = $attributes['subtitle'] ?? 'Every number comes from a real client account and lands in your report each month.';
$stats = $attributes['stats'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-growth-stats',
	'id' => 'section-growth',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-growth-stats__container container">
		<div class="fyntix-growth-stats__header">
			<h2 class="fyntix-growth-stats__title">
				<?php echo esc_html($title); ?>
			</h2>
			<?php if ($subtitle): ?>
			<p class="fyntix-growth-stats__subtitle">
				<?php echo esc_html($subtitle); ?>
			</p>
			<?php endif; ?>
		</div>
		
		<div class="fyntix-growth-stats__grid">
			<?php foreach ($stats as $index => $stat): ?>
			<div class="fyntix-growth-stat" data-stat-index="<?php echo $index; ?>">
				<div class="fyntix-growth-stat__value" data-value="<?php echo esc_attr($stat['value']); ?>">
					<?php echo esc_html($stat['value']); ?>
				</div>
				<div class="fyntix-growth-stat__label">
					<?php echo esc_html($stat['label']); ?>
				</div>
				<?php if (!empty($stat['suffix'])): ?>
				<div class="fyntix-growth-stat__suffix">
					<?php echo esc_html($stat['suffix']); ?>
				</div>
				<?php endif; ?>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<style>
.fyntix-growth-stats {
	padding: 6rem 0;
	background-color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-growth-stats__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-growth-stats__header {
	text-align: center;
	margin-bottom: 4rem;
	max-width: 50rem;
	margin-left: auto;
	margin-right: auto;
}

.fyntix-growth-stats__title {
	margin: 0 0 1rem;
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 400;
	line-height: 1.2;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-growth-stats__subtitle {
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.6;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-growth-stats__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 3rem;
}

.fyntix-growth-stat {
	text-align: center;
	padding: 2rem;
	border-radius: 1rem;
	background: linear-gradient(135deg, #f8f8f8 0%, #fff 100%);
	border: 1px solid var(--wp--preset--color--haze-300, #e0e0e0);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fyntix-growth-stat:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.fyntix-growth-stat__value {
	font-size: clamp(3rem, 6vw, 5rem);
	font-weight: 600;
	line-height: 1;
	color: var(--wp--preset--color--spark, #f75d3b);
	margin-bottom: 0.75rem;
	letter-spacing: -0.02em;
}

.fyntix-growth-stat__label {
	font-size: 1.5rem;
	font-weight: 400;
	color: var(--wp--preset--color--slatecolor, #262626);
	margin-bottom: 0.5rem;
}

.fyntix-growth-stat__suffix {
	font-size: 0.875rem;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
	line-height: 1.4;
}

@media (max-width: 767px) {
	.fyntix-growth-stats {
		padding: 3rem 0;
	}
	
	.fyntix-growth-stats__header {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-growth-stats__grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	
	.fyntix-growth-stat {
		padding: 1.5rem;
	}
}
</style>
