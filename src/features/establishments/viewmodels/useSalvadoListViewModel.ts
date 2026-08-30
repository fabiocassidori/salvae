import { useMemo } from "react";

import { useFeedQuery } from "../services/establishmentsQueries";
import { toOfferCardModel } from "./salvadoPresenter";

type Params = {
  onOpenSalvado: (salvadoId: string) => void;
};

/** VIEWMODEL da lista completa "Ver tudo" de Salvados. */
export function useSalvadoListViewModel({ onOpenSalvado }: Params) {
  const query = useFeedQuery();
  const offers = useMemo(() => (query.data ?? []).map(toOfferCardModel), [query.data]);

  return {
    offers,
    isLoading: query.isPending,
    isRefreshing: query.isRefetching,
    hasError: query.isError,
    refresh: query.refetch,
    onOpenSalvado,
  };
}
