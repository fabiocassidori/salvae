import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { colors, minTouchTarget, radius, spacing, typography } from "@/shared/theme";

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  /** Só aparência de campo, sem foco — usado como atalho que navega. */
  readOnlyPress?: () => void;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = "Buscar",
  onSubmit,
  readOnlyPress,
}: SearchFieldProps) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        editable={!readOnlyPress}
        onPressIn={readOnlyPress}
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.field,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceBase,
  },
  input: {
    flex: 1,
    ...typography.corpo,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
});
