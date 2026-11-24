<?php
$heading = $attributes['heading'] ?? 'Trusted by ambitious global teams to build what's next.';

// Real client logos from the site
$logos = [
	['name' => 'Fanshawe', 'file' => 'fanshawe-logo.svg'],
	['name' => 'Possible', 'file' => 'possible-logo.svg'],
	['name' => 'Family Plumber', 'file' => 'family-plumber-logo.svg'],
	['name' => 'Morcos Law', 'file' => 'morcos-law-logo.svg'],
	['name' => 'Total Restoration', 'file' => 'total-restoration-logo.svg'],
	['name' => 'SmartRent', 'file' => 'smartrent-logo.svg'],
	['name' => 'SurveyWorks', 'file' => 'surveyworks-logo.svg'],
	['name' => 'Heron AI', 'file' => 'heron-ai-logo.svg'],
];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-logo-strip bg-chalk py-16'
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="container px-gutter max-md:px-gutter-mobile">
		<h2 class="text-center text-lg md:text-xl text-haze-800 font-medium mb-12">
			<?php echo esc_html($heading); ?>
		</h2>
		<div class="fyntix-logo-strip__grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
			<?php foreach ($logos as $logo): ?>
			<div class="fyntix-logo-strip__logo opacity-60 hover:opacity-100 transition-opacity">
				<img src="<?php echo esc_url(plugins_url('assets/client-logos/' . $logo['file'], dirname(__DIR__))); ?>" alt="<?php echo esc_attr($logo['name']); ?>" loading="lazy" class="max-w-full h-8" />
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
