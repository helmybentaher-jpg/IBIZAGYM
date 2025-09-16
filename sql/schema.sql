-- IBIZAGYM SQL Schema (run in Supabase SQL Editor)
create extension if not exists pgcrypto;

-- profiles linked to auth.uid()
create table profiles (
  id uuid primary key default auth.uid(),
  full_name text not null,
  phone text,
  email text,
  birth_date date,
  role text default 'member', -- member / admin / coach
  created_at timestamptz default now()
);

-- subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  plan text not null,
  status text not null default 'active',
  start_date date not null,
  end_date date not null,
  auto_renew boolean default false,
  created_at timestamptz default now()
);

-- rooms
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity int default 20,
  description text
);

-- classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete set null,
  title text not null,
  description text,
  instructor text,
  capacity int,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  status text default 'booked',
  created_at timestamptz default now(),
  unique (class_id, profile_id)
);

-- access logs (portique)
create table access_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  scan_time timestamptz default now(),
  direction text,
  source text,
  metadata jsonb
);

-- badges
create table badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  badge_id text not null unique,
  type text default 'rfid',
  active boolean default true,
  created_at timestamptz default now()
);

-- Indexes
create index on classes(start_time);
create index on bookings(class_id);
create index on access_logs(profile_id);
