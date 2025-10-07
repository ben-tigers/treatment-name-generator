# 🚀 Treatment Name Generator - Database Setup Guide

## Current Issue
The global counter is showing "0" because the Supabase database hasn't been set up yet. Here's how to fix it:

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Click "New Project"**
3. **Choose your organization** (or create one)
4. **Enter project details:**
   - Name: `treatment-name-generator`
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait for setup** (takes 2-3 minutes)

## Step 2: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste** the entire contents of `supabase-schema.sql`
4. **Click "Run"** to execute the SQL

This will create:
- `name_events` table for logging generations
- `global_counters` table for the global total
- Automatic trigger to increment counter
- Realtime subscriptions

## Step 3: Get API Keys

1. **Go to Settings > API** in Supabase
2. **Copy these values:**
   - `Project URL` (looks like: `https://xxxxx.supabase.co`)
   - `anon public` key (starts with `eyJ...`)
   - `service_role` key (starts with `eyJ...`)

## Step 4: Configure Vercel Environment Variables

1. **Go to your Vercel project dashboard**
2. **Click Settings > Environment Variables**
3. **Add these variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_TOKEN=your-secure-admin-token
```

4. **Click "Save"**
5. **Redeploy** your Vercel project

## Step 5: Test the Setup

1. **Visit your deployed site**
2. **Generate some names** (click "Generate Magic")
3. **Check the global counter** - it should increment
4. **Open multiple tabs** - counter should update in real-time
5. **Visit `/admin?token=your-admin-token`** to see logged events

## Troubleshooting

### Counter Still Shows 0?
- Check Vercel environment variables are set correctly
- Verify Supabase database schema was created
- Check browser console for errors
- Ensure Vercel project was redeployed after adding env vars

### Realtime Not Working?
- Check Supabase Realtime is enabled
- Verify RLS policies are correct
- Check browser console for WebSocket errors

### API Errors?
- Check Vercel function logs
- Verify service role key has correct permissions
- Test API endpoints directly

## Alternative: Local Development

For local testing, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_TOKEN=test-admin-token
```

## Security Notes

- Never commit `.env.local` to git
- Use strong admin tokens
- Service role key should only be used server-side
- Anon key is safe to expose client-side

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Check Vercel function logs
3. Verify Supabase project is active
4. Test API endpoints manually
