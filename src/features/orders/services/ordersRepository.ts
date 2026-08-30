import { resolveDataSource } from "@/shared/data";

import type { OrdersRepository } from "./orders.contract";
import { ordersHttp } from "./orders.http";
import { ordersMock } from "./orders.mock";

/** Camada de repositório da fatia `orders` — único ponto de acesso a dados. */
export const ordersRepository: OrdersRepository = resolveDataSource({
  mock: ordersMock,
  http: ordersHttp,
});

export { __resetOrders } from "./orders.mock";
export type { CreateOrderInput, OrdersRepository } from "./orders.contract";
