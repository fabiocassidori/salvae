import { QueryClient } from "@tanstack/react-query";

/**
 * Instância única do React Query.
 *
 * Fica em `shared/lib` (adaptador de biblioteca de terceiros) para que tanto
 * `app/providers` quanto testes possam reutilizar a mesma configuração.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
