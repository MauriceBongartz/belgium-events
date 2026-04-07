-- ============================================================
-- Belgium Events — Supabase Setup Script
-- Run this in the Supabase SQL Editor:
-- https://app.supabase.com → SQL Editor → New Query
-- ============================================================


-- 1. Create the events table
-- ============================================================
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  date        timestamptz not null,
  location    text not null,
  latitude    float,
  longitude   float,
  category    text not null default 'Other',
  created_at  timestamptz not null default now()
);


-- 2. Enable Row Level Security
-- ============================================================
alter table public.events enable row level security;


-- 3. Policy: Anyone can READ events (public)
-- ============================================================
create policy "Public can read events"
  on public.events
  for select
  using (true);


-- 4. Policy: Only admin can INSERT events
-- ============================================================
create policy "Admin can insert events"
  on public.events
  for insert
  with check (
    auth.email() = 'bongartzmaurice24@gmail.com'
  );


-- 5. Policy: Only admin can UPDATE events
-- ============================================================
create policy "Admin can update events"
  on public.events
  for update
  using (
    auth.email() = 'bongartzmaurice24@gmail.com'
  );


-- 6. Policy: Only admin can DELETE events
-- ============================================================
create policy "Admin can delete events"
  on public.events
  for delete
  using (
    auth.email() = 'bongartzmaurice24@gmail.com'
  );


-- ============================================================
-- OPTIONAL: Seed with a sample event to test the setup
-- ============================================================
-- insert into public.events (title, description, date, location, latitude, longitude, category)
-- values (
--   'Welcome to Belgium Events',
--   'This is a sample event to verify your setup is working correctly.',
--   now() + interval '7 days',
--   'Grand Place, Brussels',
--   50.8467,
--   4.3525,
--   'Culture'
-- );
