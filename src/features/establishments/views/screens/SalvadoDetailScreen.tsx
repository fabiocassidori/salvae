import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "@/app/navigation";
import { colors, elevation, minTouchTarget, screenMargin, spacing } from "@/shared/theme";
import {
  CountdownChip,
  EmptyState,
  PriceTag,
  PrimaryButton,
  SafeAreaInsetBottom,
  SafetySeal,
  Text,
} from "@/shared/ui";

import { useSalvadoDetailViewModel } from "../../viewmodels/useSalvadoDetailViewModel";

type Props = RootStackScreenProps<"SalvadoDetail">;

export function SalvadoDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useSalvadoDetailViewModel({
    salvadoId: route.params.salvadoId,
    onOpenCart: () => navigation.navigate("Cart"),
    onOpenEstablishment: (establishmentId) =>
      navigation.navigate("Establishment", { establishmentId }),
  });

  if (vm.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brandPrimary} />
      </View>
    );
  }

  if (vm.hasError || !vm.model) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Salvado indisponível"
        description="Esta oferta pode ter sido resgatada. Veja outros perto de você."
        actionLabel="Voltar"
        onAction={navigation.goBack}
      />
    );
  }

  const m = vm.model;

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: m.imageUrl }} style={styles.hero} />
          <Pressable
            onPress={navigation.goBack}
            style={[styles.back, { top: insets.top + spacing.sm }]}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.heroChip}>
            <CountdownChip expiresAt={m.offerExpiresAt} />
          </View>
        </View>

        <View style={styles.body}>
          <Text variant="titulo">{m.name}</Text>

          <Pressable
            style={styles.metaRow}
            onPress={vm.openEstablishment}
            accessibilityRole="button"
          >
            <Ionicons name="storefront-outline" size={16} color={colors.textSecondary} />
            <Text variant="apoio" color="secondary">
              {m.establishmentName}
            </Text>
            <Ionicons name="ellipse" size={4} color={colors.textSecondary} />
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text variant="apoio" color="secondary">
              {m.distanceLabel}
            </Text>
          </Pressable>

          {m.isSurpriseBag ? (
            <View style={styles.surprise}>
              <Ionicons name="gift-outline" size={16} color={colors.brandPrimary} />
              <Text variant="apoio" color="brand">
                Caixa Surpresa — o conteúdo exato é definido pelo parceiro na retirada.
              </Text>
            </View>
          ) : null}

          {/* Segurança/condição SEMPRE antes do preço (contexto-design §1). */}
          <SafetySeal data={m.safetySeal} />

          <View style={styles.pickup}>
            <Ionicons name="time-outline" size={16} color={colors.brandPrimary} />
            <Text variant="corpo">Janela de retirada: {m.pickupWindowLabel}</Text>
          </View>

          {m.consumeWithinLabel ? (
            <Text variant="apoio" color="secondary">
              {m.consumeWithinLabel}
            </Text>
          ) : null}

          <View style={styles.about}>
            <Text variant="subtitulo">Sobre o item</Text>
            <Text variant="corpo" color="secondary">
              {m.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PriceTag
          originalPriceInCents={m.originalPriceInCents}
          priceInCents={m.priceInCents}
          showImpact
        />
        <View style={styles.cta}>
          <PrimaryButton
            label={m.isOfferOpen ? "Adicionar à sacola" : "Oferta encerrada"}
            onPress={vm.addToCart}
            disabled={!m.isOfferOpen}
          />
        </View>
        <SafeAreaInsetBottom />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surfaceBase },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceBg,
  },
  scroll: { paddingBottom: spacing.lg },
  hero: { width: "100%", height: 260, backgroundColor: colors.border },
  back: {
    position: "absolute",
    left: screenMargin,
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: minTouchTarget / 2,
    backgroundColor: colors.surfaceBase,
    alignItems: "center",
    justifyContent: "center",
    ...elevation(2),
  },
  heroChip: { position: "absolute", left: screenMargin, bottom: spacing.md },
  body: { padding: screenMargin, gap: spacing.md },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  surprise: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pickup: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  about: { gap: spacing.xs },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: screenMargin,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surfaceBase,
    ...elevation(2),
  },
  cta: { marginTop: spacing.xs },
});
