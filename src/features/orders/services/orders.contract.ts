import type { FulfillmentType, Order, OrderLine } from "../model/order";

/** Dados necessários para criar um pedido no checkout. */
export type CreateOrderInput = {
  fulfillmentType: FulfillmentType;
  establishment: Order["establishment"];
  lines: OrderLine[];
  fulfillmentWindowLabel: string;
  deliveryAddressLine: string | null;
  subtotalInCents: number;
  deliveryFeeInCents: number;
  paymentLabel: string;
  paidInApp: boolean;
  impactValueInCents: number;
  impactWeightGrams: number;
};

/** Contrato do repositório de Pedidos (= contrato do backend C# .NET). */
export type OrdersRepository = {
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order>;
  createOrder(input: CreateOrderInput): Promise<Order>;
};
