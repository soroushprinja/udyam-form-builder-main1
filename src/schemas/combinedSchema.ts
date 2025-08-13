import { z } from "zod";

import { formSchema as step1Schema } from "./step1Schema";
import { formSchema as step2Schema } from "./step2Schema";

// Combined form schema for all steps
export const combinedFormSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
});

export type CombinedFormData = z.infer<typeof combinedFormSchema>;
