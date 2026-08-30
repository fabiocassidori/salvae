import { Platform, type ViewStyle } from "react-native";

import { colors } from "./colors";

/**
 * Sombra/elevação cross-platform.
 *
 * iOS usa `shadow*`; Android usa `elevation` (que exige `backgroundColor`
 * opaco no mesmo nó). `level` 1 = cards, 2 = barras fixas (header/tab/footer).
 */
export function elevation(level: 1 | 2 | 3): ViewStyle {
  const map = {
    1: { height: 1, radius: 2, opacity: 0.08, elevation: 1 },
    2: { height: 2, radius: 6, opacity: 0.1, elevation: 4 },
    3: { height: 6, radius: 16, opacity: 0.14, elevation: 8 },
  }[level];

  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: map.height },
      shadowRadius: map.radius,
      shadowOpacity: map.opacity,
    },
    android: { elevation: map.elevation },
    default: {},
  })!;
}
