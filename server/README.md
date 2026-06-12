# Wimbledon Pong — Leaderboard API

Small Node/Express + PostgreSQL service for the arcade-score leaderboard and the
Mixed Doubles Pong game UI. Stores high scores in a single `scores` table
(`name`, `score`, `created_at`) and serves the game at `/`.

## Status (12 June 2026)

### Live URLs

| Environment | Pong | Wedding site |
|-------------|------|--------------|
| **Production** | https://wimbledon-pong-prod-production.up.railway.app/ | https://www.madla-kopac.cz |
| **Staging** | https://wimbledon-pong-staging.up.railway.app/ | https://madla-kopac-staging.up.railway.app |

Railway project: **Svatba**. Production services: `wimbledon-pong-prod`, `Postgres-mWd5`, `Svatba`. Staging services: `wimbledon-pong`, `Postgres`, `thorough-motivation`.

### Game (deployed to staging + production)

- **Pre-start splash** — Czech intro text in Pong UI style; tap to continue to menu.
- **1P arcade** — human on right court, 90s timer, streak scoring, post-game leaderboard flow.
- **2P tennis** — full match scoring (sets/games/points).
- **Mobile** — bottom ▲/▼ touch bar during `playing` only (hidden on menu/splash/pauses); 1P uses right pad (YOU). Swipe controls were tried and removed.
- **Mobile menu exit** — Menu chip in scoreboard opens “Opustit hru?” confirm dialog.
- **Responsive menu** — start-screen buttons stack vertically on narrow viewports.
- **Static files** — game served from `server/public/index.html` (keep in sync with repo-root `index.html`).

### Wedding site (`koplikson/Svatba`, merged to `main`)

- Nav + register + schedule (10:30 Wimbledon) links: **Chci hrát** (MS Forms) and **Chci natrénovat** (production Pong URL), centered.
- Production practice links point to `wimbledon-pong-prod-production.up.railway.app`.

### Production leaderboard seed

Top 10 pre-filled for demo/testing (all score `0`, ordered Player 1 → Player 10):

```
GET /api/scores?limit=10
→ Player 1 … Player 10 (score 0, rank by insertion order)
```

Real arcade submissions replace entries as higher scores are posted (`ORDER BY score DESC, created_at ASC`).

### Git

- **Wimbledon_Pong** — `main` at `6c5c50f` (feature branch merged).
- **Svatba** — `main` at `a253154` (practice buttons + production Pong links).

### Not done / optional next

- 2P desktop controls intro screen (↑ W / ↓ S).
- Custom domain for production Pong (e.g. `pong.madla-kopac.cz`).
- GitHub auto-deploy for `wimbledon-pong-prod` (currently CLI `railway up` from `server/`).

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

**Staging**

```
cd server
railway link --project Svatba --environment staging
railway service link wimbledon-pong
railway up --detach -m "deploy message"
```

URL: https://wimbledon-pong-staging.up.railway.app/

**Production**

```
cd server
railway link --project Svatba --environment production
railway service link wimbledon-pong-prod
railway up --detach -m "deploy message"
```

URL: https://wimbledon-pong-prod-production.up.railway.app/

Postgres and `DATABASE_URL` are separate services per environment (`Postgres` / `Postgres-mWd5`). The wedding site links to the production Pong URL via **Chci natrénovat** — no pong code in that repo.

`railway.toml` configures build/start/healthcheck; `PORT` and `DATABASE_URL` are
provided by Railway.

## Known limitation

Score submission is entirely client-trusted — a determined user could `POST`
an arbitrary score directly to the API. This is acceptable for a casual
leaderboard and is not addressed in v1. If abuse becomes a problem, consider
rate-limiting by IP (`express-rate-limit`) or capping the maximum plausible
score server-side.
