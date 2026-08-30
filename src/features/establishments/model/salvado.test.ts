import {
  discountPercent,
  impactValueInCents,
  impactWeightGrams,
  isOfferOpen,
  type Salvado,
} from "./salvado";

const baseSalvado: Salvado = {
  id: "slv-1",
  establishmentId: "est-1",
  name: "Cesta de Pães",
  description: "",
  imageUrl: "https://example.com/img.jpg",
  category: "BAKERY",
  kind: "REGULAR",
  originalPriceInCents: 2000,
  priceInCents: 800,
  weightGrams: 900,
  quantityAvailable: 3,
  publishedAt: "2026-08-30T10:00:00.000Z",
  offerExpiresAt: "2026-08-30T13:00:00.000Z",
  pickupWindow: { date: "2026-08-30", startTime: "18:00", endTime: "19:30", label: "Retirar hoje" },
  safetySeal: {
    availability: "Disponível até hoje",
    conservation: "Temperatura ambiente",
    responsible: "Informado pela loja",
    consumeWithinHours: null,
  },
  isSafe: true,
};

describe("model/salvado", () => {
  it("calcula o Impacto Salvo monetário e em peso", () => {
    expect(impactValueInCents(baseSalvado)).toBe(1200);
    expect(impactWeightGrams(baseSalvado, 2)).toBe(1800);
  });

  it("calcula o percentual de desconto", () => {
    expect(discountPercent(baseSalvado)).toBe(60);
  });

  it("considera a oferta aberta apenas se não expirou e há estoque", () => {
    const now = new Date("2026-08-30T12:00:00.000Z").getTime();
    expect(isOfferOpen(baseSalvado, now)).toBe(true);
    expect(isOfferOpen({ ...baseSalvado, quantityAvailable: 0 }, now)).toBe(false);
    expect(isOfferOpen(baseSalvado, new Date("2026-08-30T14:00:00.000Z").getTime())).toBe(false);
  });
});
