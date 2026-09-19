-- ElderCare Check-in - v1 schema
-- Paste this whole file into the Supabase SQL Editor and hit Run.

-- ---------------------------------------------------------------------------
-- families: one row per family. Holds the two secret link tokens.
-- ---------------------------------------------------------------------------
create table if not exists public.families (
  id           uuid primary key default gen_random_uuid(),

  -- parent_label is what the CHILD sees on the dashboard ("Mom").
  -- child_label is what the PARENT sees on their page ("Sarah").
  parent_label text not null,
  child_label  text not null default 'your family',

  -- IANA timezone name, e.g. 'America/Chicago'. This decides what "today"
  -- means for this family. See src/lib/dates.ts.
  timezone     text not null default 'America/New_York',

  -- The secrets in the two links. 16 random bytes = 128 bits of entropy.
  -- Defaults mean a new family can be created without generating these by hand.
  parent_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  child_token  text not null unique default encode(gen_random_bytes(16), 'hex'),

  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- checkins: one row per button tap.
-- ---------------------------------------------------------------------------
create table if not exists public.checkins (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families(id) on delete cascade,

  kind       text not null check (kind in ('okay', 'meds')),

  -- The calendar date in the FAMILY'S timezone, not UTC. Stored rather than
  -- computed so "did they check in today?" is a plain equality lookup.
  local_date date not null,

  -- The real moment of the tap, for showing "checked in at 8:04 AM".
  created_at timestamptz not null default now(),

  -- A 75-year-old will tap the button more than once. This makes repeat taps
  -- harmless: the API inserts with ON CONFLICT DO NOTHING, so the first tap
  -- of the day is the one that sticks.
  unique (family_id, kind, local_date)
);

create index if not exists checkins_family_date_idx
  on public.checkins (family_id, local_date desc);

-- ---------------------------------------------------------------------------
-- Lock the tables down.
-- RLS enabled with ZERO policies means every request is denied by default.
-- The service-role/secret key bypasses RLS, and that key only ever lives on
-- the server, so the browser can never reach these tables.
-- ---------------------------------------------------------------------------
alter table public.families enable row level security;
alter table public.checkins enable row level security;

-- Keep the browser-facing roles out. Combined with RLS above, a request
-- carrying a publishable/anon key can't read or write either table.
revoke all on public.families  from anon, authenticated;
revoke all on public.checkins  from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Let the server in.
--
-- Some Supabase projects don't automatically grant privileges on newly
-- created tables, which shows up as: permission denied for table families
-- Granting explicitly means this file works on a fresh project either way.
--
-- This does NOT weaken anything. service_role is the identity behind the
-- secret key, which only ever lives on the server (see src/lib/supabase.ts).
-- It already bypasses RLS by design; these grants are the separate, older
-- permission system that sits in front of it.
-- ---------------------------------------------------------------------------
grant usage on schema public to service_role;

grant select, insert, update, delete on public.families to service_role;
grant select, insert, update, delete on public.checkins to service_role;

-- Both tables use uuid primary keys, so there are no sequences today and this
-- grants nothing. It's here so that adding a bigserial column later can't
-- reintroduce the same permission error.
grant usage, select on all sequences in schema public to service_role;
