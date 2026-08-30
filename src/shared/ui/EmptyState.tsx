import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/shared/theme";

import { SecondaryButton } from "./Button";
import { Text } from "./Text";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  /** Mensagem nunca culpa o usuário e indica a próxima ação (§2 do design). */
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = "leaf-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={40} color={colors.textSecondary} />
      <Text variant="subtitulo" style={styles.center}>
        {title}
      </Text>
      {description ? (
        <Text variant="corpo" color="secondary" style={styles.center}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <SecondaryButton label={actionLabel} onPress={onAction} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  center: { textAlign: "center" },
  action: { marginTop: spacing.sm },
});
