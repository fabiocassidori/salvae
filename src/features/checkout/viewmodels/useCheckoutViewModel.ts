import { useMemo, useState } from "react";

import { useSelectedAddress } from "@/features/addresses";
import { useCartSummary, useCartStore } from "@/features/cart";
import { useCreateOrderMutation, type FulfillmentType } from "@/features/orders";
import { usePaymentMethods } from "@/features/payments";
import { formatCurrencyBRL, formatWeightKg } from "@/shared/utils";

import {
  checkoutTotalInCents,
  deliveryFeeInCents,
  fulfillmentWindowLabel,
} from "../model/checkout";

type Params = {
  onConfirmed: (orderId: string) => void;
  onAddCard: () => void;
  onChangeAddress: () => void;
};

/** VIEWMODEL do Checkout ("Confirmar Pedido"). */
export function useCheckoutViewModel({ onConfirmed, onAddCard, onChangeAddress }: Params) {
  const cart = useCartSummary();
  const clearCart = useCartStore((s) => s.clear);
  const address = useSelectedAddress();
  const payments = usePaymentMethods();
  const createOrder = useCreateOrderMutation();

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("PICKUP");

  const deliveryFee = deliveryFeeInCents(fulfillment);
  const total = checkoutTotalInCents(cart.subtotalInCents, fulfillment);

  const selectedPayment = payments.options.find((o) => o.id === payments.selectedId) ?? null;
  const pickupLabel = cart.lines[0]?.pickupWindowLabel ?? "Retirar hoje";

  const canConfirm =
    !cart.isEmpty &&
    !!selectedPayment &&
    (fulfillment === "PICKUP" || !!address) &&
    !createOrder.isPending;

  const summary = useMemo(
    () => ({
      items: cart.lines.map((l) => ({
        id: l.id,
        label: `${l.quantity}× ${l.name}`,
        priceLabel: formatCurrencyBRL(l.unitPriceInCents * l.quantity),
        pickupWindowLabel: l.pickupWindowLabel,
      })),
      subtotalLabel: formatCurrencyBRL(cart.subtotalInCents),
      deliveryFeeLabel: deliveryFee === 0 ? "Grátis" : formatCurrencyBRL(deliveryFee),
      totalLabel: formatCurrencyBRL(total),
      impactLabel: `${formatCurrencyBRL(cart.impactValueInCents)} · ${formatWeightKg(
        cart.impactWeightGrams,
      )} de comida`,
    }),
    [cart, deliveryFee, total],
  );

  return {
    establishmentName: cart.establishmentName,
    establishmentAddressLine: cart.establishmentAddressLine,
    isEmpty: cart.isEmpty,

    fulfillment,
    setFulfillment,

    address: address ? { label: address.label, shortLabel: address.shortLabel } : null,
    onChangeAddress,

    paymentOptions: payments.options,
    selectedPaymentId: payments.selectedId,
    selectPayment: payments.select,
    onAddCard,

    summary,
    canConfirm,
    isSubmitting: createOrder.isPending,
    hasError: createOrder.isError,

    confirm: () => {
      if (!canConfirm || !selectedPayment) return;
      createOrder.mutate(
        {
          fulfillmentType: fulfillment,
          establishment: {
            id: cart.establishmentId ?? "",
            name: cart.establishmentName ?? "",
            addressLine: cart.establishmentAddressLine ?? "",
          },
          lines: cart.lines.map((l) => ({
            salvadoId: l.salvadoId,
            name: l.name,
            quantity: l.quantity,
            unitPriceInCents: l.unitPriceInCents,
          })),
          fulfillmentWindowLabel: fulfillmentWindowLabel(fulfillment, pickupLabel),
          deliveryAddressLine:
            fulfillment === "DELIVERY" && address
              ? `${address.shortLabel} · ${address.label}`
              : null,
          subtotalInCents: cart.subtotalInCents,
          deliveryFeeInCents: deliveryFee,
          paymentLabel: selectedPayment.title,
          paidInApp: !selectedPayment.isOnPickup,
          impactValueInCents: cart.impactValueInCents,
          impactWeightGrams: cart.impactWeightGrams,
        },
        {
          onSuccess: (order) => {
            clearCart();
            onConfirmed(order.id);
          },
        },
      );
    },
  };
}
