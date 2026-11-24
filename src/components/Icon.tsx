import { Ionicons } from "@expo/vector-icons";

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
};

export function Icon({ name, color, size }: IconProps) {
  return <Ionicons name={name} color={color} size={size} />;
}
