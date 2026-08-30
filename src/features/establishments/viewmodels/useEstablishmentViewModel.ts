import { useMemo } from "react";

import { establishmentCategoryLabel, formatDistance } from "../model/establishment";
import {
  useEstablishmentQuery,
  useEstablishmentSalvadosQuery,
} from "../services/establishmentsQueries";
import { toOfferCardModel } from "./salvadoPresenter";

type Params = {
  establishmentId: string;
  onOpenSalvado: (salvadoId: string) => void;
};

/** VIEWMODEL do Perfil do Estabelecimento parceiro. */
export function useEstablishmentViewModel({ establishmentId, onOpenSalvado }: Params) {
  const establishmentQuery = useEstablishmentQuery(establishmentId);
  const salvadosQuery = useEstablishmentSalvadosQuery(establishmentId);

  const header = useMemo(() => {
    const e = establishmentQuery.data;
    if (!e) return null;
    return {
      name: e.name,
      categoryLabel: establishmentCategoryLabel[e.category],
      coverUrl: e.coverUrl,
      addressLine: e.addressLine,
      distanceLabel: formatDistance(e.distanceMeters),
      ratingLabel: e.rating.toFixed(1),
      safetyRatingLabel: e.safetyRating.toFixed(1),
      isVerifiedPartner: e.isVerifiedPartner,
    };
  }, [establishmentQuery.data]);

  const offers = useMemo(
    () => (salvadosQuery.data ?? []).map(toOfferCardModel),
    [salvadosQuery.data],
  );

  return {
    header,
    offers,
    isLoading: establishmentQuery.isPending,
    hasError: establishmentQuery.isError,
    onOpenSalvado,
  };
}
