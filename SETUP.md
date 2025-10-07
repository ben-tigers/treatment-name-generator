# Treatment Name Generator - Global Counter Setup

## Overview
This implementation adds a global shared counter and live updates to the Treatment Name Generator using Supabase for persistence and realtime updates.

## Setup Instructions

### 1. Supabase Setup
1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `supabase-schema.sql` to create the required tables and triggers

### 2. Environment Variables
Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin token for accessing admin page
ADMIN_TOKEN=replace-with-long-random-string
```

### 3. Vercel Configuration
Add these environment variables to your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

### 4. Features Added

#### Global Counter
- Shows total names generated across all users
- Updates in real-time using Supabase Realtime
- Falls back to polling if Realtime is unavailable

#### Event Logging
- Records each name generation with:
  - Timestamp
  - IP address (from x-forwarded-for)
  - Approximate location (city, region, country)
  - User agent
  - Referrer

#### Admin Panel
- Access at `/admin` with admin token
- View recent 200 generation events
- Real-time updates

#### Privacy Notice
- Added footer notice about data collection

### 5. API Endpoints

- `POST /api/record` - Records a generation event
- `GET /api/total` - Gets current global total
- `GET /api/admin?token=...` - Gets admin data

### 6. Components Added

- `GlobalTotal` - Displays global counter with realtime updates
- `AdminPage` - Admin interface for viewing events

### 7. Integration Points

- `generateNames()` function now calls `/api/record` to log events
- Global counter displayed in header
- Simple client-side routing for admin page

## Testing

1. Deploy to Vercel with environment variables set
2. Generate some names to test event recording
3. Check admin panel at `/admin?token=your-admin-token`
4. Verify realtime updates work by opening multiple browser tabs

## Privacy & Security

- IP addresses are logged for abuse prevention
- Approximate location data collected
- Admin panel protected by token
- All data stored in Supabase with proper RLS policies
