import { StyleSheet, View } from "react-native";

import { spacing } from "@/shared/theme";

import { Money } from "./Money";
import { Text } from "./Text";

type PriceTagProps = {
  originalPriceInCents: number;
  priceInCents: number;
  /** Mostra a linha "Impacto salvo R$ X" (economia = original − atual). */
  showImpact?: boolean;
  align?: "left" | "right";
  size?: "md" | "lg";
};

/**
 * Preço do Salvado: valor original riscado + valor atual em destaque.
 * "Impacto salvo" substitui "economia"/"desconto" (`contexto-design.md` §2).
 * Segurança/condição sempre precede preço na hierarquia (§1) — este componente
 * é sempre posicionado depois do Selo/Badge nas telas.
 */
export function PriceTag({
  originalPriceInCents,
  priceInCents,
  showImpact = false,
  align = "left",
  size = "md",
}: PriceTagProps) {
  const impact = Math.max(0, originalPriceInCents - priceInCents);

  return (
    <View style={[styles.container, align === "right" && styles.right]}>
      <View style={[styles.row, align === "right" && styles.right]}>
        <Money cents={originalPriceInCents} variant="apoio" color="secondary" strikethrough />
        <Money
          cents={priceInCents}
          variant={size === "lg" ? "titulo" : "subtitulo"}
          color="brand"
        />
      </View>
      {showImpact && impact > 0 ? (
        <Text variant="apoio" color="secondary">
          Impacto salvo {formatImpact(impact)}
        </Text>
      ) : null}
    </View>
  );
}

function formatImpact(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  container: { gap: 2 },
  row: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm, flexWrap: "wrap" },
  right: { alignItems: "flex-end", justifyContent: "flex-end" },
});
