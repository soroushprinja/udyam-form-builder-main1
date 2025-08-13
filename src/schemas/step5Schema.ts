import { z } from "zod";

export const step5Schema = z.object({
  // Final Review
  reviewAllSteps: z.boolean().refine(val => val === true, {
    message: "Please review all steps before final submission"
  }),
  
  // Additional Information
  specialRequirements: z.string().optional(),
  additionalDocuments: z.array(z.string()).optional(),
  notes: z.string().optional(),
  
  // Contact Preferences
  preferredContactMethod: z.enum(["email", "phone", "sms"], {
    required_error: "Please select preferred contact method"
  }),
  preferredContactTime: z.enum(["morning", "afternoon", "evening"], {
    required_error: "Please select preferred contact time"
  }),
  
  // Marketing Consent
  marketingConsent: z.boolean().default(false),
  newsletterSubscription: z.boolean().default(false),
  
  // Final Declaration
  finalDeclaration: z.boolean().refine(val => val === true, {
    message: "You must accept the final declaration to submit"
  }),
  
  // Captcha/Verification
  captchaVerified: z.boolean().refine(val => val === true, {
    message: "Please complete the verification"
  }),
  
  // Submission Method
  submissionMethod: z.enum(["online", "offline"], {
    required_error: "Please select submission method"
  }),
  
  // Payment Information (if applicable)
  paymentMethod: z.enum(["online", "offline", "free"], {
    required_error: "Please select payment method"
  }),
  paymentStatus: z.enum(["pending", "completed", "failed"], {
    required_error: "Payment status is required"
  }),
  
  // Acknowledgement
  acknowledgementReceived: z.boolean().default(false),
  acknowledgementNumber: z.string().optional(),
  
  // Tracking
  applicationStatus: z.enum(["draft", "submitted", "under_review", "approved", "rejected"], {
    required_error: "Application status is required"
  }),
  trackingNumber: z.string().optional(),
  
  // Timestamps
  submittedAt: z.string().optional(),
  lastModifiedAt: z.string().optional()
});

export type Step5Data = z.infer<typeof step5Schema>;
