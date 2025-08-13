import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeMeta(meta) {
  if (!meta) return {};
  return {
    scraped_at: meta.scraped_at || meta.scrapedAt,
    source: meta.source,
    total_steps: meta.total_steps || meta.totalSteps,
    total_fields: meta.total_fields || meta.totalFields,
  };
}


class DataValidator {
  constructor() {
    this.validationErrors = [];
    this.validationWarnings = [];
  }

  async validateScrapedData(data) {
    console.log('🔍 Validating scraped data...');
    
    // Validate metadata
    this.validateMetadata(data.metadata);
    
    // Validate each step
    if (data.step1) {
      this.validateStep(data.step1, 'Step 1');
    }
    
    if (data.step2) {
      this.validateStep(data.step2, 'Step 2');
    }
    
    // Validate overall structure
    this.validateOverallStructure(data);
    
    // Report results
    this.reportValidationResults();
    
    return this.validationErrors.length === 0;
  }

  validateMetadata(metadata) {
    const meta = normalizeMeta(metadata);
    if (!meta.scraped_at || !meta.source || !meta.total_steps || !meta.total_fields) {
      this.addError('Missing required metadata fields');
      return;
    }
    if (meta.source && !meta.source.includes('udyamregistration.gov.in')) {
      this.addWarning('Source URL may not be the official Udyam portal');
    }
    if (meta.total_fields && meta.total_fields < 5) {
      this.addWarning('Total field count seems low - may have missed some fields');
    }
  }

  validateStep(step, stepName) {
    if (!step.fields || !Array.isArray(step.fields)) {
      this.addError(`${stepName}: Missing or invalid fields array`);
      return;
    }

    if (step.fields.length === 0) {
      if (stepName === 'Step 2') {
        this.addWarning(`${stepName}: No fields found (likely gated behind OTP)`);
      } else {
        this.addError(`${stepName}: No fields found`);
      }
      return;
    }

    // Validate each field
    step.fields.forEach((field, index) => {
      this.validateField(field, stepName, index);
    });

    // Check for required field types based on step
    this.validateStepRequirements(step, stepName);
  }

  validateField(field, stepName, index) {
    const requiredFieldProps = ['key', 'label', 'type'];
    requiredFieldProps.forEach(prop => {
      if (!field[prop]) {
        this.addError(`${stepName} Field ${index}: Missing required property '${prop}'`);
      }
    });

    // Validate field key format
    if (field.key && !/^[a-z_][a-z0-9_]*$/i.test(field.key)) {
      this.addWarning(`${stepName} Field ${index}: Field key '${field.key}' may not be valid JavaScript identifier`);
    }

    // Validate field type
    const validTypes = ['text', 'email', 'tel', 'select', 'checkbox', 'radio', 'date', 'submit', 'button'];
    if (field.type && !validTypes.includes(field.type)) {
      this.addWarning(`${stepName} Field ${index}: Unknown field type '${field.type}'`);
    }

    // Validate validation rules
    if (field.validation) {
      this.validateFieldValidation(field.validation, stepName, index);
    }

    // Validate select options
    if (field.type === 'select' && field.options) {
      this.validateSelectOptions(field.options, stepName, index);
    }
  }

  validateFieldValidation(validation, stepName, index) {
    if (validation.required && typeof validation.required !== 'boolean') {
      this.addError(`${stepName} Field ${index}: Validation 'required' must be boolean`);
    }

    if (validation.minlength && (typeof validation.minlength !== 'number' || validation.minlength < 0)) {
      this.addError(`${stepName} Field ${index}: Validation 'minlength' must be positive number`);
    }

    if (validation.maxlength && (typeof validation.maxlength !== 'number' || validation.maxlength < 0)) {
      this.addError(`${stepName} Field ${index}: Validation 'maxlength' must be positive number`);
    }

    if (validation.minlength && validation.maxlength && validation.minlength > validation.maxlength) {
      this.addError(`${stepName} Field ${index}: Validation 'minlength' cannot be greater than 'maxlength'`);
    }

    if (validation.pattern && !(validation.pattern instanceof RegExp || typeof validation.pattern === 'string')) {
      this.addError(`${stepName} Field ${index}: Validation 'pattern' must be string or RegExp`);
    }
  }

