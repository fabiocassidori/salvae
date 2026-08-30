import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

/** Chip de filtro selecionável (raio 24dp, alvo de toque >= 48dp). */
export function FilterChip({ label, selected = false, onPress, icon }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
      hitSlop={8}
    >
      <View style={styles.inner}>
        {icon ? (
          <Ionicons
            name={icon}
            size={15}
            color={selected ? colors.surfaceBase : colors.textSecondary}
          />
        ) : null}
        <Text variant="apoio" color={selected ? "onBrand" : "secondary"}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: minTouchTarget - 8,
    justifyContent: "center",
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceBase,
    paddingHorizontal: spacing.md,
  },
  selected: { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimary },
  inner: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
