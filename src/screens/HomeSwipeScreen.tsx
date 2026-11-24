import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AppButton } from "../components/AppButton";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { SwipeDeck } from "../components/SwipeDeck";
import { theme } from "../constants/theme";
import { eventProvider, useApp } from "../context/AppContext";
import { EventInterest, GtaEvent, RootStackParamList } from "../types";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeSwipeScreen() {
  const navigation = useNavigation<Navigation>();
  const { currentUser, logout, refreshAppData, dataMode } = useApp();
  const [events, setEvents] = useState<GtaEvent[]>([]);
  const [interests, setInterests] = useState<EventInterest[]>([]);
  const [actionedEventIds, setActionedEventIds] = useState<string[]>([]);
  const [lastJoinedEvent, setLastJoinedEvent] = useState<GtaEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeck = useCallback(() => {
    let isActive = true;

    async function load() {
      if (!currentUser) {
        return;
      }

      setIsLoading(true);
      const [nextEvents, nextInterests] = await Promise.all([
        eventProvider.getEvents(),
        eventProvider.getUserInterests?.(currentUser.id) ?? Promise.resolve([])
      ]);

      if (isActive) {
        setEvents(nextEvents);
        setInterests(nextInterests);
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  useFocusEffect(loadDeck);

  const availableEvents = useMemo(() => {
    const completedIds = new Set([
      ...interests.map((interest) => interest.event_id),
      ...actionedEventIds
    ]);

    return events.filter((event) => !completedIds.has(event.id));
  }, [actionedEventIds, events, interests]);

  async function handleSwipeLeft(event: GtaEvent) {
    if (!currentUser) {
      return;
    }

    setActionedEventIds((ids) => [...ids, event.id]);
    await eventProvider.markSkipped(currentUser.id, event.id);
    refreshAppData();
  }

  async function handleSwipeRight(event: GtaEvent) {
    if (!currentUser) {
      return;
    }

    setActionedEventIds((ids) => [...ids, event.id]);
    await eventProvider.markInterested(currentUser.id, event.id);
    setLastJoinedEvent(event);
    refreshAppData();
  }

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Avatar name={currentUser.name} uri={currentUser.avatar_url} size={44} />
            <View>
              <Text style={styles.kicker}>Toronto and GTA</Text>
              <Text style={styles.heading}>Tonight's deck</Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel="Log out"
            activeOpacity={0.85}
            onPress={logout}
            style={styles.iconButton}
          >
            <Icon name="log-out-outline" color={theme.colors.ink} size={20} />
          </TouchableOpacity>
        </View>

        {dataMode === "mock" ? (
          <Text style={styles.demoNote}>Demo data is active until Supabase keys are added.</Text>
        ) : null}

        {lastJoinedEvent ? (
          <View style={styles.joinedBanner}>
            <View style={styles.joinedTextBlock}>
              <Text style={styles.joinedTitle}>Joined chat</Text>
              <Text style={styles.joinedEvent} numberOfLines={1}>
                {lastJoinedEvent.title}
              </Text>
            </View>
            <AppButton
              title="Chat"
              onPress={() =>
                navigation.navigate("EventChat", {
                  eventId: lastJoinedEvent.id
                })
              }
              icon={<Icon name="chatbubble-ellipses-outline" color={theme.colors.surface} size={16} />}
              style={styles.chatButton}
            />
          </View>
        ) : null}

        <View style={styles.deckWrap}>
          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={theme.colors.coral} />
            </View>
          ) : (
            <SwipeDeck
              events={availableEvents}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onOpenEvent={(event) => navigation.navigate("EventDetails", { eventId: event.id })}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  kicker: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "900"
  },
  heading: {
    color: theme.colors.ink,
    fontSize: 25,
    fontWeight: "900"
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  demoNote: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  joinedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.dark
  },
  joinedTextBlock: {
    flex: 1
  },
  joinedTitle: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "900"
  },
  joinedEvent: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "800"
  },
  chatButton: {
    minHeight: 42,
    paddingHorizontal: theme.spacing.md
  },
  deckWrap: {
    flex: 1
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
