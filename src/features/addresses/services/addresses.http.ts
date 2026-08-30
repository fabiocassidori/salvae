import { httpClient } from "@/shared/api";

import { addressListSchema, addressSchema } from "../model/address";
import type { AddressesRepository } from "./addresses.contract";

export const addressesHttp: AddressesRepository = {
  async getAddresses() {
    const { data } = await httpClient.get("/enderecos");
    return addressListSchema.parse(data);
  },

  async saveAddress(draft) {
    const { data } = draft.id
      ? await httpClient.put(`/enderecos/${draft.id}`, draft)
      : await httpClient.post("/enderecos", draft);
    return addressSchema.parse(data);
  },

  async deleteAddress(id) {
    await httpClient.delete(`/enderecos/${id}`);
  },
};
