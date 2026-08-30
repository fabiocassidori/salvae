import { Image, StyleSheet, View } from "react-native";

import { colors } from "@/shared/theme";

import { Text } from "./Text";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 72 }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} accessibilityLabel={name} />
      ) : (
        <Text variant="subtitulo" color="onBrand">
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
});
