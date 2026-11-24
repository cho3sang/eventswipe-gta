import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { theme } from "../constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled,
  loading,
  style
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={variant === "secondary" ? theme.colors.ink : "#FFFFFF"} /> : icon}
      <Text style={[styles.text, variant === "secondary" || variant === "ghost" ? styles.darkText : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  primary: {
    backgroundColor: theme.colors.coral
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  danger: {
    backgroundColor: theme.colors.danger
  },
  ghost: {
    backgroundColor: "transparent"
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    color: theme.colors.surface,
    fontWeight: "800",
    fontSize: 15
  },
  darkText: {
    color: theme.colors.ink
  }
});
