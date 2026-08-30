import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TabScreenProps } from "@/app/navigation";
import { colors, elevation, screenMargin, spacing } from "@/shared/theme";
import { Card, EmptyState, Screen, Text } from "@/shared/ui";

import { useOrderListViewModel } from "../../viewmodels/useOrderListViewModel";
import { OrderCard } from "../components/OrderCard";

type Props = TabScreenProps<"PedidosTab">;

export function OrderListScreen({ navigation }: Props) {
  const vm = useOrderListViewModel({
    onOpenOrder: (orderId) => navigation.navigate("OrderDetail", { orderId }),
    onExplore: () => navigation.navigate("Tabs", { screen: "InicioTab" }),
  });

  if (vm.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }

  if (vm.isEmpty) {
    return (
      <Screen padded={false}>
        <Header />
        <EmptyState
          icon="receipt-outline"
          title="Você ainda não tem pedidos"
          description="Quando resgatar um Salvado, o acompanhamento aparece aqui."
          actionLabel="Ver Salvados"
          onAction={vm.onExplore}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {vm.active.length > 0 ? (
          <View style={styles.section}>
            <Text variant="subtitulo">Em andamento</Text>
            {vm.active.map((order) => (
              <OrderCard key={order.id} order={order} onOpen={vm.onOpenOrder} />
            ))}
          </View>
        ) : null}

        {vm.history.length > 0 ? (
          <View style={styles.section}>
            <Text variant="subtitulo">Histórico</Text>
            {vm.history.map((order) => (
              <Card key={order.id} onPress={() => vm.onOpenOrder(order.id)}>
                <View style={styles.historyRow}>
                  <View style={styles.historyBody}>
                    <Text variant="corpo">{order.establishmentName}</Text>
                    <Text variant="apoio" color="secondary">
                      {order.itemsLabel} · {order.dayLabel}
                    </Text>
                  </View>
                  <View style={styles.historyStatus}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={colors.brandPrimary}
                    />
                    <Text variant="apoio" color="brand">
                      {order.statusLabel}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <Text variant="titulo">Meus Pedidos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: screenMargin,
    paddingBottom: spacing.md,
    backgroundColor: colors.surfaceBase,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    ...elevation(2),
  },
  content: { padding: screenMargin, gap: spacing.lg },
  section: { gap: spacing.sm },
  historyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  historyBody: { flex: 1, gap: 2 },
  historyStatus: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
