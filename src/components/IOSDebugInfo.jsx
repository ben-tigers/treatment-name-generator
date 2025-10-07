import React, { useEffect, useState } from 'react';

export default function IOSDebugInfo() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      hasProcessEnv: typeof process !== 'undefined' && !!process.env,
      hasSupabaseUrl: typeof process !== 'undefined' && process.env && !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: typeof process !== 'undefined' && process.env && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      fetchSupported: typeof fetch !== 'undefined',
      websocketSupported: typeof WebSocket !== 'undefined',
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      devicePixelRatio: window.devicePixelRatio
    };
    
    setDebugInfo(info);
  }, []);

  // Only show on iOS Safari for debugging
  if (!debugInfo.isIOS || !debugInfo.isSafari) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">iOS Safari Debug Info:</div>
      <div className="space-y-1">
        <div>iOS: {debugInfo.isIOS ? 'Yes' : 'No'}</div>
        <div>Safari: {debugInfo.isSafari ? 'Yes' : 'No'}</div>
        <div>Process.env: {debugInfo.hasProcessEnv ? 'Yes' : 'No'}</div>
        <div>Supabase URL: {debugInfo.hasSupabaseUrl ? 'Yes' : 'No'}</div>
        <div>Supabase Key: {debugInfo.hasSupabaseKey ? 'Yes' : 'No'}</div>
        <div>Fetch: {debugInfo.fetchSupported ? 'Yes' : 'No'}</div>
        <div>WebSocket: {debugInfo.websocketSupported ? 'Yes' : 'No'}</div>
        <div>Viewport: {debugInfo.viewportWidth}x{debugInfo.viewportHeight}</div>
        <div>Pixel Ratio: {debugInfo.devicePixelRatio}</div>
      </div>
    </div>
  );
}
