import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { EmptyState, OfferCard, Screen, ScreenHeader, Tag, Text } from "@/shared/ui";

import { useEstablishmentViewModel } from "../../viewmodels/useEstablishmentViewModel";

type Props = RootStackScreenProps<"Establishment">;

export function EstablishmentScreen({ navigation, route }: Props) {
  const vm = useEstablishmentViewModel({
    establishmentId: route.params.establishmentId,
    onOpenSalvado: (salvadoId) => navigation.navigate("SalvadoDetail", { salvadoId }),
  });

  if (vm.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }

  if (vm.hasError || !vm.header) {
    return (
      <EmptyState
        title="Estabelecimento indisponível"
        actionLabel="Voltar"
        onAction={navigation.goBack}
      />
    );
  }

  const h = vm.header;

  return (
    <Screen padded={false}>
      <ScreenHeader title={h.name} onBack={navigation.goBack} />
      <FlatList
        data={vm.offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.head}>
            {h.coverUrl ? <Image source={{ uri: h.coverUrl }} style={styles.cover} /> : null}
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text variant="titulo">{h.name}</Text>
                {h.isVerifiedPartner ? <Tag label="PARCEIRO VERIFICADO" /> : null}
              </View>
              <Text variant="apoio" color="secondary">
                {h.categoryLabel} · {h.distanceLabel}
              </Text>
              <Text variant="apoio" color="secondary">
                {h.addressLine}
              </Text>
              <View style={styles.ratings}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color={colors.urgency} />
                  <Text variant="apoio" color="secondary">
                    {h.ratingLabel} geral
                  </Text>
                </View>
                <View style={styles.rating}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.brandPrimary} />
                  <Text variant="apoio" color="secondary">
                    {h.safetyRatingLabel} em segurança do produto
                  </Text>
                </View>
              </View>
            </View>
            <Text variant="subtitulo" style={styles.section}>
              Salvados disponíveis
            </Text>
          </View>
        }
        renderItem={({ item }) => <OfferCard offer={item} onPress={vm.onOpenSalvado} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <EmptyState
            title="Sem Salvados agora"
            description="Este parceiro ainda não publicou Salvados hoje. Ative o aviso para ser avisado."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.lg, flexGrow: 1 },
  head: { gap: spacing.md, marginBottom: spacing.md },
  cover: { width: "100%", height: 140, backgroundColor: colors.border },
  info: { paddingHorizontal: screenMargin, gap: spacing.xs },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  ratings: { gap: spacing.xs, marginTop: spacing.xs },
  rating: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  section: { paddingHorizontal: screenMargin },
  sep: { height: spacing.sm },
});
