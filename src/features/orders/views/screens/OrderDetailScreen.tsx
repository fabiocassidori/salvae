import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import {
  Card,
  Divider,
  EmptyState,
  InfoRow,
  Screen,
  ScreenHeader,
  StatusPill,
  Text,
} from "@/shared/ui";

import { useOrderDetailViewModel } from "../../viewmodels/useOrderDetailViewModel";

type Props = RootStackScreenProps<"OrderDetail">;

export function OrderDetailScreen({ navigation, route }: Props) {
  const vm = useOrderDetailViewModel(route.params.orderId);

  if (vm.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }
  if (vm.hasError || !vm.model) {
    return (
      <EmptyState title="Pedido não encontrado" actionLabel="Voltar" onAction={navigation.goBack} />
    );
  }

  const m = vm.model;

  return (
    <Screen padded={false}>
      <ScreenHeader title={`Pedido ${m.code}`} onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StatusPill tone={m.statusTone} label={m.statusLabel} />

        <Card>
          <Text variant="subtitulo" style={styles.cardTitle}>
            Acompanhamento
          </Text>
          {m.timeline.map((step) => (
            <View key={step.label} style={styles.step}>
              <Ionicons
                name={step.reached ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={step.reached ? colors.brandPrimary : colors.border}
              />
              <Text
                variant={step.current ? "corpo" : "apoio"}
                color={step.reached ? "primary" : "secondary"}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text variant="subtitulo" style={styles.cardTitle}>
            {m.isPickup ? "Retirada" : "Entrega"}
          </Text>
          <InfoRow icon="storefront-outline" text="Estabelecimento" value={m.establishmentName} />
          <InfoRow
            icon="location-outline"
            text={m.isPickup ? "Endereço de retirada" : "Endereço de entrega"}
            value={m.isPickup ? m.establishmentAddressLine : (m.deliveryAddressLine ?? "-")}
          />
          <InfoRow icon="time-outline" text="Janela" value={m.fulfillmentWindowLabel} />
        </Card>

        <Card>
          <Text variant="subtitulo" style={styles.cardTitle}>
            Itens
          </Text>
          {m.lines.map((line) => (
            <View key={line.id} style={styles.lineRow}>
              <Text variant="corpo" style={styles.lineLabel}>
                {line.label}
              </Text>
              <Text variant="corpo">{line.priceLabel}</Text>
            </View>
          ))}
          <Divider inset />
          <SummaryRow label="Subtotal" value={m.subtotalLabel} />
          <SummaryRow label="Taxa de entrega" value={m.deliveryFeeLabel} />
          <SummaryRow label="Total" value={m.totalLabel} strong />
        </Card>

        <Card>
          <InfoRow
            icon="card-outline"
            text="Pagamento"
            value={`${m.paymentLabel}${m.paidInApp ? " · pago no app" : " · na retirada/entrega"}`}
          />
          <InfoRow icon="leaf-outline" text="Impacto salvo" value={m.impactLabel} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text variant={strong ? "corpo" : "apoio"} color={strong ? "primary" : "secondary"}>
        {label}
      </Text>
      <Text variant={strong ? "subtitulo" : "corpo"}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.md },
  cardTitle: { marginBottom: spacing.sm },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  lineRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  lineLabel: { flex: 1 },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
});
