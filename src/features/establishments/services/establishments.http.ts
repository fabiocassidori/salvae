import { httpClient } from "@/shared/api";

import { establishmentListSchema, establishmentSchema } from "../model/establishment";
import type { ExploreFilters } from "../model/filters";
import { salvadoFeedSchema, salvadoWithEstablishmentSchema } from "../model/salvado";
import type { EstablishmentsRepository } from "./establishments.contract";

/**
 * Implementação HTTP do repositório — forma final das chamadas ao backend
 * C# .NET (endpoint + `schema.parse` na borda). Ativada com
 * `EXPO_PUBLIC_DATA_SOURCE=http`. Os paths abaixo são a proposta de rotas;
 * ajuste conforme a API real quando ela existir.
 */
export const establishmentsHttp: EstablishmentsRepository = {
  async getFeed() {
    const { data } = await httpClient.get("/salvados/feed");
    return salvadoFeedSchema.parse(data);
  },

  async searchSalvados(filters: ExploreFilters) {
    const { data } = await httpClient.get("/salvados", {
      params: {
        q: filters.term || undefined,
        category: filters.category ?? undefined,
        sort: filters.sort,
      },
    });
    return salvadoFeedSchema.parse(data);
  },

  async getSalvadoById(id: string) {
    const { data } = await httpClient.get(`/salvados/${id}`);
    return salvadoWithEstablishmentSchema.parse(data);
  },

  async getSalvadosByEstablishment(establishmentId: string) {
    const { data } = await httpClient.get(`/estabelecimentos/${establishmentId}/salvados`);
    return salvadoFeedSchema.parse(data);
  },

  async getEstablishments() {
    const { data } = await httpClient.get("/estabelecimentos");
    return establishmentListSchema.parse(data);
  },

  async getEstablishmentById(id: string) {
    const { data } = await httpClient.get(`/estabelecimentos/${id}`);
    return establishmentSchema.parse(data);
  },
};
