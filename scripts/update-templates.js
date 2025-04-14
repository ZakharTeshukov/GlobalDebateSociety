#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('templates', {
    alias: 't',
    description: 'Directory containing HTML templates',
    type: 'string',
    default: './templates'
  })
  .option('images', {
    alias: 'i',
    description: 'Base directory for images',
    type: 'string',
    default: './images'
  })
  .option('webp-dir', {
    alias: 'w',
    description: 'Directory containing WebP images',
    type: 'string',
    default: './images/webp'
  })
  .option('base-path', {
    alias: 'b',
    description: 'Base path for image URLs in HTML',
    type: 'string',
    default: '/images/webp'
  })
  .option('sizes', {
    alias: 's',
    description: 'Responsive sizes to use (comma-separated)',
    type: 'string',
    default: '320,768,1024,1920'
  })
  .option('dry-run', {
    alias: 'd',
    description: 'Preview changes without writing files',
    type: 'boolean',
    default: false
  })
  .help()
  .alias('help', 'h')
  .argv;

// Process options
const templatesDir = path.resolve(argv.templates);
const imagesDir = path.resolve(argv.images);
const webpDir = path.resolve(argv['webp-dir']);
const basePath = argv['base-path'];
const sizes = argv.sizes.split(',').map(size => parseInt(size, 10));
const dryRun = argv['dry-run'];

// Define pattern for HTML files
const htmlPattern = `${templatesDir}/**/*.html`;

/**
 * Checks if an image has responsive WebP versions
 * @param {string} imageName - Base name of the image without extension
 * @param {string} relativePath - Relative path to directory containing the image
 * @returns {boolean}
 */
function hasResponsiveVersions(imageName, relativePath) {
  const dirPath = path.join(webpDir, relativePath);
  
  // Check if at least one responsive version exists
  for (const size of sizes) {
    const responsiveFile = path.join(dirPath, `${imageName}-${size}w.webp`);
    if (!fs.existsSync(responsiveFile)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Generate srcset string for responsive images
 * @param {string} imageName - Base name of the image without extension
 * @param {string} relativePath - Relative path to directory containing the image
 * @returns {string}
 */
function generateSrcset(imageName, relativePath) {
  let urlPath = path.join(basePath, relativePath).replace(/\\/g, '/');
  if (!urlPath.endsWith('/')) {
    urlPath += '/';
  }
  
  return sizes
    .map(size => `${urlPath}${imageName}-${size}w.webp ${size}w`)
    .join(', ');
}

/**
 * Generate sizes attribute based on responsive sizes
 * @returns {string}
 */
function generateSizesAttribute() {
  // Create a responsive sizes attribute based on the available breakpoints
  return sizes
    .map((size, index, arr) => {
      if (index === arr.length - 1) {
        return `${size}px`;
      }
      const nextSize = arr[index + 1];
      return `(max-width: ${nextSize}px) ${size}px`;
    })
    .join(', ');
}

/**
 * Update HTML templates with responsive image markup
 * @param {string} htmlFile - Path to HTML file
 * @returns {Promise<void>}
 */
async function updateTemplate(htmlFile) {
  try {
    const htmlContent = await fs.readFile(htmlFile, 'utf8');
    const $ = cheerio.load(htmlContent);
    let modified = false;
    
    // Find all img tags
    $('img').each((_, element) => {
      const img = $(element);
      const src = img.attr('src');
      
      // Skip if image is already using srcset or if src is not defined
      if (!src || img.attr('srcset')) {
        return;
      }
      
      // Parse the image path
      const imgPath = src.startsWith('/') ? src.substring(1) : src;
      const parsedPath = path.parse(imgPath);
      const baseName = parsedPath.name;
      const dirName = parsedPath.dir;
      
      // Check if we have WebP versions for this image
      if (!hasResponsiveVersions(baseName, dirName)) {
        return;
      }
      
      // Generate responsive image attributes
      const srcset = generateSrcset(baseName, dirName);
      const sizes = generateSizesAttribute();
      const fallbackSrc = path.join(basePath, dirName, `${baseName}.webp`).replace(/\\/g, '/');
      
      // Update the img tag
      img.attr('srcset', srcset);
      img.attr('sizes', sizes);
      img.attr('src', fallbackSrc);
      
      // Add loading="lazy" if not present
      if (!img.attr('loading')) {
        img.attr('loading', 'lazy');
      }
      
      // Mark as modified
      modified = true;
    });
    
    // If changes were made, write the updated HTML
    if (modified) {
      const updatedHtml = $.html();
      
      if (dryRun) {
        console.log(`Would update: ${htmlFile}`);
      } else {
        await fs.writeFile(htmlFile, updatedHtml);
        console.log(`Updated: ${htmlFile}`);
      }
    } else {
      console.log(`No changes needed for: ${htmlFile}`);
    }
  } catch (error) {
    console.error(`Error updating ${htmlFile}:`, error.message);
  }
}

/**
 * Process all HTML files
 */
async function processTemplates() {
  try {
    const files = glob.sync(htmlPattern);
    
    if (files.length === 0) {
      console.log(`No HTML templates found in ${templatesDir}`);
      return;
    }
    
    console.log(`Found ${files.length} HTML templates to process`);
    
    // Process each HTML file
    for (const file of files) {
      await updateTemplate(file);
    }
    
    console.log('Template updates complete!');
    
    if (dryRun) {
      console.log('Note: This was a dry run. No files were actually modified.');
    }
  } catch (error) {
    console.error('Error processing templates:', error);
  }
}

// Run the script
processTemplates(); 