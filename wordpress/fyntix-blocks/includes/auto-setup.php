<?php
/**
 * Auto-setup functionality
 * Creates homepage with all blocks and content on plugin activation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Run auto-setup on plugin activation
 */
function fyntix_blocks_auto_setup() {
	// Check if already set up
	if ( get_option( 'fyntix_blocks_setup_complete' ) ) {
		return;
	}
	
	// Create Blog page
	$blog_page = wp_insert_post( array(
		'post_title'   => 'Blog',
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_content' => '<!-- wp:query {"queryId":1,"query":{"perPage":12,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
		<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /-->
		<!-- wp:post-terms {"term":"category"} /-->
		<!-- wp:post-title {"isLink":true} /-->
		<!-- wp:post-excerpt /-->
		<!-- wp:post-date /-->
	<!-- /wp:post-template -->
	<!-- wp:query-pagination /-->
</div>
<!-- /wp:query -->',
	) );
	
	// Create Home page with all blocks
	$home_content = fyntix_get_homepage_content();
	
	$home_page = wp_insert_post( array(
		'post_title'   => 'Home',
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_content' => $home_content,
	) );
	
	// Set as front page
	if ( $home_page && ! is_wp_error( $home_page ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_page );
		if ( $blog_page && ! is_wp_error( $blog_page ) ) {
			update_option( 'page_for_posts', $blog_page );
		}
	}
	
	// Create sample blog post
	wp_insert_post( array(
		'post_title'   => 'Welcome to Fyntix',
		'post_type'    => 'post',
		'post_status'  => 'publish',
		'post_content' => '<!-- wp:paragraph --><p>This is a sample blog post. Fyntix is a business growth agency connecting Search & AI Visibility with Paid Media & Content.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>How we help businesses grow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>We bring SEO, GEO, AEO and AIO into one strategy: understanding your audience, finding the questions that matter, and making your expertise clear across the pages and platforms they use.</p><!-- /wp:paragraph -->',
		'post_category' => array( 1 ),
	) );
	
	// Mark setup as complete
	update_option( 'fyntix_blocks_setup_complete', true );
}

/**
 * Get homepage content with all blocks
 */
function fyntix_get_homepage_content() {
	return '<!-- wp:fyntix/hero {"title":"Business growth that gets you seen","subtitle":"Fyntix is a business growth agency. We make sure your customers find you everywhere, from Google Search to ChatGPT.","ctaText":"Get started","ctaUrl":"/contact"} /-->

<!-- wp:fyntix/logo-strip {"title":"Trusted by ambitious global teams"} /-->

<!-- wp:fyntix/growth-stats {"title":"Growth you can measure, not just likes","subtitle":"Every number comes from a real client account and lands in your report each month.","stats":[{"value":"2.4B","label":"organic views","suffix":"across client accounts in 2025"},{"value":"38M","label":"conversions","suffix":"for brands since 2021"},{"value":"4.1×","label":"average ROI","suffix":"reported monthly, never rounded up"}]} /-->

<!-- wp:fyntix/platform-results {"title":"Results you can see, post by post","subtitle":"Pick a platform. Every case is a real client account, with the numbers to prove it.","results":[{"platform":"Instagram · Reels","metric":"248K","description":"orders from one Reel"},{"platform":"TikTok","metric":"1.1M","description":"views in first week"},{"platform":"YouTube","metric":"18K","description":"conversions tracked"}]} /-->

<!-- wp:fyntix/our-work {"title":"Our work","subtitle":"From pilots to products people use every day.","caseStudies":[{"title":"Search ads. Real jobs.","description":"A focused Google Search programme, with a detailed view of enquiries, bookings and business growth.","metric":"$33.7k","metricLabel":"Google Ads spend","link":"/work"},{"title":"Local search. More booked consultations.","description":"Technical SEO, local content and a clearer path from search to enquiry.","metric":"124%","metricLabel":"more booked consultations","link":"/work"},{"title":"Launch visibility. Lasting growth.","description":"Search, conversion and lifecycle marketing for a growing B2B SaaS.","link":"/work"}]} /-->

<!-- wp:fyntix/services-pillar {"title":"Search & AI Visibility","subtitle":"Get found in search and AI answers","description":"We bring SEO, GEO, AEO and AIO into one strategy.","backgroundColor":"charcoal","services":[{"title":"SEO Strategy & Optimisation","description":"Build an organic search foundation around relevant intent."},{"title":"GEO, AEO & AIO","description":"Make your expertise easier for answer engines to understand."},{"title":"AI Search Visibility","description":"Understand how your brand appears in AI-assisted discovery."}]} /-->

<!-- wp:fyntix/services-pillar {"title":"Paid Media & Content","subtitle":"Turn attention into enquiries and sales","description":"Bring Google Ads, Meta Ads and TikTok Ads together with articles, blogs and social content.","backgroundColor":"soft-grey","services":[{"title":"Google Ads","description":"Reach people looking for what you offer."},{"title":"Meta & TikTok Ads","description":"Build paid social campaigns with platform-appropriate creative."},{"title":"Content Strategy & Creation","description":"Turn expertise into content with a clear purpose."}]} /-->

<!-- wp:fyntix/timeline {"title":"From first call to real leads in 90 days","milestones":[{"days":"Days 1–7","title":"Growth audit","description":"We audit your SEO, AI visibility, ads and competitors to set clear growth priorities."},{"days":"Days 8–30","title":"Growth baseline","description":"Set up tracking, establish baselines and create your first content brief."},{"days":"Days 31–60","title":"Launch & optimize","description":"Launch campaigns, publish content and start optimizing based on data."},{"days":"Days 61–90","title":"Scale & refine","description":"Scale what works, refine what doesn\'t, and prepare for sustainable growth."}]} /-->

<!-- wp:fyntix/report-mockup {"title":"Weekly report you\'ll actually read","description":"One page, every Monday: what grew, what flopped and what we\'re filming next."} /-->

<!-- wp:fyntix/testimonials {"title":"Stories from client partnerships","testimonials":[{"quote":"I would recommend Fyntix to anyone who\'s got ambitious plans to accelerate their roadmap, or is looking to build an AI-powered product from scratch.","author":"Julie Jeancolas","role":"Global Head of Product","company":"Tesco"}]} /-->

<!-- wp:fyntix/cta {"title":"Ready to grow?","description":"Let\'s talk about your business goals and how we can help you get found, chosen and remembered.","buttonText":"Get started","buttonUrl":"/contact","backgroundColor":"charcoal"} /-->';
}

/**
 * Run auto-setup on plugin activation
 */
register_activation_hook( FYNTIX_BLOCKS_PATH . 'fyntix-blocks.php', 'fyntix_blocks_auto_setup' );
