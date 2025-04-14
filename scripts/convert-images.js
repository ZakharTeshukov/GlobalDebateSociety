#!/usr/bin/env node

/**
 * Image Conversion Script
 * 
 * This script converts images to WebP format and creates responsive variants.
 * 
 * Usage:
 *   node convert-images.js [options]
 * 
 * Options:
 *   --dir=PATH      Source directory for images (default: src/assets/images)
 *   --webp=PATH     Output directory for WebP images (default: src/assets/webp)
 *   --responsive=PATH Output directory for responsive images (default: src/assets/responsive)
 *   --quality=N     WebP quality setting 0-100 (default: 80 for JPEG, 85 for PNG)
 *   --sizes=LIST    Comma-separated list of widths (default: 480,768,1200,1920)
 *   --force         Overwrite existing files
 *   --verbose       Show detailed output
 *   --help          Display help information
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const fsExtra = require('fs-extra');
const glob = require('glob');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Default configuration
const config = {
  sourceDir: 'src/assets/images',
  webpDir: 'src/assets/webp',
  responsiveDir: 'src/assets/responsive',
  jpegQuality: 80,
  pngQuality: 85,
  sizes: [
    { name: 'small', width: 480 },
    { name: 'medium', width: 768 },
    { name: 'large', width: 1200 },
    { name: 'xlarge', width: 1920 }
  ],
  force: false,
  verbose: false
};

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('source', {
    alias: 's',
    description: 'Source directory containing images',
    type: 'string',
    default: './images'
  })
  .option('output', {
    alias: 'o',
    description: 'Output directory for converted images',
    type: 'string',
    default: './images/webp'
  })
  .option('quality', {
    alias: 'q',
    description: 'WebP image quality (1-100)',
    type: 'number',
    default: 80
  })
  .option('sizes', {
    alias: 'z',
    description: 'Responsive sizes to generate (comma-separated)',
    type: 'string',
    default: '320,768,1024,1920'
  })
  .option('formats', {
    alias: 'f',
    description: 'File formats to convert (comma-separated)',
    type: 'string',
    default: 'jpg,jpeg,png'
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
const sourcePath = path.resolve(argv.source);
const outputPath = path.resolve(argv.output);
const quality = argv.quality;
const sizes = argv.sizes.split(',').map(size => parseInt(size, 10));
const formats = argv.formats.split(',');
const dryRun = argv['dry-run'];

// Create pattern for glob
const pattern = `${sourcePath}/**/*.{${formats.join(',')}}`;

// Ensure output directory exists
if (!dryRun) {
  fsExtra.ensureDirSync(outputPath);
}

// Display help text
function showHelp() {
  console.log(`
Image Conversion Script

This script converts images to WebP format and creates responsive variants.

Usage:
  node convert-images.js [options]

