import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { EventListItem } from "../components/EventListItem";
import { theme } from "../constants/theme";
import { eventProvider, useApp } from "../context/AppContext";
import { GtaEvent, RootStackParamList } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function MyEventsScreen() {
  const navigation = useNavigation<Navigation>();
  const { currentUser, refreshKey } = useApp();
  const [events, setEvents] = useState<GtaEvent[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(() => {
    let isActive = true;

    async function load() {
      if (!currentUser) {
        return;
      }

      setIsLoading(true);
      const loadedEvents = await eventProvider.getUserEvents?.(currentUser.id) ?? [];
      const countPairs = await Promise.all(
        loadedEvents.map(async (event) => [
          event.id,
          ((await eventProvider.getInterestedUsers?.(event.id)) ?? []).length
        ] as const)
      );

      if (isActive) {
        setEvents(loadedEvents);
        setCounts(Object.fromEntries(countPairs));
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [currentUser, refreshKey]);

  useFocusEffect(loadEvents);

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Plans you liked</Text>
          <Text style={styles.heading}>My Events</Text>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={theme.colors.coral} />
          </View>
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              interestedCount={counts[event.id] ?? 1}
              onOpenDetails={() => navigation.navigate("EventDetails", { eventId: event.id })}
              onOpenChat={() => navigation.navigate("EventChat", { eventId: event.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved events yet</Text>
            <Text style={styles.emptyText}>
              Swipe right on an event and it will appear here with chat access.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md
  },
  header: {
    gap: 4,
    marginBottom: theme.spacing.xs
  },
  kicker: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "900"
  },
  heading: {
    color: theme.colors.ink,
    fontSize: 30,
    fontWeight: "900"
  },
  loader: {
    paddingVertical: theme.spacing.xxl
  },
  emptyState: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 21,
    fontWeight: "900"
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  }
});
