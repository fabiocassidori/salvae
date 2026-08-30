import { create } from "zustand";

/**
 * Estado de CLIENTE: qual endereço está selecionado para a entrega.
 *
 * É só o `id` — a lista de endereços em si vem do repositório (React Query).
 * `null` = "usar o endereço padrão" (resolvido em `useSelectedAddress`).
 */
type SelectedAddressStore = {
  selectedId: string | null;
  select: (id: string) => void;
  reset: () => void;
};

export const useSelectedAddressStore = create<SelectedAddressStore>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  reset: () => set({ selectedId: null }),
}));
