import { useMemo } from "react";

import { formatCurrencyBRL, formatWeightKg } from "@/shared/utils";

import { cartImpact, cartItemCount, cartSubtotalInCents } from "../model/cart";
import { useCartStore } from "../services/cartStore";

type Params = {
  onCheckout: () => void;
  onKeepBrowsing: () => void;
};

/** VIEWMODEL da tela Sacola. */
export function useCartViewModel({ onCheckout, onKeepBrowsing }: Params) {
  const lines = useCartStore((s) => s.lines);
  const establishmentName = useCartStore((s) => s.establishmentName);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const cart = useCartStore((s) => s);

  const totals = useMemo(() => {
    const impact = cartImpact(cart);
    return {
      subtotalLabel: formatCurrencyBRL(cartSubtotalInCents(cart)),
      impactValueLabel: formatCurrencyBRL(impact.valueInCents),
      impactWeightLabel: formatWeightKg(impact.weightGrams),
      count: cartItemCount(cart),
    };
  }, [cart]);

  const rows = useMemo(
    () =>
      lines.map((l) => ({
        id: l.id,
        name: l.name,
        imageUrl: l.imageUrl,
        quantity: l.quantity,
        maxQuantity: l.maxQuantity,
        pickupWindowLabel: l.pickupWindowLabel,
        lineTotalLabel: formatCurrencyBRL(l.unitPriceInCents * l.quantity),
      })),
    [lines],
  );

  return {
    establishmentName,
    rows,
    isEmpty: lines.length === 0,
    ...totals,
    setQuantity,
    removeLine,
    onCheckout,
    onKeepBrowsing,
  };
}
