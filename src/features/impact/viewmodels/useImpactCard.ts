import { formatCurrencyBRL, formatWeightKg } from "@/shared/utils";

import { levelFor } from "../model/impact";
import { useImpactSummaryQuery } from "../services/impactQueries";

/** Resumo curto do impacto para o card do Perfil. */
export function useImpactCard() {
  const query = useImpactSummaryQuery();
  const s = query.data;
  if (!s) return null;

  return {
    levelLabel: levelFor(s.totalWeightGrams).current.label,
    weightLabel: formatWeightKg(s.totalWeightGrams),
    valueLabel: formatCurrencyBRL(s.totalValueInCents),
    streakDays: s.streakDays,
  };
}
