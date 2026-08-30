import { StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { spacing } from "@/shared/theme";
import {
  PrimaryButton,
  SafeAreaInsetBottom,
  Screen,
  ScreenHeader,
  Text,
  TextField,
} from "@/shared/ui";

import { useAddCardViewModel } from "../../viewmodels/useAddCardViewModel";

type Props = RootStackScreenProps<"AddCard">;

export function AddCardScreen({ navigation }: Props) {
  const vm = useAddCardViewModel({ onSaved: () => navigation.goBack() });

  return (
    <Screen padded={false}>
      <ScreenHeader title="Novo cartão" onBack={navigation.goBack} />
      <Screen
        scroll
        avoidKeyboard
        edges={["left", "right"]}
        footer={
          <View>
            <PrimaryButton label="Salvar cartão" onPress={vm.submit} loading={vm.isSubmitting} />
            <SafeAreaInsetBottom />
          </View>
        }
      >
        <View style={styles.form}>
          <Text variant="apoio" color="secondary">
            Os dados do cartão não saem do dispositivo nesta versão de demonstração.
          </Text>
          <TextField
            label="Número do cartão"
            value={vm.form.number}
            onChangeText={(t) => vm.setField("number", t)}
            keyboardType="number-pad"
            placeholder="0000 0000 0000 0000"
            error={vm.errors.number}
          />
          <TextField
            label="Nome impresso no cartão"
            value={vm.form.holderName}
            onChangeText={(t) => vm.setField("holderName", t)}
            autoCapitalize="characters"
            error={vm.errors.holderName}
          />
          <View style={styles.pair}>
            <View style={styles.grow}>
              <TextField
                label="Validade"
                value={vm.form.expiry}
                onChangeText={(t) => vm.setField("expiry", t)}
                placeholder="MM/AA"
                error={vm.errors.expiry}
              />
            </View>
            <View style={styles.grow}>
              <TextField
                label="CVV"
                value={vm.form.cvv}
                onChangeText={(t) => vm.setField("cvv", t)}
                keyboardType="number-pad"
                maxLength={4}
                error={vm.errors.cvv}
              />
            </View>
          </View>
        </View>
      </Screen>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, paddingVertical: spacing.md },
  pair: { flexDirection: "row", gap: spacing.sm },
  grow: { flex: 1 },
});
