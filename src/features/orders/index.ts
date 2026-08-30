// API pública da fatia `orders`.
export { OrderListScreen } from "./views/screens/OrderListScreen";
export { OrderDetailScreen } from "./views/screens/OrderDetailScreen";
export { OrderConfirmedScreen } from "./views/screens/OrderConfirmedScreen";

// Services — consumido pelo checkout
export { useCreateOrderMutation, useOrdersQuery, ordersKeys } from "./services/ordersQueries";
export type { CreateOrderInput } from "./services/ordersRepository";
export { __resetOrders } from "./services/ordersRepository";

// Model
export type { Order, OrderStatus, FulfillmentType, OrderLine } from "./model/order";
export { statusLabel, isOpenOrder } from "./model/order";
