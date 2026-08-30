import { useCartActions } from "@/features/cart";

import { useSalvadoQuery } from "../services/establishmentsQueries";
import { toSalvadoDetailModel } from "./salvadoPresenter";

type Params = {
  salvadoId: string;
  onOpenCart: () => void;
  onOpenEstablishment: (establishmentId: string) => void;
};

/** VIEWMODEL do Detalhe do Salvado. */
export function useSalvadoDetailViewModel({ salvadoId, onOpenCart, onOpenEstablishment }: Params) {
  const query = useSalvadoQuery(salvadoId);
  const { addSalvado } = useCartActions();

  const model = query.data ? toSalvadoDetailModel(query.data) : null;

  return {
    model,
    isLoading: query.isPending,
    hasError: query.isError,
    /** "Adicionar à sacola" e ir para o checkout. */
    addToCart: () => {
      if (!query.data) return;
      addSalvado(query.data);
      onOpenCart();
    },
    openEstablishment: () => {
      if (model) onOpenEstablishment(model.establishmentId);
    },
  };
}
