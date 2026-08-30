import type { AppNotification } from "../model/notification";

/** Contrato do repositório de notificações (= contrato do backend C# .NET). */
export type NotificationsRepository = {
  getNotifications(): Promise<AppNotification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
};
