import { useMemo } from "react";

import type { AddressCardModel } from "@/shared/ui";

import { addressIcon, formatAddress } from "../model/address";
import { useAddressesQuery, useDeleteAddressMutation } from "../services/addressesQueries";
import { useSelectedAddressStore } from "../services/selectedAddressStore";

type Params = {
  onAddAddress: () => void;
  onEditAddress: (addressId: string) => void;
  /** Quando presente, a tela funciona em modo "escolher endereço". */
  onPicked?: () => void;
};

export function useAddressListViewModel({ onAddAddress, onEditAddress, onPicked }: Params) {
  const { data, isPending, isError, refetch } = useAddressesQuery();
  const selectedId = useSelectedAddressStore((s) => s.selectedId);
  const select = useSelectedAddressStore((s) => s.select);
  const deleteAddress = useDeleteAddressMutation();

  const items = useMemo<AddressCardModel[]>(
    () =>
      (data ?? []).map((a) => ({
        id: a.id,
        label: a.label,
        formatted: formatAddress(a),
        isDefault: a.isDefault,
        icon: addressIcon(a.kind),
      })),
    [data],
  );

  const addresses = data ?? [];
  const effectiveSelectedId =
    selectedId ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null;

  return {
    items,
    selectedId: effectiveSelectedId,
    isLoading: isPending,
    hasError: isError,
    refresh: refetch,
    pickAddress: (id: string) => {
      select(id);
      onPicked?.();
    },
    removeAddress: (id: string) => deleteAddress.mutate(id),
    onAddAddress,
    onEditAddress,
  };
}
