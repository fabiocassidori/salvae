import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { NewCardInput } from "./payments.contract";
import { paymentsRepository } from "./paymentsRepository";

export const paymentsKeys = {
  all: ["payments"] as const,
  methods: () => [...paymentsKeys.all, "methods"] as const,
};

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: paymentsKeys.methods(),
    queryFn: () => paymentsRepository.getMethods(),
  });
}

export function useAddCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewCardInput) => paymentsRepository.addCard(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
