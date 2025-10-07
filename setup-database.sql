-- Supabase setup for Treatment Name Generator
-- Run this SQL in your Supabase SQL editor

-- Table for logging name generation events
create table if not exists public.name_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip text, 
  city text, 
  region text, 
  country text,
  user_agent text, 
  referrer text
);

-- Table for global counter (single row)
create table if not exists public.global_counters (
  id int primary key check (id = 1),
  total bigint not null default 0
);

-- Insert initial counter row
insert into public.global_counters (id,total) values (1,0) on conflict (id) do nothing;

-- Enable Row Level Security
alter table public.name_events enable row level security;
alter table public.global_counters enable row level security;

-- Policies for name_events table
create policy insert_events on public.name_events for insert to anon with check (true);
create policy select_events on public.name_events for select to anon using (true);

-- Policies for global_counters table
create policy select_counter on public.global_counters for select to anon using (true);

-- Function to automatically increment global counter
create or replace function public.bump_global_total()
returns trigger language plpgsql as $$
begin
  update public.global_counters set total = total + 1 where id = 1;
  return new;
end $$;

-- Trigger to auto-increment counter on new events
drop trigger if exists trg_bump_total on public.name_events;
create trigger trg_bump_total 
  after insert on public.name_events 
  for each row 
  execute function public.bump_global_total();

-- Enable Realtime for global_counters table
alter publication supabase_realtime add table public.global_counters;
