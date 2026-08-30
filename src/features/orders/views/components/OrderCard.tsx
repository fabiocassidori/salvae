import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/shared/theme";
import { Card, Divider, SecondaryButton, StatusPill, Tag, Text } from "@/shared/ui";

import type { OrderListItem } from "../../viewmodels/orderPresenter";

type OrderCardProps = {
  order: OrderListItem;
  onOpen: (orderId: string) => void;
};

/** Card do pedido em andamento (tela Meus Pedidos). */
export function OrderCard({ order, onOpen }: OrderCardProps) {
  return (
    <Card>
      <View style={styles.topRow}>
        <StatusPill tone={order.statusTone} label={order.statusLabel} />
        <Tag label={order.dayLabel} tone="neutral" />
      </View>

      <Text variant="subtitulo" style={styles.spaced}>
        {order.establishmentName}
      </Text>
      <Text variant="apoio" color="secondary">
        {order.itemsLabel}
      </Text>

      <View style={styles.infoBox}>
        <Text variant="apoio">{order.fulfillmentWindowLabel}</Text>
      </View>

      <Divider inset />

      <View style={styles.bottomRow}>
        <View>
          <Text variant="apoio" color="secondary">
            Nº do pedido
          </Text>
          <Text variant="subtitulo">{order.code}</Text>
        </View>
        <SecondaryButton label="Ver detalhes" onPress={() => onOpen(order.id)} fullWidth={false} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  spaced: { marginBottom: 2 },
  infoBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.brandTint,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
