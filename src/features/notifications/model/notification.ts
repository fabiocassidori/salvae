import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "OFFER_NEARBY",
  "ORDER_UPDATE",
  "FAVORITE_PUBLISHED",
  "IMPACT",
  "SYSTEM",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  read: z.boolean(),
  /** Alvo de navegação opcional. */
  salvadoId: z.string().nullable(),
  orderId: z.string().nullable(),
});
export type AppNotification = z.infer<typeof notificationSchema>;
export const notificationListSchema = z.array(notificationSchema);

export function notificationIcon(
  type: NotificationType,
):
  | "bag-handle-outline"
  | "receipt-outline"
  | "heart-outline"
  | "leaf-outline"
  | "information-circle-outline" {
  switch (type) {
    case "OFFER_NEARBY":
      return "bag-handle-outline";
    case "ORDER_UPDATE":
      return "receipt-outline";
    case "FAVORITE_PUBLISHED":
      return "heart-outline";
    case "IMPACT":
      return "leaf-outline";
    case "SYSTEM":
      return "information-circle-outline";
  }
}

export function relativeTime(iso: string, nowMs: number = Date.now()): string {
  const diffMin = Math.round((nowMs - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `há ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  return `há ${diffD} d`;
}
