const LEAGUES = { CL: 2, PL: 39, PD: 140, BL1: 78, SA: 135, FL1: 61 };
const RESOURCES = new Set(['matches', 'standings', 'scorers', 'assists', 'yellowcards', 'redcards']);

function seasonNow() {
  const d = new Date();
  return d.getUTCMonth() >= 6 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;
}
function mapStatus(short) {
  if (['FT', 'AET', 'PEN'].includes(short)) return 'FINISHED';
  if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(short)) return 'IN_PLAY';
  if (short === 'PST') return 'POSTPONED';
  if (short === 'CANC') return 'CANCELLED';
  return 'SCHEDULED';
}
function normalize(resource, rows, leagueName) {
  if (resource === 'matches') return {
    matches: rows.map(x => ({
      id: x.fixture.id,
      utcDate: x.fixture.date,
      status: mapStatus(x.fixture.status.short),
      matchday: x.league.round,
      competition: { name: leagueName },
      homeTeam: { id: x.teams.home.id, name: x.teams.home.name, shortName: x.teams.home.name, crest: x.teams.home.logo },
      awayTeam: { id: x.teams.away.id, name: x.teams.away.name, shortName: x.teams.away.name, crest: x.teams.away.logo },
      score: { fullTime: { home: x.goals.home, away: x.goals.away } }
    }))
  };
  if (resource === 'standings') {
    const rowsTable = rows[0]?.league?.standings?.[0] || [];
    return { standings: [{ table: rowsTable.map(x => ({
      position: x.rank,
      team: { id: x.team.id, name: x.team.name, shortName: x.team.name, crest: x.team.logo },
      playedGames: x.all.played, won: x.all.win, draw: x.all.draw, lost: x.all.lose,
      goalsFor: x.all.goals.for, goalsAgainst: x.all.goals.against,
      goalDifference: x.goalsDiff, points: x.points
    })) }] };
  }
  return { scorers: rows.map(x => {
    const s = x.statistics?.[0] || {};
    return {
      player: { id: x.player.id, name: x.player.name, photo: x.player.photo },
      team: { id: s.team?.id, name: s.team?.name, crest: s.team?.logo },
      goals: s.goals?.total ?? 0,
      assists: s.goals?.assists ?? 0,
      yellowCards: s.cards?.yellow ?? 0,
      redCards: s.cards?.red ?? 0,
      appearances: s.games?.appearences ?? s.games?.appearances ?? 0
    };
  }) };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) return res.status(503).json({
    error: 'Football API key is not connected. Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables.'
  });

  const { competition, resource } = req.query || {};
  const league = LEAGUES[competition];
  if (!league || !RESOURCES.has(resource)) return res.status(400).json({ error: 'Unsupported competition or resource.' });

  const season = seasonNow();
  const params = new URLSearchParams({ league: String(league), season: String(season) });
  let endpoint;
  let ttl = 21600;

  if (resource === 'matches') {
    endpoint = 'fixtures';
    const from = new Date(); from.setUTCDate(from.getUTCDate() - 7);
    const to = new Date(); to.setUTCDate(to.getUTCDate() + 14);
    params.set('from', from.toISOString().slice(0, 10));
    params.set('to', to.toISOString().slice(0, 10));
    ttl = 600;
  } else if (resource === 'standings') {
    endpoint = 'standings';
    ttl = 3600;
  } else {
    endpoint = ({
      scorers: 'players/topscorers',
      assists: 'players/topassists',
      yellowcards: 'players/topyellowcards',
      redcards: 'players/topredcards'
    })[resource];
  }

  try {
    const response = await fetch('https://v3.football.api-sports.io/' + endpoint + '?' + params.toString(), {
      headers: { 'x-apisports-key': apiKey }
    });
    const body = await response.json();
    if (!response.ok || (body.errors && Object.keys(body.errors).length)) {
      return res.status(response.status || 502).json({
        error: body.errors?.token || body.errors?.requests || body.errors?.plan || body.message || 'Football data provider error',
        details: body.errors || undefined
      });
    }
    const rows = body.response || [];
    const result = normalize(resource, rows, competition);
    res.setHeader('Cache-Control', 's-maxage=' + ttl + ', stale-while-revalidate=' + (ttl * 2));
    if (body.paging) res.setHeader('X-Data-Paging', JSON.stringify(body.paging));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({ error: 'Unable to reach API-Football.' });
  }
}