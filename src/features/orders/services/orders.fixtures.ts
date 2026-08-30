import type { Order } from "../model/order";

const now = Date.now();
const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

/** Dados mockados (etapa offline). Formato = contrato do backend C# .NET. */
export const ORDERS_MOCK: Order[] = [
  {
    id: "ord-sv-892a",
    code: "SV-892A",
    status: "READY_FOR_PICKUP",
    fulfillmentType: "PICKUP",
    createdAt: iso(2 * 60 * 60_000),
    establishment: {
      id: "est-padaria-central",
      name: "Padaria Central",
      addressLine: "Rua das Flores, 123 - Pinheiros",
    },
    lines: [
      {
        salvadoId: "slv-cesta-paes-artesanais",
        name: "Cesta de Pães",
        quantity: 1,
        unitPriceInCents: 800,
      },
    ],
    fulfillmentWindowLabel: "Retire entre 18:00 e 19:30",
    deliveryAddressLine: null,
    subtotalInCents: 800,
    deliveryFeeInCents: 0,
    totalInCents: 800,
    paymentLabel: "Pagar na retirada",
    paidInApp: false,
    impactValueInCents: 1000,
    impactWeightGrams: 900,
  },
  {
    id: "ord-sv-774b",
    code: "SV-774B",
    status: "COMPLETED",
    fulfillmentType: "PICKUP",
    createdAt: iso(28 * 60 * 60_000),
    establishment: {
      id: "est-mercado-verde",
      name: "Mercado Verde",
      addressLine: "Av. Paulista, 2100 - Bela Vista",
    },
    lines: [
      {
        salvadoId: "slv-kit-hortifruti",
        name: "Kit Hortifruti",
        quantity: 1,
        unitPriceInCents: 1400,
      },
    ],
    fulfillmentWindowLabel: "Retirado ontem",
    deliveryAddressLine: null,
    subtotalInCents: 1400,
    deliveryFeeInCents: 0,
    totalInCents: 1400,
    paymentLabel: "Visa •••• 4821",
    paidInApp: true,
    impactValueInCents: 1600,
    impactWeightGrams: 2200,
  },
];
