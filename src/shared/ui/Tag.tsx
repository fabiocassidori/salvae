import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

/** Etiqueta curta (ex.: "PRINCIPAL" no endereço, "Hoje" no pedido). */
export function Tag({ label, tone = "brand" }: { label: string; tone?: "brand" | "neutral" }) {
  const isBrand = tone === "brand";
  return (
    <View
      style={[styles.tag, { backgroundColor: isBrand ? colors.brandPrimary : colors.surfaceBg }]}
    >
      <Text variant="apoio" color={isBrand ? "onBrand" : "secondary"}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
