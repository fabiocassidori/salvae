/**
 * MODEL — sacola. Cada linha é um "snapshot" do Salvado no momento em que foi
 * adicionado (preço, janela, peso), para a sacola não depender de dados ao vivo.
 * Regra estilo iFood: a sacola pertence a UM estabelecimento por vez.
 */
export type CartLine = {
  id: string;
  salvadoId: string;
  name: string;
  imageUrl: string;
  unitPriceInCents: number;
  originalUnitPriceInCents: number;
  weightGrams: number;
  quantity: number;
  maxQuantity: number;
  pickupWindowLabel: string;
};

export type Cart = {
  establishmentId: string | null;
  establishmentName: string | null;
  establishmentAddressLine: string | null;
  lines: CartLine[];
};

export const EMPTY_CART: Cart = {
  establishmentId: null,
  establishmentName: null,
  establishmentAddressLine: null,
  lines: [],
};

export function cartSubtotalInCents(cart: Cart): number {
  return cart.lines.reduce((total, l) => total + l.unitPriceInCents * l.quantity, 0);
}

export function cartOriginalTotalInCents(cart: Cart): number {
  return cart.lines.reduce((total, l) => total + l.originalUnitPriceInCents * l.quantity, 0);
}

/** "Impacto Salvo" da sacola: economia + massa de comida resgatada. */
export function cartImpact(cart: Cart): { valueInCents: number; weightGrams: number } {
  return {
    valueInCents: cartOriginalTotalInCents(cart) - cartSubtotalInCents(cart),
    weightGrams: cart.lines.reduce((total, l) => total + l.weightGrams * l.quantity, 0),
  };
}

export function cartItemCount(cart: Cart): number {
  return cart.lines.reduce((total, l) => total + l.quantity, 0);
}

export function setLineQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  const lines = cart.lines.flatMap((l) => {
    if (l.id !== lineId) return [l];
    const next = Math.max(0, Math.min(quantity, l.maxQuantity));
    return next === 0 ? [] : [{ ...l, quantity: next }];
  });
  return lines.length === 0 ? EMPTY_CART : { ...cart, lines };
}
