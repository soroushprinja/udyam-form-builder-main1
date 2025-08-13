import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UdyamScraper {
  constructor() {
    this.baseUrl = 'https://udyamregistration.gov.in/UdyamRegistration.aspx';
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: true, // Set to true for production
      defaultViewport: { width: 1366, height: 768 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ Browser initialized successfully');
  }

  async scrapeStep1() {
    console.log('📋 Scraping Step 1: Aadhaar Verification...');
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      console.log('✅ Page loaded successfully');

      // Wait for the form to load
      await this.page.waitForSelector('#ctl00_ContentPlaceHolder1_txtadharno', { timeout: 10000 });
      
      // Extract form fields
      const step1Data = await this.page.evaluate(() => {
        const fields = [];
        
        // Aadhaar Number field
        const aadhaarField = document.querySelector('#ctl00_ContentPlaceHolder1_txtadharno');
        if (aadhaarField) {
          fields.push({
            key: 'aadhaar_number',
            label: 'Your Aadhaar No',
            type: 'text',
            id: aadhaarField.id,
            name: aadhaarField.name,
            placeholder: aadhaarField.placeholder || 'Your Aadhaar No',
            required: aadhaarField.required,
            pattern: aadhaarField.pattern,
            maxlength: aadhaarField.maxLength,
            validation: {
              minLength: 12,
              maxLength: 12,
              pattern: '^\\d{12}$',
              message: 'Aadhaar number must be exactly 12 digits'
            }
          });
        }

        // Entrepreneur Name field
        const nameField = document.querySelector('#ctl00_ContentPlaceHolder1_txtownername');
        if (nameField) {
          fields.push({
            key: 'entrepreneur_name',
            label: 'Name as per Aadhaar',
            type: 'text',
            id: nameField.id,
            name: nameField.name,
            placeholder: nameField.placeholder || 'Name as per Aadhaar',
            required: nameField.required,
            pattern: nameField.pattern,
            maxlength: nameField.maxLength,
            validation: {
              minLength: 2,
              maxLength: 100,
              pattern: '^[a-zA-Z\\s]+$',
              message: 'Name must contain only letters and spaces'
            }
          });
        }

        // Consent checkbox
        const consentField = document.querySelector('#ctl00_ContentPlaceHolder1_chkDecarationA');
        if (consentField) {
          fields.push({
            key: 'aadhaar_consent',
            label: 'I consent to the use of my Aadhaar number for Udyam registration',
            type: 'checkbox',
            id: consentField.id,
            name: consentField.name,
            required: true,
            validation: {
              required: true,
              message: 'You must provide consent to proceed'
            }
          });
        }

        // Look for any additional fields in Step 1
        const additionalFields = document.querySelectorAll('input, select, textarea');
        additionalFields.forEach((field) => {
          const type = (field.type || '').toLowerCase();
          const idLower = (field.id || '').toLowerCase();
          if (type === 'hidden') return;
          if (!field.id) return;
          if (idLower.includes('viewstate') || idLower.includes('eventvalidation')) return;
          if (fields.find((f) => f.id === field.id)) return;

          const fieldData = {
            key: field.id.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            label: field.placeholder || field.title || field.id,
            type: field.type || 'text',
            id: field.id,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            pattern: field.pattern,
            maxlength: field.maxLength
          };

          if (field.tagName === 'SELECT') {
            fieldData.options = Array.from(field.options).map((opt) => ({
              value: opt.value,
              text: (opt.textContent || '').trim()
            }));
          }

          fields.push(fieldData);
        });

        return fields;
      });

      console.log(`✅ Step 1: Found ${step1Data.length} fields`);
      return step1Data;

    } catch (error) {
      console.error('❌ Error scraping Step 1:', error.message);
      throw error;
    }
  }

  async scrapeStep2() {
    console.log('📋 Scraping Step 2: PAN Verification...');
    
    try {
      // Navigate to Step 2 (this might require form submission or navigation)
      // For now, we'll try to find Step 2 fields on the same page
      
      const step2Data = await this.page.evaluate(() => {
        const fields = [];

        const bySelectors = (sels) => sels.map(s => document.querySelector(s)).find(Boolean);
        const byIdOrNameLike = (patterns) => {
          const rx = new RegExp(patterns.join('|'), 'i');
          return [...document.querySelectorAll('input,select,textarea')]
            .find(el => rx.test(el.id) || rx.test(el.name) || rx.test(el.placeholder || ''));
        };
        const byLabelText = (patterns) => {
          const rx = new RegExp(patterns.join('|'), 'i');
          for (const label of document.querySelectorAll('label')) {
            const txt = (label.textContent || '').trim();
            if (rx.test(txt)) {
              const forId = label.getAttribute('for');
              if (forId) {
                const el = document.getElementById(forId);
                if (el) return el;
              }
              let el = label.nextElementSibling;
              for (let i = 0; i < 3 && el; i++, el = el.nextElementSibling) {
                if (el.matches?.('input,select,textarea')) return el;
                const nested = el.querySelector?.('input,select,textarea');
                if (nested) return nested;
              }
            }
          }
          return null;
        };

        const pick = (el, defaults) => {
          if (!el) return null;
          const base = {
            id: el.id, name: el.name, placeholder: el.placeholder,
            required: !!el.required, maxlength: el.maxLength > 0 ? el.maxLength : undefined,
          };
          if (el.tagName === 'SELECT') {
            return {
              ...defaults, ...base, type: 'select',
              options: [...el.options].map(o => ({ value: o.value, text: (o.textContent || '').trim() })),
            };
          }
          return { ...defaults, ...base, type: (el.type || 'text') };
        };

        // Type of Organisation
        const orgEl =
          bySelectors(['#ctl00_ContentPlaceHolder1_ddltypeoforg']) ||
          byIdOrNameLike(['ddltype', 'typeoforg', 'organization', 'organisation']) ||
          byLabelText(['Type of Organisation']);
        const org = pick(orgEl, {
          key: 'type_of_organisation',
          label: 'Type of Organisation / संगठन के प्रकार',
          validation: { required: true, message: 'Please select type of organisation' },
        });
        if (org) fields.push(org);

        // PAN number
        const panEl =
          bySelectors(['#ctl00_ContentPlaceHolder1_txtPan']) ||
          byIdOrNameLike(['txtpan', '\\bpan\\b']) ||
          byLabelText(['PAN']);
        const pan = pick(panEl, {
          key: 'pan_number',
          label: 'Enter Pan Number',
          validation: {
            minLength: 10, maxLength: 10,
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
            message: 'PAN must be in format: ABCDE1234F',
          },
        });
        if (pan) fields.push(pan);

        // PAN holder name
        const panNameEl =
          bySelectors(['#ctl00_ContentPlaceHolder1_txtPanName']) ||
          byIdOrNameLike(['panname', 'name.*pan']) ||
          byLabelText(['Name as per PAN']);
        const panName = pick(panNameEl, {
          key: 'pan_holder_name',
          label: 'Name as per PAN',
          validation: { minLength: 2, maxLength: 100, pattern: '^[a-zA-Z\\s]+$', message: 'Name must contain only letters and spaces' },
        });
        if (panName) fields.push(panName);

        // DOB/DOI
        const dobEl =
          bySelectors(['#ctl00_ContentPlaceHolder1_txtdob']) ||
          byIdOrNameLike(['dob', 'dateofbirth', 'doi', 'dateofinc']) ||
          byLabelText(['Date of Birth', 'Date of Incorporation']);
        const dob = pick(dobEl, {
          key: 'date_of_birth_incorporation',
          label: 'Date of Birth/Incorporation',
          type: 'date',
          validation: { required: true, message: 'Date of birth/incorporation is required' },
        });
        if (dob) fields.push(dob);

        // PAN Consent
        const panConsentEl =
          bySelectors(['#ctl00_ContentPlaceHolder1_chkDecarationP']) ||
          byIdOrNameLike(['consent.*pan', 'pan.*consent']) ||
          byLabelText(['consent', 'I consent']);
        const panConsent = panConsentEl && {
          key: 'pan_consent',
          label: 'I consent to the use of my PAN data for Udyam registration',
          type: 'checkbox',
          id: panConsentEl.id, name: panConsentEl.name, required: true,
          validation: { required: true, message: 'You must provide PAN consent to proceed' },
        };
        if (panConsent) fields.push(panConsent);

        // Validate PAN button
        const validateBtn =
          bySelectors(['#ctl00_ContentPlaceHolder1_btnValidatePan']) ||
          byIdOrNameLike(['validate.*pan', 'btn.*pan']) ||
          byLabelText(['PAN Validate']);
        if (validateBtn) {
          fields.push({
            key: 'validate_pan_button',
            label: 'PAN Validate',
            type: 'submit',
            id: validateBtn.id, name: validateBtn.name, required: false,
          });
        }

        return fields;
      });

      console.log(`✅ Step 2: Found ${step2Data.length} fields`);
      return step2Data;

    } catch (error) {
      console.error('❌ Error scraping Step 2:', error.message);
      throw error;
    }
  }
}

