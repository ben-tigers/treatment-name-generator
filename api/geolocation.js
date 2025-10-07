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
    const { ip } = req.query;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address required' });
    }

    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return standardized format
    return res.status(200).json({
      ip: ip,
      city: data.city || null,
      region: data.region || data.region_code || null,
      country: data.country_name || data.country || null,
      country_code: data.country_code || null,
      timezone: data.timezone || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      isp: data.org || null
    });
    
  } catch (error) {
    console.error('Geolocation error:', error);
    return res.status(500).json({ 
      error: 'Failed to get geolocation data',
      details: error.message 
    });
  }
}
