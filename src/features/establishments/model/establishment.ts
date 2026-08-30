import { z } from "zod";

/**
 * MODEL — Estabelecimento parceiro (glossário: nunca "loja"/"vendedor").
 * Schema Zod é a fonte da verdade e serve de contrato para o backend C# .NET.
 */
export const establishmentCategorySchema = z.enum([
  "BAKERY",
  "GROCERY",
  "PRODUCE",
  "RESTAURANT",
  "BUTCHER",
  "PHARMACY",
]);
export type EstablishmentCategory = z.infer<typeof establishmentCategorySchema>;

export const establishmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: establishmentCategorySchema,
  logoUrl: z.string().url().nullable(),
  coverUrl: z.string().url().nullable(),
  addressLine: z.string(),
  distanceMeters: z.number().int().nonnegative(),
  /** Avaliação geral do parceiro. */
  rating: z.number().min(0).max(5),
  /** Avaliação específica de "segurança do produto" (contexto-negocio §3). */
  safetyRating: z.number().min(0).max(5),
  isVerifiedPartner: z.boolean(),
});
export type Establishment = z.infer<typeof establishmentSchema>;

export const establishmentListSchema = z.array(establishmentSchema);

// ─── Regras de domínio puras ─────────────────────────────────────────────────

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
}

export const establishmentCategoryLabel: Record<EstablishmentCategory, string> = {
  BAKERY: "Padaria",
  GROCERY: "Mercado",
  PRODUCE: "Hortifruti",
  RESTAURANT: "Restaurante",
  BUTCHER: "Açougue",
  PHARMACY: "Farmácia",
};
