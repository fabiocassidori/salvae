import type { StatusTone } from "@/shared/ui";
import { formatCurrencyBRL, formatWeightKg } from "@/shared/utils";

import {
  isOpenOrder,
  itemCount,
  statusLabel,
  timelineSteps,
  type Order,
  type OrderStatus,
} from "../model/order";

function statusTone(status: OrderStatus): StatusTone {
  if (status === "COMPLETED") return "done";
  if (status === "CANCELED") return "canceled";
  if (status === "OUT_FOR_DELIVERY" || status === "READY_FOR_PICKUP") return "progress";
  return "waiting";
}

function relativeDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(today) - startOf(d)) / 86_400_000);
  if (days <= 0) return "Hoje";
  if (days === 1) return "Ontem";
  return d.toLocaleDateString("pt-BR");
}

function itemsLabel(order: Order): string {
  const count = itemCount(order);
  const names = order.lines.map((l) => l.name).join(", ");
  return `${count} ${count === 1 ? "item" : "itens"} · ${names}`;
}

export type OrderListItem = {
  id: string;
  code: string;
  establishmentName: string;
  itemsLabel: string;
  statusTone: StatusTone;
  statusLabel: string;
  dayLabel: string;
  fulfillmentWindowLabel: string;
  isOpen: boolean;
};

export function toOrderListItem(order: Order): OrderListItem {
  return {
    id: order.id,
    code: order.code,
    establishmentName: order.establishment.name,
    itemsLabel: itemsLabel(order),
    statusTone: statusTone(order.status),
    statusLabel: statusLabel(order),
    dayLabel: relativeDay(order.createdAt),
    fulfillmentWindowLabel: order.fulfillmentWindowLabel,
    isOpen: isOpenOrder(order),
  };
}

export type OrderTimelineStep = { label: string; reached: boolean; current: boolean };

export type OrderDetailModel = {
  id: string;
  code: string;
  statusTone: StatusTone;
  statusLabel: string;
  isPickup: boolean;
  establishmentName: string;
  establishmentAddressLine: string;
  deliveryAddressLine: string | null;
  fulfillmentWindowLabel: string;
  lines: { id: string; label: string; priceLabel: string }[];
  subtotalLabel: string;
  deliveryFeeLabel: string;
  totalLabel: string;
  paymentLabel: string;
  paidInApp: boolean;
  impactLabel: string;
  timeline: OrderTimelineStep[];
};

export function toOrderDetailModel(order: Order): OrderDetailModel {
  const steps = timelineSteps(order);
  const currentIndex =
    order.status === "CANCELED" ? -1 : steps.findIndex((s) => s.status === order.status);
  const reachedUpto = order.status === "COMPLETED" ? steps.length - 1 : Math.max(0, currentIndex);

  return {
    id: order.id,
    code: order.code,
    statusTone: statusTone(order.status),
    statusLabel: statusLabel(order),
    isPickup: order.fulfillmentType === "PICKUP",
    establishmentName: order.establishment.name,
    establishmentAddressLine: order.establishment.addressLine,
    deliveryAddressLine: order.deliveryAddressLine,
    fulfillmentWindowLabel: order.fulfillmentWindowLabel,
    lines: order.lines.map((l) => ({
      id: l.salvadoId,
      label: `${l.quantity}× ${l.name}`,
      priceLabel: formatCurrencyBRL(l.unitPriceInCents * l.quantity),
    })),
    subtotalLabel: formatCurrencyBRL(order.subtotalInCents),
    deliveryFeeLabel:
      order.deliveryFeeInCents === 0 ? "Grátis" : formatCurrencyBRL(order.deliveryFeeInCents),
    totalLabel: formatCurrencyBRL(order.totalInCents),
    paymentLabel: order.paymentLabel,
    paidInApp: order.paidInApp,
    impactLabel: `${formatCurrencyBRL(order.impactValueInCents)} · ${formatWeightKg(
      order.impactWeightGrams,
    )} de comida resgatada`,
    timeline: steps.map((s, index) => ({
      label: s.label,
      reached: order.status !== "CANCELED" && index <= reachedUpto,
      current: index === currentIndex,
    })),
  };
}
