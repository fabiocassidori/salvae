import { z } from "zod";

/** Selos de nível do "Salvador" (contexto-negocio §1). */
export const impactLevelSchema = z.enum(["BRONZE", "SILVER", "GOLD"]);
export type ImpactLevel = z.infer<typeof impactLevelSchema>;

export const impactSummarySchema = z.object({
  /** Massa de comida evitada de virar lixo (acumulada). */
  totalWeightGrams: z.number().int().nonnegative(),
  /** "Impacto Salvo" monetário acumulado. */
  totalValueInCents: z.number().int().nonnegative(),
  /** Refeições doadas via "Compre 1, Salve 1" e doações diretas. */
  mealsDonated: z.number().int().nonnegative(),
  ordersCount: z.number().int().nonnegative(),
  /** "Salvaê Streak": dias seguidos ajudando a salvar comida. */
  streakDays: z.number().int().nonnegative(),
});
export type ImpactSummary = z.infer<typeof impactSummarySchema>;

/** ~2,5 kg de CO2e evitados por kg de comida resgatada (proxy). */
export const CO2E_PER_KG = 2.5;

const LEVELS: { level: ImpactLevel; minKg: number; label: string }[] = [
  { level: "BRONZE", minKg: 0, label: "Salvador Bronze" },
  { level: "SILVER", minKg: 10, label: "Salvador Prata" },
  { level: "GOLD", minKg: 50, label: "Salvador Ouro" },
];

export function levelFor(totalWeightGrams: number): {
  current: { level: ImpactLevel; label: string };
  next: { level: ImpactLevel; label: string; remainingKg: number } | null;
  progress: number;
} {
  const kg = totalWeightGrams / 1000;
  let currentIndex = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (kg >= LEVELS[i].minKg) currentIndex = i;
  }
  const current = LEVELS[currentIndex];
  const next = LEVELS[currentIndex + 1] ?? null;

  if (!next) {
    return { current: { level: current.level, label: current.label }, next: null, progress: 1 };
  }

  const span = next.minKg - current.minKg;
  const done = Math.min(span, kg - current.minKg);
  return {
    current: { level: current.level, label: current.label },
    next: {
      level: next.level,
      label: next.label,
      remainingKg: Math.max(0, next.minKg - kg),
    },
    progress: span === 0 ? 1 : done / span,
  };
}

export function co2eKgAvoided(totalWeightGrams: number): number {
  return (totalWeightGrams / 1000) * CO2E_PER_KG;
}
