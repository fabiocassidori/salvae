// API pública da fatia `impact` (gamificação: Impacto Salvo, níveis, streak).
export { ImpactScreen } from "./views/screens/ImpactScreen";
export { useImpactCard } from "./viewmodels/useImpactCard";
export { useImpactSummaryQuery } from "./services/impactQueries";
export type { ImpactSummary, ImpactLevel } from "./model/impact";
export { levelFor, co2eKgAvoided } from "./model/impact";
