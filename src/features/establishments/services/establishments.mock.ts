import { mockResponse } from "@/shared/lib";

import type { ExploreFilters } from "../model/filters";
import {
  isOfferOpen,
  salvadoFeedSchema,
  salvadoWithEstablishmentSchema,
  type SalvadoWithEstablishment,
} from "../model/salvado";
import { establishmentListSchema, establishmentSchema } from "../model/establishment";
import type { EstablishmentsRepository } from "./establishments.contract";
import { ESTABLISHMENTS_MOCK } from "./establishments.fixtures";
import { SALVADOS_MOCK } from "./salvados.fixtures";

function joinAll(): SalvadoWithEstablishment[] {
  return SALVADOS_MOCK.map((salvado) => {
    const establishment = ESTABLISHMENTS_MOCK.find((e) => e.id === salvado.establishmentId);
    if (!establishment) {
      throw new Error(`Estabelecimento ausente para o Salvado ${salvado.id}`);
    }
    return { salvado, establishment };
  });
}

/** Implementação MOCK do repositório (fixtures em memória + validação Zod). */
export const establishmentsMock: EstablishmentsRepository = {
  async getFeed() {
    const list = joinAll()
      .filter((x) => isOfferOpen(x.salvado))
      .sort((a, b) => a.establishment.distanceMeters - b.establishment.distanceMeters);
    return mockResponse(salvadoFeedSchema.parse(list));
  },

  async searchSalvados(filters: ExploreFilters) {
    const term = filters.term.trim().toLowerCase();
    const list = joinAll()
      .filter((x) => isOfferOpen(x.salvado))
      .filter((x) =>
        term
          ? x.salvado.name.toLowerCase().includes(term) ||
            x.establishment.name.toLowerCase().includes(term)
          : true,
      )
      .filter((x) => (filters.category ? x.salvado.category === filters.category : true))
      .sort((a, b) => {
        if (filters.sort === "LOWEST_PRICE") {
          return a.salvado.priceInCents - b.salvado.priceInCents;
        }
        if (filters.sort === "ENDING_SOON") {
          return (
            new Date(a.salvado.offerExpiresAt).getTime() -
            new Date(b.salvado.offerExpiresAt).getTime()
          );
        }
        return a.establishment.distanceMeters - b.establishment.distanceMeters;
      });
    return mockResponse(salvadoFeedSchema.parse(list));
  },

  async getSalvadoById(id: string) {
    const salvado = SALVADOS_MOCK.find((s) => s.id === id);
    if (!salvado) throw new Error(`Salvado não encontrado: ${id}`);
    const establishment = ESTABLISHMENTS_MOCK.find((e) => e.id === salvado.establishmentId);
    if (!establishment) throw new Error(`Estabelecimento ausente para o Salvado ${id}`);
    return mockResponse(salvadoWithEstablishmentSchema.parse({ salvado, establishment }));
  },

  async getSalvadosByEstablishment(establishmentId: string) {
    const list = joinAll().filter(
      (x) => x.establishment.id === establishmentId && isOfferOpen(x.salvado),
    );
    return mockResponse(salvadoFeedSchema.parse(list));
  },

  async getEstablishments() {
    return mockResponse(establishmentListSchema.parse(ESTABLISHMENTS_MOCK));
  },

  async getEstablishmentById(id: string) {
    const found = ESTABLISHMENTS_MOCK.find((e) => e.id === id);
    if (!found) throw new Error(`Estabelecimento não encontrado: ${id}`);
    return mockResponse(establishmentSchema.parse(found));
  },
};
