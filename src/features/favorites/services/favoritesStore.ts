import { create } from "zustand";

/**
 * SERVICES — estabelecimentos favoritos do usuário (mock em memória).
 * Base para "notificar quando um parceiro favorito publicar um Salvado".
 */
type FavoritesStore = {
  establishmentIds: string[];
  toggle: (establishmentId: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  establishmentIds: ["est-padaria-central"],
  toggle: (establishmentId) =>
    set((state) => ({
      establishmentIds: state.establishmentIds.includes(establishmentId)
        ? state.establishmentIds.filter((id) => id !== establishmentId)
        : [...state.establishmentIds, establishmentId],
    })),
}));
