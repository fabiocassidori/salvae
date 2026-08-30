import { useMemo } from "react";

import { useOrdersQuery } from "../services/ordersQueries";
import { toOrderListItem } from "./orderPresenter";

type Params = {
  onOpenOrder: (orderId: string) => void;
  onExplore: () => void;
};

/** VIEWMODEL de "Meus Pedidos" (ativos + histórico). */
export function useOrderListViewModel({ onOpenOrder, onExplore }: Params) {
  const query = useOrdersQuery();

  const { active, history } = useMemo(() => {
    const items = (query.data ?? []).map(toOrderListItem);
    return {
      active: items.filter((o) => o.isOpen),
      history: items.filter((o) => !o.isOpen),
    };
  }, [query.data]);

  return {
    active,
    history,
    isLoading: query.isPending,
    isRefreshing: query.isRefetching,
    hasError: query.isError,
    refresh: query.refetch,
    isEmpty: active.length === 0 && history.length === 0,
    onOpenOrder,
    onExplore,
  };
}
