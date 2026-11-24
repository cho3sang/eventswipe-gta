import {
  EventChatMember,
  EventInterest,
  EventMessage,
  Friendship,
  UserProfile
} from "../types";

const createdAt = "2026-07-02T12:00:00-04:00";

export const DEMO_USER: UserProfile = {
  id: "demo-user",
  name: "Tenzin Demo",
  avatar_url: null,
  city: "Toronto",
  age: 24,
  created_at: createdAt
};

export const MOCK_USERS: UserProfile[] = [
  DEMO_USER,
  {
    id: "user-maya",
    name: "Maya Chen",
    avatar_url: null,
    city: "Toronto",
    age: 25,
    created_at: createdAt
  },
  {
    id: "user-jay",
    name: "Jay Patel",
    avatar_url: null,
    city: "Mississauga",
    age: 26,
    created_at: createdAt
  },
  {
    id: "user-ana",
    name: "Ana Rivera",
    avatar_url: null,
    city: "Toronto",
    age: 23,
    created_at: createdAt
  },
  {
    id: "user-noah",
    name: "Noah Singh",
    avatar_url: null,
    city: "Brampton",
    age: 27,
    created_at: createdAt
  },
  {
    id: "user-leah",
    name: "Leah Thompson",
    avatar_url: null,
    city: "Toronto",
    age: 24,
    created_at: createdAt
  },
  {
    id: "user-omar",
    name: "Omar Hassan",
    avatar_url: null,
    city: "Scarborough",
    age: 28,
    created_at: createdAt
  },
  {
    id: "user-sofia",
    name: "Sofia Rossi",
    avatar_url: null,
    city: "Etobicoke",
    age: 25,
    created_at: createdAt
  }
];

export const MOCK_EVENT_INTERESTS: EventInterest[] = [
  {
    id: "interest-maya-rooftop",
    user_id: "user-maya",
    event_id: "event-rooftop-party",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-jay-rooftop",
    user_id: "user-jay",
    event_id: "event-rooftop-party",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-ana-food",
    user_id: "user-ana",
    event_id: "event-food-festival",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-leah-art",
    user_id: "user-leah",
    event_id: "event-art-gallery-night",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-omar-soccer",
    user_id: "user-omar",
    event_id: "event-soccer-watch-party",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-sofia-night-market",
    user_id: "user-sofia",
    event_id: "event-night-market",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-maya-tech",
    user_id: "user-maya",
    event_id: "event-tech-networking",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-jay-volleyball",
    user_id: "user-jay",
    event_id: "event-beach-volleyball",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-noah-comedy",
    user_id: "user-noah",
    event_id: "event-comedy-show",
    status: "interested",
    created_at: createdAt
  },
  {
    id: "interest-leah-cultural",
    user_id: "user-leah",
    event_id: "event-cultural-festival",
    status: "interested",
    created_at: createdAt
  }
];

export const MOCK_CHAT_MEMBERS: EventChatMember[] = MOCK_EVENT_INTERESTS.map(
  (interest) => ({
    id: `member-${interest.user_id}-${interest.event_id}`,
    user_id: interest.user_id,
    event_id: interest.event_id,
    joined_at: createdAt
  })
);

export const MOCK_EVENT_MESSAGES: EventMessage[] = [
  {
    id: "message-rooftop-maya",
    event_id: "event-rooftop-party",
    user_id: "user-maya",
    message: "I am probably going around 8. Anyone want to meet near King first?",
    created_at: "2026-07-02T12:20:00-04:00"
  },
  {
    id: "message-rooftop-jay",
    event_id: "event-rooftop-party",
    user_id: "user-jay",
    message: "Down. I can grab a patio table if people confirm.",
    created_at: "2026-07-02T12:28:00-04:00"
  },
  {
    id: "message-tech-maya",
    event_id: "event-tech-networking",
    user_id: "user-maya",
    message: "This one looks useful for portfolio projects.",
    created_at: "2026-07-02T13:10:00-04:00"
  },
  {
    id: "message-night-market-sofia",
    event_id: "event-night-market",
    user_id: "user-sofia",
    message: "I am going for the dessert trucks first.",
    created_at: "2026-07-02T14:05:00-04:00"
  }
];

export const MOCK_FRIENDSHIPS: Friendship[] = [
  {
    id: "friend-demo-maya",
    requester_id: "demo-user",
    receiver_id: "user-maya",
    status: "accepted",
    created_at: createdAt
  },
  {
    id: "friend-demo-jay",
    requester_id: "demo-user",
    receiver_id: "user-jay",
    status: "accepted",
    created_at: createdAt
  }
];
