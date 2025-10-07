import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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

    // Get the global counter
    const { data, error } = await supabase
      .from('global_counters')
      .select('total')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ total: 0 });
    }

    const total = Number(data?.total ?? 0);
    return res.status(200).json({ 
      total: Number.isFinite(total) ? total : 0 
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ total: 0 });
  }
}