Options:
  --dir=PATH      Source directory for images (default: ${config.sourceDir})
  --webp=PATH     Output directory for WebP images (default: ${config.webpDir})
  --responsive=PATH Output directory for responsive images (default: ${config.responsiveDir})
  --quality=N     WebP quality setting 0-100 (default: ${config.jpegQuality} for JPEG, ${config.pngQuality} for PNG)
  --sizes=LIST    Comma-separated list of widths (default: ${config.sizes.map(s => s.width).join(',')})
  --force         Overwrite existing files
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

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Get all image files recursively from a directory
function findImageFiles(dir) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif'];
  const results = [];

  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      results.push(...findImageFiles(fullPath));
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (imageExts.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

// Maintain relative paths when creating output files
function getRelativeOutputPath(imagePath, outputDir, newExt, sizeSuffix = '') {
  const relativePath = path.relative(config.sourceDir, imagePath);
  const extname = path.extname(relativePath);
  const basename = path.basename(relativePath, extname);
  const dirname = path.dirname(relativePath);
  
  return path.join(outputDir, dirname, `${basename}${sizeSuffix}${newExt}`);
}

// Convert image to WebP format
async function convertToWebP(imagePath, outputPath, isJpeg) {
  try {
    const quality = isJpeg ? config.jpegQuality : config.pngQuality;
    
    // Create output directory if it doesn't exist
    ensureDir(path.dirname(outputPath));
    
    // Skip if file exists and --force is not set
    if (!config.force && fileExists(outputPath)) {
      if (config.verbose) {
        console.log(`Skipping existing file: ${outputPath}`);
      }
      return true;
    }
    
    await sharp(imagePath)
      .webp({ quality })
      .toFile(outputPath);
    
    if (config.verbose) {
      console.log(`Converted to WebP: ${outputPath}`);
    }
    return true;
  } catch (error) {
    console.error(`Error converting ${imagePath} to WebP:`, error.message);
    return false;
  }
}

// Create responsive image variants
async function createResponsiveVariants(imagePath, isJpeg) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const results = [];
    const originalExt = path.extname(imagePath);
    
    // Only create responsive variants for images larger than the smallest size
    if (metadata.width <= config.sizes[0].width) {
      console.log(`Skipping responsive variants for ${imagePath} (${metadata.width}px is too small)`);
      return results;
    }

    // Create responsive variants for each configured size
    for (const size of config.sizes) {
      // Skip sizes larger than the original image
      if (size.width >= metadata.width) {
        if (config.verbose) {
          console.log(`Skipping ${size.name} variant for ${imagePath} (original is smaller)`);
        }
        continue;
      }

      // Create responsive variant in original format
      const responsiveOutputPath = getRelativeOutputPath(
        imagePath, 
        config.responsiveDir, 
        originalExt, 
        `-${size.name}`
      );
      
      // Create directory for responsive variant if it doesn't exist
      ensureDir(path.dirname(responsiveOutputPath));
      
      // Skip if file exists and --force is not set
      if (!config.force && fileExists(responsiveOutputPath)) {
        if (config.verbose) {
          console.log(`Skipping existing file: ${responsiveOutputPath}`);
        }
        results.push(responsiveOutputPath);
        continue;
      }

      try {
        await image
          .resize({ width: size.width, withoutEnlargement: true })
          .toFile(responsiveOutputPath);
        
        if (config.verbose) {
          console.log(`Created responsive variant: ${responsiveOutputPath}`);
        }
        results.push(responsiveOutputPath);
      } catch (error) {
        console.error(`Error creating responsive variant ${responsiveOutputPath}:`, error.message);
      }

      // Create WebP variant
      const webpOutputPath = getRelativeOutputPath(
        imagePath, 
        config.webpDir, 
        '.webp', 
        `-${size.name}`
      );
      
      // Create WebP variant
      const quality = isJpeg ? config.jpegQuality : config.pngQuality;
      
      // Create directory for WebP variant if it doesn't exist
      ensureDir(path.dirname(webpOutputPath));
      
      // Skip if file exists and --force is not set
      if (!config.force && fileExists(webpOutputPath)) {
        if (config.verbose) {
          console.log(`Skipping existing file: ${webpOutputPath}`);
        }
        continue;
      }

      try {
        await image
          .resize({ width: size.width, withoutEnlargement: true })
          .webp({ quality })
          .toFile(webpOutputPath);
        
        if (config.verbose) {
          console.log(`Created WebP variant: ${webpOutputPath}`);
        }
      } catch (error) {
        console.error(`Error creating WebP variant ${webpOutputPath}:`, error.message);
      }
    }

    // Create full-size WebP variant
    const fullWebpPath = getRelativeOutputPath(imagePath, config.webpDir, '.webp');
    await convertToWebP(imagePath, fullWebpPath, isJpeg);

    return results;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return [];
  }
}

// Process all images in the source directory
async function processImages() {
  console.log('Starting image conversion process...');
  
  // Ensure output directories exist
  ensureDir(config.webpDir);
  ensureDir(config.responsiveDir);
  
  // Find all image files
  const imageFiles = findImageFiles(config.sourceDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  if (imageFiles.length === 0) {
    console.log('No images found in source directory');
    return;
  }
  
  let success = 0;
  let failed = 0;
  
  // Process each image
  for (const imagePath of imageFiles) {
    console.log(`Processing: ${imagePath}`);
    
    const ext = path.extname(imagePath).toLowerCase();
    const isJpeg = ['.jpg', '.jpeg'].includes(ext);
    
    try {
      await createResponsiveVariants(imagePath, isJpeg);
      success++;
    } catch (error) {
      console.error(`Failed to process ${imagePath}:`, error.message);
      failed++;
    }
  }
  
  console.log('\nImage conversion complete:');
  console.log(`- Successfully processed: ${success} images`);
  console.log(`- Failed to process: ${failed} images`);
  console.log(`- Output WebP directory: ${config.webpDir}`);
  console.log(`- Output responsive directory: ${config.responsiveDir}`);
}

// Main function
async function main() {
  console.log('WebP Image Conversion Tool');
  
  try {
    // Parse command line arguments
    parseArgs();
    
    // Process images
    await processImages();
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