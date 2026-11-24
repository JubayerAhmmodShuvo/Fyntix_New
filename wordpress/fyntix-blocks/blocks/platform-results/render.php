<?php
/**
 * Platform Results Block Template
 */

$title = $attributes['title'] ?? 'Results you can see, post by post';
$subtitle = $attributes['subtitle'] ?? 'Pick a platform. Every case is a real client account.';
$results = $attributes['results'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-platform-results',
	'id' => 'section-post-results',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-platform-results__container container">
		<div class="fyntix-platform-results__header">
			<h2 class="fyntix-platform-results__title">
				<?php echo esc_html($title); ?>
			</h2>
			<p class="fyntix-platform-results__subtitle">
				<?php echo esc_html($subtitle); ?>
			</p>
		</div>
		
		<!-- Tab Navigation -->
		<div class="platform-tabs" role="tablist" aria-label="Platform results">
			<?php foreach ($results as $index => $result): ?>
			<button role="tab" 
					id="platform-tab-<?php echo $index; ?>"
					aria-controls="platform-panel-<?php echo $index; ?>"
					aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>"
					tabindex="<?php echo $index === 0 ? '0' : '-1'; ?>"
					class="platform-tab <?php echo $index === 0 ? 'platform-tab--active' : 'platform-tab--inactive'; ?>">
				<?php echo esc_html($result['platform']); ?>
			</button>
			<?php endforeach; ?>
		</div>
		
		<!-- Tab Panels (all server-rendered) -->
		<?php foreach ($results as $index => $result): ?>
		<div role="tabpanel"
			 id="platform-panel-<?php echo $index; ?>"
			 aria-labelledby="platform-tab-<?php echo $index; ?>"
			 <?php echo $index !== 0 ? 'hidden' : ''; ?>
			 class="platform-panel">
			<article class="fyntix-platform-result">
				<div class="fyntix-platform-result__platform">
					<?php echo esc_html($result['platform']); ?>
				</div>
				<div class="fyntix-platform-result__metric">
					<?php echo esc_html($result['metric']); ?>
				</div>
				<div class="fyntix-platform-result__description">
					<?php echo esc_html($result['description']); ?>
				</div>
			</article>
		</div>
		<?php endforeach; ?>
	</div>
</section>

<style>
.fyntix-platform-results {
	padding: 6rem 0;
	background-color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-platform-results__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-platform-results__header {
	text-align: center;
	margin-bottom: 4rem;
}

.fyntix-platform-results__title {
	margin: 0 0 1rem;
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 400;
	line-height: 1.2;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-platform-results__subtitle {
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.6;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

.platform-tabs {
	display: flex;
	gap: 1rem;
	justify-content: center;
	margin-bottom: 3rem;
	flex-wrap: wrap;
}

.platform-tab {
	padding: 0.75rem 1.5rem;
	background: transparent;
	border: 2px solid var(--wp--preset--color--haze-300, #e0e0e0);
	border-radius: 9999px;
	font-size: 1rem;
	font-weight: 500;
	color: var(--wp--preset--color--slatecolor, #262626);
	cursor: pointer;
	transition: all 0.2s ease;
}

.platform-tab:hover {
	border-color: var(--wp--preset--color--spark, #f75d3b);
	color: var(--wp--preset--color--spark, #f75d3b);
}

.platform-tab--active {
	background: var(--wp--preset--color--spark, #f75d3b);
	border-color: var(--wp--preset--color--spark, #f75d3b);
	color: var(--wp--preset--color--chalk, #fff);
}

.platform-tab--active:hover {
	color: var(--wp--preset--color--chalk, #fff);
}

.platform-panel {
	max-width: 40rem;
	margin: 0 auto;
}

.fyntix-platform-result {
	padding: 2.5rem;
	border-radius: 1rem;
	background: linear-gradient(135deg, #f8f8f8 0%, #fff 100%);
	border: 1px solid var(--wp--preset--color--haze-300, #e0e0e0);
	text-align: center;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fyntix-platform-result:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.fyntix-platform-result__platform {
	margin-bottom: 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--wp--preset--color--spark, #f75d3b);
}

.fyntix-platform-result__metric {
	margin-bottom: 0.75rem;
	font-size: clamp(2.5rem, 5vw, 4rem);
	font-weight: 600;
	line-height: 1;
	color: var(--wp--preset--color--slatecolor, #262626);
	letter-spacing: -0.02em;
}

.fyntix-platform-result__description {
	font-size: 1rem;
	line-height: 1.5;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

@media (max-width: 767px) {
	.fyntix-platform-results {
		padding: 3rem 0;
	}
	
	.fyntix-platform-results__header {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-platform-results__grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
}
</style>
