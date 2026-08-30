import type { PaymentMethod } from "../model/paymentMethod";

/** Dados mockados (etapa offline). Formato = contrato do backend C# .NET. */
export const PAYMENT_METHODS_MOCK: PaymentMethod[] = [
  {
    id: "pm-card-visa",
    type: "CREDIT_CARD",
    label: "Cartão de crédito",
    brand: "Visa",
    last4: "4821",
    isDefault: true,
  },
  {
    id: "pm-pix",
    type: "PIX",
    label: "Pix",
    brand: null,
    last4: null,
    isDefault: false,
  },
  {
    id: "pm-on-pickup",
    type: "PAY_ON_PICKUP",
    label: "Pagar na retirada",
    brand: null,
    last4: null,
    isDefault: false,
  },
];
