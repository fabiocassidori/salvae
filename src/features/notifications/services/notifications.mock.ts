import { mockResponse } from "@/shared/lib";

import { notificationListSchema, type AppNotification } from "../model/notification";
import type { NotificationsRepository } from "./notifications.contract";
import { NOTIFICATIONS_MOCK } from "./notifications.fixtures";

let NOTIFICATIONS: AppNotification[] = [...NOTIFICATIONS_MOCK];

export const notificationsMock: NotificationsRepository = {
  async getNotifications() {
    return mockResponse(notificationListSchema.parse(NOTIFICATIONS));
  },
  async markRead(id) {
    NOTIFICATIONS = NOTIFICATIONS.map((n) => (n.id === id ? { ...n, read: true } : n));
    return mockResponse(undefined, 120);
  },
  async markAllRead() {
    NOTIFICATIONS = NOTIFICATIONS.map((n) => ({ ...n, read: true }));
    return mockResponse(undefined, 120);
  },
};

/** Apenas para testes. */
export function __resetNotifications(): void {
  NOTIFICATIONS = [...NOTIFICATIONS_MOCK];
}
