#!/bin/bash

# Demo script to showcase SEO enhancement functionality
# This script runs the SEO enhancement with different options

echo "SEO Enhancement Test Script"
echo "=========================="
echo ""

# First, run a dry run on the templates directory
echo "Running dry-run on templates directory..."
node scripts/update-seo.js --dir=templates --dry-run

echo ""
echo "Testing with specific page types..."

# Test with organization schema
echo ""
echo "Applying organization schema to a specific file..."
node scripts/update-seo.js --dir=templates --type=organization --dry-run 

# Test with event schema
echo ""
echo "Applying event schema to a specific file..."
node scripts/update-seo.js --dir=templates --type=event --dry-run

# Test with article schema
echo ""
echo "Applying article schema to a specific file..."
node scripts/update-seo.js --dir=templates --type=article --dry-run

echo ""
echo "Test completed. To apply changes for real, run without the --dry-run flag."
echo "For example: node scripts/update-seo.js --dir=templates" 