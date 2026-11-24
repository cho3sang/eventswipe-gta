import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppButton } from "../components/AppButton";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { TagPill } from "../components/TagPill";
import { theme } from "../constants/theme";
import { eventProvider, useApp } from "../context/AppContext";
import { EventInterest, GtaEvent, RootStackParamList, UserProfile } from "../types";
import { formatLongEventDate } from "../utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetails">;

export function EventDetailsScreen({ navigation, route }: Props) {
  const { currentUser, refreshAppData } = useApp();
  const [event, setEvent] = useState<GtaEvent | null>(null);
  const [interests, setInterests] = useState<EventInterest[]>([]);
  const [interestedUsers, setInterestedUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        if (!currentUser) {
          return;
        }

        setIsLoading(true);
        const [loadedEvent, loadedInterests, loadedUsers] = await Promise.all([
          eventProvider.getEventById(route.params.eventId),
          eventProvider.getUserInterests?.(currentUser.id) ?? Promise.resolve([]),
          eventProvider.getInterestedUsers?.(route.params.eventId) ?? Promise.resolve([])
        ]);

        if (isActive) {
          setEvent(loadedEvent);
          setInterests(loadedInterests);
          setInterestedUsers(loadedUsers);
          setIsLoading(false);
        }
      }

      void load();

      return () => {
        isActive = false;
      };
    }, [currentUser, route.params.eventId])
  );

  const isInterested = interests.some(
    (interest) =>
      interest.event_id === route.params.eventId && interest.status === "interested"
  );

  async function handleInterested() {
    if (!currentUser || !event) {
      return;
    }

    setIsSaving(true);

    try {
      await eventProvider.markInterested(currentUser.id, event.id);
      const [loadedInterests, loadedUsers] = await Promise.all([
        eventProvider.getUserInterests?.(currentUser.id) ?? Promise.resolve([]),
        eventProvider.getInterestedUsers?.(event.id) ?? Promise.resolve([])
      ]);
      setInterests(loadedInterests);
      setInterestedUsers(loadedUsers);
      refreshAppData();
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !currentUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.coral} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: event.image_url }} style={styles.heroImage} />
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.category}>{event.category}</Text>
            <Text style={styles.title}>{event.title}</Text>
          </View>
          <TagPill label={event.price_label} tone="yellow" />
        </View>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.tags}>
          {event.tags.map((tag) => (
            <TagPill key={tag} label={tag} tone="teal" />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <InfoRow
          icon={<Icon name="calendar-outline" color={theme.colors.coral} size={20} />}
          label="When"
          value={formatLongEventDate(event)}
        />
        <InfoRow
          icon={<Icon name="location-outline" color={theme.colors.teal} size={20} />}
          label="Where"
          value={`${event.venue_name}, ${event.address}`}
        />
        <InfoRow
          icon={<Icon name="open-outline" color={theme.colors.blue} size={20} />}
          label="Source"
          value={event.source_name}
        />
      </View>

      <View style={styles.mapPlaceholder}>
        <Icon name="location-outline" color={theme.colors.surface} size={28} />
        <Text style={styles.mapTitle}>{event.neighbourhood}</Text>
        <Text style={styles.mapText}>{event.city}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.interestHeader}>
          <Icon name="people-outline" color={theme.colors.ink} size={20} />
          <Text style={styles.sectionTitle}>Interested</Text>
          <Text style={styles.count}>{interestedUsers.length}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
          {interestedUsers.length > 0 ? (
            interestedUsers.map((user) => (
              <View key={user.id} style={styles.avatarBlock}>
                <Avatar name={user.name} uri={user.avatar_url} size={48} />
                <Text style={styles.avatarName} numberOfLines={1}>
                  {user.id === currentUser.id ? "You" : user.name.split(" ")[0]}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noInterest}>Be the first person interested.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <AppButton
          title={isInterested ? "You're interested" : "I'm interested"}
          onPress={handleInterested}
          loading={isSaving}
          disabled={isInterested}
        />
        {isInterested ? (
          <AppButton
            title="Open event chat"
            onPress={() => navigation.navigate("EventChat", { eventId: event.id })}
            icon={<Icon name="chatbubble-ellipses-outline" color={theme.colors.surface} size={18} />}
          />
        ) : null}
        <AppButton
          title="Event link"
          variant="secondary"
          onPress={() => void Linking.openURL(event.source_url)}
          icon={<Icon name="open-outline" color={theme.colors.ink} size={18} />}
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    paddingBottom: theme.spacing.xxl
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background
  },
  heroImage: {
    width: "100%",
    height: 290,
    backgroundColor: theme.colors.border
  },
  section: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md
  },
  titleBlock: {
    flex: 1,
    gap: 4
  },
  category: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: theme.colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900"
  },
  description: {
    color: theme.colors.inkSoft,
    fontSize: 16,
    lineHeight: 24
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  infoRow: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background
  },
  infoText: {
    flex: 1,
    gap: 3
  },
  infoLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  infoValue: {
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700"
  },
  mapPlaceholder: {
    height: 160,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.dark,
    gap: 5
  },
  mapTitle: {
    color: theme.colors.surface,
    fontSize: 22,
    fontWeight: "900"
  },
  mapText: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 14,
    fontWeight: "700"
  },
  interestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  count: {
    color: theme.colors.teal,
    fontSize: 15,
    fontWeight: "900"
  },
  avatarRow: {
    gap: theme.spacing.md
  },
  avatarBlock: {
    width: 64,
    alignItems: "center",
    gap: 6
  },
  avatarName: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: "700",
    maxWidth: 64
  },
  noInterest: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: "700"
  },
  actions: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900"
  }
});
