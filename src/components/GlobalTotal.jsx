import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if we have the required environment variables
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default function GlobalTotal() {
  const [total, setTotal] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function fetchInitialTotal() {
      try {
        const response = await fetch('/api/total', { cache: 'no-store' });
        const data = await response.json();
        if (isActive && data.total !== undefined) {
          setTotal(data.total);
        }
      } catch (error) {
        console.error('Failed to fetch initial total:', error);
        if (isActive) {
          setTotal(0);
        }
      }
    }

    // Fetch initial total
    fetchInitialTotal();

    // Set up realtime subscription if Supabase is configured
    if (supabase) {
      const channel = supabase
        .channel('global-counter')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'global_counters',
            filter: 'id=eq.1'
          },
            (payload) => {
              const newTotal = payload.new?.total;
              if (typeof newTotal === 'number' && isActive) {
                setTotal(newTotal);
              }
            }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });

      return () => {
        isActive = false;
        supabase.removeChannel(channel);
      };
    } else {
      // Fallback to polling every 3 seconds if Supabase is not configured
      const interval = setInterval(fetchInitialTotal, 3000);
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }
  }, []);

  if (total === null) {
    return (
      <div className="flex items-center gap-2 text-purple-300">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <span>Loading global stats...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-purple-300">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-400' : 'bg-yellow-400'
      }`}></div>
      <span className="text-sm sm:text-base">
        Global names generated: <span className="font-bold text-purple-200">{total.toLocaleString()}</span>
      </span>
    </div>
  );
}
