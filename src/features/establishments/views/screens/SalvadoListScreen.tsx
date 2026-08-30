import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { EmptyState, OfferCard, Screen, ScreenHeader } from "@/shared/ui";

import { useSalvadoListViewModel } from "../../viewmodels/useSalvadoListViewModel";

type Props = RootStackScreenProps<"SalvadoList">;

export function SalvadoListScreen({ navigation }: Props) {
  const vm = useSalvadoListViewModel({
    onOpenSalvado: (salvadoId) => navigation.navigate("SalvadoDetail", { salvadoId }),
  });

  return (
    <Screen padded={false}>
      <ScreenHeader title="Salvados perto de você" onBack={navigation.goBack} />
      <FlatList
        data={vm.offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={vm.refresh}
        refreshing={vm.isRefreshing}
        renderItem={({ item }) => <OfferCard offer={item} onPress={vm.onOpenSalvado} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          vm.isLoading ? (
            <ActivityIndicator color={colors.brandPrimary} style={styles.loading} />
          ) : (
            <EmptyState
              title="Nenhum Salvado disponível agora"
              description="Volte mais tarde: novos Salvados são publicados ao longo do dia."
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: screenMargin, gap: spacing.sm, flexGrow: 1 },
  sep: { height: spacing.sm },
  loading: { marginTop: spacing.xl },
});
