import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/shared/theme";

export function Divider({ inset = false }: { inset?: boolean }) {
  return <View style={[styles.line, inset && styles.inset]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  inset: { marginVertical: spacing.sm },
});
