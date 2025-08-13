import { z } from "zod";

export const formSchema = z.object({

});

export type FormData = z.infer<typeof formSchema>;
