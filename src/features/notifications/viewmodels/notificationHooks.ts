import { useNotificationsQuery } from "../services/notificationsQueries";

/** Indicador de não lidas — consumido pelo sino do cabeçalho. */
export function useHasUnreadNotifications(): boolean {
  const { data } = useNotificationsQuery();
  return (data ?? []).some((n) => !n.read);
}
