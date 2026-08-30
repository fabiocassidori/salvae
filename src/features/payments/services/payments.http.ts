import { httpClient } from "@/shared/api";

import { paymentMethodListSchema, paymentMethodSchema } from "../model/paymentMethod";
import type { PaymentsRepository } from "./payments.contract";

export const paymentsHttp: PaymentsRepository = {
  async getMethods() {
    const { data } = await httpClient.get("/pagamentos/metodos");
    return paymentMethodListSchema.parse(data);
  },
  async addCard(input) {
    const { data } = await httpClient.post("/pagamentos/cartoes", input);
    return paymentMethodSchema.parse(data);
  },
};
