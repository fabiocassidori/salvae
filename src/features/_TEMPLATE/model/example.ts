import { z } from "zod";

/** MODEL — schema é a fonte da verdade; o tipo é inferido dele. */
export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type Example = z.infer<typeof exampleSchema>;
export const exampleListSchema = z.array(exampleSchema);

/** Regra de domínio pura (exemplo). */
export function isNamed(example: Example): boolean {
  return example.name.trim().length > 0;
}
