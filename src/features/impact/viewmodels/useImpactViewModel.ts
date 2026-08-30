import { formatCurrencyBRL, formatWeightKg } from "@/shared/utils";

import { co2eKgAvoided, levelFor } from "../model/impact";
import { useImpactSummaryQuery } from "../services/impactQueries";

/** VIEWMODEL da tela "Meu Impacto" (gamificação). */
export function useImpactViewModel() {
  const query = useImpactSummaryQuery();
  const s = query.data;

  if (!s) {
    return { isLoading: query.isPending, hasError: query.isError, model: null } as const;
  }

  const level = levelFor(s.totalWeightGrams);

  return {
    isLoading: false,
    hasError: query.isError,
    model: {
      levelLabel: level.current.label,
      nextLevelLabel: level.next?.label ?? null,
      nextLevelRemaining: level.next
        ? `Faltam ${level.next.remainingKg.toLocaleString("pt-BR", {
            maximumFractionDigits: 1,
          })} kg para ${level.next.label}`
        : "Nível máximo alcançado",
      progress: level.progress,
      streakLabel:
        s.streakDays > 0
          ? `${s.streakDays} dias seguidos salvando comida`
          : "Comece sua sequência hoje",
      stats: [
        { key: "weight", label: "Comida resgatada", value: formatWeightKg(s.totalWeightGrams) },
        { key: "value", label: "Impacto salvo", value: formatCurrencyBRL(s.totalValueInCents) },
        {
          key: "co2",
          label: "CO₂e evitado",
          value: `${co2eKgAvoided(s.totalWeightGrams).toLocaleString("pt-BR", {
            maximumFractionDigits: 1,
          })} kg`,
        },
        { key: "meals", label: "Refeições doadas", value: String(s.mealsDonated) },
        { key: "orders", label: "Pedidos", value: String(s.ordersCount) },
      ],
    },
  } as const;
}
