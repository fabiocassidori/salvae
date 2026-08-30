import type { Address } from "../model/address";

/** Dados mockados (etapa offline). Formato = contrato do backend C# .NET. */
export const ADDRESSES_MOCK: Address[] = [
  {
    id: "addr-casa",
    label: "Casa",
    kind: "HOME",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 42",
    district: "Pinheiros",
    city: "São Paulo",
    state: "SP",
    zipCode: "05432-010",
    reference: "Portão azul",
    isDefault: true,
  },
  {
    id: "addr-trabalho",
    label: "Trabalho",
    kind: "WORK",
    street: "Av. Paulista",
    number: "1000",
    complement: "Andar 15",
    district: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    reference: "",
    isDefault: false,
  },
];
