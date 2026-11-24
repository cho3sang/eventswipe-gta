import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

type TagPillProps = {
  label: string;
  tone?: "coral" | "teal" | "blue" | "yellow";
};

export function TagPill({ label, tone = "blue" }: TagPillProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.pill, toneStyle.container]}>
      <Text style={[styles.text, toneStyle.text]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const toneStyles = {
  coral: {
    container: { backgroundColor: theme.colors.coralSoft },
    text: { color: theme.colors.coral }
  },
  teal: {
    container: { backgroundColor: theme.colors.tealSoft },
    text: { color: theme.colors.teal }
  },
  blue: {
    container: { backgroundColor: theme.colors.blueSoft },
    text: { color: theme.colors.blue }
  },
  yellow: {
    container: { backgroundColor: theme.colors.yellowSoft },
    text: { color: theme.colors.yellow }
  }
};

const styles = StyleSheet.create({
  pill: {
    maxWidth: 120,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill
  },
  text: {
    fontSize: 12,
    fontWeight: "800"
  }
});
