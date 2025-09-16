-- Enable RLS and create example policies (run after creating tables)

alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table bookings enable row level security;
alter table badges enable row level security;
alter table access_logs enable row level security;

create policy "profiles_self" on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "subs_owner" on subscriptions
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "bookings_owner" on bookings
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "classes_public_read" on classes
  for select
  using (is_public = true);

-- For admin operations you'll use service role via server functions
