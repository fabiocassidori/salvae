import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { colors, elevation, radius, spacing } from "@/shared/theme";

type CardProps = PropsWithChildren<{
  onPress?: () => void;
  style?: ViewStyle;
  /** Remove o padding interno padrão de 16dp. */
  bare?: boolean;
  accessibilityLabel?: string;
}>;

/** Superfície branca, raio 8dp, padding 16dp (`contexto-design.md` §5/§6). */
export function Card({ children, onPress, style, bare = false, accessibilityLabel }: CardProps) {
  if (!onPress) {
    return <View style={[styles.card, !bare && styles.padded, style]}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !bare && styles.padded,
        style,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceBase,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...elevation(1),
  },
  padded: { padding: spacing.md },
  pressed: { opacity: 0.92 },
});
