# Wimbledon Pong — Leaderboard API

Small Node/Express + PostgreSQL API backing the arcade-score leaderboard for
the 1-player game. Stores high scores in a single `scores` table
(`name`, `score`, `created_at`) and serves the top entries.

## Endpoints

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

## Deploying to Railway

```
railway login
railway init
railway add -d postgres        # provisions Postgres, sets DATABASE_URL on linked services
railway up                      # deploy this directory
railway variables --set CORS_ORIGIN=<frontend origin>
railway domain                  # generate a public URL -> use as API_BASE in index.html
```

`railway.toml` configures the build/start/healthcheck settings; `PORT` and
`DATABASE_URL` are provided automatically by Railway.

## Known limitation

Score submission is entirely client-trusted — a determined user could `POST`
an arbitrary score directly to the API. This is acceptable for a casual
leaderboard and is not addressed in v1. If abuse becomes a problem, consider
rate-limiting by IP (`express-rate-limit`) or capping the maximum plausible
score server-side.
