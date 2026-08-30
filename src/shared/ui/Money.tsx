import { formatCurrencyBRL } from "@/shared/utils";

import { Text, type AppTextProps } from "./Text";

type MoneyProps = Omit<AppTextProps, "children"> & {
  cents: number;
  strikethrough?: boolean;
};

/** Exibe um valor em centavos como moeda BRL. */
export function Money({ cents, strikethrough = false, style, ...rest }: MoneyProps) {
  return (
    <Text {...rest} style={[strikethrough && { textDecorationLine: "line-through" }, style]}>
      {formatCurrencyBRL(cents)}
    </Text>
  );
}
