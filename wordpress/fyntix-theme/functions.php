<?php
/**
 * Fyntix Theme Functions
 *
 * @package Fyntix
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup
 */
function fyntix_setup() {
	// Add support for editor styles
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );

	// Add support for responsive embeds
	add_theme_support( 'responsive-embeds' );

	// Add support for wide and full alignments
	add_theme_support( 'align-wide' );

	// Add support for custom line height
	add_theme_support( 'custom-line-height' );

	// Add support for custom spacing
	add_theme_support( 'custom-spacing' );

	// Add support for custom units
	add_theme_support( 'custom-units' );

	// Add support for link color
	add_theme_support( 'link-color' );

	// Add support for block styles
	add_theme_support( 'wp-block-styles' );

	// Add support for post thumbnails
	add_theme_support( 'post-thumbnails' );

	// Add support for title tag
	add_theme_support( 'title-tag' );

	// Add support for HTML5 markup
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Register navigation menus
	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'fyntix' ),
			'footer'  => __( 'Footer Menu', 'fyntix' ),
		)
	);
}
add_action( 'after_setup_theme', 'fyntix_setup' );

/**
 * Enqueue scripts and styles
 */
function fyntix_enqueue_assets() {
	// Enqueue theme stylesheet
	wp_enqueue_style( 'fyntix-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );

	// Enqueue theme scripts
	if ( ! is_admin() ) {
		wp_enqueue_script(
			'fyntix-scripts',
			get_template_directory_uri() . '/assets/js/theme.js',
			array(),
			wp_get_theme()->get( 'Version' ),
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'fyntix_enqueue_assets' );

/**
 * Add editor styles
 */
function fyntix_editor_styles() {
	add_editor_style(
		array(
			'style.css',
			'assets/css/editor.css',
		)
	);
}
add_action( 'admin_init', 'fyntix_editor_styles' );

/**
 * Register block patterns category
 */
function fyntix_register_block_patterns_category() {
	register_block_pattern_category(
		'fyntix',
		array(
			'label' => __( 'Fyntix Patterns', 'fyntix' ),
		)
	);
}
add_action( 'init', 'fyntix_register_block_patterns_category' );

/**
 * Add custom image sizes for lazy loading
 */
function fyntix_custom_image_sizes() {
	add_image_size( 'fyntix-thumbnail', 400, 300, true );
	add_image_size( 'fyntix-medium', 800, 600, true );
	add_image_size( 'fyntix-large', 1200, 900, false );
}
add_action( 'after_setup_theme', 'fyntix_custom_image_sizes' );

/**
 * Add loading="lazy" to images
 */
function fyntix_add_lazy_loading( $attr, $attachment, $size ) {
	$attr['loading'] = 'lazy';
	$attr['decoding'] = 'async';
	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'fyntix_add_lazy_loading', 10, 3 );

/**
 * Remove unnecessary WordPress features for better performance
 */
function fyntix_optimize_performance() {
	// Remove emoji scripts
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );

	// Remove block library CSS (we'll use custom styles)
	// Uncomment if not using core block styles:
	// wp_dequeue_style( 'wp-block-library' );
	// wp_dequeue_style( 'wp-block-library-theme' );
}
add_action( 'wp_enqueue_scripts', 'fyntix_optimize_performance', 100 );

/**
 * Add SEO meta tags (basic implementation - use Yoast/Rank Math for full SEO)
 */
function fyntix_add_meta_tags() {
	if ( is_singular() ) {
		$post_id = get_the_ID();
		$description = get_post_meta( $post_id, '_fyntix_meta_description', true );
		if ( $description ) {
			echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";
		}
	}
}
add_action( 'wp_head', 'fyntix_add_meta_tags', 1 );

/**
 * Add custom body classes
 */
function fyntix_body_classes( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'fyntix-home';
	}
	
	$classes[] = 'fyntix-theme';
	
	return $classes;
}
add_filter( 'body_class', 'fyntix_body_classes' );

/**
 * Customize excerpt length
 */
function fyntix_excerpt_length( $length ) {
	return 30;
}
add_filter( 'excerpt_length', 'fyntix_excerpt_length' );

/**
 * Customize excerpt more text
 */
function fyntix_excerpt_more( $more ) {
	return '...';
}
add_filter( 'excerpt_more', 'fyntix_excerpt_more' );
