import { StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { spacing } from "@/shared/theme";
import {
  FilterChip,
  PrimaryButton,
  SafeAreaInsetBottom,
  Screen,
  ScreenHeader,
  Text,
  TextField,
} from "@/shared/ui";

import { useAddressFormViewModel } from "../../viewmodels/useAddressFormViewModel";

type Props = RootStackScreenProps<"AddressForm">;

const KIND_OPTIONS = [
  { value: "HOME", label: "Casa" },
  { value: "WORK", label: "Trabalho" },
  { value: "OTHER", label: "Outro" },
] as const;

export function AddressFormScreen({ navigation, route }: Props) {
  const vm = useAddressFormViewModel({
    addressId: route.params?.addressId,
    onSaved: () => navigation.goBack(),
  });

  return (
    <Screen padded={false}>
      <ScreenHeader
        title={vm.isEditing ? "Editar endereço" : "Novo endereço"}
        onBack={navigation.goBack}
      />
      <Screen
        scroll
        avoidKeyboard
        edges={["left", "right"]}
        footer={<Footer onPress={vm.submit} isEditing={vm.isEditing} />}
      >
        <View style={styles.form}>
          <View style={styles.kinds}>
            <Text variant="apoio" color="secondary">
              Tipo
            </Text>
            <View style={styles.kindRow}>
              {KIND_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  selected={vm.form.kind === opt.value}
                  onPress={() => vm.setKind(opt.value)}
                />
              ))}
            </View>
          </View>

          <TextField
            label="Nome do endereço"
            value={vm.form.label}
            onChangeText={(t) => vm.setField("label", t)}
            placeholder="Casa, Trabalho…"
            error={vm.errors.label}
          />
          <TextField
            label="CEP"
            value={vm.form.zipCode}
            onChangeText={(t) => vm.setField("zipCode", t)}
            placeholder="00000-000"
            keyboardType="number-pad"
          />
          <TextField
            label="Rua"
            value={vm.form.street}
            onChangeText={(t) => vm.setField("street", t)}
            error={vm.errors.street}
          />
          <View style={styles.pair}>
            <View style={styles.numberField}>
              <TextField
                label="Número"
                value={vm.form.number}
                onChangeText={(t) => vm.setField("number", t)}
                keyboardType="number-pad"
                error={vm.errors.number}
              />
            </View>
            <View style={styles.grow}>
              <TextField
                label="Complemento"
                value={vm.form.complement}
                onChangeText={(t) => vm.setField("complement", t)}
                placeholder="Apto, bloco…"
              />
            </View>
          </View>
          <TextField
            label="Bairro"
            value={vm.form.district}
            onChangeText={(t) => vm.setField("district", t)}
            error={vm.errors.district}
          />
          <View style={styles.pair}>
            <View style={styles.grow}>
              <TextField
                label="Cidade"
                value={vm.form.city}
                onChangeText={(t) => vm.setField("city", t)}
                error={vm.errors.city}
              />
            </View>
            <View style={styles.stateField}>
              <TextField
                label="UF"
                value={vm.form.state}
                onChangeText={(t) => vm.setField("state", t)}
                autoCapitalize="characters"
                maxLength={2}
                error={vm.errors.state}
              />
            </View>
          </View>
          <TextField
            label="Ponto de referência"
            value={vm.form.reference}
            onChangeText={(t) => vm.setField("reference", t)}
            placeholder="Opcional"
          />
        </View>
      </Screen>
    </Screen>
  );
}

function Footer({ onPress, isEditing }: { onPress: () => void; isEditing: boolean }) {
  return (
    <View>
      <PrimaryButton
        label={isEditing ? "Salvar endereço" : "Adicionar endereço"}
        onPress={onPress}
      />
      <SafeAreaInsetBottom />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, paddingVertical: spacing.md },
  kinds: { gap: spacing.xs },
  kindRow: { flexDirection: "row", gap: spacing.sm },
  pair: { flexDirection: "row", gap: spacing.sm },
  numberField: { width: 110 },
  stateField: { width: 90 },
  grow: { flex: 1 },
});
