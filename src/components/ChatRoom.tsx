import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { theme } from "../constants/theme";
import { eventProvider } from "../context/AppContext";
import { EventMessage, GtaEvent, UserProfile } from "../types";
import { formatMessageTime } from "../utils/format";
import { Icon } from "./Icon";

type ChatRoomProps = {
  event: GtaEvent;
  currentUser: UserProfile;
};

export function ChatRoom({ event, currentUser }: ChatRoomProps) {
  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<EventMessage>>(null);

  const starterMessage = useMemo<EventMessage>(
    () => ({
      id: "starter-message",
      event_id: event.id,
      user_id: "system",
      message: "You joined the chat for this event. Start planning with others.",
      created_at: new Date().toISOString(),
      system: true
    }),
    [event.id]
  );

  const visibleMessages = useMemo(
    () => [starterMessage, ...messages],
    [messages, starterMessage]
  );

  useEffect(() => {
    let isMounted = true;

    eventProvider.joinEventChat(currentUser.id, event.id).catch(() => undefined);
    eventProvider.getMessages(event.id).then((loadedMessages) => {
      if (isMounted) {
        setMessages(loadedMessages);
      }
    });

    const unsubscribe = eventProvider.subscribeToMessages?.(event.id, (nextMessages) => {
      if (isMounted) {
        setMessages(nextMessages);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [currentUser.id, event.id]);

  async function handleSend() {
    const message = draft.trim();

    if (!message) {
      return;
    }

    setDraft("");
    setIsSending(true);

    try {
      await eventProvider.sendMessage(event.id, currentUser.id, message);
      const nextMessages = await eventProvider.getMessages(event.id);
      setMessages(nextMessages);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={96}
      style={styles.container}
    >
      <FlatList
        ref={listRef}
        data={visibleMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMine = item.user_id === currentUser.id;

          if (item.system) {
            return (
              <View style={styles.systemBubble}>
                <Text style={styles.systemText}>{item.message}</Text>
              </View>
            );
          }

          return (
            <View style={[styles.messageRow, isMine ? styles.mineRow : styles.theirRow]}>
              <View style={[styles.bubble, isMine ? styles.mineBubble : styles.theirBubble]}>
                <Text style={[styles.senderName, isMine ? styles.mineName : styles.theirName]}>
                  {isMine ? "You" : item.user?.name ?? "Toronto User"}
                </Text>
                <Text style={[styles.messageText, isMine ? styles.mineText : styles.theirText]}>
                  {item.message}
                </Text>
                <Text style={[styles.timeText, isMine ? styles.mineTime : styles.theirTime]}>
                  {formatMessageTime(item.created_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message the group"
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          accessibilityLabel="Send message"
          activeOpacity={0.85}
          disabled={isSending}
          onPress={handleSend}
          style={styles.sendButton}
        >
          <Icon name="send" color={theme.colors.surface} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  messageList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  systemBubble: {
    alignSelf: "center",
    maxWidth: "88%",
    borderRadius: theme.radius.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.blueSoft
  },
  systemText: {
    color: theme.colors.blue,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  },
  messageRow: {
    flexDirection: "row"
  },
  mineRow: {
    justifyContent: "flex-end"
  },
  theirRow: {
    justifyContent: "flex-start"
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    gap: 4
  },
  mineBubble: {
    backgroundColor: theme.colors.coral
  },
  theirBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  senderName: {
    fontSize: 12,
    fontWeight: "900"
  },
  mineName: {
    color: theme.colors.surface
  },
  theirName: {
    color: theme.colors.teal
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21
  },
  mineText: {
    color: theme.colors.surface
  },
  theirText: {
    color: theme.colors.ink
  },
  timeText: {
    fontSize: 11,
    fontWeight: "700",
    alignSelf: "flex-end"
  },
  mineTime: {
    color: "rgba(255,255,255,0.76)"
  },
  theirTime: {
    color: theme.colors.muted
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: Platform.OS === "ios" ? theme.spacing.xl : theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  input: {
    flex: 1,
    maxHeight: 112,
    minHeight: 46,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.ink,
    fontSize: 15,
    backgroundColor: theme.colors.background
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.teal
  }
});
