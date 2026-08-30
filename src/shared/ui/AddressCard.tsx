import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, radius, spacing } from "@/shared/theme";

import { IconTile } from "./IconTile";
import { Tag } from "./Tag";
import { Text } from "./Text";

export type AddressCardModel = {
  id: string;
  label: string;
  /** Ex.: "Rua das Flores, 123 - Apto 42\nPinheiros, São Paulo - SP\n05432-010". */
  formatted: string;
  isDefault: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

type AddressCardProps = {
  address: AddressCardModel;
  onPress?: () => void;
  onMenu?: () => void;
  selected?: boolean;
};

export function AddressCard({ address, onPress, onMenu, selected = false }: AddressCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={[styles.card, selected && styles.selected]}
    >
      <IconTile icon={address.icon} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="corpo">{address.label}</Text>
          {address.isDefault ? <Tag label="PRINCIPAL" /> : null}
        </View>
        <Text variant="apoio" color="secondary">
          {address.formatted}
        </Text>
      </View>
      {onMenu ? (
        <Pressable
          onPress={onMenu}
          hitSlop={8}
          style={styles.menu}
          accessibilityRole="button"
          accessibilityLabel={`Opções do endereço ${address.label}`}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceBase,
  },
  selected: { borderColor: colors.brandPrimary },
  body: { flex: 1, gap: spacing.xs },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  menu: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "flex-end",
  },
});
