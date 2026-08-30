import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import type { TabScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import {
  AppHeader,
  EmptyState,
  FilterChip,
  OfferCard,
  Screen,
  SearchField,
  SectionHeader,
} from "@/shared/ui";

import { useFeedViewModel } from "../../viewmodels/useFeedViewModel";

type Props = TabScreenProps<"InicioTab">;

export function FeedScreen({ navigation }: Props) {
  const vm = useFeedViewModel({
    onOpenSalvado: (salvadoId) => navigation.navigate("SalvadoDetail", { salvadoId }),
    onSeeAll: () => navigation.navigate("SalvadoList"),
    onOpenNotifications: () => navigation.navigate("Notifications"),
    onChangeLocation: () => navigation.navigate("AddressList"),
  });

  return (
    <Screen padded={false}>
      <AppHeader
        variant="location"
        addressLabel={vm.addressLabel}
        onPressLocation={vm.onChangeLocation}
        onPressNotifications={vm.onOpenNotifications}
        hasUnreadNotifications={vm.hasUnread}
      />

      <FlatList
        data={vm.offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={vm.refresh}
        refreshing={vm.isRefreshing}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchField
              value=""
              onChangeText={() => {}}
              placeholder="Buscar lojas ou produtos..."
              readOnlyPress={() => navigation.navigate("Tabs", { screen: "ExplorarTab" })}
            />

            <FlatList
              horizontal
              data={vm.categoryChips}
              keyExtractor={(chip) => chip.value}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => (
                <FilterChip
                  label={item.label}
                  selected={vm.selectedCategory === item.value}
                  onPress={() => vm.toggleCategory(item.value)}
                />
              )}
            />

            <SectionHeader
              title="Salvados Perto de Você"
              actionLabel="Ver tudo"
              onAction={vm.onSeeAll}
            />
          </View>
        }
        renderItem={({ item }) => <OfferCard offer={item} onPress={vm.onOpenSalvado} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          vm.isLoading ? (
            <ActivityIndicator color={colors.brandPrimary} style={styles.loading} />
          ) : vm.hasError ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Não foi possível carregar os Salvados"
              description="Verifique a conexão e tente novamente."
              actionLabel="Tentar de novo"
              onAction={vm.refresh}
            />
          ) : (
            <EmptyState
              title="Nenhum Salvado por perto agora"
              description="Assim que um parceiro publicar, ele aparece aqui. Veja outros bairros na busca."
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
