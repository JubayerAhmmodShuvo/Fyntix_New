<?php
/**
 * Timeline Block Template
 */

$title = $attributes['title'] ?? 'From first call to real leads in 90 days';
$milestones = $attributes['milestones'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-timeline',
	'id' => 'section-process',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-timeline__container container">
		<h2 class="fyntix-timeline__title">
			<?php echo esc_html($title); ?>
		</h2>
		
		<div class="fyntix-timeline__track">
			<?php foreach ($milestones as $index => $milestone): ?>
			<div class="fyntix-timeline__milestone" data-index="<?php echo $index + 1; ?>">
				<div class="fyntix-timeline__milestone-number">
					<?php printf('%02d', $index + 1); ?>
				</div>
				<div class="fyntix-timeline__milestone-content">
					<div class="fyntix-timeline__milestone-days">
						<?php echo esc_html($milestone['days']); ?>
					</div>
					<h3 class="fyntix-timeline__milestone-title">
						<?php echo esc_html($milestone['title']); ?>
					</h3>
					<p class="fyntix-timeline__milestone-description">
						<?php echo esc_html($milestone['description']); ?>
					</p>
				</div>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<style>
.fyntix-timeline {
	padding: 6rem 0;
	background-color: var(--wp--preset--color--soft-grey, #f8f8f8);
}

.fyntix-timeline__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-timeline__title {
	margin: 0 0 4rem;
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 400;
	line-height: 1.2;
	text-align: center;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-timeline__track {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 3rem;
	position: relative;
}

.fyntix-timeline__milestone {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 2rem;
	background: var(--wp--preset--color--chalk, #fff);
	border-radius: 1rem;
	border: 1px solid var(--wp--preset--color--haze-300, #e0e0e0);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	position: relative;
}

.fyntix-timeline__milestone:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.fyntix-timeline__milestone-number {
	position: absolute;
	top: -1rem;
	left: 2rem;
	width: 3rem;
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--wp--preset--color--spark, #f75d3b);
	color: var(--wp--preset--color--chalk, #fff);
	border-radius: 50%;
	font-size: 1.25rem;
	font-weight: 600;
	line-height: 1;
}

.fyntix-timeline__milestone-content {
	padding-top: 1.5rem;
}

.fyntix-timeline__milestone-days {
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--wp--preset--color--spark, #f75d3b);
}

.fyntix-timeline__milestone-title {
	margin: 0 0 0.75rem;
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1.3;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-timeline__milestone-description {
	margin: 0;
	font-size: 1rem;
	line-height: 1.6;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

@media (max-width: 767px) {
	.fyntix-timeline {
		padding: 3rem 0;
	}
	
	.fyntix-timeline__title {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-timeline__track {
		grid-template-columns: 1fr;
		gap: 2rem;
	}
}
</style>
