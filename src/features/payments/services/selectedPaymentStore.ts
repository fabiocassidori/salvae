import { create } from "zustand";

/**
 * Estado de CLIENTE: qual forma de pagamento está selecionada.
 * Só o `id`; a lista vem do repositório (React Query). `null` = usar o padrão.
 */
type SelectedPaymentStore = {
  selectedId: string | null;
  select: (id: string) => void;
};

export const useSelectedPaymentStore = create<SelectedPaymentStore>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
}));
