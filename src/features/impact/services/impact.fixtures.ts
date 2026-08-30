import type { ImpactSummary } from "../model/impact";

/** Dados mockados (etapa offline). Formato = contrato do backend C# .NET. */
export const IMPACT_SUMMARY_MOCK: ImpactSummary = {
  totalWeightGrams: 14_300,
  totalValueInCents: 21_750,
  mealsDonated: 6,
  ordersCount: 12,
  streakDays: 4,
};
