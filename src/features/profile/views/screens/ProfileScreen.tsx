import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { TabScreenProps } from "@/app/navigation";
import { colors, screenMargin, spacing } from "@/shared/theme";
import { AddressCard, Avatar, Card, Divider, IconTile, ListRow, Text } from "@/shared/ui";

import { useProfileViewModel } from "../../viewmodels/useProfileViewModel";

type Props = TabScreenProps<"PerfilTab">;

export function ProfileScreen({ navigation }: Props) {
  const vm = useProfileViewModel({
    onEditProfile: () => navigation.navigate("EditProfile"),
    onOpenImpact: () => navigation.navigate("Impact"),
    onAddAddress: () => navigation.navigate("AddressForm"),
    onOpenAddresses: () => navigation.navigate("AddressList"),
    onOpenSettings: () => navigation.navigate("Settings"),
    onSignOut: () => navigation.navigate("Tabs", { screen: "InicioTab" }),
  });

  if (vm.isLoading) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]} edges={["top", "left", "right"]}>
        <ActivityIndicator color={colors.brandPrimary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Avatar uri={vm.avatarUrl} name={vm.name} size={80} />
          <Text variant="titulo">{vm.name}</Text>
          <Text variant="apoio" color="secondary">
            {vm.memberSince}
          </Text>
        </View>

        {vm.impact ? (
          <Card onPress={vm.onOpenImpact} accessibilityLabel="Ver meu impacto">
            <View style={styles.impactRow}>
              <IconTile icon="leaf-outline" />
              <View style={styles.impactBody}>
                <Text variant="corpo">Impacto salvo · {vm.impact.levelLabel}</Text>
                <Text variant="apoio" color="secondary">
                  {vm.impact.weightLabel} de comida · {vm.impact.valueLabel} · sequência de{" "}
                  {vm.impact.streakDays} dias
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </Card>
        ) : null}

        <Section title="Dados pessoais" actionLabel="Editar" onAction={vm.onEditProfile}>
          <Card>
            {vm.personalData.map((row, index) => (
              <View key={row.key}>
                {index > 0 ? <Divider inset /> : null}
                <View style={styles.dataRow}>
                  <IconTile icon={row.icon} size={36} />
                  <View style={styles.dataBody}>
                    <Text variant="apoio" color="secondary">
                      {row.label}
                    </Text>
                    <Text variant="corpo">{row.value}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </Section>

        <Section title="Meus endereços" actionLabel="+ Novo" onAction={vm.onAddAddress}>
          <View style={styles.addressList}>
            {vm.addressCards.map((address) => (
              <AddressCard key={address.id} address={address} onPress={vm.onOpenAddresses} />
            ))}
            {vm.hasMoreAddresses ? (
              <Pressable onPress={vm.onOpenAddresses} hitSlop={8} accessibilityRole="button">
                <Text variant="corpo" color="brand">
                  Ver todos os endereços
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Section>

        <View style={styles.menu}>
          <ListRow
            icon="settings-outline"
            label="Configurações da conta"
            onPress={vm.onOpenSettings}
          />
          <ListRow icon="log-out-outline" label="Sair do app" danger onPress={vm.onSignOut} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="subtitulo">{title}</Text>
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text variant="corpo" color="brand">
            {actionLabel}
          </Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceBg },
  centered: { alignItems: "center", justifyContent: "center" },
  content: { padding: screenMargin, gap: spacing.lg, paddingBottom: spacing.xl },
  hero: { alignItems: "center", gap: spacing.xs, paddingVertical: spacing.md },
  impactRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  impactBody: { flex: 1, gap: 2 },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  dataBody: { flex: 1, gap: 2 },
  addressList: { gap: spacing.sm },
  menu: { gap: spacing.xs },
});
