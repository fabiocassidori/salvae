import { isOpenOrder, statusLabel, timelineSteps, type Order } from "./order";

const order: Order = {
  id: "ord-1",
  code: "SV-892A",
  status: "READY_FOR_PICKUP",
  fulfillmentType: "PICKUP",
  createdAt: "2026-08-30T12:00:00.000Z",
  establishment: { id: "est-1", name: "Padaria Central", addressLine: "Rua das Flores, 123" },
  lines: [{ salvadoId: "slv-1", name: "Cesta de Pães", quantity: 1, unitPriceInCents: 800 }],
  fulfillmentWindowLabel: "Retire entre 18:00 e 19:30",
  deliveryAddressLine: null,
  subtotalInCents: 800,
  deliveryFeeInCents: 0,
  totalInCents: 800,
  paymentLabel: "Pagar na retirada",
  paidInApp: false,
  impactValueInCents: 1000,
  impactWeightGrams: 900,
};

describe("model/order", () => {
  it("usa rótulo de status sensível ao tipo de recebimento", () => {
    expect(statusLabel({ ...order, status: "PREPARING" })).toBe("Aguardando retirada");
    expect(statusLabel({ ...order, status: "PREPARING", fulfillmentType: "DELIVERY" })).toBe(
      "Em preparação",
    );
    expect(statusLabel({ ...order, status: "COMPLETED" })).toBe("Concluído");
  });

  it("monta a linha do tempo conforme retirada ou entrega", () => {
    expect(timelineSteps(order).map((s) => s.status)).toEqual([
      "PLACED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "COMPLETED",
    ]);
    expect(timelineSteps({ ...order, fulfillmentType: "DELIVERY" }).map((s) => s.status)).toEqual([
      "PLACED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "COMPLETED",
    ]);
  });

  it("distingue pedido em aberto de concluído", () => {
    expect(isOpenOrder(order)).toBe(true);
    expect(isOpenOrder({ ...order, status: "COMPLETED" })).toBe(false);
  });
});
