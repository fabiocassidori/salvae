import { z } from "zod";

export const addressKindSchema = z.enum(["HOME", "WORK", "OTHER"]);
export type AddressKind = z.infer<typeof addressKindSchema>;

export const addressSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: addressKindSchema,
  street: z.string(),
  number: z.string(),
  complement: z.string().default(""),
  district: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zipCode: z.string(),
  reference: z.string().default(""),
  isDefault: z.boolean(),
});
export type Address = z.infer<typeof addressSchema>;
export const addressListSchema = z.array(addressSchema);

/** Rótulo curto para o cabeçalho ("Entregar em ..."). */
export function shortAddressLabel(a: Address): string {
  return `${a.street}, ${a.number}`;
}

/** Endereço multilinha para o `AddressCard`. */
export function formatAddress(a: Address): string {
  const line1 = a.complement
    ? `${a.street}, ${a.number} - ${a.complement}`
    : `${a.street}, ${a.number}`;
  return `${line1}\n${a.district}, ${a.city} - ${a.state}\n${a.zipCode}`;
}

export function addressIcon(kind: AddressKind): "home" | "briefcase" | "location" {
  if (kind === "HOME") return "home";
  if (kind === "WORK") return "briefcase";
  return "location";
}
