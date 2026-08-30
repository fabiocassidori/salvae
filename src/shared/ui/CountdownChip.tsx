import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";
import { getCountdown } from "@/shared/utils";

import { Text } from "./Text";

type CountdownChipProps = {
  /** ISO da expiração da oferta (Janela de Salvamento). */
  expiresAt: string;
  /** Atualiza sozinho a cada minuto. */
  live?: boolean;
  compact?: boolean;
};

/**
 * Chip de Contagem Regressiva (`contexto-design.md` §6).
 * Fundo `#FDF0D9`, texto `#8A5300`, raio 24dp, ícone de relógio REDUNDANTE.
 * Nunca vermelho, nunca ícone de advertência.
 */
export function CountdownChip({ expiresAt, live = true, compact = false }: CountdownChipProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [live]);

  const { label } = getCountdown(expiresAt, now);

  return (
    <View
      style={[styles.chip, compact && styles.compact]}
      accessibilityLabel={`Janela de salvamento: ${label}`}
    >
      <Ionicons name="time-outline" size={compact ? 13 : 15} color={colors.urgency} />
      <Text variant="apoio" color="urgency" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    backgroundColor: colors.urgencyBg,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  compact: { paddingVertical: 2 },
});
