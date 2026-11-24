import { useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { theme } from "../constants/theme";
import { GtaEvent } from "../types";
import { EventCard } from "./EventCard";
import { Icon } from "./Icon";

const screenWidth = Dimensions.get("window").width;
const swipeThreshold = screenWidth * 0.24;

type SwipeDeckProps = {
  events: GtaEvent[];
  onSwipeLeft: (event: GtaEvent) => void;
  onSwipeRight: (event: GtaEvent) => void;
  onOpenEvent: (event: GtaEvent) => void;
};

export function SwipeDeck({
  events,
  onSwipeLeft,
  onSwipeRight,
  onOpenEvent
}: SwipeDeckProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const currentEvent = events[0];
  const nextEvent = events[1];

  const rotate = pan.x.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ["-9deg", "0deg", "9deg"]
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false
        }),
        onPanResponderRelease: (_, gesture) => {
          if (!currentEvent) {
            resetCard();
            return;
          }

          if (gesture.dx > swipeThreshold) {
            forceSwipe(1, currentEvent);
            return;
          }

          if (gesture.dx < -swipeThreshold) {
            forceSwipe(-1, currentEvent);
            return;
          }

          resetCard();
        }
      }),
    [currentEvent, pan]
  );

  function resetCard() {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      useNativeDriver: true
    }).start();
  }

  function forceSwipe(direction: 1 | -1, event: GtaEvent) {
    Animated.timing(pan, {
      toValue: { x: direction * (screenWidth + 120), y: 22 },
      duration: 220,
      useNativeDriver: true
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      if (direction > 0) {
        onSwipeRight(event);
      } else {
        onSwipeLeft(event);
      }
    });
  }

  if (!currentEvent) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No more events</Text>
        <Text style={styles.emptyText}>
          Your deck is clear. Check My Events for the ones you liked.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardArea}>
        {nextEvent ? (
          <View style={styles.nextCard} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <EventCard event={nextEvent} />
          </View>
        ) : null}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.currentCard,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }]
            }
          ]}
        >
          <EventCard event={currentEvent} onPress={() => onOpenEvent(currentEvent)} />
        </Animated.View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          accessibilityLabel="Not interested"
          activeOpacity={0.85}
          onPress={() => forceSwipe(-1, currentEvent)}
          style={[styles.actionButton, styles.noButton]}
        >
          <Icon name="close" color={theme.colors.danger} size={34} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Interested"
          activeOpacity={0.85}
          onPress={() => forceSwipe(1, currentEvent)}
          style={[styles.actionButton, styles.yesButton]}
        >
          <Icon name="heart" color={theme.colors.surface} size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg
  },
  currentCard: {
    flex: 1
  },
  cardArea: {
    flex: 1,
    minHeight: 0
  },
  nextCard: {
    ...StyleSheet.absoluteFillObject,
    top: 10,
    transform: [{ scale: 0.96 }],
    opacity: 0.55
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.sm
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow
  },
  noButton: {
    backgroundColor: theme.colors.surface
  },
  yesButton: {
    backgroundColor: theme.colors.coral
  },
  emptyState: {
    flex: 1,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: theme.spacing.sm
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  }
});
