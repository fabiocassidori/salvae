/** Tipos utilitários transversais, sem vínculo com domínio. */

export type Nullable<T> = T | null;

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** Identificador opaco de entidade — evita misturar ids de tipos diferentes. */
export type Id<TBrand extends string> = string & { readonly __brand: TBrand };
