import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, elevation, minTouchTarget, screenMargin } from "@/shared/theme";

import { Text } from "./Text";

type ScreenHeaderProps = {
  title?: string;
  onBack?: () => void;
  /** Ação opcional à direita (ícone). */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

/** Cabeçalho de tela interna: voltar (48x48) + título centralizado. */
export function ScreenHeader({ title, onBack, rightIcon, onRightPress }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.touch}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>

      {title ? (
        <Text variant="subtitulo" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}

      <View style={[styles.side, styles.right]}>
        {rightIcon && onRightPress ? (
          <Pressable onPress={onRightPress} accessibilityRole="button" style={styles.touch}>
            <Ionicons name={rightIcon} size={22} color={colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: screenMargin - 4,
    paddingBottom: 4,
    backgroundColor: colors.surfaceBase,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    ...elevation(2),
  },
  side: { width: minTouchTarget, height: minTouchTarget, justifyContent: "center" },
  right: { alignItems: "flex-end" },
  touch: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, textAlign: "center" },
});
