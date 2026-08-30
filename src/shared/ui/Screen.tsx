import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { colors, elevation, screenMargin } from "@/shared/theme";

type ScreenProps = PropsWithChildren<{
  /** Aplica a margem lateral padrão de 16dp ao conteúdo. */
  padded?: boolean;
  scroll?: boolean;
  /** Barra fixa no rodapé (ex.: botão primário de ação). */
  footer?: ReactNode;
  edges?: readonly Edge[];
  contentStyle?: ViewStyle;
  /** Envolve o conteúdo em `KeyboardAvoidingView` (telas com formulário). */
  avoidKeyboard?: boolean;
}>;

/**
 * Container base de tela: fundo `surface/fundo`, safe area e margem lateral
 * padrão. `footer` fica fixo fora da área rolável.
 *
 * Cross-platform: quando `avoidKeyboard`, usa `KeyboardAvoidingView` com o
 * `behavior` correto por plataforma (`padding` no iOS; no Android o
 * `windowSoftInputMode=adjustResize` do Expo já reposiciona, então `behavior`
 * fica indefinido para não empilhar deslocamento).
 */
export function Screen({
  children,
  padded = true,
  scroll = false,
  footer,
  // Padrão sem `top`/`bottom`: os cabeçalhos (`AppHeader`/`ScreenHeader`) já
  // aplicam o inset superior; os rodapés fixos aplicam o inferior. Telas sem
  // cabeçalho que renderizam colado ao topo passam `edges` explicitamente.
  edges = ["left", "right"],
  contentStyle,
  avoidKeyboard = false,
}: ScreenProps) {
  const inner = (
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  );

  const body = (
    <>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
      {footer ? <View style={[styles.footer, padded && styles.padded]}>{footer}</View> : null}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surfaceBg },
  flex: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  padded: { paddingHorizontal: screenMargin },
  footer: {
    paddingVertical: screenMargin,
    backgroundColor: colors.surfaceBase,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...elevation(2),
  },
});
