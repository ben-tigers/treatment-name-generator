#!/bin/bash

# Supabase credentials
SUPABASE_URL="https://jqlbhjfhaivnapdlqenp.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbGJoamZoYWl2bmFwZGxxZW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc5MzA5NCwiZXhwIjoyMDc1MzY5MDk0fQ.HxbQh7WTPac6e2ZPyygC61crJCvkNlXwGMFaTy9dLjA"

echo "Setting up Supabase database schema..."

# Create name_events table
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "create table if not exists public.name_events (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), ip text, city text, region text, country text, user_agent text, referrer text);"
  }'

echo "Created name_events table"

# Create global_counters table
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "create table if not exists public.global_counters (id int primary key check (id = 1), total bigint not null default 0);"
  }'

echo "Created global_counters table"

# Insert initial counter
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "insert into public.global_counters (id,total) values (1,0) on conflict (id) do nothing;"
  }'

echo "Inserted initial counter"

# Enable RLS
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "alter table public.name_events enable row level security; alter table public.global_counters enable row level security;"
  }'

echo "Enabled RLS"

# Create policies
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "create policy insert_events on public.name_events for insert to anon with check (true); create policy select_events on public.name_events for select to anon using (true); create policy select_counter on public.global_counters for select to anon using (true);"
  }'

echo "Created policies"

# Create trigger function
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "create or replace function public.bump_global_total() returns trigger language plpgsql as $$ begin update public.global_counters set total = total + 1 where id = 1; return new; end $$;"
  }'

echo "Created trigger function"

# Create trigger
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "drop trigger if exists trg_bump_total on public.name_events; create trigger trg_bump_total after insert on public.name_events for each row execute function public.bump_global_total();"
  }'

echo "Created trigger"

# Enable realtime
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "alter publication supabase_realtime add table public.global_counters;"
  }'

echo "Enabled realtime"

echo "Database setup complete!"
