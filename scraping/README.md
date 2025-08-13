# Udyam Registration Portal Web Scraper

This directory contains web scraping tools to extract form fields, validation rules, and UI structure from the official Udyam registration portal at `https://udyamregistration.gov.in/UdyamRegistration.aspx`.

## 🎯 What We're Scraping

### Step 1: Aadhaar Verification
- Aadhaar Number field (12 digits)
- Entrepreneur Name field
- Consent checkbox
- Any additional fields present

### Step 2: PAN Verification
- Type of Organisation dropdown
- PAN Number field (10 characters)
- PAN Holder Name field
- Date of Birth/Incorporation field
- PAN Consent checkbox
- PAN Validate button

## 🛠️ Available Tools

### 1. Node.js Scraper (Puppeteer)
**File**: `scraper.js`
**Best for**: Dynamic content, JavaScript-heavy pages, handling complex interactions

**Features**:
- Uses Puppeteer for browser automation
- Handles dynamic content loading
- Can interact with form elements
- Better for complex validation scenarios

### 2. Python Scraper (BeautifulSoup)
**File**: `scraper.py`
**Best for**: Static content, lightweight scraping, Python environments

**Features**:
- Uses BeautifulSoup for HTML parsing
- Lightweight and fast
- Good for basic form field extraction
- Easy to modify and extend

### 3. Schema Generator
**File**: `schema-generator.js`
**Purpose**: Converts scraped data into:
- Zod validation schemas
- React form components
- TypeScript types

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for Node.js tools)
- Python 3.8+ (for Python tools)
- npm or pip for package management

### Installation

#### For Node.js Tools:
```bash
cd scraping
npm install
```

#### For Python Tools:
```bash
cd scraping
pip install -r requirements.txt
```

## 📋 Usage

### Running the Node.js Scraper

```bash
# Scrape all steps (default)
npm run scrape

# Scrape specific step
npm run scrape:step1
npm run scrape:step2

# Scrape all steps explicitly
npm run scrape:all

# Custom output file
node scraper.js --output my_schema.json
```

### Running the Python Scraper

```bash
# Scrape all steps (default)
python scraper.py

# Scrape specific step
python scraper.py --step 1
python scraper.py --step 2

# Scrape all steps explicitly
python scraper.py --all

# Custom output file
python scraper.py --output my_schema.json
```

### Generating Schemas and Components

```bash
# Generate Zod schemas and React components
npm run generate-schema
```

## 📊 Output Files

The scrapers generate the following files:

### Raw Scraped Data
- `udyam_step1_complete.json` - Step 1 fields
- `udyam_step2_complete.json` - Step 2 fields
- `udyam_complete_schema.json` - All steps combined

### Generated Schemas (after running schema generator)
- `src/schemas/step1Schema.ts` - Zod schema for Step 1
- `src/schemas/step2Schema.ts` - Zod schema for Step 2
- `src/schemas/Step1.tsx` - React component for Step 1
- `src/schemas/Step2.tsx` - React component for Step 2
- `src/schemas/combinedSchema.ts` - Combined schema for all steps

## 🔍 Understanding the Scraped Data

Each field in the scraped data contains:

```json
{
  "key": "field_identifier",
  "label": "Human-readable label",
  "type": "input_type",
  "id": "html_id",
  "name": "html_name",
  "placeholder": "placeholder_text",
  "required": true/false,
  "validation": {
    "required": true/false,
    "minlength": 12,
    "maxlength": 12,
    "pattern": "regex_pattern",
    "message": "validation_message"
  },
  "options": [] // for select fields
}
```

## 🎨 Customization

### Adding New Field Types
1. Modify the `extract_field_data` method in the scraper
2. Add validation rules in `extract_field_validation`
3. Update the schema generator to handle new types

### Modifying Validation Rules
1. Edit the validation patterns in the scraper
2. Update error messages
3. Add custom validation logic

### Styling and UI
1. Modify the generated React components
2. Update CSS classes and styling
3. Add custom form layouts

## ⚠️ Important Notes

### Rate Limiting
- The Udyam portal may have rate limiting
- Add delays between requests if needed
- Respect the website's robots.txt

### Legal Considerations
- Only scrape publicly available information
- Don't overload the server
- Check the website's terms of service

### Data Accuracy
- Validate scraped data manually
- Cross-reference with official documentation
- Update scrapers if the portal changes

## 🐛 Troubleshooting

### Common Issues

#### "Page not loading"
- Check internet connection
- Verify the URL is accessible
- Try different user agents

#### "Fields not found"
- Portal structure may have changed
- Check for dynamic content loading
- Verify field IDs and names

#### "Validation errors"
- Check regex patterns
- Verify field requirements
- Test with sample data

### Debug Mode
- Set `headless: false` in Puppeteer for visual debugging
- Add console.log statements for debugging
- Use browser dev tools to inspect elements

## 🔄 Updating the Scraper

### When to Update
- Portal structure changes
- New fields are added
- Validation rules change
- UI components are modified

### How to Update
1. Test the current scraper
2. Identify changes in the portal
3. Update field selectors and validation
4. Test with new data
5. Regenerate schemas and components

## 📚 Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [BeautifulSoup Documentation](https://beautiful-soup-4.readthedocs.io/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contributing

1. Test your changes thoroughly
2. Update documentation
3. Follow existing code style
4. Add error handling
5. Test with different scenarios

## 📄 License

This project is for educational purposes. Please respect the Udyam portal's terms of service.
