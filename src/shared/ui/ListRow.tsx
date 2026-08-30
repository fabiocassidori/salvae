import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

type ListRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  /** Destaque de ação destrutiva (ex.: "Sair do App"). */
  danger?: boolean;
  chevron?: boolean;
};

/** Linha de menu (Perfil): ícone + rótulo + chevron. */
export function ListRow({ icon, label, onPress, danger = false, chevron = true }: ListRowProps) {
  const tint = danger ? colors.feedbackError : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      android_ripple={{ color: danger ? "#F7E4E3" : colors.brandTint }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={danger ? colors.feedbackError : colors.brandPrimary} />
      <View style={styles.label}>
        <Text variant="corpo" style={{ color: tint }}>
          {label}
        </Text>
      </View>
      {chevron && !danger ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceBase,
    overflow: "hidden",
  },
  pressed: { opacity: 0.9 },
  label: { flex: 1 },
});
