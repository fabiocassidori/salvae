import type { CurrentUser } from "../model/user";
import { useCurrentUserQuery } from "../services/profileQueries";

/**
 * Usuário autenticado atual (do repositório de perfil, via React Query).
 * `undefined` enquanto carrega — as telas tratam o estado de loading.
 */
export function useCurrentUser(): CurrentUser | undefined {
  return useCurrentUserQuery().data;
}
