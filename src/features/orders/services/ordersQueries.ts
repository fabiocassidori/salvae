import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateOrderInput } from "./orders.contract";
import { ordersRepository } from "./ordersRepository";

export const ordersKeys = {
  all: ["orders"] as const,
  list: () => [...ordersKeys.all, "list"] as const,
  detail: (id: string) => [...ordersKeys.all, "detail", id] as const,
};

export function useOrdersQuery() {
  return useQuery({ queryKey: ordersKeys.list(), queryFn: () => ordersRepository.getOrders() });
}

export function useOrderQuery(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersRepository.getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersRepository.createOrder(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
