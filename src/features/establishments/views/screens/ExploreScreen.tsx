import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import type { TabScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { AppHeader, EmptyState, FilterChip, OfferCard, Screen, SearchField } from "@/shared/ui";

import { useExploreViewModel } from "../../viewmodels/useExploreViewModel";

type Props = TabScreenProps<"ExplorarTab">;

export function ExploreScreen({ navigation }: Props) {
  const vm = useExploreViewModel({
    onOpenSalvado: (salvadoId) => navigation.navigate("SalvadoDetail", { salvadoId }),
  });

  return (
    <Screen padded={false}>
      <AppHeader
        variant="brand"
        onPressNotifications={() => navigation.navigate("Notifications")}
      />

      <FlatList
        data={vm.offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchField
              value={vm.term}
              onChangeText={vm.onChangeTerm}
              placeholder="O que você quer salvar hoje?"
            />
            <FlatList
              horizontal
              data={vm.sortChips}
              keyExtractor={(chip) => chip.value}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => (
                <FilterChip
                  label={item.label}
                  selected={item.selected}
                  onPress={() => vm.selectSort(item.value)}
                />
              )}
            />
          </View>
        }
        renderItem={({ item }) => <OfferCard offer={item} onPress={vm.onOpenSalvado} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          vm.isLoading ? (
            <ActivityIndicator color={colors.brandPrimary} style={styles.loading} />
          ) : (
            <EmptyState
              icon="search-outline"
              title="Nenhum Salvado encontrado"
              description="Tente outro termo ou remova os filtros para ver mais opções."
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: screenMargin, gap: spacing.sm, flexGrow: 1 },
  header: { gap: spacing.md, marginBottom: spacing.md },
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  sep: { height: spacing.sm },
  loading: { marginTop: spacing.xl },
});
