# Fyntix WordPress Installation Guide

This package contains the complete WordPress rebuild of the Fyntix website, including a custom block theme and companion plugin with Gutenberg blocks.

## Contents

- **fyntix-theme** - Custom block theme with theme.json, templates, and self-hosted fonts
- **fyntix-blocks** - Companion plugin with 9 custom Gutenberg blocks
- **release/** - Installable ZIP files ready for WordPress installation

## Requirements

- WordPress 6.9 or higher
- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Modern browser with JavaScript enabled

## Installation

### Step 1: Install WordPress

If you don't have WordPress installed yet:

1. Download WordPress from https://wordpress.org/download/
2. Upload to your web server or set up locally
3. Complete the 5-minute installation
4. Log in to your WordPress admin dashboard

### Step 2: Install the Theme

1. Go to **Appearance → Themes** in your WordPress admin
2. Click **Add New Theme** → **Upload Theme**
3. Upload `fyntix-theme.zip` from the `release/` folder
4. Click **Install Now**
5. Click **Activate** once installed

### Step 3: Install the Blocks Plugin

1. Go to **Plugins → Add New Plugin**
2. Click **Upload Plugin**
3. Upload `fyntix-blocks.zip` from the `release/` folder
4. Click **Install Now**
5. Click **Activate** once installed

### Step 4: Create Your Homepage

1. Go to **Pages → Add New Page**
2. Title it "Home"
3. Add the following blocks in order (all from the "Fyntix Blocks" category):
   - **Fyntix Hero** - Edit title and CTA
   - **Logo Strip** - Add client/partner logos
   - **Growth Stats** - Add your key metrics
   - **Platform Results** - Add your case study results
   - **Services Pillar** (2x) - One for each service area
   - **Timeline** - Your 90-day process
   - **Report Mockup** - Weekly reporting preview
   - **Testimonials** - Client quotes
   - **Call to Action** - Final CTA
4. Click **Publish**

5. Go to **Settings → Reading**
6. Set "Your homepage displays" to "A static page"
7. Select "Home" as your homepage
8. Click **Save Changes**

### Step 5: Create Navigation Menus

1. Go to **Appearance → Menus** (or **Appearance → Editor → Navigation**)
2. Create a "Primary Menu" with:
   - Home
   - Work
   - Services
   - About
   - Contact
3. Create a "Footer Menu" with:
   - Privacy Policy
   - Terms & Conditions

### Step 6: Set Up Blog

1. Go to **Posts → Add New** to create blog posts
2. Add categories and tags as needed
3. The `/blog` archive page will display automatically at `/blog/` URL
4. Single post template includes:
   - Featured image
   - Author and date
   - Full content
   - Related posts

### Step 7: Recommended Plugins

For full SEO functionality, install:

1. **Yoast SEO** or **Rank Math** - For complete SEO features
2. **Contact Form 7** or **WPForms** - For contact forms
3. **WP Rocket** or **LiteSpeed Cache** - For performance optimization (optional)

## Available Blocks

The Fyntix Blocks plugin includes 9 custom blocks:

### 1. Fyntix Hero
- Large hero section with title, subtitle, and CTA button
- Customizable text and CTA URL
- Responsive design with mobile optimization

### 2. Logo Strip
- Display client/partner logos in a grid
- Automatic image lazy loading
- Hover effects on logos

### 3. Growth Stats
- Display key metrics with animated counters
- Automatically animates on scroll into view
- Supports multiple stats in a grid layout

### 4. Platform Results
- Showcase platform-specific results
- Great for case studies
- Grid layout with hover effects

### 5. Services Pillar
- Display services with descriptions
- Two background color options (charcoal/soft grey)
- Perfect for service overviews

### 6. Timeline
- 90-day process visualization
- Numbered milestones with descriptions
- Responsive grid layout

### 7. Report Mockup
- Display weekly report preview
- Dashboard-style cards with metrics
- Engaging visual for reporting capabilities

### 8. Testimonials
- Client testimonial quotes
- Author attribution with role and company
- Quote styling with hover effects

### 9. Call to Action
- Final conversion section
- Large title with description
- Prominent CTA button

## SEO Requirements Met

✅ All text content is server-rendered real HTML (no JavaScript content injection)  
✅ Fast loading with lazy-loaded images  
✅ Self-hosted fonts for better performance  
✅ Clean, semantic HTML structure  
✅ Optimized for Core Web Vitals  
✅ Compatible with Yoast SEO and Rank Math  
✅ Proper heading hierarchy  
✅ Accessible markup with ARIA labels where needed

## Customization

### Colors

Edit colors in **Appearance → Editor → Styles** or modify `theme.json`:
- **Spark** - #f75d3b (Brand Orange)
- **Charcoal** - #141414 (Dark Background)
- **Chalk** - #ffffff (White)
- **Haze** variations - Gray scale colors

### Fonts

Self-hosted fonts are included in the theme:
- **Inter Display** - Primary font family
- **Instrument Serif** - Accent font for specific headings

### Spacing & Layout

The theme uses responsive spacing:
- Mobile: 1.5rem gutters
- Desktop: 3rem gutters (scales with viewport)
- Max content width: 75rem (1200px)

## Performance Optimization

The theme and blocks are built for speed:

1. **Minimal JavaScript** - Only for animations and interactions
2. **Inline CSS** - Block styles are inline for better performance
3. **Lazy Loading** - All images load lazily by default
4. **No jQuery** - Pure JavaScript for better performance
5. **Font Display Swap** - Fonts use `font-display: swap`
6. **Clean Code** - No unnecessary features or bloat

## Troubleshooting

### Blocks Don't Appear

1. Make sure the **Fyntix Blocks** plugin is activated
2. Clear any caching plugins
3. Refresh the block editor page

### Fonts Not Loading

1. Check that font files exist in `/wp-content/themes/fyntix/assets/fonts/`
2. Clear browser cache
3. Check server MIME types support .woff2 files

### Animation Not Working

1. Ensure JavaScript is enabled in browser
2. Check browser console for errors
3. Clear any JavaScript minification/caching

### Styling Issues

1. Clear all caches (browser, plugin caches, CDN)
2. Regenerate CSS in **Appearance → Editor**
3. Check for theme/plugin conflicts by temporarily switching themes

## Development

### Theme Structure
```
fyntix-theme/
├── theme.json          # Design system tokens
├── style.css           # Main stylesheet
├── functions.php       # Theme functions
├── index.php           # Main template
├── parts/              # Template parts (header, footer)
├── templates/          # Page templates
├── patterns/           # Block patterns (optional)
└── assets/
    ├── fonts/          # Self-hosted fonts
    ├── js/             # Theme JavaScript
    ├── css/            # Additional CSS
    └── images/         # Theme images
```

### Blocks Plugin Structure
```
fyntix-blocks/
├── fyntix-blocks.php   # Main plugin file
├── blocks/             # Individual block folders
│   ├── hero/
│   │   ├── block.json
│   │   ├── render.php
│   │   └── index.js (optional)
│   └── ...
└── build/              # Compiled assets
    ├── style.css
    ├── blocks.js
    ├── editor.css
    └── editor.js
```

## Support

For issues, questions, or customization requests:
- Review this README
- Check WordPress requirements
- Test with default WordPress theme to isolate issues
- Contact Fyntix development team

## Credits

- **Theme**: Fyntix Team
- **Blocks**: Custom Gutenberg blocks built for Fyntix
- **Fonts**: Inter Display, Instrument Serif
- **Framework**: WordPress 6.9+ with Full Site Editing

---

© 2026 Fyntix™ - All Rights Reserved
