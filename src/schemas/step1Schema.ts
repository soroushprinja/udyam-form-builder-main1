import { z } from "zod";

export const formSchema = z.object({
  aadhaar_number: z.string().regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
  entrepreneur_name: z.string().regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  aadhaar_consent: z.boolean().refine(val => val === true, {
    message: "You must provide consent to proceed"
  }),
  ctl00_contentplaceholder1_btnvalidateaadhaar: z.string(),
  checkbox: z.boolean().refine(val => val === true, {
    message: "You must provide consent to proceed"
  })
});

export type FormData = z.infer<typeof formSchema>;
