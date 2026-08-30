// ─── API pública da fatia `establishments` (Salvados + parceiros) ─────────────

// Views (registradas pelo RootNavigator)
export { FeedScreen } from "./views/screens/FeedScreen";
export { ExploreScreen } from "./views/screens/ExploreScreen";
export { SalvadoDetailScreen } from "./views/screens/SalvadoDetailScreen";
export { SalvadoListScreen } from "./views/screens/SalvadoListScreen";
export { EstablishmentScreen } from "./views/screens/EstablishmentScreen";

// Camada de repositório + hooks de query — para outras fatias montarem ViewModels
export {
  useFeedQuery,
  useSalvadoQuery,
  useSearchSalvadosQuery,
  establishmentsKeys,
} from "./services/establishmentsQueries";
export { establishmentsRepository } from "./services/establishmentsRepository";
export type { EstablishmentsRepository } from "./services/establishments.contract";

// Presenter compartilhado
export { toOfferCardModel } from "./viewmodels/salvadoPresenter";

// Model — entidades, enums e regras de domínio (contrato do backend)
export type {
  Salvado,
  SalvadoCategory,
  SalvadoKind,
  SalvadoWithEstablishment,
  PickupWindow,
  SafetySealInfo,
} from "./model/salvado";
export {
  impactValueInCents,
  impactWeightGrams,
  discountPercent,
  isOfferOpen,
  salvadoCategoryLabel,
} from "./model/salvado";
export type { Establishment, EstablishmentCategory } from "./model/establishment";
export { formatDistance, establishmentCategoryLabel } from "./model/establishment";
