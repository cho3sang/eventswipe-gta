import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { GtaEvent } from "../types";
import { formatEventDate } from "../utils/format";
import { AppButton } from "./AppButton";
import { Icon } from "./Icon";

type EventListItemProps = {
  event: GtaEvent;
  interestedCount: number;
  onOpenDetails: () => void;
  onOpenChat: () => void;
};

export function EventListItem({
  event,
  interestedCount,
  onOpenDetails,
  onOpenChat
}: EventListItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onOpenDetails} style={styles.card}>
      <Image source={{ uri: event.image_url }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.metaRow}>
          <Icon name="calendar-outline" color={theme.colors.muted} size={15} />
          <Text style={styles.metaText} numberOfLines={1}>
            {formatEventDate(event)}
          </Text>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {event.venue_name} · {event.neighbourhood}
        </Text>
        <Text style={styles.count}>{interestedCount} interested</Text>
        <View style={styles.actions}>
          <AppButton title="Details" onPress={onOpenDetails} variant="secondary" style={styles.action} />
          <AppButton
            title="Chat"
            onPress={onOpenChat}
            icon={<Icon name="chatbubble-ellipses-outline" color={theme.colors.surface} size={16} />}
            style={styles.action}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  image: {
    width: 112,
    height: 164,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.border
  },
  body: {
    flex: 1,
    gap: 5
  },
  category: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: theme.colors.ink,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "900"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  metaText: {
    flex: 1,
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  location: {
    color: theme.colors.inkSoft,
    fontSize: 13,
    fontWeight: "700"
  },
  count: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "900"
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs
  },
  action: {
    flex: 1,
    minHeight: 40
  }
});
