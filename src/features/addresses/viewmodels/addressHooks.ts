import { shortAddressLabel, type Address } from "../model/address";
import { useAddressesQuery } from "../services/addressesQueries";
import { useSelectedAddressStore } from "../services/selectedAddressStore";

export type SelectedAddress = Address & { shortLabel: string };

/**
 * Endereço de entrega ativo — consumido por Home, Checkout, Perfil.
 * Combina a lista (repositório/React Query) com o `id` selecionado (store de
 * cliente). Sem seleção explícita, usa o endereço padrão / o primeiro.
 */
export function useSelectedAddress(): SelectedAddress | null {
  const { data: addresses } = useAddressesQuery();
  const selectedId = useSelectedAddressStore((s) => s.selectedId);

  if (!addresses || addresses.length === 0) return null;

  const address =
    (selectedId ? addresses.find((a) => a.id === selectedId) : undefined) ??
    addresses.find((a) => a.isDefault) ??
    addresses[0];

  return address ? { ...address, shortLabel: shortAddressLabel(address) } : null;
}
