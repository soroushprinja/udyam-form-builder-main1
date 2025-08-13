@echo off
REM Udyam Scraping Quick Start Script for Windows
REM This script automates the entire scraping process

echo 🚀 Udyam Registration Portal Scraping - Quick Start
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm found

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Run the scraper
echo 🕷️  Starting web scraping...
echo ⚠️  Note: This will open a browser window. Please don't close it until scraping is complete.
echo.

npm run scrape:all

if %errorlevel% neq 0 (
    echo ❌ Scraping failed
    pause
    exit /b 1
)

echo ✅ Scraping completed successfully

REM Validate the scraped data
echo 🔍 Validating scraped data...
npm run validate

if %errorlevel% neq 0 (
    echo ⚠️  Validation found issues. Please review the scraped data.
) else (
    echo ✅ Data validation passed
)

REM Generate schemas and components
echo 🔧 Generating schemas and React components...
npm run generate-schema

if %errorlevel% neq 0 (
    echo ❌ Schema generation failed
    pause
    exit /b 1
)

echo ✅ Schema generation completed

echo.
echo 🎉 All done! Here's what was created:
echo 📁 Scraped data files in ./scraping/
echo 📁 Generated schemas in ./src/schemas/
echo.
echo Next steps:
echo 1. Review the generated schemas and components
echo 2. Integrate them into your main application
echo 3. Test the forms with real data
echo 4. Customize styling and validation as needed

pause
