import type { SalvadoCategory } from "./salvado";

export const SORT_OPTIONS = ["NEAREST", "LOWEST_PRICE", "ENDING_SOON"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const sortOptionLabel: Record<SortOption, string> = {
  NEAREST: "Mais Próximos",
  LOWEST_PRICE: "Menor Preço",
  ENDING_SOON: "Encerrando",
};

export type ExploreFilters = {
  term: string;
  category: SalvadoCategory | null;
  sort: SortOption;
};

export const DEFAULT_FILTERS: ExploreFilters = {
  term: "",
  category: null,
  sort: "NEAREST",
};

/** Chips de categoria da Home (subconjunto em destaque). */
export const HOME_CATEGORY_CHIPS: { value: SalvadoCategory; label: string }[] = [
  { value: "BAKERY", label: "Padaria" },
  { value: "GROCERY", label: "Mercado" },
  { value: "PRODUCE", label: "Hortifruti" },
  { value: "HOT_MEAL", label: "Quentes" },
  { value: "SWEETS", label: "Doces" },
];
