export type InterestStatus = "interested" | "skipped";
export type FriendshipStatus = "pending" | "accepted";

export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string | null;
  city: string;
  age?: number | null;
  created_at: string;
};

export type GtaEvent = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_datetime: string;
  end_datetime: string;
  venue_name: string;
  address: string;
  neighbourhood: string;
  city: string;
  price_label: string;
  category: string;
  source_name: string;
  source_url: string;
  created_at: string;
  tags: string[];
};

export type EventInterest = {
  id: string;
  user_id: string;
  event_id: string;
  status: InterestStatus;
  created_at: string;
};

export type EventChatMember = {
  id: string;
  user_id: string;
  event_id: string;
  joined_at: string;
};

export type EventMessage = {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: UserProfile | null;
  system?: boolean;
};

export type Friendship = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: FriendshipStatus;
  created_at: string;
};

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetails: { eventId: string };
  EventChat: { eventId: string };
};

export type MainTabParamList = {
  Discover: undefined;
  MyEvents: undefined;
  Friends: undefined;
};
