import type { FulfillmentType } from "@/features/orders";

/** Taxa de entrega fixa nesta etapa (mock). O backend calculará por distância. */
export const DELIVERY_FEE_IN_CENTS = 699;

export function deliveryFeeInCents(type: FulfillmentType): number {
  return type === "DELIVERY" ? DELIVERY_FEE_IN_CENTS : 0;
}

export function checkoutTotalInCents(subtotalInCents: number, type: FulfillmentType): number {
  return subtotalInCents + deliveryFeeInCents(type);
}

/** Previsão de janela conforme o tipo de recebimento. */
export function fulfillmentWindowLabel(type: FulfillmentType, pickupLabel: string): string {
  if (type === "PICKUP") {
    return pickupLabel.replace(/^Retirar\s+/i, "Retire ");
  }
  return "Entrega hoje, previsão de 30 a 45 min";
}
