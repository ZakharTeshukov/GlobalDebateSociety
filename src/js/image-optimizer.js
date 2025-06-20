/**
 * Image Optimization Script for Global Debate Society
 *
 * This script provides utilities for optimizing images, including:
 * - Converting images to WebP format
 * - Creating responsive image variants
 * - Updating HTML with WebP sources and fallbacks
 */

// Configuration for image optimization
const config = {
  // Source directories for images
  sourceDirs: ['src/assets/images', 'src/assets/uploads'],

  // Output directory for WebP images
  outputDir: 'src/assets/webp',

  // Responsive image sizes
  sizes: {
    small: 480,
    medium: 768,
    large: 1200,
    xlarge: 1920,
  },

  // Quality settings for different image types
  quality: {
    jpg: 80,
    png: 85,
    webp: 80,
  },
};

/**
 * Converts images to WebP format
 * Requires Node.js environment with Sharp library
 *
 * Usage:
 * node image-optimizer.js --convert
 */
function convertImagesToWebP() {
  // This is a node.js script that would be run via CLI
  // Using the Sharp library for image processing
  const fs = require('fs');
  const path = require('path');
  const sharp = require('sharp');

  // Process each source directory
  config.sourceDirs.forEach((sourceDir) => {
    // Create output directory if it doesn't exist
    const outputDir = config.outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get all image files from the source directory
    const files = fs.readdirSync(sourceDir);

    // Process each file
    files.forEach((file) => {
      const filePath = path.join(sourceDir, file);
      const fileExt = path.extname(file).toLowerCase();

      // Only process image files
      if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
        const fileName = path.basename(file, fileExt);

        // Create WebP version
        sharp(filePath)
          .webp({ quality: config.quality.webp })
          .toFile(path.join(outputDir, `${fileName}.webp`))
          .then(() => console.log(`Converted ${file} to WebP`))
          .catch((err) => console.error(`Error converting ${file}:`, err));

        // Create responsive variants for both original and WebP
        Object.entries(config.sizes).forEach(([size, width]) => {
          // Responsive WebP
          sharp(filePath)
            .resize(width)
            .webp({ quality: config.quality.webp })
            .toFile(path.join(outputDir, `${fileName}-${size}.webp`))
            .then(() => console.log(`Created ${size} WebP variant for ${file}`))
            .catch((err) => console.error(`Error creating ${size} WebP variant for ${file}:`, err));

          // Responsive original format
          sharp(filePath)
            .resize(width)
            .toFile(path.join(outputDir, `${fileName}-${size}${fileExt}`))
            .then(() => console.log(`Created ${size} variant for ${file}`))
            .catch((err) => console.error(`Error creating ${size} variant for ${file}:`, err));
        });
      }
    });
  });
}

/**
 * Updates HTML to use WebP with fallbacks
 * This would be run as part of a build process
 *
 * Usage:
 * node image-optimizer.js --update-html
 */
function updateHTMLWithWebP() {
  const fs = require('fs');
  const path = require('path');

  // Find all HTML files
  const htmlFiles = [];
  function findHTMLFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Recursively search directories
        findHTMLFiles(filePath);
      } else if (path.extname(file).toLowerCase() === '.html') {
        // Add HTML files to the list
        htmlFiles.push(filePath);
      }
    });
  }

  // Start search from root directory
  findHTMLFiles('.');

  // Process each HTML file
  htmlFiles.forEach((htmlFile) => {
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Find all standard img tags
    const imgRegex = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;

    // Store all replacements to make
    const replacements = [];

    while ((match = imgRegex.exec(html)) !== null) {
      const fullTag = match[0];
      const imgSrc = match[1];
      const fileExt = path.extname(imgSrc).toLowerCase();

      // Only process jpg, jpeg, png
      if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
        const fileName = path.basename(imgSrc, fileExt);
        const filePath = path.dirname(imgSrc);

        // Skip SVG and already processed images
        if (fileExt === '.svg' || fullTag.includes('srcset') || fullTag.includes('data-src')) {
          continue;
        }

        // Create new tag with picture element for WebP support
        const webpPath = `${filePath}/webp/${fileName}.webp`;

        // Get image attributes
        const altMatch = fullTag.match(/alt\s*=\s*["']([^"']*)["']/i);
        const alt = altMatch ? altMatch[1] : '';

        const classMatch = fullTag.match(/class\s*=\s*["']([^"']*)["']/i);
        const className = classMatch ? classMatch[1] : '';

        // Create responsive image with WebP and fallback
        const newTag = `
<picture>
  <source srcset="${webpPath}" type="image/webp">
  <source srcset="${imgSrc}" type="${fileExt === '.png' ? 'image/png' : 'image/jpeg'}">
  <img src="${imgSrc}" alt="${alt}" class="${className}" loading="lazy">
</picture>`;

        // Add to replacements
        replacements.push({ original: fullTag, replacement: newTag });
      }
    }

    // Apply all replacements
    replacements.forEach(({ original, replacement }) => {
      html = html.replace(original, replacement);
    });

    // Write updated HTML
    fs.writeFileSync(htmlFile, html);
    console.log(`Updated ${htmlFile}`);
  });
}

/**
 * Client-side function to detect WebP support
 * Adds a class to the HTML element that can be used in CSS
 */
function detectWebPSupport() {
  const testWebP = (callback) => {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  };

  testWebP((support) => {
    document.documentElement.classList.add(support ? 'webp' : 'no-webp');
  });
}

// Initialize WebP detection on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', detectWebPSupport);
}

/**
 * Client-side helper to load responsive images based on viewport
 */
function setupResponsiveImages() {
  const updateImageSources = () => {
    const viewportWidth = window.innerWidth;
    const images = document.querySelectorAll('img[data-srcset]');

    images.forEach((img) => {
      const srcset = img.getAttribute('data-srcset');
      if (srcset) {
        // Parse srcset string
        const sources = srcset.split(',').map((source) => {
          const [url, width] = source.trim().split(' ');
          return {
            url,
            width: parseInt(width.replace('w', '')),
          };
        });

        // Sort by width
        sources.sort((a, b) => a.width - b.width);

        // Find appropriate source
        let selectedSource = sources[0];
        for (const source of sources) {
          if (viewportWidth <= source.width) {
            selectedSource = source;
            break;
          }
        }

        // Set the src
        if (img.dataset.src !== selectedSource.url) {
          img.dataset.src = selectedSource.url;

          // If using lazy loading, update data-src, otherwise update src directly
          if (!img.src || img.classList.contains('loaded')) {
            img.src = selectedSource.url;
          }
        }
      }
    });
  };

  // Run on load and resize
  window.addEventListener('load', updateImageSources);
  window.addEventListener('resize', updateImageSources);
}

// Initialize responsive images on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', setupResponsiveImages);
}

// Export functions for use in other modules
export { detectWebPSupport, setupResponsiveImages };

// If running in Node.js, handle command line arguments
if (typeof module !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--convert')) {
    convertImagesToWebP();
  } else if (args.includes('--update-html')) {
    updateHTMLWithWebP();
  } else {
    console.log(`
Image Optimizer for Global Debate Society
----------------------------------------
Commands:
  --convert      : Convert images to WebP and create responsive variants
  --update-html  : Update HTML files to use WebP with fallbacks
    `);
  }
}
