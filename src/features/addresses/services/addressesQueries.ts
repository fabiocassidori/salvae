import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AddressDraft } from "./addresses.contract";
import { addressesRepository } from "./addressesRepository";

export const addressesKeys = {
  all: ["addresses"] as const,
  list: () => [...addressesKeys.all, "list"] as const,
};

export function useAddressesQuery() {
  return useQuery({
    queryKey: addressesKeys.list(),
    queryFn: () => addressesRepository.getAddresses(),
  });
}

export function useSaveAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: AddressDraft) => addressesRepository.saveAddress(draft),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressesKeys.all });
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesRepository.deleteAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressesKeys.all });
    },
  });
}
