import type { Establishment } from "../model/establishment";
import type { ExploreFilters } from "../model/filters";
import type { SalvadoWithEstablishment } from "../model/salvado";

/**
 * Contrato da camada de repositório da fatia `establishments`.
 *
 * É a fronteira única entre as ViewModels/queries e a origem dos dados. Tanto a
 * implementação `mock` quanto a `http` satisfazem este tipo — trocar de fonte
 * (`EXPO_PUBLIC_DATA_SOURCE`) não altera nenhuma assinatura.
 *
 * Este tipo é também o contrato esperado do backend C# .NET.
 */
export type EstablishmentsRepository = {
  /** Feed da Home: Salvados com oferta aberta, ordenados por proximidade. */
  getFeed(): Promise<SalvadoWithEstablishment[]>;
  /** Busca da tela Explorar. */
  searchSalvados(filters: ExploreFilters): Promise<SalvadoWithEstablishment[]>;
  getSalvadoById(id: string): Promise<SalvadoWithEstablishment>;
  getSalvadosByEstablishment(establishmentId: string): Promise<SalvadoWithEstablishment[]>;
  getEstablishments(): Promise<Establishment[]>;
  getEstablishmentById(id: string): Promise<Establishment>;
};
