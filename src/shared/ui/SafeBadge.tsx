import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

/**
 * Selo compacto "Consumo Seguro" exibido no Card de Oferta.
 * Comunica segurança com ícone + texto (redundância WCAG 1.4.1).
 */
export function SafeBadge({ label = "Consumo Seguro" }: { label?: string }) {
  return (
    <View style={styles.badge} accessibilityLabel={label}>
      <Ionicons name="shield-checkmark" size={13} color={colors.brandPrimary} />
      <Text variant="apoio" color="brand">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radius.chip,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
});
