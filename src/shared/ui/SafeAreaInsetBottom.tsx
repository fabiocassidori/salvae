import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Espaçador que reserva a área segura inferior (rodapés fixos). */
export function SafeAreaInsetBottom({ min = 8 }: { min?: number }) {
  const insets = useSafeAreaInsets();
  return <View style={{ height: Math.max(min, insets.bottom) }} />;
}
