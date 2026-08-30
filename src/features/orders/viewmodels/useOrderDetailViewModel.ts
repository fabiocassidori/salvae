import { useOrderQuery } from "../services/ordersQueries";
import { toOrderDetailModel } from "./orderPresenter";

/** VIEWMODEL do Detalhe do Pedido. */
export function useOrderDetailViewModel(orderId: string) {
  const query = useOrderQuery(orderId);
  return {
    model: query.data ? toOrderDetailModel(query.data) : null,
    isLoading: query.isPending,
    hasError: query.isError,
  };
}
