import {
  EMPTY_CART,
  cartImpact,
  cartItemCount,
  cartSubtotalInCents,
  setLineQuantity,
  type Cart,
  type CartLine,
} from "./cart";

const line = (over: Partial<CartLine> = {}): CartLine => ({
  id: "line-1",
  salvadoId: "slv-1",
  name: "Cesta de Pães",
  imageUrl: "https://example.com/i.jpg",
  unitPriceInCents: 800,
  originalUnitPriceInCents: 2000,
  weightGrams: 900,
  quantity: 2,
  maxQuantity: 5,
  pickupWindowLabel: "Retirar hoje",
  ...over,
});

const cart: Cart = {
  establishmentId: "est-1",
  establishmentName: "Padaria Central",
  establishmentAddressLine: "Rua das Flores, 123",
  lines: [line()],
};

describe("model/cart", () => {
  it("soma subtotal e contagem de itens", () => {
    expect(cartSubtotalInCents(cart)).toBe(1600);
    expect(cartItemCount(cart)).toBe(2);
  });

  it("calcula o Impacto Salvo da sacola (valor + peso)", () => {
    expect(cartImpact(cart)).toEqual({ valueInCents: 2400, weightGrams: 1800 });
  });

  it("limita a quantidade ao estoque e esvazia a sacola ao zerar", () => {
    expect(setLineQuantity(cart, "line-1", 99).lines[0].quantity).toBe(5);
    expect(setLineQuantity(cart, "line-1", 0)).toEqual(EMPTY_CART);
  });
});
