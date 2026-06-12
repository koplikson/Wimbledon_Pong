import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { initDb } from './db.js';
import scoresRouter from './routes/scores.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/scores', scoresRouter);
app.use(express.static(publicDir));
app.get('/', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')));

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => app.listen(PORT, () => console.log('Listening on ' + PORT)))
  .catch((err) => {
    console.error('DB init failed', err);
    process.exit(1);
  });
