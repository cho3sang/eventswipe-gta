import { RealtimeChannel } from "@supabase/supabase-js";
import { MOCK_EVENTS } from "../data/mockEvents";
import {
  DEMO_USER,
  MOCK_CHAT_MEMBERS,
  MOCK_EVENT_INTERESTS,
  MOCK_EVENT_MESSAGES,
  MOCK_FRIENDSHIPS,
  MOCK_USERS
} from "../data/mockUsers";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  EventChatMember,
  EventInterest,
  EventMessage,
  Friendship,
  GtaEvent,
  UserProfile
} from "../types";

type MessageListener = (messages: EventMessage[]) => void;

export interface EventProvider {
  getEvents(): Promise<GtaEvent[]>;
  getEventById(id: string): Promise<GtaEvent | null>;
  markInterested(userId: string, eventId: string): Promise<EventInterest>;
  markSkipped(userId: string, eventId: string): Promise<EventInterest>;
  joinEventChat(userId: string, eventId: string): Promise<EventChatMember>;
  sendMessage(eventId: string, userId: string, message: string): Promise<EventMessage>;
  getMessages(eventId: string): Promise<EventMessage[]>;
  subscribeToMessages?(eventId: string, listener: MessageListener): () => void;
  getUserById?(userId: string): Promise<UserProfile | null>;
  upsertUser?(user: UserProfile): Promise<UserProfile>;
  getUsers?(): Promise<UserProfile[]>;
  getUserInterests?(userId: string): Promise<EventInterest[]>;
  getUserEvents?(userId: string): Promise<GtaEvent[]>;
  getInterestedUsers?(eventId: string): Promise<UserProfile[]>;
  getFriends?(userId: string): Promise<UserProfile[]>;
  addFriend?(requesterId: string, receiverId: string): Promise<Friendship>;
  getSharedEvents?(userId: string, friendId: string): Promise<GtaEvent[]>;
}

