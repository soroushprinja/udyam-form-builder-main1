import { z } from "zod";

export const step4Schema = z.object({
  // Additional Business Details
  businessRegistrationType: z.enum(["proprietorship", "partnership", "company", "llp", "huf", "cooperative", "society", "trust"], {
    required_error: "Please select business registration type"
  }),
  businessRegistrationNumber: z.string().min(1, "Registration number is required"),
  businessRegistrationDate: z.string().min(1, "Registration date is required"),
  businessRegistrationAuthority: z.string().min(1, "Registration authority is required"),
  
  // Financial Details
  annualTurnover: z.number().min(0, "Annual turnover cannot be negative"),
  exportTurnover: z.number().min(0, "Export turnover cannot be negative"),
  importTurnover: z.number().min(0, "Import turnover cannot be negative"),
  
  // Manufacturing Details
  manufacturingCapacity: z.string().optional(),
  manufacturingUnits: z.number().min(0, "Manufacturing units cannot be negative"),
  qualityCertifications: z.array(z.string()).optional(),
  
  // Service Details
  serviceCategories: z.array(z.string()).optional(),
  serviceStandards: z.array(z.string()).optional(),
  
  // Trading Details
  tradingCategories: z.array(z.string()).optional(),
  tradingLicenses: z.array(z.string()).optional(),
  
  // Compliance
  msmeCertificates: z.array(z.string()).optional(),
  isoCertifications: z.array(z.string()).optional(),
  otherCertifications: z.array(z.string()).optional(),
  
  // Documents
  businessPlan: z.string().optional(),
  financialStatements: z.string().optional(),
  taxReturns: z.string().optional(),
  
  // Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: "You must accept the declaration to proceed"
  }),
  termsAndConditions: z.boolean().refine(val => val === true, {
    message: "You must accept terms and conditions to proceed"
  })
});

export type Step4Data = z.infer<typeof step4Schema>;
