import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, elevation, minTouchTarget, radius, spacing } from "@/shared/theme";
import { Text } from "@/shared/ui";

const TAB_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  InicioTab: { label: "Início", icon: "home-outline" },
  ExplorarTab: { label: "Explorar", icon: "search-outline" },
  PedidosTab: { label: "Pedidos", icon: "receipt-outline" },
  PerfilTab: { label: "Perfil", icon: "person-outline" },
};

/** Barra de abas custom — aba ativa em "pílula" verde (protótipo). */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(spacing.sm, insets.bottom) }]}>
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const focused = state.index === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            android_ripple={{ color: colors.brandTint, borderless: true, radius: 40 }}
            style={styles.item}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Ionicons
                name={meta.icon}
                size={20}
                color={focused ? colors.surfaceBase : colors.textSecondary}
              />
              <Text variant="apoio" color={focused ? "onBrand" : "secondary"}>
                {meta.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surfaceBase,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...elevation(2),
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: minTouchTarget },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  pillActive: { backgroundColor: colors.brandPrimary },
});
