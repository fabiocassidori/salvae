// API pública da fatia `addresses`.
export { AddressListScreen } from "./views/screens/AddressListScreen";
export { AddressFormScreen } from "./views/screens/AddressFormScreen";
export { useSelectedAddress } from "./viewmodels/addressHooks";
export type { SelectedAddress } from "./viewmodels/addressHooks";

// Camada de repositório + hooks de query
export { addressesRepository } from "./services/addressesRepository";
export type { AddressesRepository, AddressDraft } from "./services/addressesRepository";
export { useAddressesQuery } from "./services/addressesQueries";
export { useSelectedAddressStore } from "./services/selectedAddressStore";

export { formatAddress, shortAddressLabel, addressIcon } from "./model/address";
export type { Address, AddressKind } from "./model/address";
