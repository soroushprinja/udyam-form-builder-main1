#!/bin/bash

# Udyam Scraping Quick Start Script
# This script automates the entire scraping process

echo "🚀 Udyam Registration Portal Scraping - Quick Start"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run the scraper
echo "🕷️  Starting web scraping..."
echo "⚠️  Note: This will open a browser window. Please don't close it until scraping is complete."
echo ""

npm run scrape:all

if [ $? -ne 0 ]; then
    echo "❌ Scraping failed"
    exit 1
fi

echo "✅ Scraping completed successfully"

# Validate the scraped data
echo "🔍 Validating scraped data..."
npm run validate

if [ $? -ne 0 ]; then
    echo "⚠️  Validation found issues. Please review the scraped data."
else
    echo "✅ Data validation passed"
fi

# Generate schemas and components
echo "🔧 Generating schemas and React components..."
npm run generate-schema

if [ $? -ne 0 ]; then
    echo "❌ Schema generation failed"
    exit 1
fi

echo "✅ Schema generation completed"

echo ""
echo "🎉 All done! Here's what was created:"
echo "📁 Scraped data files in ./scraping/"
echo "📁 Generated schemas in ./src/schemas/"
echo ""
echo "Next steps:"
echo "1. Review the generated schemas and components"
echo "2. Integrate them into your main application"
echo "3. Test the forms with real data"
echo "4. Customize styling and validation as needed"
