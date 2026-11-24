# Fyntix WordPress Blocks - Complete List

## Overview
This document lists all custom Gutenberg blocks created for the Fyntix WordPress site, along with their features and attributes.

## Blocks Created

### 1. Hero Block (`fyntix/hero`)
**Purpose**: Main hero section for homepage and landing pages  
**Features**:
- Large responsive title with custom typography
- Subtitle/description text
- CTA button with customizable URL
- Responsive design (mobile/desktop)
- Background color options

**Editable Attributes**:
- Title text
- Subtitle text
- CTA button text
- CTA button URL
- Background color

**SEO**: All text server-rendered in HTML

---

### 2. Logo Strip Block (`fyntix/logo-strip`)
**Purpose**: Display client or partner logos in a horizontal grid  
**Features**:
- Section title
- Responsive logo grid (auto-fit layout)
- Lazy-loaded images
- Hover opacity effects
- Placeholder support

**Editable Attributes**:
- Section title
- Logo images (array of images with URLs and alt text)

**SEO**: All content server-rendered, images with proper alt attributes

---

### 3. Growth Stats Block (`fyntix/growth-stats`)
**Purpose**: Display key metrics with animated counters  
**Features**:
- Section title and subtitle
- Animated number counters (animates on scroll)
- Multiple stats in responsive grid
- Support for different number formats (decimal, multipliers: K, M, B, ×)
- Hover animations on cards

**Editable Attributes**:
- Title
- Subtitle
- Stats array (each with value, label, and optional suffix)

**SEO**: All numbers rendered in HTML (animation is progressive enhancement)  
**JavaScript**: Intersection Observer for scroll-triggered animation

---

### 4. Platform Results Block (`fyntix/platform-results`)
**Purpose**: Showcase platform-specific case study results  
**Features**:
- Section title and subtitle
- Responsive grid layout
- Platform badges
- Large metric display
- Description text

**Editable Attributes**:
- Title
- Subtitle
- Results array (platform, metric, description)

**SEO**: All content server-rendered

---

### 5. Services Pillar Block (`fyntix/services-pillar`)
**Purpose**: Display service offerings in organized sections  
**Features**:
- Large section title and subtitle
- Description text
- Service cards in responsive grid
- Two background color themes (charcoal/soft grey)
- Hover effects on cards

**Editable Attributes**:
- Title
- Subtitle
- Description
- Services array (title and description for each)
- Background color

**SEO**: All content server-rendered, semantic HTML structure

---

### 6. Timeline Block (`fyntix/timeline`)
**Purpose**: Display 90-day process or milestone timeline  
**Features**:
- Section title
- Numbered milestones
- Day range labels
- Responsive grid layout
- Hover animations

**Editable Attributes**:
- Title
- Milestones array (days, title, description)

**SEO**: All content server-rendered in proper order

---

### 7. Report Mockup Block (`fyntix/report-mockup`)
**Purpose**: Display weekly/monthly report preview  
**Features**:
- Section title and description
- Dashboard-style metric cards
- Growth indicators (badges)
- Realistic report visualization

**Editable Attributes**:
- Title
- Description

**SEO**: All content server-rendered

---

### 8. Testimonials Block (`fyntix/testimonials`)
**Purpose**: Display client testimonials and reviews  
**Features**:
- Section title
- Quote styling with decorative quotes
- Author attribution (name, role, company)
- Responsive grid layout
- Hover animations
- Accent border styling

**Editable Attributes**:
- Title
- Testimonials array (quote, author, role, company)

**SEO**: All quotes server-rendered, semantic figure/blockquote markup

---

### 9. Call to Action Block (`fyntix/cta`)
**Purpose**: Final conversion section with prominent CTA  
**Features**:
- Large title
- Description text
- Prominent button
- Two background themes
- Center-aligned content

**Editable Attributes**:
- Title
- Description
- Button text
- Button URL
- Background color

**SEO**: All content server-rendered

---

## Technical Implementation

### Rendering Method
**Server-Side Rendering (SSR)** using `render.php` files for all blocks.

**Benefits**:
- All content in HTML source (perfect for SEO)
- Fast initial page load
- No JavaScript required for content display
- JavaScript only used for progressive enhancements (animations)

### CSS Approach
**Inline scoped CSS** in each block's render.php file.

**Benefits**:
- No unused CSS loaded
- Automatic code splitting per block
- No build process required
- Easy to maintain

### JavaScript Usage
**Minimal, Progressive Enhancement Only**:
- Growth Stats: Scroll-triggered number animation
- Future blocks: Tab functionality, accordions, etc.

**No JavaScript Used For**:
- Content rendering
- Initial display
- Layout
- SEO-critical text

### Performance Optimizations
1. **Lazy loading** on all images
2. **Minimal JavaScript** (< 2KB for animations)
3. **Inline CSS** (no extra HTTP requests)
4. **No dependencies** (no jQuery or other libraries)
5. **Server-side rendering** (instant content visibility)

### Accessibility Features
- Semantic HTML (section, article, figure, blockquote)
- Proper heading hierarchy
- ARIA labels where appropriate
- Focus-visible styles
- Keyboard navigation support

### Browser Compatibility
- Modern browsers (last 2 versions)
- Progressive enhancement for animations
- Graceful fallbacks
- No IE11 support (following WordPress 6.3+ standards)

---

## Block Category
All blocks appear under **"Fyntix Blocks"** category in the block inserter.

## WordPress Compatibility
- **Minimum WordPress**: 6.9
- **PHP Version**: 8.0+
- **Block API**: Version 3
- **FSE**: Full Site Editing compatible

## SEO Compliance
✅ All text content server-rendered  
✅ No JavaScript-dependent content  
✅ Semantic HTML structure  
✅ Proper heading hierarchy  
✅ Image alt attributes  
✅ Lazy loading with decoding="async"  
✅ Clean, crawlable markup  
✅ Fast page load times  
✅ Core Web Vitals optimized

---

© 2026 Fyntix™