  validateSelectOptions(options, stepName, index) {
    if (!Array.isArray(options)) {
      this.addError(`${stepName} Field ${index}: Options must be an array`);
      return;
    }

    options.forEach((option, optIndex) => {
      if (!option.value && !option.text) {
        this.addWarning(`${stepName} Field ${index} Option ${optIndex}: Missing both value and text`);
      }
    });
  }

  validateStepRequirements(step, stepName) {
    if (stepName === 'Step 1') {
      // Step 1 should have Aadhaar-related fields
      const hasAadhaarField = step.fields.some(f => 
        f.key.includes('aadhaar') || f.label.toLowerCase().includes('aadhaar')
      );
      
      if (!hasAadhaarField) {
        this.addWarning(`${stepName}: No Aadhaar-related fields found`);
      }

      const hasConsentField = step.fields.some(f => f.type === 'checkbox');
      if (!hasConsentField) {
        this.addWarning(`${stepName}: No consent checkbox found`);
      }
    }

    if (stepName === 'Step 2') {
      // Step 2 should have PAN-related fields
      const hasPanField = step.fields.some(f => 
        f.key.includes('pan') || f.label.toLowerCase().includes('pan')
      );
      
      if (!hasPanField) {
        this.addWarning(`${stepName}: No PAN-related fields found`);
      }

      const hasOrgTypeField = step.fields.some(f => f.type === 'select');
      if (!hasOrgTypeField) {
        this.addWarning(`${stepName}: No organisation type dropdown found`);
      }
    }
  }

  validateOverallStructure(data) {
    // Check if we have both steps
    if (!data.step1 && !data.step2) {
      this.addError('No steps found in data');
    }

    // Check for duplicate field keys across steps
    const allKeys = [];
    [data.step1, data.step2].forEach(step => {
      if (step && step.fields) {
        step.fields.forEach(field => {
          if (field.key) {
            if (allKeys.includes(field.key)) {
              this.addWarning(`Duplicate field key found: ${field.key}`);
            } else {
              allKeys.push(field.key);
            }
          }
        });
      }
    });
  }

  addError(message) {
    this.validationErrors.push(message);
  }

  addWarning(message) {
    this.validationWarnings.push(message);
  }

  reportValidationResults() {
    console.log('\n📊 Validation Results:');
    console.log('='.repeat(50));
    
    if (this.validationErrors.length === 0) {
      console.log('✅ No validation errors found!');
    } else {
      console.log(`❌ Found ${this.validationErrors.length} validation errors:`);
      this.validationErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (this.validationWarnings.length > 0) {
      console.log(`⚠️  Found ${this.validationWarnings.length} validation warnings:`);
      this.validationWarnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
    
    console.log('='.repeat(50));
    
    if (this.validationErrors.length === 0) {
      console.log('🎉 Data validation passed! The scraped data is ready for use.');
    } else {
      console.log('🔧 Please fix the validation errors before proceeding.');
    }
  }

  async validateFile(filename) {
    try {
      const filePath = path.join(__dirname, filename);
      const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      return await this.validateScrapedData(data);
    } catch (error) {
      console.error(`❌ Error reading file ${filename}:`, error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  const validator = new DataValidator();
  
  // Check command line arguments
  const args = process.argv.slice(2);
  const filename = args[0] || 'udyam_complete_schema.json';
  
  console.log(`🔍 Validating file: ${filename}`);
  
  const isValid = await validator.validateFile(filename);
  
  if (isValid) {
    console.log('\n✅ Validation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Validation failed!');
    process.exit(1);
  }
}

// Run
main();

export default DataValidator;
