# Image Processing and HTML Template Update Scripts

This directory contains scripts for optimizing images and updating HTML templates to improve web performance through WebP image support and responsive loading.

## Scripts Overview

1. **convert-images.js**: Converts images to WebP format and creates responsive versions
2. **update-html-templates.js**: Updates HTML templates to use WebP images with responsive loading

## Prerequisites

- Node.js (v14.x or later)
- NPM dependencies:
  - sharp
  - yargs
  - fs-extra
  - glob
  - cheerio

Install dependencies:

```bash
npm install sharp yargs fs-extra glob cheerio
```

## Image Conversion Script (convert-images.js)

This script processes images by:
- Converting images to WebP format
- Creating responsive image variants at different sizes
- Preserving directory structure

### Usage

```bash
node scripts/convert-images.js [options]
```

### Options

- `--source-dir`, `-s`: Source directory containing original images (default: `public/images`)
- `--webp-dir`, `-w`: Output directory for WebP images (default: `public/images-webp`)
- `--responsive-dir`, `-r`: Output directory for responsive images (default: `public/images-responsive`)
- `--quality`, `-q`: WebP compression quality (1-100, default: 80)
- `--sizes`, `-z`: Responsive image sizes (comma-separated, default: 640,960,1280,1920)
- `--verbose`, `-v`: Enable verbose output
- `--help`, `-h`: Show help

### Examples

```bash
# Basic usage with defaults
node scripts/convert-images.js

# Specify custom directories and quality
node scripts/convert-images.js --source-dir=assets/images --webp-dir=assets/webp --quality=85

# Create responsive images with custom sizes
node scripts/convert-images.js --sizes=320,768,1024,1440
```

## HTML Template Update Script (update-html-templates.js)

This script updates HTML templates to take advantage of optimized images by:
- Transforming `<img>` tags into `<picture>` elements with WebP support
- Adding responsive image loading with `srcset` attributes
- Updating CSS background images to use WebP when supported
- Adding WebP detection script

### Usage

```bash
node scripts/update-html-templates.js [options]
```

### Options

- `--source-dir`, `-s`: Source directory containing HTML files (default: `public`)
- `--output-dir`, `-o`: Output directory for updated HTML files (default: `public-updated`)
- `--original-images-dir`, `-i`: Directory containing original images (default: `public/images`)
- `--webp-dir`, `-w`: Directory containing WebP images (default: `public/images-webp`)
- `--responsive-dir`, `-r`: Directory containing responsive images (default: `public/images-responsive`)
- `--dry-run`, `-d`: Preview changes without modifying files
- `--help`, `-h`: Show help

### Examples

```bash
# Basic usage with defaults
node scripts/update-html-templates.js

# Specify custom directories
node scripts/update-html-templates.js --source-dir=src/templates --output-dir=dist/templates

# Preview changes without modifying files
node scripts/update-html-templates.js --dry-run
```

## Recommended Workflow

1. **Convert images first**:
   ```bash
   node scripts/convert-images.js
   ```

2. **Then update HTML templates**:
   ```bash
   node scripts/update-html-templates.js
   ```

3. **Preview changes** (optional):
   ```bash
   node scripts/update-html-templates.js --dry-run
   ```

This workflow ensures that all optimized images are created before updating the HTML templates to reference them.

## Tips

- Always keep backups of original images and templates
- Check browser compatibility for WebP support
- Test the updated templates in different browsers and devices
- Use the `--verbose` flag to debug image conversion issues
- Use the `--dry-run` flag to preview HTML changes before applying them 