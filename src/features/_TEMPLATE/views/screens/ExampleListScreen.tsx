import { ActivityIndicator, FlatList } from "react-native";

import { colors } from "@/shared/theme";
import { EmptyState, Screen, Text } from "@/shared/ui";

import { useExampleListViewModel } from "../../viewmodels/useExampleListViewModel";

/** VIEW — só renderização. Consome exatamente uma ViewModel. */
export function ExampleListScreen() {
  const vm = useExampleListViewModel();

  if (vm.isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brandPrimary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={vm.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text variant="corpo">{item.label}</Text>}
        ListEmptyComponent={<EmptyState title="Nada por aqui ainda" />}
      />
    </Screen>
  );
}
