import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  const fetchEvents = async () => {
    const effectiveToken = (token || sessionStorage.getItem('ADMIN_TOKEN') || new URLSearchParams(location.search).get('token') || '').trim();
    if (!effectiveToken) {
      setError('');
      return;
    }
    // Persist the token for subsequent requests
    sessionStorage.setItem('ADMIN_TOKEN', effectiveToken);
    setToken(effectiveToken);
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin?token=${encodeURIComponent(effectiveToken)}`, {
        headers: {
          // Also send via header to avoid query-string issues/caches
          'Authorization': `Bearer ${effectiveToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid admin token');
        } else {
          setError('Failed to fetch events');
        }
        return;
      }
      
      const data = await response.json();
      setEvents(data.events || []);
      setError(null);
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize token from URL or sessionStorage on mount
    const urlToken = (new URLSearchParams(window.location.search).get('token') || '').trim();
    const stored = (sessionStorage.getItem('ADMIN_TOKEN') || '').trim();
    const initial = urlToken || stored;
    if (initial) {
      setToken(initial);
      // Kick off fetch after state update
      setTimeout(fetchEvents, 0);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="glass rounded-3xl p-8 max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Access</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => token && fetchEvents()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <div className="flex gap-4">
              <button
                onClick={fetchEvents}
                className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => { sessionStorage.removeItem('ADMIN_TOKEN'); setToken(''); setEvents([]); setError(null); history.replaceState(null, '', location.pathname); }}
                className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="text-purple-300">Loading events...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-400">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-purple-300">Time</th>
                    <th className="text-left py-3 px-4 text-purple-300">IP</th>
                    <th className="text-left py-3 px-4 text-purple-300">City</th>
                    <th className="text-left py-3 px-4 text-purple-300">Region</th>
                    <th className="text-left py-3 px-4 text-purple-300">Country</th>
                    <th className="text-left py-3 px-4 text-purple-300">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event.id || index} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">
                        {new Date(event.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-purple-200 font-mono text-xs">
                        {event.ip || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-purple-200">
                        {event.city || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-purple-200">
                        {event.region || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-purple-200">
                        {event.country || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-purple-200 text-xs max-w-xs truncate">
                        {event.user_agent || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {events.length === 0 && (
                <div className="text-center py-8 text-purple-300">
                  No events found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
