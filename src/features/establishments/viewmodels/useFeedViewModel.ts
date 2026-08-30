import { useMemo, useState } from "react";

import { useSelectedAddress } from "@/features/addresses";
import { useHasUnreadNotifications } from "@/features/notifications";

import { HOME_CATEGORY_CHIPS } from "../model/filters";
import type { SalvadoCategory } from "../model/salvado";
import { useFeedQuery } from "../services/establishmentsQueries";
import { toOfferCardModel } from "./salvadoPresenter";

type Params = {
  onOpenSalvado: (salvadoId: string) => void;
  onSeeAll: () => void;
  onOpenNotifications: () => void;
  onChangeLocation: () => void;
};

/** VIEWMODEL da Home ("Salvados Perto de Você"). */
export function useFeedViewModel({
  onOpenSalvado,
  onSeeAll,
  onOpenNotifications,
  onChangeLocation,
}: Params) {
  const query = useFeedQuery();
  const address = useSelectedAddress();
  const hasUnread = useHasUnreadNotifications();
  const [category, setCategory] = useState<SalvadoCategory | null>(null);

  const offers = useMemo(() => {
    const list = query.data ?? [];
    const filtered = category ? list.filter((x) => x.salvado.category === category) : list;
    return filtered.map(toOfferCardModel);
  }, [query.data, category]);

  return {
    addressLabel: address?.shortLabel ?? "Selecionar endereço",
    hasUnread,
    categoryChips: HOME_CATEGORY_CHIPS,
    selectedCategory: category,
    toggleCategory: (value: SalvadoCategory) =>
      setCategory((current) => (current === value ? null : value)),
    offers,
    isLoading: query.isPending,
    isRefreshing: query.isRefetching,
    hasError: query.isError,
    refresh: query.refetch,
    onOpenSalvado,
    onSeeAll,
    onOpenNotifications,
    onChangeLocation,
  };
}
