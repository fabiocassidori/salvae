import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, radius, screenMargin, spacing } from "@/shared/theme";
import { Card, EmptyState, Screen, ScreenHeader, Text } from "@/shared/ui";

import { useImpactViewModel } from "../../viewmodels/useImpactViewModel";

type Props = RootStackScreenProps<"Impact">;

export function ImpactScreen({ navigation }: Props) {
  const vm = useImpactViewModel();

  if (vm.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }
  if (vm.hasError || !vm.model) {
    return (
      <EmptyState
        title="Não foi possível carregar seu impacto"
        actionLabel="Voltar"
        onAction={navigation.goBack}
      />
    );
  }

  const m = vm.model;

  return (
    <Screen scroll padded={false}>
      <ScreenHeader title="Meu Impacto" onBack={navigation.goBack} />
      <View style={styles.content}>
        <Card>
          <View style={styles.levelRow}>
            <View style={styles.medal}>
              <Ionicons name="ribbon" size={22} color={colors.brandPrimary} />
            </View>
            <View style={styles.levelText}>
              <Text variant="subtitulo">{m.levelLabel}</Text>
              <Text variant="apoio" color="secondary">
                {m.nextLevelRemaining}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { flex: Math.max(0.02, m.progress) }]} />
            <View style={{ flex: Math.max(0, 1 - m.progress) }} />
          </View>
        </Card>

        <Card>
          <View style={styles.streakRow}>
            <Ionicons name="flame" size={20} color={colors.urgency} />
            <Text variant="corpo">{m.streakLabel}</Text>
          </View>
        </Card>

        <View style={styles.grid}>
          {m.stats.map((stat) => (
            <Card key={stat.key} style={styles.statCard}>
              <Text variant="titulo" color="brand">
                {stat.value}
              </Text>
              <Text variant="apoio" color="secondary">
                {stat.label}
              </Text>
            </Card>
          ))}
        </View>

        <Text variant="apoio" color="secondary" style={styles.note}>
          Você não está comprando comida velha barata — está participando de um resgate. Cada pedido
          evita desperdício e pode virar doação.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.md },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  medal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: { flex: 1, gap: 2 },
  progressTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: radius.chip,
    backgroundColor: colors.surfaceBg,
    overflow: "hidden",
  },
  progressFill: { backgroundColor: colors.brandPrimary },
  streakRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statCard: { flexBasis: "47%", flexGrow: 1, gap: 2 },
  note: { marginTop: spacing.sm },
});
