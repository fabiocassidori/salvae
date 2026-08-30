import { useState } from "react";

import { useCurrentUserQuery, useUpdateProfileMutation } from "../services/profileQueries";

type FormState = { fullName: string; email: string; phone: string };

export function useEditProfileViewModel({ onSaved }: { onSaved: () => void }) {
  const { data: user } = useCurrentUserQuery();
  const updateProfile = useUpdateProfileMutation();

  const [draft, setDraft] = useState<FormState | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const form: FormState = draft ?? {
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  };

  const errors = {
    fullName: form.fullName.trim().length >= 3 ? undefined : "Informe seu nome completo.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? undefined : "E-mail inválido.",
    phone: form.phone.replace(/\D/g, "").length >= 10 ? undefined : "Telefone inválido.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  return {
    form,
    isSubmitting: updateProfile.isPending,
    errors: (showErrors ? errors : {}) as Partial<typeof errors>,
    setField: (field: keyof FormState, value: string) =>
      setDraft((current) => ({ ...(current ?? form), [field]: value })),
    submit: () => {
      if (!isValid) {
        setShowErrors(true);
        return;
      }
      updateProfile.mutate(
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        { onSuccess: onSaved },
      );
    },
  };
}
