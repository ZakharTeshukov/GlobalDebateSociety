# SEO Enhancement Tools for Global Debate Society

This directory contains scripts and schema templates for improving the SEO of the Global Debate Society website.

## Features

- **JSON-LD Structured Data**: Schema.org markup for better search engine understanding
- **Meta Description Generation**: Automatic creation of meta descriptions
- **Open Graph Tags**: Enhances sharing on social media platforms
- **Twitter Card Support**: Improves appearance when shared on Twitter
- **Canonical URLs**: Prevents duplicate content issues

## Schema Types

The following JSON-LD schema types are included:

1. **Organization** (`schemas/organization.json`): For the company/organization pages
2. **Event** (`schemas/event.json`): For debate events, competitions, and workshops
3. **Article** (`schemas/article.json`): For blog posts, news articles, and resources
4. **WebPage** (`schemas/default.json`): Default schema for general pages

## Usage

### Installing

Install the required dependencies:

```bash
npm install cheerio fs-extra
```

### Running the SEO Enhancement Script

```bash
node scripts/update-seo.js [options]
```

### Options

- `--dir=PATH`: Source directory for HTML files (default: src/templates)
- `--output=PATH`: Output directory (default: same as source)
- `--dry-run`: Don't write files, just show changes
- `--verbose`: Show detailed output
- `--type=TYPE`: Default page type to apply (organization, event, article, default)
- `--help`: Display help information

### Examples

```bash
# Process all HTML files in the templates directory
node scripts/update-seo.js --dir=templates

# Dry run to preview changes without modifying files
node scripts/update-seo.js --dry-run

# Specify output directory
node scripts/update-seo.js --dir=src/templates --output=dist/templates

# Set default schema type
node scripts/update-seo.js --type=event
```

## Customizing Schemas

The JSON-LD schema templates in the `schemas/` directory can be customized to fit specific needs. Each template follows Schema.org standards and includes the most important properties for its type.

### Organization Schema

Use for the homepage and about pages.

### Event Schema

Use for event pages, tournament announcements, and workshops.

### Article Schema

Use for blog posts, news articles, and educational resources.

### Default Schema

Use for general pages that don't fit into the other categories.

## Automatic Type Detection

The script attempts to detect the appropriate schema type based on the content of each page:

- **Event pages**: Detected by the presence of event-related elements like dates, calendar entries, etc.
- **Article pages**: Detected by the presence of article, blog post, or author information
- **Organization pages**: Used for the homepage and about pages
- **Default pages**: Used for all other pages

## Best Practices

- Ensure all images have proper alt text
- Use meaningful title tags for each page
- Keep meta descriptions between 140-160 characters
- Include proper heading structure (H1, H2, etc.)
- Use canonical URLs to prevent duplicate content

## Integration with Build Process

The SEO enhancement script can be integrated into your build process:

```json
"scripts": {
  "build": "npm run convert-images && npm run update-templates && npm run update-seo"
}
```

## Testing SEO Enhancements

Test your structured data using:

- [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 