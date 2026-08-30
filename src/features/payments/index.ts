// API pública da fatia `payments`.
export { AddCardScreen } from "./views/screens/AddCardScreen";
export { usePaymentMethods, useSelectedPaymentMethod } from "./viewmodels/paymentHooks";
export type { PaymentMethodOption } from "./viewmodels/paymentHooks";

// Camada de repositório + hooks de query
export { paymentsRepository } from "./services/paymentsRepository";
export type { PaymentsRepository, NewCardInput } from "./services/paymentsRepository";
export { usePaymentMethodsQuery } from "./services/paymentsQueries";
export { useSelectedPaymentStore } from "./services/selectedPaymentStore";

export type { PaymentMethod, PaymentMethodType } from "./model/paymentMethod";
