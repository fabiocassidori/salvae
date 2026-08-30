import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/shared/theme";

import { Text } from "./Text";

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  /** Linha única de informação (ex.: linha do Selo de Segurança). */
  text: string;
  /** Quando presente, vira par rótulo/valor (ex.: card "Local", "Resumo"). */
  value?: string;
  iconColor?: string;
};

export function InfoRow({ icon, text, value, iconColor = colors.brandPrimary }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={iconColor} style={styles.icon} />
      <View style={styles.body}>
        <Text variant="apoio" color={value ? "secondary" : "primary"}>
          {text}
        </Text>
        {value ? <Text variant="corpo">{value}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm },
  icon: { marginTop: 2 },
  body: { flex: 1, gap: 2 },
});
