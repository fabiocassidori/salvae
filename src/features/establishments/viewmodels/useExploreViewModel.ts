import { useMemo, useState } from "react";

import { DEFAULT_FILTERS, SORT_OPTIONS, sortOptionLabel } from "../model/filters";
import type { ExploreFilters } from "../model/filters";
import { useSearchSalvadosQuery } from "../services/establishmentsQueries";
import { toOfferCardModel } from "./salvadoPresenter";

type Params = {
  onOpenSalvado: (salvadoId: string) => void;
};

/** VIEWMODEL da tela Explorar (busca + filtros + ordenação). */
export function useExploreViewModel({ onOpenSalvado }: Params) {
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);
  const query = useSearchSalvadosQuery(filters);

  const offers = useMemo(() => (query.data ?? []).map(toOfferCardModel), [query.data]);

  return {
    term: filters.term,
    onChangeTerm: (term: string) => setFilters((f) => ({ ...f, term })),
    sortChips: SORT_OPTIONS.map((value) => ({
      value,
      label: sortOptionLabel[value],
      selected: filters.sort === value,
    })),
    selectSort: (sort: ExploreFilters["sort"]) => setFilters((f) => ({ ...f, sort })),
    offers,
    resultCount: offers.length,
    isLoading: query.isPending,
    hasError: query.isError,
    onOpenSalvado,
  };
}
