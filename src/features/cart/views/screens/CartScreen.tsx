import { Image, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, elevation, screenMargin, spacing } from "@/shared/theme";
import {
  Card,
  Divider,
  EmptyState,
  PrimaryButton,
  QuantityStepper,
  SafeAreaInsetBottom,
  Screen,
  ScreenHeader,
  Text,
} from "@/shared/ui";

import { useCartViewModel } from "../../viewmodels/useCartViewModel";

type Props = RootStackScreenProps<"Cart">;

export function CartScreen({ navigation }: Props) {
  const vm = useCartViewModel({
    onCheckout: () => navigation.navigate("Checkout"),
    onKeepBrowsing: () => navigation.navigate("Tabs", { screen: "InicioTab" }),
  });

  if (vm.isEmpty) {
    return (
      <Screen padded={false}>
        <ScreenHeader title="Sacola" onBack={navigation.goBack} />
        <EmptyState
          icon="bag-handle-outline"
          title="Sua sacola está vazia"
          description="Escolha um Salvado para começar a resgatar comida."
          actionLabel="Ver Salvados"
          onAction={vm.onKeepBrowsing}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScreenHeader title="Sacola" onBack={navigation.goBack} />
      <View style={styles.content}>
        {vm.establishmentName ? (
          <Text variant="apoio" color="secondary">
            Retirada em {vm.establishmentName}
          </Text>
        ) : null}

        {vm.rows.map((row) => (
          <Card key={row.id} style={styles.line}>
            <Image source={{ uri: row.imageUrl }} style={styles.image} />
            <View style={styles.lineBody}>
              <Text variant="corpo" numberOfLines={2}>
                {row.name}
              </Text>
              <Text variant="apoio" color="secondary">
                {row.pickupWindowLabel}
              </Text>
              <View style={styles.lineFooter}>
                <QuantityStepper
                  value={row.quantity}
                  onChange={(next) => vm.setQuantity(row.id, next)}
                  max={row.maxQuantity}
                />
                <Text variant="corpo">{row.lineTotalLabel}</Text>
              </View>
            </View>
          </Card>
        ))}

        <Card>
          <View style={styles.summaryRow}>
            <Text variant="corpo" color="secondary">
              Subtotal
            </Text>
            <Text variant="subtitulo">{vm.subtotalLabel}</Text>
          </View>
          <Divider inset />
          <View style={styles.summaryRow}>
            <Text variant="apoio" color="secondary">
              Impacto salvo
            </Text>
            <Text variant="apoio" color="secondary">
              {vm.impactValueLabel} · {vm.impactWeightLabel} de comida
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Ir para o pagamento"
          onPress={vm.onCheckout}
          trailingIcon="arrow-forward"
        />
        <SafeAreaInsetBottom />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.sm, flex: 1 },
  line: { flexDirection: "row", gap: spacing.md },
  image: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.border },
  lineBody: { flex: 1, gap: spacing.xs },
  lineFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footer: {
    paddingHorizontal: screenMargin,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceBase,
    ...elevation(2),
  },
});
