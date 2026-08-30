import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

type SelectableRowProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

/**
 * Linha selecionável estilo rádio (ex.: forma de pagamento, tipo de recebimento).
 * Selecionado = borda verde + check; comunica seleção por ícone + borda, não só cor.
 */
export function SelectableRow({ title, subtitle, selected, onPress, icon }: SelectableRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.row, selected && styles.selected]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={22}
          color={selected ? colors.brandPrimary : colors.textSecondary}
        />
      ) : null}
      <View style={styles.body}>
        <Text variant="corpo">{title}</Text>
        {subtitle ? (
          <Text variant="apoio" color="secondary">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={22}
        color={selected ? colors.brandPrimary : colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceBase,
  },
  selected: { borderColor: colors.brandPrimary },
  body: { flex: 1, gap: 2 },
});
