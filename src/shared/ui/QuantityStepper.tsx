import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius } from "@/shared/theme";

import { Text } from "./Text";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

/** Controle de quantidade na sacola. Cada toque respeita o alvo de 48dp. */
export function QuantityStepper({ value, onChange, min = 0, max = 99 }: QuantityStepperProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={[styles.btn, value <= min && styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
      >
        <Ionicons name="remove" size={18} color={colors.brandPrimary} />
      </Pressable>
      <Text variant="corpo" style={styles.value} accessibilityLabel={`Quantidade ${value}`}>
        {value}
      </Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={[styles.btn, value >= max && styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
      >
        <Ionicons name="add" size={18} color={colors.brandPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.field,
  },
  btn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.35 },
  value: { minWidth: 24, textAlign: "center" },
});
