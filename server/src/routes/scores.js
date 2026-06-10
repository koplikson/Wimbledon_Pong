import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// POST /api/scores - submit a new arcade score
router.post('/', async (req, res, next) => {
  try {
    const { name, score } = req.body || {};
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 12) {
      return res.status(400).json({ error: 'invalid name' });
    }
    if (!Number.isInteger(score) || score < -100000 || score > 1000000) {
      return res.status(400).json({ error: 'invalid score' });
    }
    const cleanName = name.trim().slice(0, 12).replace(/[^\x20-\x7E]/g, '') || 'Player';
    const result = await pool.query(
      'INSERT INTO scores (name, score) VALUES ($1, $2) RETURNING id, name, score, created_at',
      [cleanName, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/scores?limit=10 - top scores, highest first
router.get('/', async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (!Number.isInteger(limit) || limit <= 0 || limit > 100) limit = 10;
    const result = await pool.query(
      'SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT $1',
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
