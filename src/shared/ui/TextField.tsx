import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { colors, minTouchTarget, radius, spacing, typography } from "@/shared/theme";

import { Text } from "./Text";

type TextFieldProps = TextInputProps & {
  label: string;
  /** Mensagem de erro — única situação de uso do vermelho de sistema. */
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, style, ...rest }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="apoio" color="secondary">
        {label}
      </Text>
      <TextInput
        {...rest}
        style={[styles.input, !!error && styles.inputError, style]}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label}
      />
      {error ? (
        <Text variant="apoio" color="error">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="apoio" color="secondary">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    minHeight: minTouchTarget,
    ...typography.corpo,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.field,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceBase,
  },
  inputError: { borderColor: colors.feedbackError },
});
