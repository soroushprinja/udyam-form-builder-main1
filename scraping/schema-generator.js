import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SchemaGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '../src/schemas');
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  generateZodSchema(fields) {
    let schemaCode = 'import { z } from "zod";\n\n';
    
    // Generate field schemas
    const fieldSchemas = fields.map(field => {
      let fieldSchema = '';
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
          fieldSchema = `  ${field.key}: z.string()`;
          
          if (field.validation?.required) {
            fieldSchema += '.min(1, "This field is required")';
          }
          
          if (field.validation?.minlength) {
            fieldSchema += `.min(${field.validation.minlength}, "Must be at least ${field.validation.minlength} characters")`;
          }
          
          if (field.validation?.maxlength) {
            fieldSchema += `.max(${field.validation.maxlength}, "Must not exceed ${field.validation.maxlength} characters")`;
          }
          
          if (field.validation?.pattern) {
            fieldSchema += `.regex(/${field.validation.pattern}/, "${field.validation.message || 'Invalid format'}")`;
          }
          
          if (field.type === 'email') {
            fieldSchema += '.email("Please enter a valid email address")';
          }
          
          if (field.type === 'tel') {
            fieldSchema += '.regex(/^[6-9]\\d{9}$/, "Please enter a valid 10-digit mobile number")';
          }
          
          break;
          
        case 'select':
          if (field.options && field.options.length > 0) {
            const optionValues = field.options.map(opt => opt.value).filter(v => v !== '0');
            fieldSchema = `  ${field.key}: z.enum([${optionValues.map(v => `"${v}"`).join(', ')}], {
    required_error: "${field.validation?.message || 'Please select an option'}"
  })`;
          } else {
            fieldSchema = `  ${field.key}: z.string().min(1, "${field.validation?.message || 'This field is required'}")`;
          }
          break;
          
        case 'checkbox':
          fieldSchema = `  ${field.key}: z.boolean().refine(val => val === true, {
    message: "${field.validation?.message || 'You must provide consent to proceed'}"
  })`;
          break;
          
        case 'date':
          fieldSchema = `  ${field.key}: z.string().min(1, "${field.validation?.message || 'Date is required'}")`;
          break;
          
        default:
          fieldSchema = `  ${field.key}: z.string()`;
      }
      
      return fieldSchema;
    });
    
    schemaCode += 'export const formSchema = z.object({\n';
    schemaCode += fieldSchemas.join(',\n');
    schemaCode += '\n});\n\n';
    
    // Generate type export
    schemaCode += 'export type FormData = z.infer<typeof formSchema>;\n';
    
    return schemaCode;
  }

  generateReactFormComponent(stepData, stepNumber) {
    let componentCode = `import { UseFormReturn } from "react-hook-form";
import { FormData } from "../schemas/step${stepNumber}Schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step${stepNumber}Props {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  onPrevious?: () => void;
  formData?: FormData;
}

const Step${stepNumber} = ({ form, onSubmit, onPrevious, formData }: Step${stepNumber}Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

`;

    // Generate form fields
    stepData.fields.forEach(field => {
      if (field.type === 'checkbox') {
        componentCode += `  const ${field.key}Value = watch("${field.key}");\n`;
      }
    });
    
    componentCode += '\n  return (\n';
    componentCode += '    <div>\n';
    componentCode += `      {/* Form Header */}\n`;
    componentCode += `      <div className="form-header">\n`;
    componentCode += `        ${stepData.title}\n`;
    componentCode += `      </div>\n\n`;
    componentCode += `      {/* Form Content */}\n`;
    componentCode += `      <div className="form-content">\n`;
    componentCode += `        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">\n`;
    
    // Generate form fields
    stepData.fields.forEach(field => {
      if (field.type === 'submit') return; // Skip submit buttons for now
      
      componentCode += `          {/* ${field.label} */}\n`;
      componentCode += `          <div>\n`;
      componentCode += `            <Label className="form-field-label">\n`;
      componentCode += `              ${field.label}\n`;
      if (field.validation?.required) {
        componentCode += `              <span className="form-field-required">*</span>\n`;
      }
      componentCode += `            </Label>\n`;
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
        case 'date':
          componentCode += `            <Input\n`;
          componentCode += `              {...register("${field.key}")}\n`;
          if (field.type !== 'text') {
            componentCode += `              type="${field.type}"\n`;
          }
          if (field.placeholder) {
            componentCode += `              placeholder="${field.placeholder}"\n`;
          }
          if (field.validation?.maxlength) {
            componentCode += `              maxLength={${field.validation.maxlength}}\n`;
          }
          componentCode += `              className="form-field-input"\n`;
          componentCode += `            />\n`;
          break;
          
        case 'select':
          componentCode += `            <Select\n`;
          componentCode += `              value={watch("${field.key}")}\n`;
          componentCode += `              onValueChange={(value) => setValue("${field.key}", value)}\n`;
          componentCode += `            >\n`;
          componentCode += `              <SelectTrigger className="form-field-input">\n`;
          componentCode += `                <SelectValue placeholder="${field.placeholder || 'Select an option'}" />\n`;
          componentCode += `              </SelectTrigger>\n`;
          componentCode += `              <SelectContent>\n`;
          
          if (field.options) {
            field.options.forEach(option => {
              if (option.value !== '0') { // Skip placeholder options
                componentCode += `                <SelectItem value="${option.value}">${option.text}</SelectItem>\n`;
              }
            });
          }
          
          componentCode += `              </SelectContent>\n`;
          componentCode += `            </Select>\n`;
          break;
          
        case 'checkbox':
          componentCode += `            <div className="checkbox-container">\n`;
          componentCode += `              <Checkbox\n`;
          componentCode += `                id="${field.key}"\n`;
          componentCode += `                checked={${field.key}Value}\n`;
          componentCode += `                onCheckedChange={(checked) => setValue("${field.key}", !!checked)}\n`;
          componentCode += `                className="mt-0.5"\n`;
          componentCode += `              />\n`;
          componentCode += `              <Label htmlFor="${field.key}" className="checkbox-label">\n`;
          componentCode += `                <span>${field.label}</span>\n`;
          componentCode += `              </Label>\n`;
          componentCode += `            </div>\n`;
          break;
      }
      
      // Add error handling
      componentCode += `            {errors.${field.key} && (\n`;
      componentCode += `              <p className="form-field-error">{errors.${field.key}.message}</p>\n`;
      componentCode += `            )}\n`;
      
      componentCode += `          </div>\n\n`;
    });
    
    // Add navigation buttons
    if (stepNumber > 1) {
      componentCode += `          {/* Navigation Buttons */}\n`;
      componentCode += `          <div className="flex justify-between pt-6">\n`;
      componentCode += `            <Button\n`;
      componentCode += `              type="button"\n`;
      componentCode += `              onClick={onPrevious}\n`;
      componentCode += `              className="btn-secondary"\n`;
      componentCode += `            >\n`;
      componentCode += `              Previous Step\n`;
      componentCode += `            </Button>\n\n`;
      componentCode += `            <Button type="submit" className="btn-primary">\n`;
      componentCode += `              Continue to Next Step\n`;
      componentCode += `            </Button>\n`;
      componentCode += `          </div>\n`;
    } else {
      componentCode += `          {/* Submit Button */}\n`;
      componentCode += `          <div className="flex justify-end mt-6">\n`;
      componentCode += `            <Button type="submit" className="btn-primary">\n`;
      componentCode += `              Continue to Next Step\n`;
      componentCode += `            </Button>\n`;
      componentCode += `          </div>\n`;
    }
    
    componentCode += `        </form>\n`;
    componentCode += `      </div>\n`;
    componentCode += `    </div>\n`;
    componentCode += `  );\n`;
    componentCode += `};\n\n`;
    componentCode += `export default Step${stepNumber};\n`;
    
    return componentCode;
  }

  async generateSchemas(scrapedData) {
    await this.ensureOutputDir();
    
    console.log('🔧 Generating schemas and components...');
    
    // Generate schema for each step
    for (const [stepKey, stepData] of Object.entries(scrapedData)) {
      if (stepKey.startsWith('step')) {
        const stepNumber = stepKey.replace('step', '');
        
        // Generate Zod schema
        const schemaCode = this.generateZodSchema(stepData.fields);
        const schemaPath = path.join(this.outputDir, `step${stepNumber}Schema.ts`);
        await fs.writeFile(schemaPath, schemaCode);
        console.log(`✅ Generated schema: step${stepNumber}Schema.ts`);
        
        // Generate React component
        const componentCode = this.generateReactFormComponent(stepData, stepNumber);
        const componentPath = path.join(this.outputDir, `Step${stepNumber}.tsx`);
        await fs.writeFile(componentPath, componentCode);
        console.log(`✅ Generated component: Step${stepNumber}.tsx`);
      }
    }
    
    // Generate combined schema
    const combinedSchemaCode = this.generateCombinedSchema(scrapedData);
    const combinedSchemaPath = path.join(this.outputDir, 'combinedSchema.ts');
    await fs.writeFile(combinedSchemaPath, combinedSchemaCode);
    console.log(`✅ Generated combined schema: combinedSchema.ts`);
    
    console.log('🎉 Schema generation completed!');
  }

  generateCombinedSchema(scrapedData) {
    let code = 'import { z } from "zod";\n\n';
    
    // Import individual step schemas
    Object.keys(scrapedData).forEach(stepKey => {
      if (stepKey.startsWith('step')) {
        const stepNumber = stepKey.replace('step', '');
        code += `import { formSchema as step${stepNumber}Schema } from "./step${stepNumber}Schema";\n`;
      }
    });
    
    code += '\n// Combined form schema for all steps\n';
    code += 'export const combinedFormSchema = z.object({\n';
    
    Object.keys(scrapedData).forEach(stepKey => {
      if (stepKey.startsWith('step')) {
        const stepNumber = stepKey.replace('step', '');
        code += `  step${stepNumber}: step${stepNumber}Schema,\n`;
      }
    });
    
    code += '});\n\n';
    code += 'export type CombinedFormData = z.infer<typeof combinedFormSchema>;\n';
    
    return code;
  }
}

// Main execution
async function main() {
  try {
    // Read the scraped data
    const scrapedDataPath = path.join(__dirname, 'udyam_complete_schema.json');
    const scrapedData = JSON.parse(await fs.readFile(scrapedDataPath, 'utf-8'));
    
    const generator = new SchemaGenerator();
    await generator.generateSchemas(scrapedData);
    
  } catch (error) {
    console.error('❌ Schema generation failed:', error.message);
    process.exit(1);
  }
}

// Run
main();

export default SchemaGenerator;
