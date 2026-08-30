import { useMemo } from "react";

import { notificationIcon, relativeTime } from "../model/notification";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "../services/notificationsQueries";

type Params = {
  onOpenSalvado: (salvadoId: string) => void;
  onOpenOrder: (orderId: string) => void;
};

export function useNotificationsViewModel({ onOpenSalvado, onOpenOrder }: Params) {
  const { data, isPending } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();

  const items = useMemo(
    () =>
      (data ?? []).map((n) => ({
        id: n.id,
        icon: notificationIcon(n.type),
        title: n.title,
        body: n.body,
        timeLabel: relativeTime(n.createdAt),
        read: n.read,
      })),
    [data],
  );

  const notifications = data ?? [];

  return {
    items,
    isLoading: isPending,
    isEmpty: !isPending && items.length === 0,
    hasUnread: items.some((i) => !i.read),
    markAllRead: () => markAll.mutate(),
    open: (id: string) => {
      const notification = notifications.find((n) => n.id === id);
      if (!notification) return;
      if (!notification.read) markRead.mutate(id);
      if (notification.orderId) onOpenOrder(notification.orderId);
      else if (notification.salvadoId) onOpenSalvado(notification.salvadoId);
    },
  };
}
