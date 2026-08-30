import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

/**
 * Carrega a família Inter exigida pelo design system (`contexto-design.md` §3).
 *
 * Enquanto `false`, a raiz do app deve segurar a splash / mostrar um
 * placeholder — nenhuma tela deve renderizar texto com a família ainda ausente.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  return loaded;
}
