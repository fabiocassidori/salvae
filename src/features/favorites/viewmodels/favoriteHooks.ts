import { useFavoritesStore } from "../services/favoritesStore";

export function useFavorite(establishmentId: string) {
  const isFavorite = useFavoritesStore((s) => s.establishmentIds.includes(establishmentId));
  const toggle = useFavoritesStore((s) => s.toggle);
  return { isFavorite, toggle: () => toggle(establishmentId) };
}

export function useFavoriteIds(): string[] {
  return useFavoritesStore((s) => s.establishmentIds);
}
