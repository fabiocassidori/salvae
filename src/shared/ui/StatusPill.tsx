import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

export type StatusTone = "waiting" | "progress" | "done" | "canceled";

const toneStyle: Record<
  StatusTone,
  { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  // "Aguardando" usa o âmbar de prazo (não é alarme).
  waiting: { bg: colors.urgencyBg, fg: colors.urgency, icon: "time-outline" },
  progress: { bg: colors.brandTint, fg: colors.brandPrimary, icon: "bicycle-outline" },
  done: { bg: colors.brandTint, fg: colors.brandPrimary, icon: "checkmark-circle-outline" },
  // Cancelamento é um estado de sistema — pode usar o vermelho.
  canceled: { bg: "#F7E4E3", fg: colors.feedbackError, icon: "close-circle-outline" },
};

export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const s = toneStyle[tone];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]} accessibilityLabel={`Status: ${label}`}>
      <Ionicons name={s.icon} size={14} color={s.fg} />
      <Text variant="apoio" style={{ color: s.fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
});