// Runner
async function main() {
  const scraper = new UdyamScraper();
  try {
    await scraper.init();

    const args = process.argv.slice(2);
    const stepArg = args.find(a => a.startsWith('--step='))?.split('=')[1];
    const all = args.includes('--all') || !stepArg;

    if (stepArg === '1') {
      const step1 = await scraper.scrapeStep1();
      const out = path.join(__dirname, 'udyam_step1_complete.json');
      await fs.writeFile(out, JSON.stringify(step1, null, 2));
      console.log(`💾 Data saved to: ${out}`);
    } else if (stepArg === '2') {
      const step2 = await scraper.scrapeStep2();
      const out = path.join(__dirname, 'udyam_step2_complete.json');
      await fs.writeFile(out, JSON.stringify(step2, null, 2));
      console.log(`💾 Data saved to: ${out}`);
    } else if (all) {
      console.log('🔄 Scraping all steps...');
      const step1 = await scraper.scrapeStep1();
      const step2 = await scraper.scrapeStep2();
      const allData = {
        metadata: {
          scrapedAt: new Date().toISOString(),
          source: 'https://udyamregistration.gov.in/UdyamRegistration.aspx',
          totalSteps: 2,
          totalFields: (step1?.length || 0) + (step2?.length || 0),
        },
        step1: { title: 'Aadhaar Verification', fields: step1 },
        step2: { title: 'PAN Verification', fields: step2 },
      };
      const out = path.join(__dirname, 'udyam_complete_schema.json');
      await fs.writeFile(out, JSON.stringify(allData, null, 2));
      console.log(`💾 Data saved to: ${out}`);
    }
  } catch (err) {
    console.error('❌ Scraping failed:', err?.message || err);
    process.exit(1);
  } finally {
    try { await scraper.browser?.close(); console.log('🔒 Browser closed'); } catch {}
  }
}

main();

export default UdyamScraper;
