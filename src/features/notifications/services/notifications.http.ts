import { httpClient } from "@/shared/api";

import { notificationListSchema } from "../model/notification";
import type { NotificationsRepository } from "./notifications.contract";

export const notificationsHttp: NotificationsRepository = {
  async getNotifications() {
    const { data } = await httpClient.get("/notificacoes");
    return notificationListSchema.parse(data);
  },
  async markRead(id) {
    await httpClient.post(`/notificacoes/${id}/lida`);
  },
  async markAllRead() {
    await httpClient.post("/notificacoes/lidas");
  },
};
