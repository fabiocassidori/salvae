import { z } from "zod";

/** Como o Salvado chega ao usuário. */
export const fulfillmentTypeSchema = z.enum(["PICKUP", "DELIVERY"]);
export type FulfillmentType = z.infer<typeof fulfillmentTypeSchema>;

export const orderStatusSchema = z.enum([
  "PLACED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELED",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderLineSchema = z.object({
  salvadoId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  unitPriceInCents: z.number().int().nonnegative(),
});
export type OrderLine = z.infer<typeof orderLineSchema>;

export const orderSchema = z.object({
  id: z.string(),
  /** Código legível apresentado ao usuário e ao parceiro, ex.: "SV-892A". */
  code: z.string(),
  status: orderStatusSchema,
  fulfillmentType: fulfillmentTypeSchema,
  createdAt: z.string(),
  establishment: z.object({
    id: z.string(),
    name: z.string(),
    addressLine: z.string(),
  }),
  lines: z.array(orderLineSchema),
  /** Janela de retirada / entrega, texto pronto. */
  fulfillmentWindowLabel: z.string(),
  /** Endereço de entrega (quando DELIVERY). */
  deliveryAddressLine: z.string().nullable(),
  subtotalInCents: z.number().int().nonnegative(),
  deliveryFeeInCents: z.number().int().nonnegative(),
  totalInCents: z.number().int().nonnegative(),
  paymentLabel: z.string(),
  paidInApp: z.boolean(),
  impactValueInCents: z.number().int().nonnegative(),
  impactWeightGrams: z.number().int().nonnegative(),
});
export type Order = z.infer<typeof orderSchema>;
export const orderListSchema = z.array(orderSchema);

// ─── Regras de domínio puras ─────────────────────────────────────────────────

export const OPEN_STATUSES: OrderStatus[] = [
  "PLACED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
];

export function isOpenOrder(order: Order): boolean {
  return OPEN_STATUSES.includes(order.status);
}

/** Rótulo de status sensível ao tipo de recebimento (glossário e protótipo). */
export function statusLabel(order: Order): string {
  switch (order.status) {
    case "PLACED":
    case "PREPARING":
      return order.fulfillmentType === "PICKUP" ? "Aguardando retirada" : "Em preparação";
    case "READY_FOR_PICKUP":
      return "Pronto para retirada";
    case "OUT_FOR_DELIVERY":
      return "Saiu para entrega";
    case "COMPLETED":
      return "Concluído";
    case "CANCELED":
      return "Cancelado";
  }
}

export function itemCount(order: Order): number {
  return order.lines.reduce((total, l) => total + l.quantity, 0);
}

/** Passos da linha do tempo conforme o tipo de recebimento. */
export function timelineSteps(order: Order): { status: OrderStatus; label: string }[] {
  const common: { status: OrderStatus; label: string }[] = [
    { status: "PLACED", label: "Pedido recebido" },
    { status: "PREPARING", label: "Em preparação" },
  ];
  if (order.fulfillmentType === "PICKUP") {
    return [
      ...common,
      { status: "READY_FOR_PICKUP", label: "Pronto para retirada" },
      { status: "COMPLETED", label: "Retirado" },
    ];
  }
  return [
    ...common,
    { status: "OUT_FOR_DELIVERY", label: "Saiu para entrega" },
    { status: "COMPLETED", label: "Entregue" },
  ];
}
