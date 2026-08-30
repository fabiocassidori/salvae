import { resolveDataSource } from "@/shared/data";

import type { AddressesRepository } from "./addresses.contract";
import { addressesHttp } from "./addresses.http";
import { addressesMock } from "./addresses.mock";

/** Camada de repositório da fatia `addresses` — único ponto de acesso a dados. */
export const addressesRepository: AddressesRepository = resolveDataSource({
  mock: addressesMock,
  http: addressesHttp,
});

export { __resetAddresses } from "./addresses.mock";
export type { AddressDraft, AddressesRepository } from "./addresses.contract";