const nowIso = () => new Date().toISOString();
const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const unwrapRelation = <T,>(value: T | T[] | null | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

class MockEventProvider implements EventProvider {
  private events = [...MOCK_EVENTS];
  private users = [...MOCK_USERS];
  private interests = [...MOCK_EVENT_INTERESTS];
  private chatMembers = [...MOCK_CHAT_MEMBERS];
  private messages = [...MOCK_EVENT_MESSAGES];
  private friendships = [...MOCK_FRIENDSHIPS];
  private listeners = new Map<string, Set<MessageListener>>();

  async getEvents() {
    return [...this.events].sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    );
  }

  async getEventById(id: string) {
    return this.events.find((event) => event.id === id) ?? null;
  }

  async markInterested(userId: string, eventId: string) {
    const interest = this.upsertInterest(userId, eventId, "interested");
    await this.joinEventChat(userId, eventId);
    return interest;
  }

  async markSkipped(userId: string, eventId: string) {
    return this.upsertInterest(userId, eventId, "skipped");
  }

  async joinEventChat(userId: string, eventId: string) {
    const existing = this.chatMembers.find(
      (member) => member.user_id === userId && member.event_id === eventId
    );

    if (existing) {
      return { ...existing };
    }

    const member: EventChatMember = {
      id: createId("member"),
      user_id: userId,
      event_id: eventId,
      joined_at: nowIso()
    };

    this.chatMembers.push(member);
    return { ...member };
  }

  async sendMessage(eventId: string, userId: string, message: string) {
    const eventMessage: EventMessage = {
      id: createId("message"),
      event_id: eventId,
      user_id: userId,
      message,
      created_at: nowIso(),
      user: this.users.find((user) => user.id === userId) ?? null
    };

    this.messages.push(eventMessage);
    await this.emitMessages(eventId);
    return { ...eventMessage };
  }

  async getMessages(eventId: string) {
    return this.messages
      .filter((message) => message.event_id === eventId)
      .map((message) => ({
        ...message,
        user: this.users.find((user) => user.id === message.user_id) ?? null
      }))
      .sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }

  subscribeToMessages(eventId: string, listener: MessageListener) {
    const listeners = this.listeners.get(eventId) ?? new Set<MessageListener>();
    listeners.add(listener);
    this.listeners.set(eventId, listeners);

    void this.getMessages(eventId).then(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  async getUserById(userId: string) {
    return this.users.find((user) => user.id === userId) ?? null;
  }

  async upsertUser(user: UserProfile) {
    const existingIndex = this.users.findIndex((item) => item.id === user.id);

    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...user };
    } else {
      this.users.push(user);
    }

    return user;
  }

  async getUsers() {
    return [...this.users];
  }

  async getUserInterests(userId: string) {
    return this.interests.filter((interest) => interest.user_id === userId);
  }

  async getUserEvents(userId: string) {
    const eventIds = new Set(
      this.interests
        .filter((interest) => interest.user_id === userId && interest.status === "interested")
        .map((interest) => interest.event_id)
    );

    return this.events.filter((event) => eventIds.has(event.id));
  }

  async getInterestedUsers(eventId: string) {
    const userIds = new Set(
      this.interests
        .filter((interest) => interest.event_id === eventId && interest.status === "interested")
        .map((interest) => interest.user_id)
    );

    return this.users.filter((user) => userIds.has(user.id));
  }

  async getFriends(userId: string) {
    const friendIds = this.friendships
      .filter(
        (friendship) =>
          friendship.status === "accepted" &&
          (friendship.requester_id === userId || friendship.receiver_id === userId)
      )
      .map((friendship) =>
        friendship.requester_id === userId ? friendship.receiver_id : friendship.requester_id
      );

    return this.users.filter((user) => friendIds.includes(user.id));
  }

  async addFriend(requesterId: string, receiverId: string) {
    const existing = this.friendships.find(
      (friendship) =>
        (friendship.requester_id === requesterId && friendship.receiver_id === receiverId) ||
        (friendship.requester_id === receiverId && friendship.receiver_id === requesterId)
    );

    if (existing) {
      existing.status = "accepted";
      return { ...existing };
    }

    const friendship: Friendship = {
      id: createId("friend"),
      requester_id: requesterId,
      receiver_id: receiverId,
      status: "accepted",
      created_at: nowIso()
    };

    this.friendships.push(friendship);
    return { ...friendship };
  }

  async getSharedEvents(userId: string, friendId: string) {
    const userEvents = await this.getUserEvents(userId);
    const friendEventIds = new Set(
      this.interests
        .filter((interest) => interest.user_id === friendId && interest.status === "interested")
        .map((interest) => interest.event_id)
    );

    return userEvents.filter((event) => friendEventIds.has(event.id));
  }

  private upsertInterest(
    userId: string,
    eventId: string,
    status: EventInterest["status"]
  ) {
    const existing = this.interests.find(
      (interest) => interest.user_id === userId && interest.event_id === eventId
    );

    if (existing) {
      existing.status = status;
      existing.created_at = nowIso();
      return { ...existing };
    }

    const interest: EventInterest = {
      id: createId("interest"),
      user_id: userId,
      event_id: eventId,
      status,
      created_at: nowIso()
    };

    this.interests.push(interest);
    return { ...interest };
  }

  private async emitMessages(eventId: string) {
    const listeners = this.listeners.get(eventId);

    if (!listeners?.size) {
      return;
    }

    const messages = await this.getMessages(eventId);
    listeners.forEach((listener) => listener(messages));
  }
}

class SupabaseEventProvider implements EventProvider {
  async getEvents() {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_datetime", { ascending: true });

    if (error) {
      throw error;
    }

    return data as GtaEvent[];
  }

  async getEventById(id: string) {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as GtaEvent | null;
  }

  async markInterested(userId: string, eventId: string) {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("event_interests")
      .upsert(
        {
          user_id: userId,
          event_id: eventId,
          status: "interested"
        },
        { onConflict: "user_id,event_id" }
      )
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await this.joinEventChat(userId, eventId);
    return data as EventInterest;
  }

