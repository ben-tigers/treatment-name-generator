import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// iOS Safari compatible environment variable handling
const supabaseUrl = typeof process !== 'undefined' && process.env 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : null;
const supabaseKey = typeof process !== 'undefined' && process.env 
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  : null;

// Only create client if we have the required environment variables
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
}

export default function GlobalTotal() {
  const [total, setTotal] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function fetchInitialTotal() {
      try {
        const response = await fetch('/api/total', { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (isActive && typeof data.total === 'number') {
          setTotal(data.total);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to fetch initial total:', error);
        if (isActive) {
          setError('Database not configured');
          setTotal(0);
        }
      }
    }

    // Fetch initial total
    fetchInitialTotal();

    // Set up realtime subscription if Supabase is configured
    if (supabase) {
      try {
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
              try {
                const newTotal = payload.new && payload.new.total;
                if (typeof newTotal === 'number' && isActive) {
                  setTotal(newTotal);
                  setError(null);
                }
              } catch (error) {
                console.warn('Error processing realtime update:', error);
              }
            }
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
            if (status === 'CHANNEL_ERROR') {
              console.warn('Supabase realtime channel error, falling back to polling');
            }
          });

        return () => {
          isActive = false;
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.warn('Error removing Supabase channel:', error);
          }
        };
      } catch (error) {
        console.warn('Failed to set up Supabase realtime, falling back to polling:', error);
        // Fall through to polling fallback
      }
    }
    
    // Fallback to polling every 3 seconds if Supabase is not configured or failed
    const interval = setInterval(fetchInitialTotal, 3000);
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  if (total === null) {
    return (
      <span className="text-purple-300 animate-pulse">Loading...</span>
    );
  }

  return (
    <span className="text-purple-200 font-bold">
      {total.toLocaleString()}
      {error && (
        <span className="text-xs text-yellow-400 block mt-1">
          {error}
        </span>
      )}
    </span>
  );
}
