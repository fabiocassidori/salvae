import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, elevation, screenMargin, spacing } from "@/shared/theme";
import {
  Card,
  Divider,
  EmptyState,
  InfoRow,
  PrimaryButton,
  SafeAreaInsetBottom,
  Screen,
  ScreenHeader,
  SelectableRow,
  Text,
} from "@/shared/ui";

import { useCheckoutViewModel } from "../../viewmodels/useCheckoutViewModel";

type Props = RootStackScreenProps<"Checkout">;

export function CheckoutScreen({ navigation }: Props) {
  const vm = useCheckoutViewModel({
    onConfirmed: (orderId) => navigation.replace("OrderConfirmed", { orderId }),
    onAddCard: () => navigation.navigate("AddCard"),
    onChangeAddress: () => navigation.navigate("AddressList"),
  });

  if (vm.isEmpty) {
    return (
      <Screen padded={false}>
        <ScreenHeader title="Confirmar Pedido" onBack={navigation.goBack} />
        <EmptyState
          icon="bag-handle-outline"
          title="Sua sacola está vazia"
          description="Adicione um Salvado para concluir o pedido."
          actionLabel="Ver Salvados"
          onAction={() => navigation.navigate("Tabs", { screen: "InicioTab" })}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScreenHeader title="Confirmar Pedido" onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Itens */}
        {vm.summary.items.map((item) => (
          <Card key={item.id}>
            <Text variant="subtitulo">{item.label}</Text>
            <Text variant="apoio" color="secondary" style={styles.spaced}>
              {vm.establishmentName}
            </Text>
            <CountdownChipRow label={item.pickupWindowLabel} />
          </Card>
        ))}

        {/* Tipo de recebimento */}
        <View style={styles.section}>
          <Text variant="subtitulo">Como você quer receber</Text>
          <SelectableRow
            icon="storefront-outline"
            title="Retirar no local"
            subtitle="Sem taxa · retirada no estabelecimento parceiro"
            selected={vm.fulfillment === "PICKUP"}
            onPress={() => vm.setFulfillment("PICKUP")}
          />
          <SelectableRow
            icon="bicycle-outline"
            title="Receber por entrega"
            subtitle="Entregador parceiro · taxa à parte"
            selected={vm.fulfillment === "DELIVERY"}
            onPress={() => vm.setFulfillment("DELIVERY")}
          />
        </View>

        {/* Endereço / Local */}
        {vm.fulfillment === "PICKUP" ? (
          <Card>
            <Text variant="subtitulo" style={styles.spaced}>
              Local de retirada
            </Text>
            <InfoRow
              icon="location-outline"
              text={vm.establishmentName ?? "Estabelecimento"}
              value={vm.establishmentAddressLine ?? ""}
            />
          </Card>
        ) : (
          <Card>
            <View style={styles.rowBetween}>
              <Text variant="subtitulo">Entregar em</Text>
              <Pressable onPress={vm.onChangeAddress} hitSlop={8} accessibilityRole="button">
                <Text variant="corpo" color="brand">
                  Trocar
                </Text>
              </Pressable>
            </View>
            {vm.address ? (
              <InfoRow
                icon="location-outline"
                text={vm.address.label}
                value={vm.address.shortLabel}
              />
            ) : (
              <Text variant="apoio" color="error">
                Escolha um endereço para a entrega.
              </Text>
            )}
          </Card>
        )}

        {/* Pagamento */}
        <View style={styles.section}>
          <Text variant="subtitulo">Pagamento</Text>
          {vm.paymentOptions.map((option) => (
            <SelectableRow
              key={option.id}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              selected={option.id === vm.selectedPaymentId}
              onPress={() => vm.selectPayment(option.id)}
            />
          ))}
          <Pressable
            onPress={vm.onAddCard}
            style={styles.addCard}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text variant="corpo" color="brand">
              + Adicionar cartão
            </Text>
          </Pressable>
        </View>

        {/* Resumo */}
        <Card>
          <Text variant="subtitulo" style={styles.spaced}>
            Resumo
          </Text>
          <SummaryRow label="Subtotal" value={vm.summary.subtotalLabel} />
          <SummaryRow label="Taxa de entrega" value={vm.summary.deliveryFeeLabel} />
          <Divider inset />
          <SummaryRow label="Total" value={vm.summary.totalLabel} strong />
          <Text variant="apoio" color="secondary" style={styles.impact}>
            Impacto salvo: {vm.summary.impactLabel}
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Confirmar Pedido"
          onPress={vm.confirm}
          disabled={!vm.canConfirm}
          loading={vm.isSubmitting}
          trailingIcon="arrow-forward"
        />
        <SafeAreaInsetBottom />
      </View>
    </Screen>
  );
}

function CountdownChipRow({ label }: { label: string }) {
  return (
    <View style={styles.chipRow}>
      <Text variant="apoio" color="urgency">
        {label}
      </Text>
    </View>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.rowBetween}>
      <Text variant={strong ? "corpo" : "apoio"} color={strong ? "primary" : "secondary"}>
        {label}
      </Text>
      <Text variant={strong ? "subtitulo" : "corpo"}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.md },
  section: { gap: spacing.sm },
  spaced: { marginBottom: spacing.xs },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  chipRow: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    backgroundColor: colors.urgencyBg,
    borderRadius: 24,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  addCard: { paddingVertical: spacing.sm },
  impact: { marginTop: spacing.xs },
  footer: {
    paddingHorizontal: screenMargin,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceBase,
    ...elevation(2),
  },
});
