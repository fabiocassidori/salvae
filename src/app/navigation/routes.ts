import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Contrato de navegação do app.
 *
 * O `RootStack` (native-stack) contém as abas + as telas "empilháveis" que são
 * transversais a mais de uma aba (Detalhe do Salvado, Sacola, Checkout, Pedido,
 * e as telas internas do Perfil). As telas de `views/` de cada feature são
 * tipadas contra este contrato; a montagem final vive em `RootNavigator`.
 */
export type RootTabParamList = {
  InicioTab: undefined;
  ExplorarTab: undefined;
  PedidosTab: undefined;
  PerfilTab: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;

  // Catálogo (fatia establishments)
  SalvadoDetail: { salvadoId: string };
  SalvadoList: undefined;
  Establishment: { establishmentId: string };

  // Compra
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmed: { orderId: string };

  // Pedidos
  OrderDetail: { orderId: string };

  // Perfil e conta
  EditProfile: undefined;
  Settings: undefined;
  AddressList: undefined;
  AddressForm: { addressId?: string } | undefined;
  AddCard: undefined;
  Impact: undefined;
  Notifications: undefined;
};

/** Props de uma tela empilhável do RootStack. */
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/** Props de uma tela de aba — combina o navigator de abas com o RootStack pai. */
export type TabScreenProps<T extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export const ROOT_TABS = {
  inicio: "InicioTab",
  explorar: "ExplorarTab",
  pedidos: "PedidosTab",
  perfil: "PerfilTab",
} as const;
