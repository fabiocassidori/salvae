import { useMemo } from "react";

import { useExamplesQuery } from "../services/exampleQueries";

/** VIEWMODEL — estado de apresentação + ações para a View. Sem JSX. */
export function useExampleListViewModel() {
  const query = useExamplesQuery();
  const items = useMemo(
    () => (query.data ?? []).map((e) => ({ id: e.id, label: e.name })),
    [query.data],
  );
  return { items, isLoading: query.isPending, hasError: query.isError, refresh: query.refetch };
}
