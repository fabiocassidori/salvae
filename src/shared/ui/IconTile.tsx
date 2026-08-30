import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/shared/theme";

/** Quadrado arredondado com ícone — usado em cards de dados/resumo. */
export function IconTile({
  icon,
  size = 40,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
}) {
  return (
    <View style={[styles.tile, { width: size, height: size }]}>
      <Ionicons name={icon} size={size * 0.5} color={colors.brandPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: radius.field,
    backgroundColor: colors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
});
