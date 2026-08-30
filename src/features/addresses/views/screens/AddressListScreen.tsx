import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { AddressCard, EmptyState, Screen, ScreenHeader, Text } from "@/shared/ui";

import { useAddressListViewModel } from "../../viewmodels/useAddressListViewModel";

type Props = RootStackScreenProps<"AddressList">;

export function AddressListScreen({ navigation }: Props) {
  const vm = useAddressListViewModel({
    onAddAddress: () => navigation.navigate("AddressForm"),
    onEditAddress: (addressId) => navigation.navigate("AddressForm", { addressId }),
    onPicked: () => navigation.goBack(),
  });

  return (
    <Screen padded={false}>
      <ScreenHeader
        title="Meus endereços"
        onBack={navigation.goBack}
        rightIcon="add"
        onRightPress={vm.onAddAddress}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="apoio" color="secondary">
          Toque para usar este endereço na entrega.
        </Text>

        {vm.items.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="Nenhum endereço salvo"
            description="Adicione um endereço para receber Salvados com entrega."
            actionLabel="Adicionar endereço"
            onAction={vm.onAddAddress}
          />
        ) : (
          vm.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.card}>
                <AddressCard
                  address={item}
                  selected={item.id === vm.selectedId}
                  onPress={() => vm.pickAddress(item.id)}
                />
              </View>
              <Pressable
                onPress={() => vm.onEditAddress(item.id)}
                hitSlop={8}
                style={styles.edit}
                accessibilityRole="button"
                accessibilityLabel={`Editar endereço ${item.label}`}
              >
                <Ionicons name="create-outline" size={20} color={colors.brandPrimary} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  card: { flex: 1 },
  edit: { padding: spacing.sm },
});