  async markSkipped(userId: string, eventId: string) {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("event_interests")
      .upsert(
        {
          user_id: userId,
          event_id: eventId,
          status: "skipped"
        },
        { onConflict: "user_id,event_id" }
      )
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as EventInterest;
  }

  async joinEventChat(userId: string, eventId: string) {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("event_chat_members")
      .upsert(
        {
          user_id: userId,
          event_id: eventId
        },
        { onConflict: "user_id,event_id" }
      )
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as EventChatMember;
  }

  async sendMessage(eventId: string, userId: string, message: string) {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("event_messages")
      .insert({
        event_id: eventId,
        user_id: userId,
        message
      })
      .select("*, user:users(*)")
      .single();

    if (error) {
      throw error;
    }

    return data as EventMessage;
  }

  async getMessages(eventId: string) {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("event_messages")
      .select("*, user:users(*)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data as EventMessage[];
  }

  subscribeToMessages(eventId: string, listener: MessageListener) {
    if (!supabase) {
      return () => undefined;
    }

    const client = supabase;
    let channel: RealtimeChannel | null = null;
    const refresh = () => {
      void this.getMessages(eventId).then(listener);
    };

    channel = client
      .channel(`event-messages-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_messages",
          filter: `event_id=eq.${eventId}`
        },
        refresh
      )
      .subscribe();

    refresh();

    return () => {
      if (channel) {
        void client.removeChannel(channel);
      }
    };
  }

  async getUserById(userId: string) {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as UserProfile | null;
  }

  async upsertUser(user: UserProfile) {
    if (!supabase) {
      return user;
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(user, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as UserProfile;
  }

  async getUsers() {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase.from("users").select("*").order("name");

    if (error) {
      throw error;
    }

    return data as UserProfile[];
  }

  async getUserInterests(userId: string) {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("event_interests")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return data as EventInterest[];
  }

  async getUserEvents(userId: string) {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("event_interests")
      .select("event:events(*)")
      .eq("user_id", userId)
      .eq("status", "interested");

    if (error) {
      throw error;
    }

    return data
      .map((row) => unwrapRelation<GtaEvent>(row.event))
      .filter(Boolean) as GtaEvent[];
  }

  async getInterestedUsers(eventId: string) {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("event_interests")
      .select("user:users(*)")
      .eq("event_id", eventId)
      .eq("status", "interested");

    if (error) {
      throw error;
    }

    return data
      .map((row) => unwrapRelation<UserProfile>(row.user))
      .filter(Boolean) as UserProfile[];
  }

  async getFriends(userId: string) {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("friendships")
      .select("requester:users!friendships_requester_id_fkey(*), receiver:users!friendships_receiver_id_fkey(*)")
      .eq("status", "accepted")
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
      throw error;
    }

    return data
      .map((row) => {
        const requester = unwrapRelation<UserProfile>(row.requester);
        const receiver = unwrapRelation<UserProfile>(row.receiver);

        if (!requester || !receiver) {
          return null;
        }

        return requester.id === userId ? receiver : requester;
      })
      .filter((user): user is UserProfile => Boolean(user));
  }

  async addFriend(requesterId: string, receiverId: string) {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("friendships")
      .upsert(
        {
          requester_id: requesterId,
          receiver_id: receiverId,
          status: "accepted"
        },
        { onConflict: "requester_id,receiver_id" }
      )
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as Friendship;
  }

  async getSharedEvents(userId: string, friendId: string) {
    const [userEvents, friendInterests] = await Promise.all([
      this.getUserEvents(userId),
      this.getUserInterests(friendId)
    ]);
    const friendEventIds = new Set(
      friendInterests
        .filter((interest) => interest.status === "interested")
        .map((interest) => interest.event_id)
    );

    return userEvents.filter((event) => friendEventIds.has(event.id));
  }
}

export const eventProvider: EventProvider = isSupabaseConfigured
  ? new SupabaseEventProvider()
  : new MockEventProvider();

export const dataMode = isSupabaseConfigured ? "supabase" : "mock";

export const defaultDemoUser = DEMO_USER;
