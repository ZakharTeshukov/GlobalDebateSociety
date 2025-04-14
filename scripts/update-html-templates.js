#!/usr/bin/env node

/**
 * HTML Template Update Script
 * 
 * This script updates HTML templates to use WebP images with responsive and lazy loading.
 * 
 * Usage:
 *   node update-html-templates.js [options]
 * 
 * Options:
 *   --dir=PATH      Source directory for HTML files (default: src/templates)
 *   --output=PATH   Output directory (default: same as source)
 *   --dry-run       Don't write files, just show changes
 *   --help          Display help information
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Default configuration
const config = {
  sourceDir: 'src/templates',
  outputDir: null, // If null, will overwrite original files
  webpDir: 'assets/webp',
  responsiveDir: 'assets/responsive',
  originalImagesDir: 'assets/images',
  sizes: {
    small: 480,
    medium: 768,
    large: 1200,
    xlarge: 1920
  },
  dryRun: false,
  verbose: false
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  for (const arg of args) {
    if (arg.startsWith('--dir=')) {
      config.sourceDir = arg.replace('--dir=', '');
    } else if (arg.startsWith('--output=')) {
      config.outputDir = arg.replace('--output=', '');
    } else if (arg === '--dry-run') {
      config.dryRun = true;
    } else if (arg === '--verbose') {
      config.verbose = true;
    } else if (arg === '--help') {
      showHelp();
      process.exit(0);
    }
  }
  
  // If output directory isn't specified, use the source directory
  if (!config.outputDir) {
    config.outputDir = config.sourceDir;
  }
}

// Display help text
function showHelp() {
  console.log(`
HTML Template Update Script

This script updates HTML templates to use WebP images with responsive and lazy loading.

Usage:
  node update-html-templates.js [options]

Options:
  --dir=PATH      Source directory for HTML files (default: ${config.sourceDir})
  --output=PATH   Output directory (default: same as source)
  --dry-run       Don't write files, just show changes
  --verbose       Show detailed output
  --help          Display this help information
`);
}

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    if (config.verbose) {
      console.log(`Created directory: ${dirPath}`);
    }
  }
}

// Find all HTML files in the source directory
function findHtmlFiles(dir) {
  const htmlExts = ['.html', '.htm'];
  const results = [];
  
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        results.push(...findHtmlFiles(fullPath));
      } else {
        const ext = path.extname(file.name).toLowerCase();
        if (htmlExts.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
}

// Parse an image src path and return components
function parseImagePath(src) {
  const normalized = src.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const fileName = parts[parts.length - 1];
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);
  
  return {
    src,
    normalized,
    fileName,
    ext,
    baseName,
    directory: parts.slice(0, -1).join('/')
  };
}

// Check if a file exists relative to the source directory
function fileExists(relPath) {
  const fullPath = path.resolve(config.sourceDir, '..', relPath);
  return fs.existsSync(fullPath);
}

// Generate srcset for responsive images
function generateSrcset(basePath, baseName, ext, webp = false) {
  const srcsetEntries = [];
  const targetDir = webp ? config.webpDir : config.responsiveDir;
  const targetExt = webp ? '.webp' : ext;
  
  for (const [size, width] of Object.entries(config.sizes)) {
    const responsivePath = `${targetDir}/${baseName}-${size}${targetExt}`;
    
    // Check if responsive variant exists
    if (fileExists(responsivePath)) {
      srcsetEntries.push(`${responsivePath} ${width}w`);
    }
  }
  
  return srcsetEntries.join(', ');
}

// Generate sizes attribute
function generateSizes() {
  return '(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 85vw, 80vw';
}

// Transform an img tag to picture with WebP and responsive sources
function transformImgTag(imgElement, $) {
  const src = $(imgElement).attr('src');
  
  // Skip if no src attribute or if it's a data URL or external URL
  if (!src || src.startsWith('data:') || /^https?:\/\//.test(src)) {
    if (config.verbose) {
      console.log(`Skipping external or data URL: ${src}`);
    }
    return false;
  }
  
  // Parse the image path
  const img = parseImagePath(src);
  
  // Generate WebP path
  const webpPath = `${config.webpDir}/${img.baseName}.webp`;
  
  // Skip if WebP version doesn't exist
  if (!fileExists(webpPath)) {
    if (config.verbose) {
      console.log(`Skipping image with no WebP version: ${src}`);
    }
    return false;
  }
  
  // Get original attributes
  const alt = $(imgElement).attr('alt') || '';
  const classList = $(imgElement).attr('class') || '';
  const id = $(imgElement).attr('id') || '';
  const width = $(imgElement).attr('width') || '';
  const height = $(imgElement).attr('height') || '';
  const style = $(imgElement).attr('style') || '';
  
  // Generate srcset for WebP and original format
  const webpSrcset = generateSrcset(img.directory, img.baseName, img.ext, true);
  const originalSrcset = generateSrcset(img.directory, img.baseName, img.ext, false);
  
  // Generate sizes attribute
  const sizes = generateSizes();
  
  // Create picture element
  const picture = $('<picture></picture>');
  
  // Add WebP source
  if (webpSrcset) {
    const webpSource = $('<source></source>');
    webpSource.attr('type', 'image/webp');
    webpSource.attr('srcset', webpSrcset);
    webpSource.attr('sizes', sizes);
    picture.append(webpSource);
  }
  
  // Add original format source
  if (originalSrcset) {
    const originalSource = $('<source></source>');
    originalSource.attr('srcset', originalSrcset);
    originalSource.attr('sizes', sizes);
    picture.append(originalSource);
  }
  
  // Create new img element
  const newImg = $('<img>');
  newImg.attr('src', src);
  newImg.attr('alt', alt);
  newImg.attr('loading', 'lazy');
  
  if (classList) newImg.attr('class', classList);
  if (id) newImg.attr('id', id);
  if (width) newImg.attr('width', width);
  if (height) newImg.attr('height', height);
  if (style) newImg.attr('style', style);
  
  // Add img to picture
  picture.append(newImg);
  
  // Replace original img with picture
  $(imgElement).replaceWith(picture);
  
  return true;
}

// Update CSS background images
function updateCssBackgroundImages(html) {
  let updatedHtml = html;
  
  // Find CSS background-image properties
  const bgImageRegex = /background-image:\s*url\(['"]?([^'")]+)['"]?\)/g;
  let match;
  
  while ((match = bgImageRegex.exec(html)) !== null) {
    const [fullMatch, imgPath] = match;
    
    // Skip data URLs and external URLs
    if (imgPath.startsWith('data:') || /^https?:\/\//.test(imgPath)) {
      continue;
    }
    
    // Parse the image path
    const img = parseImagePath(imgPath);
    
    // Generate WebP path (maintaining relative structure)
    const relativePath = path.relative(config.originalImagesDir, imgPath);
    const webpPath = path.join(config.webpDir, relativePath.replace(img.ext, '.webp'));
    
    // Check if WebP version exists
    if (fileExists(webpPath)) {
      // Create WebP-aware CSS
      const webpRule = `.webp ${fullMatch.replace(imgPath, webpPath)}`;
      const noWebpRule = `.no-webp ${fullMatch}`;
      
      // Replace the original rule with conditional rules
      updatedHtml = updatedHtml.replace(
        fullMatch,
        `${noWebpRule}; ${webpRule}`
      );
    }
  }
  
  return updatedHtml;
}

// Add WebP detection script to the head
function addWebpDetectionScript($) {
  // Skip if script already exists
  if ($('script').filter((i, el) => $(el).html().includes('WebP')).length > 0) {
    return;
  }
  
  const script = `
<script>
(function() {
  // WebP feature detection
  function checkWebP(callback) {
    var img = new Image();
    img.onload = function() {
      callback(img.width > 0 && img.height > 0);
    };
    img.onerror = function() {
      callback(false);
    };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  }
  
  // Add webp or no-webp class to html element
  checkWebP(function(support) {
    document.documentElement.classList.add(support ? 'webp' : 'no-webp');
  });
})();
</script>`;
  
  $('head').append(script);
}

// Add CSS rules for .webp and .no-webp classes
function addWebpCssRules($) {
  // Skip if the rules already exist
  if ($('style').filter((i, el) => $(el).html().includes('.webp')).length > 0) {
    return;
  }
  
  const css = `
<style>
/* Hide WebP images in no-webp browsers */
.no-webp .webp-only {
  display: none !important;
}

