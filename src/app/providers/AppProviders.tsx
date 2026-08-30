import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/shared/lib";

/**
 * Agrega todos os providers globais em um único lugar.
 * Ao adicionar um provider transversal (tema, i18n, auth), registre-o aqui.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  );
}
