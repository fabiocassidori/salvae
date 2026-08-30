import type { PaymentMethod } from "../model/paymentMethod";

export type NewCardInput = { holderName: string; brand: string; last4: string };

/** Contrato do repositório de formas de pagamento (= contrato do backend C# .NET). */
export type PaymentsRepository = {
  getMethods(): Promise<PaymentMethod[]>;
  addCard(input: NewCardInput): Promise<PaymentMethod>;
};
