import { Platform, Text as RNText, type TextProps as RNTextProps, StyleSheet } from "react-native";

import { colors, typography, type TypeVariant } from "@/shared/theme";

type TextColor = "primary" | "secondary" | "brand" | "urgency" | "error" | "onBrand";

const colorByToken: Record<TextColor, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  brand: colors.brandPrimary,
  urgency: colors.urgency,
  error: colors.feedbackError,
  onBrand: colors.surfaceBase,
};

export type AppTextProps = RNTextProps & {
  variant?: TypeVariant;
  color?: TextColor;
};

/**
 * Único componente de texto do app. Impõe a escala restrita (`type/*`) e o
 * alinhamento à esquerda exigidos por `contexto-design.md` §3.
 *
 * Cross-platform:
 * - `includeFontPadding: false` (Android) remove o padding extra do glifo que
 *   desalinha texto e ícone e "briga" com o `lineHeight` do design.
 * - `maxFontSizeMultiplier` limita o efeito de fontes gigantes do sistema para
 *   não quebrar layout — mantendo acessibilidade dentro de um teto.
 */
export function Text({
  variant = "corpo",
  color = "primary",
  style,
  maxFontSizeMultiplier = 1.4,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[styles.base, typography[variant], { color: colorByToken[color] }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    textAlign: "left",
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
});
