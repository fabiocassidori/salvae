import type { CreateOrderInput } from "./orders.contract";
import { __resetOrders, ordersMock } from "./orders.mock";

const input: CreateOrderInput = {
  fulfillmentType: "PICKUP",
  establishment: { id: "est-1", name: "Padaria Central", addressLine: "Rua das Flores, 123" },
  lines: [{ salvadoId: "slv-1", name: "Cesta de Pães", quantity: 2, unitPriceInCents: 800 }],
  fulfillmentWindowLabel: "Retire entre 18:00 e 19:30",
  deliveryAddressLine: null,
  subtotalInCents: 1600,
  deliveryFeeInCents: 0,
  paymentLabel: "Pagar na retirada",
  paidInApp: false,
  impactValueInCents: 2400,
  impactWeightGrams: 1800,
};

describe("orders mock repository", () => {
  beforeEach(() => __resetOrders());

  it("cria um pedido com código SV-XXXX, status PLACED e total calculado", async () => {
    const before = (await ordersMock.getOrders()).length;
    const order = await ordersMock.createOrder({ ...input, deliveryFeeInCents: 699 });

    expect(order.code).toMatch(/^SV-[A-Z0-9]{4}$/);
    expect(order.status).toBe("PLACED");
    expect(order.totalInCents).toBe(1600 + 699);

    const after = await ordersMock.getOrders();
    expect(after.length).toBe(before + 1);
    expect(after[0].id).toBe(order.id);
  });

  it("__resetOrders restaura o estado inicial", async () => {
    await ordersMock.createOrder(input);
    __resetOrders();
    const orders = await ordersMock.getOrders();
    expect(orders.every((o) => o.code.startsWith("SV-"))).toBe(true);
    expect(orders).toHaveLength(2);
  });
});
