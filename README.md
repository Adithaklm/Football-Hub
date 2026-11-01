# Football Hub

Premium dark football dashboard for the UEFA Champions League and Europe's top five domestic leagues.

## Stack
- Responsive HTML, CSS and JavaScript frontend
- Vercel serverless API proxy
- Football-data.org API v4

## Deploy
Import this repository into Vercel. Choose the Vite framework preset. Build command: `npm run build`. Output directory: `dist`.

## Connect live football data
1. Register for an API token at https://www.football-data.org/client/register
2. In Vercel, open Project → Settings → Environment Variables.
3. Add FOOTBALL_DATA_TOKEN with your token for Production, Preview and Development.
4. Redeploy.

The API token is read only by the serverless function and is not exposed in browser code.

## Competition codes
- CL — UEFA Champions League
- PL — Premier League
- PD — La Liga
- BL1 — Bundesliga
- SA — Serie A
- FL1 — Ligue 1

Fixtures, standings and scorer data are requested from the configured provider. Assist and card leaderboards are not fabricated; these need a provider/plan that supplies the relevant statistics.