# Football Hub

A responsive dark football dashboard for the UEFA Champions League and Europe's top five domestic leagues.

## Features
- Fixtures, scores and recent results
- Competition standings
- Top scorers, assists and card leaderboards where a source publishes them
- Responsive desktop and mobile layout

## Data architecture

The serverless endpoint `api/football.js` uses a validated multi-source fallback strategy:

1. **ESPN public data endpoints** — primary source for scoreboards, standings and available league leaderboards. Past events still marked pre-game are rejected instead of being shown as upcoming. These endpoints are undocumented and can change without notice.
2. **API-Football** — optional second source when `API_FOOTBALL_KEY` is configured. This is tried before static fixtures because it can provide current fixture status and scores. The Free plan may reject the current season; the backend records the failure and does not silently request an older season.
3. **OpenFootball / football.json** — final fallback for domestic-league fixtures and results. Past fixtures without a published final score are omitted, and unknown kick-off times are shown as TBC. Its datasets are public domain (CC0); coverage and update timing depend on upstream contributions.

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
- OpenFootball provides fixtures/results, not live scores or player leaderboards. Past fixtures without final scores are excluded rather than mislabeled as upcoming. Standings from this fallback are calculated only from completed scores in the published dataset and may be incomplete if the dataset is incomplete. A successful source response is not proof that the upstream dataset is complete.
- Player statistics depend on ESPN's soccer leaderboard coverage or the optional API-Football fallback. If no provider returns a category, the site reports it unavailable rather than inventing numbers.
- A successful deployment does not guarantee that every source supports every competition and data type.
