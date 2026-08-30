import { create } from "zustand";

import type { SalvadoWithEstablishment } from "@/features/establishments";

import { EMPTY_CART, setLineQuantity, type Cart, type CartLine } from "../model/cart";

let lineSeq = 0;

type CartStore = Cart & {
  addSalvado: (entry: SalvadoWithEstablishment, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

function lineFromSalvado(entry: SalvadoWithEstablishment, quantity: number): CartLine {
  const { salvado } = entry;
  lineSeq += 1;
  return {
    id: `line-${lineSeq}`,
    salvadoId: salvado.id,
    name: salvado.name,
    imageUrl: salvado.imageUrl,
    unitPriceInCents: salvado.priceInCents,
    originalUnitPriceInCents: salvado.originalPriceInCents,
    weightGrams: salvado.weightGrams,
    quantity,
    maxQuantity: salvado.quantityAvailable,
    pickupWindowLabel: salvado.pickupWindow.label,
  };
}

/**
 * SERVICES — estado de cliente da sacola (Zustand).
 * A lógica de totais/impacto vive em `model/cart.ts` (funções puras testadas).
 */
export const useCartStore = create<CartStore>((set) => ({
  ...EMPTY_CART,

  addSalvado: (entry, quantity = 1) =>
    set((state) => {
      const differentEstablishment =
        state.establishmentId !== null && state.establishmentId !== entry.establishment.id;
      const base: Cart = differentEstablishment ? EMPTY_CART : state;

      const existing = base.lines.find((l) => l.salvadoId === entry.salvado.id);
      const lines = existing
        ? base.lines.map((l) =>
            l.salvadoId === entry.salvado.id
              ? { ...l, quantity: Math.min(l.quantity + quantity, l.maxQuantity) }
              : l,
          )
        : [...base.lines, lineFromSalvado(entry, quantity)];

      return {
        establishmentId: entry.establishment.id,
        establishmentName: entry.establishment.name,
        establishmentAddressLine: entry.establishment.addressLine,
        lines,
      };
    }),

  setQuantity: (lineId, quantity) => set((state) => setLineQuantity(state, lineId, quantity)),
  removeLine: (lineId) => set((state) => setLineQuantity(state, lineId, 0)),
  clear: () => set({ ...EMPTY_CART }),
}));
