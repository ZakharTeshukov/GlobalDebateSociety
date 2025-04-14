# Image Optimization Pipeline Documentation

This document provides a comprehensive guide to the image optimization pipeline implemented for the Global Debate Society website.

## Overview

The image optimization pipeline includes:

1. Conversion of images to WebP format
2. Creation of responsive image variants
3. Implementation of lazy loading
4. HTML template updates to use the optimized images
5. WebP feature detection for CSS background images

## File Structure

```
├── scripts/
│   ├── convert-images.js      # Node.js script to convert images to WebP
│   └── update-html-templates.js  # Node.js script to update HTML files
├── src/
│   ├── assets/
│   │   ├── images/            # Original image files
│   │   ├── webp/              # WebP converted images (generated)
│   │   └── responsive/        # Responsive image variants (generated)
│   └── js/
│       ├── lazy-loading.js    # Lazy loading implementation
│       └── image-optimizer.js # Client-side image optimization utilities
├── templates/
│   └── responsive-image-example.html  # Example template
├── package.json               # Node.js dependencies and scripts
└── image-optimization-readme.md  # This documentation
```

## Setup and Installation

### Prerequisites

- Node.js 14 or higher
- NPM or Yarn

### Installation

1. Install the required dependencies:

```bash
npm install
```

This will install:
- **sharp**: For image processing and WebP conversion
- **serve**: For local development server (optional)

## Usage

### 1. Converting Images to WebP

Run the following command to convert images in the `src/assets/images` directory:

```bash
npm run optimize-images
```

This will:
- Convert all images to WebP format
- Create responsive variants in different sizes
- Store WebP images in `src/assets/webp/`
- Store responsive variants in `src/assets/responsive/`

Options:
- `--dir=PATH`: Specify a different source directory
- `--quality=N`: Set WebP quality (0-100, default: 80)
- `--force`: Overwrite existing files
- `--help`: Show help text

### 2. Updating HTML Templates

After converting images, update the HTML templates to use the optimized images:

```bash
npm run update-html
```

This will:
- Find all HTML files in the project
- Replace `<img>` tags with `<picture>` elements
- Add WebP sources with fallbacks
- Add responsive image variants using `srcset`
- Add `loading="lazy"` attribute

Options:
- `--dir=PATH`: Specify a different directory for HTML files
- `--dryrun`: Show changes without modifying files
- `--verbose`: Show detailed information
- `--help`: Show help text

### 3. Running the Full Build Process

To run the complete optimization pipeline:

```bash
npm run build
```

This will execute both the image conversion and HTML update steps.

## Implementation Details

### Responsive Image Sizes

The pipeline generates images in the following sizes:

| Name   | Width (px) | Use Case                           |
|--------|------------|-----------------------------------|
| small  | 480        | Mobile phones                     |
| medium | 768        | Tablets and small laptops         |
| large  | 1200       | Laptops and desktop monitors      |
| xlarge | 1920       | Large desktop monitors and 4K TVs |

### WebP Conversion

Images are converted to WebP format with the following settings:

- JPEG to WebP: 80% quality (configurable)
- PNG to WebP: 85% quality (configurable) 
- Preserves transparency in PNG files

### HTML Integration

The pipeline generates HTML code in the following format:

```html
<picture>
  <source srcset="path/to/image-small.webp 480w,
                 path/to/image-medium.webp 768w,
                 path/to/image-large.webp 1200w"
          type="image/webp">
  <source srcset="path/to/image-small.jpg 480w,
                 path/to/image-medium.jpg 768w,
                 path/to/image-large.jpg 1200w"
          type="image/jpeg">
  <img src="path/to/image.jpg" 
       alt="Image description" 
       class="original-class" 
       loading="lazy">
</picture>
```

### Lazy Loading Strategy

The website uses a combination of:

1. **Native lazy loading**: Using the `loading="lazy"` attribute
2. **JavaScript-based lazy loading**: Using Intersection Observer API
3. **Data attributes**: Using `data-src` and `data-srcset` for deferred loading

### CSS Background Images

For CSS background images, the pipeline uses feature detection to add a class to the HTML element:

```css
/* WebP-enabled browsers */
.webp .hero-bg {
  background-image: url('path/to/image.webp');
}

/* Fallback for browsers without WebP support */
.no-webp .hero-bg {
  background-image: url('path/to/image.jpg');
}
```

## Manual Implementation

### Adding a New Responsive Image

To manually add a responsive image:

```html
<picture>
  <source srcset="src/assets/webp/image-name-small.webp 480w,
                 src/assets/webp/image-name-medium.webp 768w,
                 src/assets/webp/image-name-large.webp 1200w"
          type="image/webp">
  <source srcset="src/assets/responsive/image-name-small.jpg 480w,
                 src/assets/responsive/image-name-medium.jpg 768w,
                 src/assets/responsive/image-name-large.jpg 1200w"
          type="image/jpeg">
  <img src="src/assets/images/image-name.jpg" 
       alt="Image description" 
       loading="lazy">
</picture>
```

### Adding a Lazy Loaded Image

To manually add a lazy-loaded image:

```html
<img data-src="src/assets/images/image-name.jpg" 
     alt="Image description" 
     class="lazy-placeholder" 
     loading="lazy">
```

## Browser Support

- **WebP Format**: Chrome, Firefox, Edge, Safari 14+, Opera, Android Browser
- **Picture Element**: All modern browsers
- **Native Lazy Loading**: Chrome, Firefox, Edge, Safari 15.4+, Opera
- **JavaScript Lazy Loading Fallback**: All browsers with JavaScript support

## Performance Benefits

Implementing this image optimization pipeline provides:

1. **Reduced Data Usage**: WebP typically reduces file size by 25-35% compared to JPEG and PNG
2. **Faster Initial Load**: Only critical images are loaded immediately
3. **Responsive Loading**: Only appropriate image sizes are downloaded
4. **Better SEO**: Improved Core Web Vitals scores (LCP, CLS)
5. **Reduced Server Load**: Fewer and smaller asset requests

## Troubleshooting

### Common Issues

1. **WebP images not showing**: Ensure browser support or check the fallback mechanism
2. **Images not lazy loading**: Verify that the `lazy-loading.js` script is properly included
3. **Responsive images not working**: Check that srcset syntax is correct with proper width descriptors
4. **Node.js errors during conversion**: Ensure Sharp is properly installed: `npm install sharp --save`

### Testing WebP Support

Use the following code to test WebP support:

```javascript
function hasWebP() {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

if (hasWebP()) {
  document.documentElement.classList.add('webp');
} else {
  document.documentElement.classList.add('no-webp');
}
```

## Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [MDN - Picture Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [Native Lazy Loading](https://web.dev/native-lazy-loading/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/) 