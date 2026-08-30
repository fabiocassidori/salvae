import { z } from "zod";

import { establishmentSchema } from "./establishment";

/**
 * MODEL — "Salvado": item resgatado, próximo do vencimento mas próprio para
 * consumo (glossário: nunca "sobra"/"resto"/"produto quase vencido").
 */
export const salvadoCategorySchema = z.enum([
  "HOT_MEAL",
  "BAKERY",
  "GROCERY",
  "PRODUCE",
  "DAIRY",
  "SWEETS",
]);
export type SalvadoCategory = z.infer<typeof salvadoCategorySchema>;

/** REGULAR = conteúdo conhecido; SURPRISE_BAG = "Caixa Surpresa" (contexto-negocio §2.1). */
export const salvadoKindSchema = z.enum(["REGULAR", "SURPRISE_BAG"]);
export type SalvadoKind = z.infer<typeof salvadoKindSchema>;

/** Janela de retirada: intervalo para retirar/receber o Salvado. */
export const pickupWindowSchema = z.object({
  /** ISO date, ex.: "2026-08-30". */
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  /** Texto pronto, ex.: "Retirar hoje, 18:00 - 19:30". */
  label: z.string(),
});
export type PickupWindow = z.infer<typeof pickupWindowSchema>;

/** Selo Salvaê de Segurança — obrigatório em todo Salvado. */
export const safetySealSchema = z.object({
  availability: z.string(),
  conservation: z.string(),
  responsible: z.string(),
  /** "consumir em até Nh após a retirada" (comida quente); null quando não se aplica. */
  consumeWithinHours: z.number().int().positive().nullable(),
});
export type SafetySealInfo = z.infer<typeof safetySealSchema>;

export const salvadoSchema = z.object({
  id: z.string(),
  establishmentId: z.string(),
  name: z.string(),
  description: z.string().default(""),
  imageUrl: z.string().url(),
  category: salvadoCategorySchema,
  kind: salvadoKindSchema,
  originalPriceInCents: z.number().int().nonnegative(),
  priceInCents: z.number().int().nonnegative(),
  /** Peso do Salvado — base do "Impacto Salvo" em kg. */
  weightGrams: z.number().int().positive(),
  quantityAvailable: z.number().int().nonnegative(),
  publishedAt: z.string(),
  /** Janela de Salvamento: instante em que a OFERTA expira. */
  offerExpiresAt: z.string(),
  pickupWindow: pickupWindowSchema,
  safetySeal: safetySealSchema,
  /** Aprovado nos critérios de segurança do produto. */
  isSafe: z.boolean(),
});
export type Salvado = z.infer<typeof salvadoSchema>;
export const salvadoListSchema = z.array(salvadoSchema);

/** Salvado já combinado com o estabelecimento — forma consumida pelas telas. */
export const salvadoWithEstablishmentSchema = z.object({
  salvado: salvadoSchema,
  establishment: establishmentSchema,
});
export type SalvadoWithEstablishment = z.infer<typeof salvadoWithEstablishmentSchema>;
export const salvadoFeedSchema = z.array(salvadoWithEstablishmentSchema);

// ─── Regras de domínio puras ─────────────────────────────────────────────────

/** "Impacto Salvo" monetário = preço original − preço atual. */
export function impactValueInCents(
  s: Pick<Salvado, "originalPriceInCents" | "priceInCents">,
): number {
  return Math.max(0, s.originalPriceInCents - s.priceInCents);
}

/** "Impacto Salvo" em massa de comida (g) evitada de virar lixo, por unidade. */
export function impactWeightGrams(s: Pick<Salvado, "weightGrams">, quantity = 1): number {
  return s.weightGrams * quantity;
}

export function discountPercent(s: Pick<Salvado, "originalPriceInCents" | "priceInCents">): number {
  if (s.originalPriceInCents === 0) return 0;
  return Math.round((1 - s.priceInCents / s.originalPriceInCents) * 100);
}

export function isOfferOpen(s: Salvado, nowMs: number = Date.now()): boolean {
  return new Date(s.offerExpiresAt).getTime() > nowMs && s.quantityAvailable > 0;
}

export const salvadoCategoryLabel: Record<SalvadoCategory, string> = {
  HOT_MEAL: "Salvados Quentes",
  BAKERY: "Padaria",
  GROCERY: "Mercado",
  PRODUCE: "Hortifruti",
  DAIRY: "Laticínios",
  SWEETS: "Doces",
};
