# Football Hub

A premium dark football dashboard for the UEFA Champions League and Europe's top five domestic leagues.

## Features
- Upcoming fixtures, live status and recent results
- Competition standings
- Top scorers
- Top assists
- Top yellow-card and red-card leaderboards
- Responsive desktop and mobile layout

## Stack
- Responsive HTML, CSS and JavaScript frontend
- Vercel serverless API proxy
- API-Football (API-SPORTS) v3

## Deploy to Vercel
1. Import this repository into Vercel.
2. Framework preset: **Vite**.
3. Build command: \`npm run build\`.
4. Output directory: \`dist\`.
5. Add the environment variable below before deploying (or redeploy after adding it).

## Connect live football data
1. Create a free account at https://dashboard.api-football.com/register
2. Copy your API key from the API-SPORTS dashboard.
3. In Vercel, open Project → Settings → Environment Variables.
4. Add \`API_FOOTBALL_KEY\` with the API key for Production, Preview and Development.
5. Redeploy the project.

**Never put the API key in frontend JavaScript or commit it to GitHub.** The key is read only by \`api/football.js\` on the server.

## Competitions
| Competition | API-Football league ID |
|---|---:|
| UEFA Champions League | 2 |
| Premier League | 39 |
| La Liga | 140 |
| Bundesliga | 78 |
| Serie A | 135 |
| Ligue 1 | 61 |

The season is selected automatically (July onward uses the current calendar year as the season start year).

## Free-plan notes
API-Football currently lists 100 requests/day and a 10 requests/minute limit on its free plan. The free plan includes the endpoints but limits available seasons/data. The app caches fixtures for 10 minutes, standings for 1 hour, and player leaderboards for 6 hours to reduce API usage. Check the provider's league coverage for each competition/season; coverage and statistics are not guaranteed to be identical across all competitions.

## Data source
- API-Football pricing: https://www.api-football.com/pricing
- API-Football documentation: https://www.api-football.com/documentation-v3

Assist and card leaderboards are fetched from the provider's dedicated top-assists, top-yellow-cards and top-red-cards endpoints. If a provider has no data for a competition/season, the site shows an unavailable state rather than invented statistics.
