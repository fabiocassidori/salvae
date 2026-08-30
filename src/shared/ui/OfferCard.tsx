import { Image, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

import { Card } from "./Card";
import { CountdownChip } from "./CountdownChip";
import { PriceTag } from "./PriceTag";
import { SafeBadge } from "./SafeBadge";
import { Text } from "./Text";

/** Dados já formatados pela ViewModel para o Card de Oferta. */
export type OfferCardModel = {
  id: string;
  salvadoName: string;
  establishmentName: string;
  imageUrl: string;
  distanceLabel?: string;
  originalPriceInCents: number;
  priceInCents: number;
  /** ISO — Janela de Salvamento (expiração da oferta). */
  expiresAt: string;
  isSafe: boolean;
};

type OfferCardProps = {
  offer: OfferCardModel;
  onPress: (id: string) => void;
};

/**
 * Card de Oferta (`contexto-design.md` §6).
 * - Imagem 72x72 (raio 8) à esquerda, padding 16, gap imagem/coluna 16, gap textos 8.
 * - Chip de contagem regressiva NUNCA é omitido.
 * - Hierarquia: nome → selo de segurança → preço (segurança antes de preço, §1).
 * - Área de toque = card inteiro.
 */
export function OfferCard({ offer, onPress }: OfferCardProps) {
  return (
    <Card
      onPress={() => onPress(offer.id)}
      accessibilityLabel={`${offer.salvadoName}, ${offer.establishmentName}`}
      style={styles.card}
    >
      <View style={styles.row}>
        <Image source={{ uri: offer.imageUrl }} style={styles.image} />

        <View style={styles.body}>
          <Text variant="apoio" color="secondary" numberOfLines={1}>
            {offer.establishmentName}
            {offer.distanceLabel ? ` · ${offer.distanceLabel}` : ""}
          </Text>

          <Text variant="subtitulo" numberOfLines={2}>
            {offer.salvadoName}
          </Text>

          {offer.isSafe ? <SafeBadge /> : null}

          <CountdownChip expiresAt={offer.expiresAt} compact />

          <PriceTag
            originalPriceInCents={offer.originalPriceInCents}
            priceInCents={offer.priceInCents}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md },
  row: { flexDirection: "row", gap: spacing.md },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.field,
    backgroundColor: colors.border,
  },
  body: { flex: 1, gap: spacing.sm },
});
