import { z } from "zod";

/**
 * Formas de pagamento. Decisão do projeto: compra ocorre no app (cartão, Pix) e
 * também é possível "pagar na retirada/entrega" (offline).
 */
export const paymentMethodTypeSchema = z.enum(["CREDIT_CARD", "PIX", "PAY_ON_PICKUP"]);
export type PaymentMethodType = z.infer<typeof paymentMethodTypeSchema>;

export const paymentMethodSchema = z.object({
  id: z.string(),
  type: paymentMethodTypeSchema,
  label: z.string(),
  /** Bandeira do cartão (quando CREDIT_CARD). */
  brand: z.string().nullable(),
  /** 4 últimos dígitos (quando CREDIT_CARD). */
  last4: z.string().nullable(),
  isDefault: z.boolean(),
});
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export const paymentMethodListSchema = z.array(paymentMethodSchema);

export function paymentMethodIcon(
  type: PaymentMethodType,
): "card-outline" | "qr-code-outline" | "cash-outline" {
  if (type === "CREDIT_CARD") return "card-outline";
  if (type === "PIX") return "qr-code-outline";
  return "cash-outline";
}

export function paymentMethodSubtitle(method: PaymentMethod): string {
  if (method.type === "CREDIT_CARD")
    return `${method.brand ?? "Cartão"} •••• ${method.last4 ?? ""}`;
  if (method.type === "PIX") return "Pagamento instantâneo no app";
  return "Dinheiro, Pix ou cartão na hora da retirada/entrega";
}
