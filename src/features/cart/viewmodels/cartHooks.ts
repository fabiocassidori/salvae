import { useCartStore } from "../services/cartStore";
import { cartImpact, cartItemCount, cartSubtotalInCents } from "../model/cart";

/** Ações da sacola para outras fatias (ex.: Detalhe do Salvado). */
export function useCartActions() {
  return {
    addSalvado: useCartStore((s) => s.addSalvado),
    clear: useCartStore((s) => s.clear),
  };
}

/** Resumo da sacola para o checkout e para o badge da aba. */
export function useCartSummary() {
  const cart = useCartStore((s) => s);
  const impact = cartImpact(cart);
  return {
    establishmentId: cart.establishmentId,
    establishmentName: cart.establishmentName,
    establishmentAddressLine: cart.establishmentAddressLine,
    lines: cart.lines,
    itemCount: cartItemCount(cart),
    subtotalInCents: cartSubtotalInCents(cart),
    impactValueInCents: impact.valueInCents,
    impactWeightGrams: impact.weightGrams,
    isEmpty: cart.lines.length === 0,
  };
}
