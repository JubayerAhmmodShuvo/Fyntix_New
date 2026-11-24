<?php
/**
 * Plugin Name: Fyntix Custom Blocks
 * Plugin URI: https://fyntix.com
 * Description: Custom Gutenberg blocks for Fyntix website sections
 * Version: 1.0.0
 * Author: Fyntix Team
 * Author URI: https://fyntix.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fyntix-blocks
 * Requires at least: 6.9
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FYNTIX_BLOCKS_VERSION', '1.0.0' );
define( 'FYNTIX_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'FYNTIX_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register all custom blocks
 */
function fyntix_blocks_register() {
	$blocks = array(
		'hero',
		'logo-strip',
		'growth-stats',
		'platform-results',
		'services-pillar',
		'timeline',
		'report-mockup',
		'testimonials',
		'cta',
	);

	foreach ( $blocks as $block ) {
		register_block_type( FYNTIX_BLOCKS_PATH . 'blocks/' . $block );
	}
}
add_action( 'init', 'fyntix_blocks_register' );

/**
 * Enqueue block assets for frontend
 */
function fyntix_blocks_enqueue_assets() {
	// Enqueue block styles
	wp_enqueue_style(
		'fyntix-blocks-style',
		FYNTIX_BLOCKS_URL . 'build/style.css',
		array(),
		FYNTIX_BLOCKS_VERSION
	);

	// Enqueue block scripts
	wp_enqueue_script(
		'fyntix-blocks-script',
		FYNTIX_BLOCKS_URL . 'build/blocks.js',
		array(),
		FYNTIX_BLOCKS_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'fyntix_blocks_enqueue_assets' );

/**
 * Enqueue block editor assets
 */
function fyntix_blocks_enqueue_editor_assets() {
	// Enqueue editor styles
	wp_enqueue_style(
		'fyntix-blocks-editor-style',
		FYNTIX_BLOCKS_URL . 'build/editor.css',
		array( 'wp-edit-blocks' ),
		FYNTIX_BLOCKS_VERSION
	);

	// Enqueue editor scripts
	wp_enqueue_script(
		'fyntix-blocks-editor-script',
		FYNTIX_BLOCKS_URL . 'build/editor.js',
		array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ),
		FYNTIX_BLOCKS_VERSION,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'fyntix_blocks_enqueue_editor_assets' );

/**
 * Register block category
 */
function fyntix_blocks_category( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'fyntix',
				'title' => __( 'Fyntix Blocks', 'fyntix-blocks' ),
				'icon'  => 'star-filled',
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'fyntix_blocks_category', 10, 2 );
