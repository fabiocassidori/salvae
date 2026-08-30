import { resolveDataSource } from "@/shared/data";

import type { PaymentsRepository } from "./payments.contract";
import { paymentsHttp } from "./payments.http";
import { paymentsMock } from "./payments.mock";

/** Camada de repositório da fatia `payments` — único ponto de acesso a dados. */
export const paymentsRepository: PaymentsRepository = resolveDataSource({
  mock: paymentsMock,
  http: paymentsHttp,
});

export { __resetPaymentMethods } from "./payments.mock";
export type { PaymentsRepository, NewCardInput } from "./payments.contract";
