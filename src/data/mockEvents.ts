import { GtaEvent } from "../types";

const createdAt = "2026-07-02T12:00:00-04:00";

export const MOCK_EVENTS: GtaEvent[] = [
  {
    id: "event-rooftop-party",
    title: "King West Rooftop Sunset Party",
    description:
      "A skyline rooftop night with DJs, golden hour photos, small bites, and a late patio set overlooking downtown Toronto.",
    image_url:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-05T19:00:00-04:00",
    end_datetime: "2026-07-05T23:30:00-04:00",
    venue_name: "Lavelle",
    address: "627 King St W, Toronto, ON",
    neighbourhood: "King West",
    city: "Toronto",
    price_label: "$25",
    category: "Nightlife",
    source_name: "TodoToronto mock feed",
    source_url: "https://www.instagram.com/todotoronto/",
    created_at: createdAt,
    tags: ["rooftop", "dj", "patio"]
  },
  {
    id: "event-food-festival",
    title: "Taste of Kensington Food Crawl",
    description:
      "A weekend street food festival with dumplings, tacos, jerk bowls, bubble tea, and pop-up dessert vendors around Kensington Market.",
    image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-06T12:00:00-04:00",
    end_datetime: "2026-07-06T18:00:00-04:00",
    venue_name: "Kensington Market",
    address: "Kensington Ave, Toronto, ON",
    neighbourhood: "Kensington Market",
    city: "Toronto",
    price_label: "Free entry",
    category: "Food",
    source_name: "Manual city picks",
    source_url: "https://www.toronto.ca/explore-enjoy/festivals-events/",
    created_at: createdAt,
    tags: ["food", "street eats", "weekend"]
  },
  {
    id: "event-art-gallery-night",
    title: "AGO After Dark: Summer Canvas",
    description:
      "An after-hours gallery night with live sketching, a lounge set, local visual artists, and access to featured summer exhibitions.",
    image_url:
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-09T18:30:00-04:00",
    end_datetime: "2026-07-09T22:00:00-04:00",
    venue_name: "Art Gallery of Ontario",
    address: "317 Dundas St W, Toronto, ON",
    neighbourhood: "Grange Park",
    city: "Toronto",
    price_label: "$18",
    category: "Arts",
    source_name: "AGO demo listing",
    source_url: "https://ago.ca/",
    created_at: createdAt,
    tags: ["gallery", "creative", "date night"]
  },
  {
    id: "event-concert",
    title: "Indie Harbourfront Concert",
    description:
      "A lakeside concert featuring three Toronto indie bands, local openers, and sunset views from the Harbourfront stage.",
    image_url:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-10T20:00:00-04:00",
    end_datetime: "2026-07-10T23:00:00-04:00",
    venue_name: "Harbourfront Centre",
    address: "235 Queens Quay W, Toronto, ON",
    neighbourhood: "Waterfront",
    city: "Toronto",
    price_label: "$35",
    category: "Music",
    source_name: "Ticketmaster placeholder",
    source_url: "https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/",
    created_at: createdAt,
    tags: ["concert", "indie", "waterfront"]
  },
  {
    id: "event-soccer-watch-party",
    title: "Liberty Village Soccer Watch Party",
    description:
      "A big-screen soccer watch party with chants, patio tables, jersey giveaways, and pre-match trivia for supporters.",
    image_url:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-11T15:00:00-04:00",
    end_datetime: "2026-07-11T18:00:00-04:00",
    venue_name: "Brazen Head",
    address: "165 E Liberty St, Toronto, ON",
    neighbourhood: "Liberty Village",
    city: "Toronto",
    price_label: "Free RSVP",
    category: "Sports",
    source_name: "Community sports feed",
    source_url: "https://www.toronto.ca/explore-enjoy/recreation/",
    created_at: createdAt,
    tags: ["soccer", "watch party", "patio"]
  },
  {
    id: "event-night-market",
    title: "Scarborough Night Market",
    description:
      "A summer night market with skewers, dessert trucks, handmade goods, music, and late-night eats from across the GTA.",
    image_url:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-12T18:00:00-04:00",
    end_datetime: "2026-07-12T23:00:00-04:00",
    venue_name: "Scarborough Town Centre Lot",
    address: "300 Borough Dr, Scarborough, ON",
    neighbourhood: "Scarborough Centre",
    city: "Toronto",
    price_label: "$10",
    category: "Market",
    source_name: "TodoToronto mock feed",
    source_url: "https://www.instagram.com/todotoronto/",
    created_at: createdAt,
    tags: ["night market", "food", "vendors"]
  },
  {
    id: "event-comedy-show",
    title: "Queen West Stand-Up Showcase",
    description:
      "A tight comedy lineup featuring local comics, surprise drop-ins, and a casual post-show hang at a Queen West bar.",
    image_url:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-14T20:30:00-04:00",
    end_datetime: "2026-07-14T22:30:00-04:00",
    venue_name: "Comedy Bar",
    address: "945 Bloor St W, Toronto, ON",
    neighbourhood: "Bloorcourt",
    city: "Toronto",
    price_label: "$17",
    category: "Comedy",
    source_name: "Venue demo listing",
    source_url: "https://comedybar.ca/",
    created_at: createdAt,
    tags: ["stand-up", "laughs", "after work"]
  },
  {
    id: "event-pop-up-market",
    title: "Parkdale Vintage Pop-Up Market",
    description:
      "A curated pop-up with vintage clothing, candles, prints, records, iced coffee, and small Toronto makers.",
    image_url:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-16T11:00:00-04:00",
    end_datetime: "2026-07-16T17:00:00-04:00",
    venue_name: "Parkdale Hall",
    address: "1605 Queen St W, Toronto, ON",
    neighbourhood: "Parkdale",
    city: "Toronto",
    price_label: "Free",
    category: "Shopping",
    source_name: "Manual vendor feed",
    source_url: "https://www.eventbrite.ca/",
    created_at: createdAt,
    tags: ["vintage", "makers", "shopping"]
  },
  {
    id: "event-beach-volleyball",
    title: "Woodbine Beach Volleyball Meetup",
    description:
      "A friendly drop-in volleyball meetup for beginner and intermediate players, followed by optional boardwalk food.",
    image_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-18T10:00:00-04:00",
    end_datetime: "2026-07-18T13:00:00-04:00",
    venue_name: "Woodbine Beach Courts",
    address: "1675 Lake Shore Blvd E, Toronto, ON",
    neighbourhood: "The Beaches",
    city: "Toronto",
    price_label: "$8",
    category: "Active",
    source_name: "Community meetup feed",
    source_url: "https://www.toronto.ca/explore-enjoy/parks-gardens-beaches/beaches/",
    created_at: createdAt,
    tags: ["volleyball", "outdoors", "meetup"]
  },
  {
    id: "event-charity-run",
    title: "High Park 5K Charity Run",
    description:
      "A community 5K supporting youth programs, with pace groups, medals, coffee, and a post-run picnic near Grenadier Pond.",
    image_url:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-19T08:30:00-04:00",
    end_datetime: "2026-07-19T11:00:00-04:00",
    venue_name: "High Park",
    address: "1873 Bloor St W, Toronto, ON",
    neighbourhood: "High Park",
    city: "Toronto",
    price_label: "$30 donation",
    category: "Wellness",
    source_name: "City of Toronto placeholder",
    source_url: "https://open.toronto.ca/",
    created_at: createdAt,
    tags: ["run", "charity", "morning"]
  },
  {
    id: "event-tech-networking",
    title: "Toronto Builder Mixer",
    description:
      "A relaxed tech networking night for founders, designers, developers, and students building early-stage products in the GTA.",
    image_url:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-22T18:00:00-04:00",
    end_datetime: "2026-07-22T21:00:00-04:00",
    venue_name: "MaRS Discovery District",
    address: "101 College St, Toronto, ON",
    neighbourhood: "Discovery District",
    city: "Toronto",
    price_label: "Free RSVP",
    category: "Tech",
    source_name: "Eventbrite placeholder",
    source_url: "https://www.eventbrite.ca/",
    created_at: createdAt,
    tags: ["networking", "founders", "students"]
  },
  {
    id: "event-cultural-festival",
    title: "Mississauga Global Culture Fest",
    description:
      "A full-day festival with dance performances, family food stalls, artisan vendors, and live music from GTA cultural groups.",
    image_url:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
    start_datetime: "2026-07-25T13:00:00-04:00",
    end_datetime: "2026-07-25T22:00:00-04:00",
    venue_name: "Celebration Square",
    address: "300 City Centre Dr, Mississauga, ON",
    neighbourhood: "City Centre",
    city: "Mississauga",
    price_label: "Free",
    category: "Culture",
    source_name: "City events placeholder",
    source_url: "https://www.mississauga.ca/events-and-attractions/events/",
    created_at: createdAt,
    tags: ["festival", "music", "family"]
  }
];
