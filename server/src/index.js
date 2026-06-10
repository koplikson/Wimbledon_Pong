import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initDb } from './db.js';
import scoresRouter from './routes/scores.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/scores', scoresRouter);

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => app.listen(PORT, () => console.log('Listening on ' + PORT)))
  .catch((err) => {
    console.error('DB init failed', err);
    process.exit(1);
  });
