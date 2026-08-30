import { mockResponse } from "@/shared/lib";

import { addressListSchema, addressSchema, type Address } from "../model/address";
import type { AddressesRepository } from "./addresses.contract";
import { ADDRESSES_MOCK } from "./addresses.fixtures";

/** Fake DB em memória — substituído por chamadas HTTP quando houver backend. */
let ADDRESSES: Address[] = [...ADDRESSES_MOCK];
let addrSeq = 0;

export const addressesMock: AddressesRepository = {
  async getAddresses() {
    return mockResponse(addressListSchema.parse(ADDRESSES));
  },

  async saveAddress(draft) {
    const id = draft.id ?? `addr-${(addrSeq += 1)}`;
    const exists = ADDRESSES.some((a) => a.id === id);
    const saved = addressSchema.parse({
      ...draft,
      id,
      isDefault: draft.isDefault ?? (!exists && ADDRESSES.length === 0),
    });
    ADDRESSES = exists ? ADDRESSES.map((a) => (a.id === id ? saved : a)) : [...ADDRESSES, saved];
    return mockResponse(saved);
  },

  async deleteAddress(id) {
    ADDRESSES = ADDRESSES.filter((a) => a.id !== id);
    return mockResponse(undefined);
  },
};

/** Apenas para testes. */
export function __resetAddresses(): void {
  ADDRESSES = [...ADDRESSES_MOCK];
  addrSeq = 0;
}
