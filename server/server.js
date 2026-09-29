// Entry point for the Express API.

import 'dotenv/config'; // must stay first so process.env is populated for everything below
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import reviewRoutes from './routes/review.js';
import historyRoutes from './routes/history.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/review', reviewRoutes);
app.use('/api/history', historyRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler (e.g. malformed JSON bodies, oversized payloads)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || 'Internal server error' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
