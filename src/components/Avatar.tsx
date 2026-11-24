import { Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { getInitials } from "../utils/format";

type AvatarProps = {
  name: string;
  uri?: string | null;
  size?: number;
};

export function Avatar({ name, uri, size = 42 }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2
          }
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2
        }
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.34) }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: theme.colors.border
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.dark
  },
  initials: {
    color: theme.colors.surface,
    fontWeight: "800"
  }
});
