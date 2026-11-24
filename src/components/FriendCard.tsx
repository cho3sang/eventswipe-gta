import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { GtaEvent, UserProfile } from "../types";
import { AppButton } from "./AppButton";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

type FriendCardProps = {
  user: UserProfile;
  sharedEvents?: GtaEvent[];
  isFriend?: boolean;
  onAdd?: () => void;
};

export function FriendCard({ user, sharedEvents = [], isFriend, onAdd }: FriendCardProps) {
  const sharedLabel =
    sharedEvents.length > 0
      ? `${sharedEvents.length} shared event${sharedEvents.length === 1 ? "" : "s"}`
      : "No shared events yet";

  return (
    <View style={styles.card}>
      <Avatar name={user.name} uri={user.avatar_url} />
      <View style={styles.body}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.city}>{user.city}</Text>
        <Text style={styles.shared} numberOfLines={2}>
          {sharedEvents.length > 0 ? `${sharedLabel}: ${sharedEvents.map((event) => event.title).join(", ")}` : sharedLabel}
        </Text>
      </View>
      {isFriend ? (
        <View style={styles.friendBadge}>
          <Icon name="checkmark" color={theme.colors.teal} size={16} />
        </View>
      ) : (
        <AppButton
          title="Add"
          onPress={onAdd ?? (() => undefined)}
          icon={<Icon name="person-add-outline" color={theme.colors.surface} size={16} />}
          style={styles.addButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  body: {
    flex: 1,
    gap: 2
  },
  name: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  city: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  shared: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  addButton: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.md
  },
  friendBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.tealSoft
  }
});
