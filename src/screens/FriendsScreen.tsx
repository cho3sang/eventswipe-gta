import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { FriendCard } from "../components/FriendCard";
import { Icon } from "../components/Icon";
import { theme } from "../constants/theme";
import { eventProvider, useApp } from "../context/AppContext";
import { GtaEvent, UserProfile } from "../types";

export function FriendsScreen() {
  const { currentUser, refreshKey, refreshAppData } = useApp();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [sharedEvents, setSharedEvents] = useState<Record<string, GtaEvent[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadFriends = useCallback(() => {
    let isActive = true;

    async function load() {
      if (!currentUser) {
        return;
      }

      setIsLoading(true);
      const [loadedUsers, loadedFriends] = await Promise.all([
        eventProvider.getUsers?.() ?? Promise.resolve([]),
        eventProvider.getFriends?.(currentUser.id) ?? Promise.resolve([])
      ]);

      const sharedPairs = await Promise.all(
        loadedUsers
          .filter((user) => user.id !== currentUser.id)
          .map(async (user) => [
            user.id,
            (await eventProvider.getSharedEvents?.(currentUser.id, user.id)) ?? []
          ] as const)
      );

      if (isActive) {
        setUsers(loadedUsers);
        setFriends(loadedFriends);
        setSharedEvents(Object.fromEntries(sharedPairs));
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [currentUser, refreshKey]);

  useFocusEffect(loadFriends);

  const friendIds = useMemo(() => new Set(friends.map((friend) => friend.id)), [friends]);
  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return users
      .filter((user) => user.id !== currentUser?.id)
      .filter((user) => {
        if (!search) {
          return true;
        }

        return `${user.name} ${user.city}`.toLowerCase().includes(search);
      });
  }, [currentUser?.id, query, users]);

  async function handleAddFriend(receiverId: string) {
    if (!currentUser) {
      return;
    }

    await eventProvider.addFriend?.(currentUser.id, receiverId);
    refreshAppData();
    loadFriends();
  }

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Plan together</Text>
          <Text style={styles.heading}>Friends</Text>
        </View>
        <View style={styles.searchBox}>
          <Icon name="search-outline" color={theme.colors.muted} size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search people"
            placeholderTextColor={theme.colors.muted}
            style={styles.searchInput}
          />
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={theme.colors.coral} />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your friends</Text>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    user={friend}
                    isFriend
                    sharedEvents={sharedEvents[friend.id] ?? []}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>Add friends to see shared event interests.</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Find people</Text>
              {filteredUsers.map((user) => (
                <FriendCard
                  key={user.id}
                  user={user}
                  isFriend={friendIds.has(user.id)}
                  sharedEvents={sharedEvents[user.id] ?? []}
                  onAdd={() => handleAddFriend(user.id)}
                />
              ))}
            </View>
          </>
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
    gap: theme.spacing.lg
  },
  header: {
    gap: 4
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    minHeight: 52,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md
  },
  searchInput: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  loader: {
    paddingVertical: theme.spacing.xxl
  },
  section: {
    gap: theme.spacing.md
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
