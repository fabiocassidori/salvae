import { StyleSheet, Switch, View } from "react-native";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { Card, Divider, Screen, ScreenHeader, Text } from "@/shared/ui";

import { useSettingsViewModel } from "../../viewmodels/useSettingsViewModel";

type Props = RootStackScreenProps<"Settings">;

export function SettingsScreen({ navigation }: Props) {
  const vm = useSettingsViewModel();

  return (
    <Screen padded={false} scroll>
      <ScreenHeader title="Configurações da conta" onBack={navigation.goBack} />
      <View style={styles.content}>
        {vm.groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text variant="subtitulo">{group.title}</Text>
            <Card>
              {group.items.map((item, index) => (
                <View key={item.key}>
                  {index > 0 ? <Divider inset /> : null}
                  <View style={styles.row}>
                    <Text variant="corpo" style={styles.rowLabel}>
                      {item.label}
                    </Text>
                    <Switch
                      value={item.value}
                      onValueChange={() => vm.toggle(item.key)}
                      trackColor={{ true: colors.brandPrimary, false: colors.border }}
                      thumbColor={colors.surfaceBase}
                    />
                  </View>
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Text variant="apoio" color="secondary" style={styles.note}>
          Estas preferências são locais nesta versão de demonstração.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: screenMargin, gap: spacing.lg },
  group: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  rowLabel: { flex: 1, paddingRight: spacing.md },
  note: { marginTop: spacing.sm },
});
