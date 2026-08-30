import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  EstablishmentScreen,
  ExploreScreen,
  FeedScreen,
  SalvadoDetailScreen,
  SalvadoListScreen,
} from "@/features/establishments";
import { CartScreen } from "@/features/cart";
import { CheckoutScreen } from "@/features/checkout";
import { NotificationsScreen } from "@/features/notifications";
import { OrderConfirmedScreen, OrderDetailScreen, OrderListScreen } from "@/features/orders";
import { AddressFormScreen, AddressListScreen } from "@/features/addresses";
import { AddCardScreen } from "@/features/payments";
import { ImpactScreen } from "@/features/impact";
import { EditProfileScreen, ProfileScreen, SettingsScreen } from "@/features/profile";
import { colors } from "@/shared/theme";

import { AppTabBar } from "./AppTabBar";
import type { RootStackParamList, RootTabParamList } from "./routes";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tab.Screen name="InicioTab" component={FeedScreen} />
      <Tab.Screen name="ExplorarTab" component={ExploreScreen} />
      <Tab.Screen name="PedidosTab" component={OrderListScreen} />
      <Tab.Screen name="PerfilTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * RootStack: abas + telas empilháveis transversais. A camada `app/` monta a
 * navegação com as telas expostas pelos barrels de cada fatia — as fatias não
 * conhecem umas às outras via navegação.
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surfaceBg } }}
      >
        <Stack.Screen name="Tabs" component={Tabs} />

        <Stack.Screen name="SalvadoDetail" component={SalvadoDetailScreen} />
        <Stack.Screen name="SalvadoList" component={SalvadoListScreen} />
        <Stack.Screen name="Establishment" component={EstablishmentScreen} />

        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddressList" component={AddressListScreen} />
        <Stack.Screen name="AddressForm" component={AddressFormScreen} />
        <Stack.Screen name="AddCard" component={AddCardScreen} />
        <Stack.Screen name="Impact" component={ImpactScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
