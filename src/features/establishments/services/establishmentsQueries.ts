import { useQuery } from "@tanstack/react-query";

import type { ExploreFilters } from "../model/filters";
import { establishmentsRepository } from "./establishmentsRepository";

/** Key factory da fatia `establishments` (Salvados + parceiros). */
export const establishmentsKeys = {
  all: ["establishments"] as const,
  feed: () => [...establishmentsKeys.all, "feed"] as const,
  search: (filters: ExploreFilters) => [...establishmentsKeys.all, "search", filters] as const,
  salvado: (id: string) => [...establishmentsKeys.all, "salvado", id] as const,
  establishment: (id: string) => [...establishmentsKeys.all, "establishment", id] as const,
  establishmentSalvados: (id: string) =>
    [...establishmentsKeys.all, "establishment", id, "salvados"] as const,
};

export function useFeedQuery() {
  return useQuery({
    queryKey: establishmentsKeys.feed(),
    queryFn: () => establishmentsRepository.getFeed(),
  });
}

export function useSearchSalvadosQuery(filters: ExploreFilters) {
  return useQuery({
    queryKey: establishmentsKeys.search(filters),
    queryFn: () => establishmentsRepository.searchSalvados(filters),
  });
}

export function useSalvadoQuery(id: string) {
  return useQuery({
    queryKey: establishmentsKeys.salvado(id),
    queryFn: () => establishmentsRepository.getSalvadoById(id),
    enabled: Boolean(id),
  });
}

export function useEstablishmentQuery(id: string) {
  return useQuery({
    queryKey: establishmentsKeys.establishment(id),
    queryFn: () => establishmentsRepository.getEstablishmentById(id),
    enabled: Boolean(id),
  });
}

export function useEstablishmentSalvadosQuery(id: string) {
  return useQuery({
    queryKey: establishmentsKeys.establishmentSalvados(id),
    queryFn: () => establishmentsRepository.getSalvadosByEstablishment(id),
    enabled: Boolean(id),
  });
}
