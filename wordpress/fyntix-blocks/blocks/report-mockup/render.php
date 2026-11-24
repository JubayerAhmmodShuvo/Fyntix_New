<?php
/**
 * Report Mockup Block Template
 */

$title = $attributes['title'] ?? 'Weekly report you\'ll actually read';
$description = $attributes['description'] ?? 'One page, every Monday: what grew, what flopped and what we\'re filming next.';

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-report-mockup',
	'id' => 'section-report',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-report-mockup__container container">
		<div class="fyntix-report-mockup__header">
			<h2 class="fyntix-report-mockup__title">
				<?php echo esc_html($title); ?>
			</h2>
			<p class="fyntix-report-mockup__description">
				<?php echo esc_html($description); ?>
			</p>
		</div>
		
		<div class="fyntix-report-mockup__preview">
			<div class="fyntix-report-mockup__card">
				<div class="fyntix-report-mockup__card-header">
					<h3>Follower Growth</h3>
					<div class="fyntix-report-mockup__badge">▲ 32%</div>
				</div>
				<div class="fyntix-report-mockup__metric">
					<span class="fyntix-report-mockup__number">4.8M</span>
					<span class="fyntix-report-mockup__label">Up from 3.6M in October</span>
				</div>
			</div>
			
			<div class="fyntix-report-mockup__card">
				<div class="fyntix-report-mockup__card-header">
					<h3>Avg. Watch Time</h3>
					<div class="fyntix-report-mockup__badge fyntix-report-mockup__badge--positive">▲ 2.1s</div>
				</div>
				<div class="fyntix-report-mockup__metric">
					<span class="fyntix-report-mockup__number">14.6s</span>
					<span class="fyntix-report-mockup__label">71% watch to the end</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
.fyntix-report-mockup {
	padding: 6rem 0;
	background-color: var(--wp--preset--color--soft-grey, #f8f8f8);
}

.fyntix-report-mockup__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-report-mockup__header {
	text-align: center;
	margin-bottom: 4rem;
	max-width: 50rem;
	margin-left: auto;
	margin-right: auto;
}

.fyntix-report-mockup__title {
	margin: 0 0 1rem;
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 400;
	line-height: 1.2;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-report-mockup__description {
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.6;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.fyntix-report-mockup__preview {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	max-width: 60rem;
	margin: 0 auto;
}

.fyntix-report-mockup__card {
	padding: 2rem;
	background: var(--wp--preset--color--chalk, #fff);
	border-radius: 1rem;
	border: 1px solid var(--wp--preset--color--haze-300, #e0e0e0);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.fyntix-report-mockup__card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.5rem;
}

.fyntix-report-mockup__card-header h3 {
	margin: 0;
	font-size: 1rem;
	font-weight: 500;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-report-mockup__badge {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	background: rgba(247, 93, 59, 0.1);
	color: var(--wp--preset--color--spark, #f75d3b);
	font-size: 0.875rem;
	font-weight: 600;
}

.fyntix-report-mockup__badge--positive {
	background: rgba(34, 197, 94, 0.1);
	color: #22c55e;
}

.fyntix-report-mockup__metric {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.fyntix-report-mockup__number {
	font-size: 2.5rem;
	font-weight: 600;
	line-height: 1;
	color: var(--wp--preset--color--slatecolor, #262626);
	letter-spacing: -0.02em;
}

.fyntix-report-mockup__label {
	font-size: 0.875rem;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

@media (max-width: 767px) {
	.fyntix-report-mockup {
		padding: 3rem 0;
	}
	
	.fyntix-report-mockup__header {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-report-mockup__preview {
		grid-template-columns: 1fr;
	}
}
</style>
