// AUDIT FINDINGS:
// - Framework: Vite + React (NOT Next.js)
// - Deploy target: Vercel (confirmed by vercel.json)
// - Current data layer: None (client-side only)
// - Generate function: generateNames() in App.jsx (lines ~251-284)
// - Architecture: Single Page Application with client-side state
// 
// DECISION: Since this is Vite/React (not Next.js), I'll adapt Option B (Supabase)
// as the easiest path with minimal changes. No server-side API routes exist,
// so I'll add Vercel Functions for the backend and Supabase for persistence.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Extract request information
    const forwarded = req.headers['x-forwarded-for'] || '';
    const ip = forwarded.split(',')[0]?.trim() || null;
    const userAgent = req.headers['user-agent'] || null;
    const referrer = req.headers['referer'] || req.headers['referrer'] || null;
    
    // Vercel provides geo information
    const geo = req.geo || {};
    const city = geo.city || null;
    const region = geo.region || null;
    const country = geo.country || null;

    // Insert event record (trigger will auto-increment global counter)
    const { error } = await supabase
      .from('name_events')
      .insert({
        ip,
        city,
        region,
        country,
        user_agent: userAgent,
        referrer
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
