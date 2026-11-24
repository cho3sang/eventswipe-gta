create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  name text not null,
  avatar_url text,
  city text not null default 'Toronto',
  age integer check (age is null or age >= 13),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  description text not null,
  image_url text not null,
  start_datetime timestamptz not null,
  end_datetime timestamptz not null,
  venue_name text not null,
  address text not null,
  neighbourhood text not null,
  city text not null,
  price_label text not null,
  category text not null,
  source_name text not null,
  source_url text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.event_interests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  event_id text not null references public.events(id) on delete cascade,
  status text not null check (status in ('interested', 'skipped')),
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists public.event_chat_members (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  event_id text not null references public.events(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists public.event_messages (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.events(id) on delete cascade,
  user_id text not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id text not null references public.users(id) on delete cascade,
  receiver_id text not null references public.users(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (requester_id, receiver_id),
  check (requester_id <> receiver_id)
);

create index if not exists events_start_datetime_idx on public.events(start_datetime);
create index if not exists event_interests_user_id_idx on public.event_interests(user_id);
create index if not exists event_interests_event_id_idx on public.event_interests(event_id);
create index if not exists event_messages_event_id_created_at_idx
  on public.event_messages(event_id, created_at);
create index if not exists friendships_requester_id_idx on public.friendships(requester_id);
create index if not exists friendships_receiver_id_idx on public.friendships(receiver_id);

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.event_interests enable row level security;
alter table public.event_chat_members enable row level security;
alter table public.event_messages enable row level security;
alter table public.friendships enable row level security;

create policy "Users can read profiles"
  on public.users for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.users for insert
  to authenticated
  with check (id = auth.uid()::text);

create policy "Users can update their own profile"
  on public.users for update
  to authenticated
  using (id = auth.uid()::text)
  with check (id = auth.uid()::text);

create policy "Authenticated users can read events"
  on public.events for select
  to authenticated
  using (true);

create policy "Users can read interests"
  on public.event_interests for select
  to authenticated
  using (true);

create policy "Users can create their own interests"
  on public.event_interests for insert
  to authenticated
  with check (user_id = auth.uid()::text);

create policy "Users can update their own interests"
  on public.event_interests for update
  to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "Users can read chat members"
  on public.event_chat_members for select
  to authenticated
  using (true);

create policy "Users can join chats as themselves"
  on public.event_chat_members for insert
  to authenticated
  with check (user_id = auth.uid()::text);

create policy "Users can read messages for joined chats"
  on public.event_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.event_chat_members members
      where members.event_id = event_messages.event_id
        and members.user_id = auth.uid()::text
    )
  );

create policy "Users can send messages to joined chats"
  on public.event_messages for insert
  to authenticated
  with check (
    user_id = auth.uid()::text
    and exists (
      select 1
      from public.event_chat_members members
      where members.event_id = event_messages.event_id
        and members.user_id = auth.uid()::text
    )
  );

create policy "Users can read their friendships"
  on public.friendships for select
  to authenticated
  using (requester_id = auth.uid()::text or receiver_id = auth.uid()::text);

create policy "Users can create friend requests"
  on public.friendships for insert
  to authenticated
  with check (requester_id = auth.uid()::text);

create policy "Users can update their friendships"
  on public.friendships for update
  to authenticated
  using (requester_id = auth.uid()::text or receiver_id = auth.uid()::text);

do $$
begin
  alter publication supabase_realtime add table public.event_messages;
exception
  when duplicate_object then null;
end $$;
