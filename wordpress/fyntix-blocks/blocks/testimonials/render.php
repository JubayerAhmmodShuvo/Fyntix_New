<?php
/**
 * Testimonials Block Template
 */

$title = $attributes['title'] ?? 'Stories from client partnerships';
$testimonials = $attributes['testimonials'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'fyntix-testimonials',
	'id' => 'section-testimonials',
]);
?>

<section <?php echo $wrapper_attributes; ?>>
	<div class="fyntix-testimonials__container container">
		<h2 class="fyntix-testimonials__title">
			<?php echo esc_html($title); ?>
		</h2>
		
		<div class="fyntix-testimonials__grid">
			<?php foreach ($testimonials as $testimonial): ?>
			<figure class="fyntix-testimonial">
				<blockquote class="fyntix-testimonial__quote">
					<?php echo esc_html($testimonial['quote']); ?>
				</blockquote>
				<figcaption class="fyntix-testimonial__author">
					<div class="fyntix-testimonial__name">
						<?php echo esc_html($testimonial['author']); ?>
					</div>
					<div class="fyntix-testimonial__role">
						<?php echo esc_html($testimonial['role']); ?><?php if (!empty($testimonial['company'])): ?>, <?php echo esc_html($testimonial['company']); ?><?php endif; ?>
					</div>
				</figcaption>
			</figure>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<style>
.fyntix-testimonials {
	padding: 6rem 0;
	background-color: var(--wp--preset--color--chalk, #fff);
}

.fyntix-testimonials__container {
	max-width: 75rem;
	margin: 0 auto;
	padding-left: clamp(1.5rem, 5vw, 3rem);
	padding-right: clamp(1.5rem, 5vw, 3rem);
}

.fyntix-testimonials__title {
	margin: 0 0 4rem;
	font-size: clamp(2rem, 4vw, 3rem);
	font-weight: 400;
	line-height: 1.2;
	text-align: center;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-testimonials__grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 3rem;
}

.fyntix-testimonial {
	margin: 0;
	padding: 3rem;
	border-radius: 1rem;
	background: linear-gradient(135deg, #f8f8f8 0%, #fff 100%);
	border: 1px solid var(--wp--preset--color--haze-300, #e0e0e0);
	border-left: 4px solid var(--wp--preset--color--spark, #f75d3b);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fyntix-testimonial:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.fyntix-testimonial__quote {
	margin: 0 0 2rem;
	font-size: clamp(1.25rem, 2.5vw, 1.5rem);
	font-weight: 400;
	line-height: 1.5;
	color: var(--wp--preset--color--slatecolor, #262626);
	quotes: """ """ "'" "'";
}

.fyntix-testimonial__quote::before {
	content: open-quote;
	color: var(--wp--preset--color--spark, #f75d3b);
	font-size: 1.5em;
	line-height: 0;
	margin-right: 0.1em;
	vertical-align: -0.4em;
}

.fyntix-testimonial__quote::after {
	content: close-quote;
	color: var(--wp--preset--color--spark, #f75d3b);
	font-size: 1.5em;
	line-height: 0;
	margin-left: 0.1em;
	vertical-align: -0.4em;
}

.fyntix-testimonial__author {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.fyntix-testimonial__name {
	font-size: 1rem;
	font-weight: 500;
	color: var(--wp--preset--color--slatecolor, #262626);
}

.fyntix-testimonial__role {
	font-size: 0.875rem;
	color: var(--wp--preset--color--haze-800, #6f6f6f);
}

@media (max-width: 767px) {
	.fyntix-testimonials {
		padding: 3rem 0;
	}
	
	.fyntix-testimonials__title {
		margin-bottom: 2.5rem;
	}
	
	.fyntix-testimonials__grid {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	
	.fyntix-testimonial {
		padding: 2rem;
	}
}
</style>
