// API pública da fatia `notifications`.
export { NotificationsScreen } from "./views/screens/NotificationsScreen";
export { useHasUnreadNotifications } from "./viewmodels/notificationHooks";

// Camada de repositório + hooks de query
export { notificationsRepository } from "./services/notificationsRepository";
export type { NotificationsRepository } from "./services/notificationsRepository";
export { useNotificationsQuery } from "./services/notificationsQueries";

export type { AppNotification, NotificationType } from "./model/notification";
