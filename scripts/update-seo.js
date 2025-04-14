#!/usr/bin/env node

/**
 * SEO Enhancement Script
 * 
 * This script updates HTML files with:
 * - JSON-LD structured data
 * - Meta descriptions
 * - Open Graph tags
 * - Twitter Card support
 * 
 * Usage:
 *   node update-seo.js [options]
 * 
 * Options:
 *   --dir=PATH      Source directory for HTML files (default: src/templates)
 *   --output=PATH   Output directory (default: same as source)
 *   --dry-run       Don't write files, just show changes
 *   --verbose       Show detailed output
 *   --type=TYPE     Page type to apply (organization, event, article, default)
 *   --help          Display help information
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Default configuration
const config = {
  sourceDir: 'src/templates',
  outputDir: null, // If null, will overwrite original files
  schemasDir: path.join(__dirname, 'schemas'),
  dryRun: false,
  verbose: false,
  defaultPageType: 'default', // Can be 'organization', 'event', 'article', or 'default'
  siteUrl: 'https://globaldebatesociety.org',
  siteName: 'Global Debate Society',
  twitterHandle: '@globaldebate'
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
    } else if (arg.startsWith('--type=')) {
      config.defaultPageType = arg.replace('--type=', '');
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
SEO Enhancement Script

This script updates HTML files with JSON-LD structured data, meta descriptions,
Open Graph tags, and Twitter Card support.

Usage:
  node update-seo.js [options]

Options:
  --dir=PATH      Source directory for HTML files (default: ${config.sourceDir})
  --output=PATH   Output directory (default: same as source)
  --dry-run       Don't write files, just show changes
  --verbose       Show detailed output
  --type=TYPE     Default page type to apply (organization, event, article, default)
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

// Load schema from file
function loadSchema(type) {
  try {
    const schemaPath = path.join(config.schemasDir, `${type}.json`);
    if (fs.existsSync(schemaPath)) {
      return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    }
    console.error(`Schema file not found: ${schemaPath}`);
    return null;
  } catch (error) {
    console.error(`Error loading schema for ${type}:`, error.message);
    return null;
  }
}

// Detect page type from content
function detectPageType($) {
  // This is a simple detection based on common page elements
  // In a real application, this could be more sophisticated
  
  // Check for event-specific content
  if ($('h1:contains("Event"), h2:contains("Event")').length > 0 || 
      $('time, .date, .event-date').length > 0) {
    return 'event';
  }
  
  // Check for article-specific content
  if ($('article, .article, .blog-post').length > 0 || 
      $('.author, .byline').length > 0) {
    return 'article';
  }
  
  // Check for home page
  if ($('body.home, .home-page').length > 0 || 
      $('meta[name="description"]').attr('content')?.includes('home')) {
    return 'organization';
  }
  
  // Default to the configured default type
  return config.defaultPageType;
}

// Generate meta description
function generateMetaDescription($) {
  // Try to extract from first paragraph or relevant content
  let description = '';
  
  // Look for existing meta description
  const existingMeta = $('meta[name="description"]').attr('content');
  if (existingMeta) {
    return existingMeta;
  }
  
  // Try to get first paragraph text
  description = $('p').first().text().trim();
  
  // If no paragraph found, try main content area
  if (!description) {
    description = $('main, .content, article').first().text().trim();
  }
  
  // If still no content, use the title
  if (!description) {
    description = $('title').text().trim();
  }
  
  // Truncate to reasonable length (155-160 chars is typical for meta descriptions)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description || `Learn more about ${config.siteName} - promoting debate worldwide`;
}

// Extract primary image for Open Graph tags
function extractPrimaryImage($) {
  // Try to find the main image of the page
  const mainImage = $('header img, main img, article img').first().attr('src');
  
  if (mainImage) {
    // Convert relative URL to absolute
    if (mainImage.startsWith('/') || !mainImage.startsWith('http')) {
      return new URL(mainImage, config.siteUrl).toString();
    }
    return mainImage;
  }
  
  // Default image if none found
  return `${config.siteUrl}/src/assets/images/logo.png`;
}

// Add JSON-LD structured data
function addStructuredData($, schema) {
  if (!schema) return;
  
  // Check if structured data already exists
  const existingSchema = $('script[type="application/ld+json"]');
  if (existingSchema.length > 0) {
    existingSchema.remove();
  }
  
  // Create the script element for JSON-LD
  const scriptTag = `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  $('head').append(scriptTag);
}

// Add Open Graph tags
function addOpenGraphTags($, pageType) {
  const title = $('title').text().trim() || config.siteName;
  const description = $('meta[name="description"]').attr('content') || '';
  const url = new URL($('link[rel="canonical"]').attr('href') || '/', config.siteUrl).toString();
  const image = extractPrimaryImage($);
  
  // Remove existing Open Graph tags
  $('meta[property^="og:"]').remove();
  
  const ogTags = [
    `<meta property="og:site_name" content="${config.siteName}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`
  ];
  
  // Add type-specific tags
  if (pageType === 'article') {
    ogTags.push(`<meta property="og:type" content="article">`);
    
    // Try to extract additional article details
    const pubDate = $('time, .date, meta[property="article:published_time"]').attr('datetime') || 
                    $('time, .date').text().trim();
    if (pubDate) {
      ogTags.push(`<meta property="article:published_time" content="${pubDate}">`);
    }
    
    // Author
    const author = $('.author, .byline').text().trim();
    if (author) {
      ogTags.push(`<meta property="article:author" content="${author}">`);
    }
  } else if (pageType === 'event') {
    ogTags.push(`<meta property="og:type" content="event">`);
    
    // Try to extract event details
    const startDate = $('time[itemprop="startDate"], .event-date').attr('datetime') || 
                      $('time[itemprop="startDate"], .event-date').text().trim();
    if (startDate) {
      ogTags.push(`<meta property="event:start_time" content="${startDate}">`);
    }
  } else {
    ogTags.push(`<meta property="og:type" content="website">`);
  }
  
  // Add all tags to head
  ogTags.forEach(tag => $('head').append(tag));
}

// Add Twitter Card tags
function addTwitterCardTags($) {
  const title = $('title').text().trim() || config.siteName;
  const description = $('meta[name="description"]').attr('content') || '';
  const image = extractPrimaryImage($);
  
  // Remove existing Twitter Card tags
  $('meta[name^="twitter:"]').remove();
  
  const twitterTags = [
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="${config.twitterHandle}">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`
  ];
  
  // Add all tags to head
  twitterTags.forEach(tag => $('head').append(tag));
}

// Add or update canonical URL
function addCanonicalUrl($, htmlFile) {
  // Remove existing canonical link
  $('link[rel="canonical"]').remove();
  
  // Generate canonical URL based on file path
  const relativePath = path.relative(config.sourceDir, htmlFile);
  const canonicalUrl = new URL(relativePath, config.siteUrl).toString();
  
  // Add canonical URL
  $('head').append(`<link rel="canonical" href="${canonicalUrl}">`);
}

// Add or update meta description
function addMetaDescription($) {
  // Generate description if not exists
  if ($('meta[name="description"]').length === 0) {
    const description = generateMetaDescription($);
    $('head').append(`<meta name="description" content="${description}">`);
  }
}

// Process a single HTML file
async function processHtmlFile(htmlFile) {
  try {
    // Read the HTML file
    const html = fs.readFileSync(htmlFile, 'utf8');
    
    // Parse HTML
    const $ = cheerio.load(html, { decodeEntities: false });
    
    console.log(`Processing ${htmlFile}`);
    
    // Detect page type
    const pageType = detectPageType($);
    
    // Add or update canonical URL
    addCanonicalUrl($, htmlFile);
    
    // Add or update meta description
    addMetaDescription($);
    
    // Load schema based on page type
    const schema = loadSchema(pageType);
    
    // Add structured data
    if (schema) {
      addStructuredData($, schema);
    }
    
    // Add Open Graph tags
    addOpenGraphTags($, pageType);
    
    // Add Twitter Card tags
    addTwitterCardTags($);
    
    // Get the final HTML
    const finalHtml = $.html();
    
    // Determine output path
    const relativePath = path.relative(config.sourceDir, htmlFile);
    const outputPath = path.join(config.outputDir, relativePath);
    
    // Create output directory if it doesn't exist
    ensureDir(path.dirname(outputPath));
    
    // Write the updated HTML
    if (!config.dryRun) {
      fs.writeFileSync(outputPath, finalHtml, 'utf8');
      console.log(`Updated ${outputPath} with SEO enhancements (${pageType} schema)`);
    } else {
      console.log(`[DRY-RUN] Would update ${outputPath} with SEO enhancements (${pageType} schema)`);
    }
    
    return {
      file: htmlFile,
      pageType: pageType,
      success: true
    };
  } catch (error) {
    console.error(`Error processing ${htmlFile}:`, error.message);
    return {
      file: htmlFile,
      success: false,
      error: error.message
    };
  }
}

// Process all HTML files
async function processHtmlFiles() {
  console.log('Starting SEO enhancement process...');
  
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
  console.log('\nSEO enhancement complete:');
  
  const totalFiles = results.length;
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;
  
  // Count by page type
  const pageTypeCounts = results.reduce((acc, result) => {
    if (result.pageType) {
      acc[result.pageType] = (acc[result.pageType] || 0) + 1;
    }
    return acc;
  }, {});
  
  console.log(`- Total HTML files processed: ${totalFiles}`);
  console.log(`- Successfully enhanced: ${successCount}`);
  console.log(`- Failed to enhance: ${errorCount}`);
  
  // Log page type counts
  console.log('- Page types processed:');
  Object.entries(pageTypeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
  
  if (config.dryRun) {
    console.log('\nThis was a dry run. No files were actually modified.');
    console.log('Run without --dry-run to apply changes.');
  }
}

// Main function
async function main() {
  console.log('SEO Enhancement Tool');
  
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