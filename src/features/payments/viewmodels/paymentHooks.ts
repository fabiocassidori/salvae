import {
  paymentMethodIcon,
  paymentMethodSubtitle,
  type PaymentMethod,
} from "../model/paymentMethod";
import { usePaymentMethodsQuery } from "../services/paymentsQueries";
import { useSelectedPaymentStore } from "../services/selectedPaymentStore";

export type PaymentMethodOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReturnType<typeof paymentMethodIcon>;
  isOnPickup: boolean;
};

function toOption(method: PaymentMethod): PaymentMethodOption {
  return {
    id: method.id,
    title: method.label,
    subtitle: paymentMethodSubtitle(method),
    icon: paymentMethodIcon(method.type),
    isOnPickup: method.type === "PAY_ON_PICKUP",
  };
}

function resolveSelectedId(methods: PaymentMethod[], selectedId: string | null): string | null {
  if (selectedId && methods.some((m) => m.id === selectedId)) return selectedId;
  return methods.find((m) => m.isDefault)?.id ?? methods[0]?.id ?? null;
}

/** Lista de formas de pagamento + seleção, para o checkout. */
export function usePaymentMethods() {
  const { data, isPending } = usePaymentMethodsQuery();
  const selectedId = useSelectedPaymentStore((s) => s.selectedId);
  const select = useSelectedPaymentStore((s) => s.select);
  const methods = data ?? [];

  return {
    options: methods.map(toOption),
    selectedId: resolveSelectedId(methods, selectedId),
    select,
    isLoading: isPending,
  };
}

export function useSelectedPaymentMethod(): PaymentMethodOption | null {
  const { data } = usePaymentMethodsQuery();
  const selectedId = useSelectedPaymentStore((s) => s.selectedId);
  const methods = data ?? [];
  const id = resolveSelectedId(methods, selectedId);
  const method = methods.find((m) => m.id === id);
  return method ? toOption(method) : null;
}
