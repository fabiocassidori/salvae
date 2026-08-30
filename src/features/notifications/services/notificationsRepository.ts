import { resolveDataSource } from "@/shared/data";

import type { NotificationsRepository } from "./notifications.contract";
import { notificationsHttp } from "./notifications.http";
import { notificationsMock } from "./notifications.mock";

/** Camada de repositório da fatia `notifications` — único ponto de acesso a dados. */
export const notificationsRepository: NotificationsRepository = resolveDataSource({
  mock: notificationsMock,
  http: notificationsHttp,
});

export { __resetNotifications } from "./notifications.mock";
export type { NotificationsRepository } from "./notifications.contract";
