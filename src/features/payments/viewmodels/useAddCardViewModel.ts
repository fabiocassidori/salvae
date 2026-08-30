import { useState } from "react";

import { useAddCardMutation } from "../services/paymentsQueries";

type FormState = { number: string; holderName: string; expiry: string; cvv: string };

const EMPTY: FormState = { number: "", holderName: "", expiry: "", cvv: "" };

function detectBrand(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(4011|4312|4389|636)/.test(digits)) return "Elo";
  return "Cartão";
}

export function useAddCardViewModel({ onSaved }: { onSaved: () => void }) {
  const addCard = useAddCardMutation();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);

  const digits = form.number.replace(/\D/g, "");
  const errors = {
    number: digits.length >= 13 && digits.length <= 19 ? undefined : "Número do cartão inválido.",
    holderName: form.holderName.trim() ? undefined : "Informe o nome impresso no cartão.",
    expiry: /^\d{2}\/\d{2}$/.test(form.expiry) ? undefined : "Use o formato MM/AA.",
    cvv: /^\d{3,4}$/.test(form.cvv) ? undefined : "CVV inválido.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  return {
    form,
    isSubmitting: addCard.isPending,
    errors: (showErrors ? errors : {}) as Partial<typeof errors>,
    setField: (field: keyof FormState, value: string) => setForm((f) => ({ ...f, [field]: value })),
    submit: () => {
      if (!isValid) {
        setShowErrors(true);
        return;
      }
      addCard.mutate(
        {
          holderName: form.holderName.trim(),
          brand: detectBrand(form.number),
          last4: digits.slice(-4),
        },
        { onSuccess: onSaved },
      );
    },
  };
}
