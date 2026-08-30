import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationsRepository } from "./notificationsRepository";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationsKeys.all, "list"] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationsKeys.list(),
    queryFn: () => notificationsRepository.getNotifications(),
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsRepository.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsRepository.markAllRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
