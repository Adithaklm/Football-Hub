const ALLOWED = new Set(['CL', 'PL', 'PD', 'BL1', 'SA', 'FL1']);
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return res.status(503).json({ error: 'Add FOOTBALL_DATA_TOKEN in Vercel → Project Settings → Environment Variables.' });
  const q = req.query || {};
  if (!ALLOWED.has(q.competition)) return res.status(400).json({ error: 'Unsupported competition.' });
  const routes = { matches: '/matches', standings: '/standings', scorers: '/scorers' };
  if (!routes[q.resource]) return res.status(400).json({ error: 'Unsupported resource.' });
  const params = new URLSearchParams();
  if (q.resource === 'matches') params.set('limit', '20');
  if (q.resource === 'scorers') params.set('limit', '10');
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/' + q.competition + routes[q.resource] + '?' + params.toString(), { headers: { 'X-Auth-Token': token } });
    const body = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: body.message || 'Football data provider error' });
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(body);
  } catch (e) {
    return res.status(502).json({ error: 'Unable to reach football data provider.' });
  }
}