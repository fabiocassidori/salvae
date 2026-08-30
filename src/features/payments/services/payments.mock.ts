import { mockResponse } from "@/shared/lib";

import {
  paymentMethodListSchema,
  paymentMethodSchema,
  type PaymentMethod,
} from "../model/paymentMethod";
import type { PaymentsRepository } from "./payments.contract";
import { PAYMENT_METHODS_MOCK } from "./payments.fixtures";

let METHODS: PaymentMethod[] = [...PAYMENT_METHODS_MOCK];
let cardSeq = 0;

export const paymentsMock: PaymentsRepository = {
  async getMethods() {
    return mockResponse(paymentMethodListSchema.parse(METHODS));
  },

  async addCard(input) {
    const card = paymentMethodSchema.parse({
      id: `pm-card-${(cardSeq += 1)}`,
      type: "CREDIT_CARD",
      label: input.holderName || "Cartão de crédito",
      brand: input.brand,
      last4: input.last4,
      isDefault: false,
    });
    METHODS = [...METHODS, card];
    return mockResponse(card);
  },
};

/** Apenas para testes. */
export function __resetPaymentMethods(): void {
  METHODS = [...PAYMENT_METHODS_MOCK];
  cardSeq = 0;
}
