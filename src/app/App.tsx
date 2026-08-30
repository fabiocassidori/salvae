import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppFonts } from "@/shared/fonts";
import { colors } from "@/shared/theme";

import { AppProviders } from "./providers";
import { RootNavigator } from "./navigation";

/**
 * Raiz da aplicação.
 *
 * Responsabilidade única: carregar a fonte do design system, compor os
 * providers globais e a navegação raiz. Nenhuma regra de negócio aqui.
 */
export default function App() {
  const fontsLoaded = useAppFonts();

  return (
    <AppProviders>
      <StatusBar style="dark" />
      {fontsLoaded ? (
        <RootNavigator />
      ) : (
        <View style={styles.splash}>
          <ActivityIndicator color={colors.brandPrimary} />
        </View>
      )}
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceBg,
  },
});
