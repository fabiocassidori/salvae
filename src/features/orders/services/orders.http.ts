import { httpClient } from "@/shared/api";

import { orderListSchema, orderSchema } from "../model/order";
import type { CreateOrderInput, OrdersRepository } from "./orders.contract";

export const ordersHttp: OrdersRepository = {
  async getOrders() {
    const { data } = await httpClient.get("/pedidos");
    return orderListSchema.parse(data);
  },

  async getOrderById(id: string) {
    const { data } = await httpClient.get(`/pedidos/${id}`);
    return orderSchema.parse(data);
  },

  async createOrder(input: CreateOrderInput) {
    const { data } = await httpClient.post("/pedidos", input);
    return orderSchema.parse(data);
  },
};
