# Wimbledon Pong — Leaderboard API

Small Node/Express + PostgreSQL service for the arcade-score leaderboard and the
Mixed Doubles Pong game UI. Stores high scores in a single `scores` table
(`name`, `score`, `created_at`) and serves the game at `/`.

## Endpoints

- `GET /` — game UI (`server/public/index.html`)
- `GET /health` — health check, returns `{ ok: true }`.
- `GET /api/scores?limit=10` — top scores, highest first.
- `POST /api/scores` — submit a score: `{ "name": "Tom", "score": 120 }`.

`initDb()` creates the `scores` table (and its index) automatically on first
boot — no separate migration step needed.

## Local development

```
cp .env.example .env   # set DATABASE_URL to a local Postgres instance
npm install
npm run dev
```

Open http://localhost:3000/ for the game. API calls use same-origin (`API_BASE=''`).

## Deploying to Railway (Svatba project)

This service lives in the **Svatba** Railway project alongside the wedding site.
Staging URL: https://wimbledon-pong-staging.up.railway.app/

```
cd server
railway link --project Svatba --environment staging
railway service link wimbledon-pong
railway up --detach -m "deploy message"
```

Postgres and `DATABASE_URL` are provisioned as separate services in the same
environment. The wedding site (`koplikson/Svatba`) links to this URL with a
**Play Pong** button — no pong code in that repo.

`railway.toml` configures build/start/healthcheck; `PORT` and `DATABASE_URL` are
provided by Railway.

## Known limitation

Score submission is entirely client-trusted — a determined user could `POST`
an arbitrary score directly to the API. This is acceptable for a casual
leaderboard and is not addressed in v1. If abuse becomes a problem, consider
rate-limiting by IP (`express-rate-limit`) or capping the maximum plausible
score server-side.
