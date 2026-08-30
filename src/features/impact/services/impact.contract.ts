import type { ImpactSummary } from "../model/impact";

/** Contrato do repositório de Impacto Salvo (= contrato do backend C# .NET). */
export type ImpactRepository = {
  getSummary(): Promise<ImpactSummary>;
};
