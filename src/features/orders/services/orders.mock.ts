import { mockResponse } from "@/shared/lib";

import { orderListSchema, orderSchema, type Order } from "../model/order";
import type { CreateOrderInput, OrdersRepository } from "./orders.contract";
import { ORDERS_MOCK } from "./orders.fixtures";

/**
 * "Banco" de pedidos em memória para a etapa offline. Pedidos criados no
 * checkout são acrescentados aqui e lidos pelos hooks de query.
 */
let ORDERS: Order[] = [...ORDERS_MOCK];
let orderSeq = 0;

function generateOrderCode(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SV-${suffix}`;
}

export const ordersMock: OrdersRepository = {
  async getOrders() {
    const sorted = [...ORDERS].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return mockResponse(orderListSchema.parse(sorted));
  },

  async getOrderById(id: string) {
    const found = ORDERS.find((o) => o.id === id);
    if (!found) throw new Error(`Pedido não encontrado: ${id}`);
    return mockResponse(orderSchema.parse(found));
  },

  async createOrder(input: CreateOrderInput) {
    orderSeq += 1;
    const order: Order = orderSchema.parse({
      id: `ord-${Date.now()}-${orderSeq}`,
      code: generateOrderCode(),
      status: "PLACED",
      createdAt: new Date().toISOString(),
      totalInCents: input.subtotalInCents + input.deliveryFeeInCents,
      ...input,
    });
    ORDERS = [order, ...ORDERS];
    return mockResponse(order, 500);
  },
};

/** Apenas para testes: restaura o estado inicial da fonte mock. */
export function __resetOrders(): void {
  ORDERS = [...ORDERS_MOCK];
  orderSeq = 0;
}
