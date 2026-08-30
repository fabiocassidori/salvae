import { useMemo, useState } from "react";

import type { AddressKind } from "../model/address";
import { useAddressesQuery, useSaveAddressMutation } from "../services/addressesQueries";

type FormState = {
  label: string;
  kind: AddressKind;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  reference: string;
};

const EMPTY: FormState = {
  label: "",
  kind: "HOME",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  reference: "",
};

type Params = {
  addressId?: string;
  onSaved: () => void;
};

export function useAddressFormViewModel({ addressId, onSaved }: Params) {
  const { data: addresses } = useAddressesQuery();
  const saveAddress = useSaveAddressMutation();

  const initial = useMemo<FormState>(() => {
    const found = addressId ? addresses?.find((a) => a.id === addressId) : undefined;
    return found
      ? {
          label: found.label,
          kind: found.kind,
          zipCode: found.zipCode,
          street: found.street,
          number: found.number,
          complement: found.complement,
          district: found.district,
          city: found.city,
          state: found.state,
          reference: found.reference,
        }
      : EMPTY;
  }, [addressId, addresses]);

  const [form, setForm] = useState<FormState>(initial);
  const [dirty, setDirty] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Sincroniza com os dados carregados (edição) enquanto o usuário não digitou.
  const effectiveForm = dirty ? form : initial;

  const errors = {
    label: effectiveForm.label.trim() ? undefined : "Dê um nome a este endereço.",
    street: effectiveForm.street.trim() ? undefined : "Informe a rua.",
    number: effectiveForm.number.trim() ? undefined : "Informe o número.",
    district: effectiveForm.district.trim() ? undefined : "Informe o bairro.",
    city: effectiveForm.city.trim() ? undefined : "Informe a cidade.",
    state: effectiveForm.state.trim().length === 2 ? undefined : "UF com 2 letras.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  const update = (patch: Partial<FormState>) => {
    setDirty(true);
    setForm((f) => ({ ...(dirty ? f : initial), ...patch }));
  };

  return {
    isEditing: Boolean(addressId),
    isSubmitting: saveAddress.isPending,
    form: effectiveForm,
    errors: (showErrors ? errors : {}) as Partial<typeof errors>,
    setField: (field: keyof FormState, value: string) => update({ [field]: value }),
    setKind: (kind: AddressKind) => update({ kind }),
    submit: () => {
      if (!isValid) {
        setShowErrors(true);
        return;
      }
      saveAddress.mutate(
        {
          id: addressId,
          label: effectiveForm.label.trim(),
          kind: effectiveForm.kind,
          street: effectiveForm.street.trim(),
          number: effectiveForm.number.trim(),
          complement: effectiveForm.complement.trim(),
          district: effectiveForm.district.trim(),
          city: effectiveForm.city.trim(),
          state: effectiveForm.state.trim().toUpperCase(),
          zipCode: effectiveForm.zipCode.trim(),
          reference: effectiveForm.reference.trim(),
        },
        { onSuccess: onSaved },
      );
    },
  };
}
