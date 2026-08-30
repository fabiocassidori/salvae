import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, radius, screenMargin, spacing } from "@/shared/theme";
import { EmptyState, Screen, ScreenHeader, Text } from "@/shared/ui";

import { useNotificationsViewModel } from "../../viewmodels/useNotificationsViewModel";

type Props = RootStackScreenProps<"Notifications">;

export function NotificationsScreen({ navigation }: Props) {
  const vm = useNotificationsViewModel({
    onOpenSalvado: (salvadoId) => navigation.navigate("SalvadoDetail", { salvadoId }),
    onOpenOrder: (orderId) => navigation.navigate("OrderDetail", { orderId }),
  });

  return (
    <Screen padded={false}>
      <ScreenHeader
        title="Notificações"
        onBack={navigation.goBack}
        rightIcon={vm.hasUnread ? "checkmark-done-outline" : undefined}
        onRightPress={vm.hasUnread ? vm.markAllRead : undefined}
      />
      <FlatList
        data={vm.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => vm.open(item.id)}
            style={[styles.row, !item.read && styles.unread]}
            accessibilityRole="button"
          >
            <View style={styles.icon}>
              <Ionicons name={item.icon} size={18} color={colors.brandPrimary} />
            </View>
            <View style={styles.body}>
              <Text variant="corpo">{item.title}</Text>
              <Text variant="apoio" color="secondary">
                {item.body}
              </Text>
              <Text variant="apoio" color="secondary">
                {item.timeLabel}
              </Text>
            </View>
            {!item.read ? <View style={styles.dot} /> : null}
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Sem notificações"
            description="Avisaremos aqui quando um parceiro publicar um Salvado ou seu pedido mudar de status."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: screenMargin, flexGrow: 1 },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceBase,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  unread: { borderColor: colors.brandPrimary },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.field,
    backgroundColor: colors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandPrimary },
  sep: { height: spacing.sm },
});
