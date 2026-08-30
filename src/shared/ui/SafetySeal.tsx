import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

import { InfoRow } from "./InfoRow";
import { Text } from "./Text";

export type SafetySealData = {
  /** Prazo — ex.: "Disponível até hoje, 22h". */
  availability: string;
  /** Conservação — ex.: "Mantido em temperatura ambiente". */
  conservation: string;
  /** Responsável — ex.: "Informado pela Padaria Central". */
  responsible: string;
};

/**
 * Selo Salvaê de Segurança (`contexto-design.md` §6 + `contexto-negocio.md` §1).
 * Fundo branco, borda 1dp verde, raio 8dp, padding 16dp.
 * OBRIGATÓRIO: 3 linhas (prazo, conservação, responsável), sempre acima da dobra.
 */
export function SafetySeal({ data }: { data: SafetySealData }) {
  return (
    <View style={styles.seal} accessibilityLabel="Selo Salvaê de Segurança">
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={18} color={colors.brandPrimary} />
        <Text variant="apoio" color="brand" style={styles.title}>
          SELO SALVAÊ DE SEGURANÇA
        </Text>
      </View>
      <View style={styles.lines}>
        <InfoRow icon="calendar-outline" text={data.availability} />
        <InfoRow icon="thermometer-outline" text={data.conservation} />
        <InfoRow icon="business-outline" text={data.responsible} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seal: {
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { letterSpacing: 0.5 },
  lines: { gap: spacing.sm },
});