/* Hide non-WebP images in WebP browsers */
.webp .no-webp-only {
  display: none !important;
}
</style>`;
  
  $('head').append(css);
}

// Process a single HTML file
async function processHtmlFile(htmlFile) {
  try {
    // Read the HTML file
    const html = fs.readFileSync(htmlFile, 'utf8');
    
    // Parse HTML
    const $ = cheerio.load(html, { decodeEntities: false });
    
    // Find all img tags
    const imgTags = $('img');
    let transformedCount = 0;
    
    console.log(`Processing ${htmlFile}, found ${imgTags.length} images`);
    
    // Transform each img tag
    imgTags.each((i, imgElement) => {
      const transformed = transformImgTag(imgElement, $);
      if (transformed) {
        transformedCount++;
      }
    });
    
    // Update CSS background images
    let updatedHtml = $.html();
    updatedHtml = updateCssBackgroundImages(updatedHtml);
    
    // Parse the updated HTML
    const $updated = cheerio.load(updatedHtml, { decodeEntities: false });
    
    // Add WebP detection script and CSS rules
    addWebpDetectionScript($updated);
    addWebpCssRules($updated);
    
    // Get the final HTML
    const finalHtml = $updated.html();
    
    // Determine output path
    const relativePath = path.relative(config.sourceDir, htmlFile);
    const outputPath = path.join(config.outputDir, relativePath);
    
    // Create output directory if it doesn't exist
    ensureDir(path.dirname(outputPath));
    
    // Write the updated HTML
    if (!config.dryRun) {
      fs.writeFileSync(outputPath, finalHtml, 'utf8');
      console.log(`Updated ${outputPath} (${transformedCount} images transformed)`);
    } else {
      console.log(`[DRY-RUN] Would update ${outputPath} (${transformedCount} images transformed)`);
    }
    
    return {
      file: htmlFile,
      transformed: transformedCount,
      total: imgTags.length
    };
  } catch (error) {
    console.error(`Error processing ${htmlFile}:`, error.message);
    return {
      file: htmlFile,
      transformed: 0,
      total: 0,
      error: error.message
    };
  }
}

// Process all HTML files
async function processHtmlFiles() {
  console.log('Starting HTML template update process...');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(config.sourceDir);
  console.log(`Found ${htmlFiles.length} HTML files to process`);
  
  if (htmlFiles.length === 0) {
    console.log('No HTML files found in source directory');
    return;
  }
  
  // Create output directory if it doesn't exist
  ensureDir(config.outputDir);
  
  // Process each HTML file
  const results = [];
  
  for (const htmlFile of htmlFiles) {
    const result = await processHtmlFile(htmlFile);
    results.push(result);
  }
  
  // Print summary
  console.log('\nHTML template update complete:');
  
  const totalFiles = results.length;
  const totalTransformed = results.reduce((sum, result) => sum + result.transformed, 0);
  const totalImages = results.reduce((sum, result) => sum + result.total, 0);
  const errors = results.filter(result => result.error);
  
  console.log(`- Total HTML files processed: ${totalFiles}`);
  console.log(`- Total images found: ${totalImages}`);
  console.log(`- Total images transformed: ${totalTransformed}`);
  console.log(`- Files with errors: ${errors.length}`);
  
  if (config.dryRun) {
    console.log('\nThis was a dry run. No files were actually modified.');
    console.log('Run without --dry-run to apply changes.');
  }
}

// Main function
async function main() {
  console.log('HTML Template Update Tool');
  
  try {
    // Parse command line arguments
    parseArgs();
    
    // Process HTML files
    await processHtmlFiles();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 