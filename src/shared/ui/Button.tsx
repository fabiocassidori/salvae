import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/shared/theme";

import { Text } from "./Text";

type ButtonProps = {
  /** Rótulo sempre no infinitivo (`contexto-design.md` §6). */
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Ícone opcional à direita (ex.: seta em "Confirmar Pedido →"). */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
};

/**
 * Botão PRIMÁRIO — fundo `brand/primaria`, altura 48dp, raio 12dp.
 * Regra: apenas UM botão primário por tela.
 */
export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  trailingIcon,
  fullWidth = true,
}: ButtonProps) {
  const blocked = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      android_ripple={blocked ? undefined : { color: "rgba(255,255,255,0.24)" }}
      style={({ pressed }) => [
        styles.base,
        styles.primary,
        fullWidth && styles.fullWidth,
        pressed && !blocked && styles.pressed,
        blocked && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surfaceBase} />
      ) : (
        <View style={styles.row}>
          <Text variant="corpo" color="onBrand">
            {label}
          </Text>
          {trailingIcon ? (
            <Ionicons name={trailingIcon} size={18} color={colors.surfaceBase} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

/** Botão SECUNDÁRIO — fundo transparente, borda verde 1dp. */
export function SecondaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  trailingIcon,
  fullWidth = true,
}: ButtonProps) {
  const blocked = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      android_ripple={blocked ? undefined : { color: colors.brandTint }}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        fullWidth && styles.fullWidth,
        pressed && !blocked && styles.pressed,
        blocked && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.brandPrimary} />
      ) : (
        <View style={styles.row}>
          <Text variant="corpo" color="brand">
            {label}
          </Text>
          {trailingIcon ? (
            <Ionicons name={trailingIcon} size={18} color={colors.brandPrimary} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
  fullWidth: { alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  primary: { backgroundColor: colors.brandPrimary },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.brandPrimary },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
});
