-- Profiles
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamp default now(),
  primary key (id)
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null,
  status text default 'active',
  created_at timestamp default now()
);
