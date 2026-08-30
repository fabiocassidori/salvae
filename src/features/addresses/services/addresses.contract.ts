import type { Address } from "../model/address";

export type AddressDraft = Omit<Address, "id" | "isDefault"> & {
  id?: string;
  isDefault?: boolean;
};

/** Contrato do repositório de endereços (= contrato do backend C# .NET). */
export type AddressesRepository = {
  getAddresses(): Promise<Address[]>;
  /** Cria (sem `id`) ou atualiza (com `id`) e retorna o endereço persistido. */
  saveAddress(draft: AddressDraft): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
};
