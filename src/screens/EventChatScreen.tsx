import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ChatRoom } from "../components/ChatRoom";
import { theme } from "../constants/theme";
import { eventProvider, useApp } from "../context/AppContext";
import { GtaEvent, RootStackParamList } from "../types";
import { formatEventDate } from "../utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "EventChat">;

export function EventChatScreen({ route }: Props) {
  const { currentUser } = useApp();
  const [event, setEvent] = useState<GtaEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    eventProvider.getEventById(route.params.eventId).then((loadedEvent) => {
      if (isMounted) {
        setEvent(loadedEvent);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [route.params.eventId]);

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
    <View style={styles.container}>
      <View style={styles.eventHeader}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatEventDate(event)} · {event.neighbourhood}
        </Text>
      </View>
      <ChatRoom event={event} currentUser={currentUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background
  },
  eventHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  category: {
    color: theme.colors.coral,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: theme.colors.ink,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900"
  },
  meta: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900"
  }
});
