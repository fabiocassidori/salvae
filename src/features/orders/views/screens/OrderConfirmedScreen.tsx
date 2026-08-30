import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, spacing } from "@/shared/theme";
import {
  Card,
  InfoRow,
  PrimaryButton,
  SafeAreaInsetBottom,
  Screen,
  SecondaryButton,
  Text,
} from "@/shared/ui";

import { useOrderDetailViewModel } from "../../viewmodels/useOrderDetailViewModel";

type Props = RootStackScreenProps<"OrderConfirmed">;

export function OrderConfirmedScreen({ navigation, route }: Props) {
  const vm = useOrderDetailViewModel(route.params.orderId);

  if (vm.isLoading || !vm.model) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }

  const m = vm.model;

  return (
    <Screen
      edges={["top", "left", "right"]}
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label="Acompanhar pedido"
            onPress={() => navigation.replace("OrderDetail", { orderId: route.params.orderId })}
          />
          <SecondaryButton
            label="Voltar ao início"
            onPress={() => navigation.navigate("Tabs", { screen: "InicioTab" })}
          />
          <SafeAreaInsetBottom />
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={40} color={colors.surfaceBase} />
        </View>
        <Text variant="titulo" style={styles.center}>
          Pedido confirmado!
        </Text>
        <Text variant="corpo" color="secondary" style={styles.center}>
          Mostre o número do pedido no {m.isPickup ? "balcão de retirada" : "recebimento"}.
        </Text>
      </View>

      <Card>
        <Text variant="apoio" color="secondary">
          Nº do pedido
        </Text>
        <Text variant="titulo" color="brand">
          {m.code}
        </Text>
      </Card>

      <Card>
        <InfoRow
          icon={m.isPickup ? "storefront-outline" : "bicycle-outline"}
          text={m.isPickup ? "Retirar em" : "Entregar em"}
          value={m.isPickup ? m.establishmentName : (m.deliveryAddressLine ?? "-")}
        />
        <InfoRow icon="time-outline" text="Janela" value={m.fulfillmentWindowLabel} />
        <InfoRow
          icon="card-outline"
          text="Pagamento"
          value={m.paidInApp ? `${m.paymentLabel} · aprovado` : `${m.paymentLabel} · na entrega`}
        />
        <InfoRow icon="leaf-outline" text="Impacto salvo" value={m.impactLabel} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xl },
  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  center: { textAlign: "center" },
  footer: { gap: spacing.sm },
});
