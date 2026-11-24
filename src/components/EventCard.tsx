import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { GtaEvent } from "../types";
import { formatEventDate } from "../utils/format";
import { Icon } from "./Icon";
import { TagPill } from "./TagPill";

type EventCardProps = {
  event: GtaEvent;
  onPress?: () => void;
};

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.card}>
      <Image source={{ uri: event.image_url }} style={styles.image} resizeMode="cover" />
      <View style={styles.imageShade} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.metaRow}>
          <Icon name="calendar-outline" color={theme.colors.surface} size={16} />
          <Text style={styles.metaText} numberOfLines={1}>
            {formatEventDate(event)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="location-outline" color={theme.colors.surface} size={16} />
          <Text style={styles.metaText} numberOfLines={1}>
            {event.venue_name} · {event.neighbourhood}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {event.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.tags}>
            {event.tags.slice(0, 2).map((tag) => (
              <TagPill key={tag} label={tag} tone="teal" />
            ))}
          </View>
          <Text style={styles.price}>{event.price_label}</Text>
        </View>
        <Text style={styles.source} numberOfLines={1}>
          {event.source_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
    borderRadius: theme.radius.card,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    ...theme.shadow
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%"
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.42)"
  },
  categoryBadge: {
    position: "absolute",
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(255, 255, 255, 0.88)"
  },
  categoryText: {
    color: theme.colors.ink,
    fontWeight: "900",
    fontSize: 12
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.surface,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  metaText: {
    flex: 1,
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "700"
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 15,
    lineHeight: 22
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  tags: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flex: 1
  },
  price: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "900"
  },
  source: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 12,
    fontWeight: "700"
  }
});
