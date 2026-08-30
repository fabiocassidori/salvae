import { StyleSheet, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { spacing } from "@/shared/theme";
import { PrimaryButton, SafeAreaInsetBottom, Screen, ScreenHeader, TextField } from "@/shared/ui";

import { useEditProfileViewModel } from "../../viewmodels/useEditProfileViewModel";

type Props = RootStackScreenProps<"EditProfile">;

export function EditProfileScreen({ navigation }: Props) {
  const vm = useEditProfileViewModel({ onSaved: () => navigation.goBack() });

  return (
    <Screen padded={false}>
      <ScreenHeader title="Editar perfil" onBack={navigation.goBack} />
      <Screen
        scroll
        avoidKeyboard
        edges={["left", "right"]}
        footer={
          <View>
            <PrimaryButton
              label="Salvar alterações"
              onPress={vm.submit}
              loading={vm.isSubmitting}
            />
            <SafeAreaInsetBottom />
          </View>
        }
      >
        <View style={styles.form}>
          <TextField
            label="Nome completo"
            value={vm.form.fullName}
            onChangeText={(t) => vm.setField("fullName", t)}
            error={vm.errors.fullName}
          />
          <TextField
            label="E-mail"
            value={vm.form.email}
            onChangeText={(t) => vm.setField("email", t)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={vm.errors.email}
          />
          <TextField
            label="Telefone"
            value={vm.form.phone}
            onChangeText={(t) => vm.setField("phone", t)}
            keyboardType="phone-pad"
            error={vm.errors.phone}
          />
        </View>
      </Screen>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, paddingVertical: spacing.md },
});
