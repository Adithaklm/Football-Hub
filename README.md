# Football Hub

A responsive dark football dashboard for the UEFA Champions League and Europe's top five domestic leagues.

## Features
- Fixtures, scores and recent results
- Competition standings
- Top scorers, assists and card leaderboards where a source publishes them
- Responsive desktop and mobile layout

## Data architecture

The serverless endpoint `api/football.js` uses a multi-source fallback strategy:

1. **ESPN public data endpoints** — primary source for scoreboards, standings and available league leaderboards. These endpoints are undocumented and can change without notice.
2. **OpenFootball / football.json** — fallback for domestic-league fixtures and results. Its datasets are public domain (CC0); coverage and update timing depend on upstream contributions.
3. **API-Football** — optional last-resort source when `API_FOOTBALL_KEY` is configured. The Free plan may reject the current season; the backend records this and does not present an older season as current.

The app does not scrape Google Search result pages. Search snippets are not a stable or reliable sports database. It also does not use FotMob's undocumented endpoints because FotMob's published terms prohibit automated/systematic retrieval without permission.

## Sources
- ESPN soccer scoreboard and standings endpoints: `site.api.espn.com` (public, undocumented)
- ESPN Core soccer leaders: `sports.core.api.espn.com` (public, undocumented; coverage varies)
- OpenFootball datasets: https://github.com/openfootball/football.json
- API-Football: https://www.api-football.com/documentation-v3

## Deploy to Vercel
1. Import this repository into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Redeploy after each GitHub change.

## Optional API-Football fallback
1. Create an account at https://dashboard.api-football.com/register.
2. In Vercel → Project → Settings → Environment Variables, add `API_FOOTBALL_KEY`.
3. Redeploy.

The key is only read server-side. Never place it in frontend JavaScript or commit it to GitHub.

## Competition mappings

| Competition | ESPN slug | OpenFootball file |
|---|---|---|
| UEFA Champions League | `uefa.champions` | Not configured |
| Premier League | `eng.1` | `en.1` |
| La Liga | `esp.1` | `es.1` |
| Bundesliga | `ger.1` | `de.1` |
| Serie A | `ita.1` | `it.1` |
| Ligue 1 | `fra.1` | `fr.1` |

## Important limitations
- ESPN endpoints are not an official developer API; availability and response formats can change.
- OpenFootball provides fixtures/results, not live scores or player leaderboards. Standings from this fallback are calculated only from completed scores in the published dataset and may be incomplete if the dataset is incomplete.
- Player statistics depend on ESPN's soccer leaderboard coverage or the optional API-Football fallback. If no provider returns a category, the site reports it unavailable rather than inventing numbers.
- A successful deployment does not guarantee that every source supports every competition and data type.
