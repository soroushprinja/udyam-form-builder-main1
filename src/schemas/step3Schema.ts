import { z } from "zod";

export const step3Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.enum(["manufacturing", "service", "trading"], {
    required_error: "Please select business type"
  }),
  businessCategory: z.string().min(1, "Please select business category"),
  businessAddress: z.string().min(10, "Address must be at least 10 characters"),
  businessCity: z.string().min(2, "City must be at least 2 characters"),
  businessState: z.string().min(1, "Please select state"),
  businessPincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  businessPhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  businessEmail: z.string().email("Please enter a valid email address"),
  businessWebsite: z.string().url().optional().or(z.literal("")),
  businessDescription: z.string().min(20, "Description must be at least 20 characters"),
  investmentInPlant: z.number().min(0, "Investment cannot be negative"),
  investmentInEquipment: z.number().min(0, "Investment cannot be negative"),
  totalInvestment: z.number().min(0, "Total investment cannot be negative"),
  employmentGenerated: z.number().min(0, "Employment count cannot be negative"),
  dateOfCommencement: z.string().min(1, "Date of commencement is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please enter a valid GSTIN").optional().or(z.literal("")),
  udyogAadhaar: z.string().min(1, "Udyog Aadhaar is required"),
  emIID: z.string().min(1, "EM-II ID is required"),
  bankAccountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  bankBranch: z.string().min(2, "Branch name must be at least 2 characters"),
  bankIFSCCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"),
  bankAccountType: z.enum(["savings", "current", "overdraft"], {
    required_error: "Please select account type"
  }),
  nomineeName: z.string().min(2, "Nominee name must be at least 2 characters"),
  nomineeRelationship: z.string().min(1, "Please select relationship"),
  nomineeAddress: z.string().min(10, "Nominee address must be at least 10 characters"),
  nomineePhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  nomineeEmail: z.string().email("Please enter a valid email address"),
  nomineePAN: z.string().length(10, "PAN must be 10 characters").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"),
  nomineeAadhaar: z.string().length(12, "Aadhaar must be 12 digits").regex(/^\d+$/, "Aadhaar must contain only digits"),
  nomineeConsent: z.boolean().refine(val => val === true, {
    message: "You must provide nominee consent to proceed"
  })
});

export type Step3Data = z.infer<typeof step3Schema>;
