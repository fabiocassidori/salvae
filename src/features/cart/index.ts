// API pública da fatia `cart`.
export { CartScreen } from "./views/screens/CartScreen";
export { useCartActions, useCartSummary } from "./viewmodels/cartHooks";
export { useCartStore } from "./services/cartStore";
export type { Cart, CartLine } from "./model/cart";
export { cartImpact, cartSubtotalInCents, cartItemCount } from "./model/cart";
