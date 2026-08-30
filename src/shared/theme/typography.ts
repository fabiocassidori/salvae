import { Platform, type TextStyle } from "react-native";

/**
 * Escala tipográfica restrita — fonte: `contexto-design.md` §3.
 *
 * Família Inter (fallback Roboto no Android / sistema no iOS). Tamanho mínimo 14.
 * Alinhamento sempre à esquerda (imposto pelo componente `Text`).
 *
 * Cross-platform: o peso é carregado pela PRÓPRIA família (`Inter_700Bold`
 * etc.). NÃO combinar com `fontWeight` — no Android isso gera "faux bold"
 * (negrito sintético sobre a fonte já negrita).
 */
export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  bold: "Inter_700Bold",
} as const;

/** Fallback usado antes de a fonte carregar / se falhar (nativo de cada OS). */
export const fontFallback = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "sans-serif",
});

type TypeToken = Pick<TextStyle, "fontSize" | "lineHeight" | "fontFamily">;

export const typography = {
  /** Títulos de tela. */
  titulo: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  /** Nomes de itens, subtítulos. */
  subtitulo: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  /** Textos, rótulos de botão. */
  corpo: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  /** Apenas metadados — nunca informação essencial. */
  apoio: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
} as const satisfies Record<string, TypeToken>;

export type TypeVariant = keyof typeof typography;
