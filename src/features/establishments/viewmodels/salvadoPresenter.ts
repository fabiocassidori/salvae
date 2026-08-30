import type { OfferCardModel } from "@/shared/ui";

import { formatDistance } from "../model/establishment";
import { impactValueInCents, type SalvadoWithEstablishment } from "../model/salvado";

/**
 * Presenter puro: entidade de domínio → modelo de apresentação.
 * Compartilhado pelas ViewModels desta fatia e pela Home.
 */
export function toOfferCardModel({
  salvado,
  establishment,
}: SalvadoWithEstablishment): OfferCardModel {
  return {
    id: salvado.id,
    salvadoName: salvado.name,
    establishmentName: establishment.name,
    imageUrl: salvado.imageUrl,
    distanceLabel: formatDistance(establishment.distanceMeters),
    originalPriceInCents: salvado.originalPriceInCents,
    priceInCents: salvado.priceInCents,
    expiresAt: salvado.offerExpiresAt,
    isSafe: salvado.isSafe,
  };
}

export type SalvadoDetailModel = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  establishmentId: string;
  establishmentName: string;
  distanceLabel: string;
  isSurpriseBag: boolean;
  isOfferOpen: boolean;
  quantityAvailable: number;
  offerExpiresAt: string;
  pickupWindowLabel: string;
  originalPriceInCents: number;
  priceInCents: number;
  impactValueInCents: number;
  weightGrams: number;
  safetySeal: { availability: string; conservation: string; responsible: string };
  consumeWithinLabel: string | null;
};

export function toSalvadoDetailModel({
  salvado,
  establishment,
}: SalvadoWithEstablishment): SalvadoDetailModel {
  return {
    id: salvado.id,
    name: salvado.name,
    description: salvado.description,
    imageUrl: salvado.imageUrl,
    establishmentId: establishment.id,
    establishmentName: establishment.name,
    distanceLabel: formatDistance(establishment.distanceMeters),
    isSurpriseBag: salvado.kind === "SURPRISE_BAG",
    isOfferOpen:
      new Date(salvado.offerExpiresAt).getTime() > Date.now() && salvado.quantityAvailable > 0,
    quantityAvailable: salvado.quantityAvailable,
    offerExpiresAt: salvado.offerExpiresAt,
    pickupWindowLabel: salvado.pickupWindow.label,
    originalPriceInCents: salvado.originalPriceInCents,
    priceInCents: salvado.priceInCents,
    impactValueInCents: impactValueInCents(salvado),
    weightGrams: salvado.weightGrams,
    safetySeal: {
      availability: salvado.safetySeal.availability,
      conservation: salvado.safetySeal.conservation,
      responsible: salvado.safetySeal.responsible,
    },
    consumeWithinLabel:
      salvado.safetySeal.consumeWithinHours != null
        ? `Consumir em até ${salvado.safetySeal.consumeWithinHours}h após a retirada`
        : null,
  };
}
