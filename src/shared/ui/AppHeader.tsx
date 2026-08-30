import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, elevation, minTouchTarget, screenMargin, spacing } from "@/shared/theme";

import { Text } from "./Text";

type AppHeaderProps = {
  /** "brand" = logotipo central; "location" = endereço de entrega selecionável. */
  variant: "brand" | "location";
  /** Texto do endereço (variant "location"). */
  addressLabel?: string;
  onPressLocation?: () => void;
  onPressNotifications?: () => void;
  hasUnreadNotifications?: boolean;
};

/** Cabeçalho das telas de aba (Início / Explorar). */
export function AppHeader({
  variant,
  addressLabel,
  onPressLocation,
  onPressNotifications,
  hasUnreadNotifications = false,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <Pressable
        style={styles.left}
        onPress={onPressLocation}
        disabled={variant === "brand"}
        accessibilityRole={variant === "location" ? "button" : "header"}
        accessibilityLabel={variant === "location" ? `Entregar em ${addressLabel}` : "Salvaê"}
      >
        {variant === "location" ? (
          <>
            <Ionicons name="location-outline" size={18} color={colors.brandPrimary} />
            <View style={styles.addressBox}>
              <Text variant="apoio" color="secondary">
                Entregar em
              </Text>
              <View style={styles.addressRow}>
                <Text variant="corpo" numberOfLines={1} style={styles.address}>
                  {addressLabel}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.brandRow}>
            <Ionicons name="location-outline" size={20} color={colors.brandPrimary} />
            <Text variant="subtitulo" color="brand">
              Salvaê
            </Text>
          </View>
        )}
      </Pressable>

      <Pressable
        onPress={onPressNotifications}
        style={styles.bell}
        accessibilityRole="button"
        accessibilityLabel={hasUnreadNotifications ? "Notificações, há novas" : "Notificações"}
      >
        <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        {hasUnreadNotifications ? <View style={styles.dot} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenMargin,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surfaceBase,
    gap: spacing.sm,
    ...elevation(2),
  },
  left: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, flex: 1 },
  addressBox: { flex: 1 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  address: { flexShrink: 1 },
  bell: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  // Indicador de "há novidades" — verde de marca (vermelho é reservado a erro de sistema).
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surfaceBase,
    backgroundColor: colors.brandPrimary,
  },
});
