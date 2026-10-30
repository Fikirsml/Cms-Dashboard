import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';
import projectRoutes from './routes/projects.js';
import issueRoutes from './routes/issues.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'forge-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Forge API is running' });
});

app.use('/auth', authRoutes);
app.use('/workspaces', workspaceRoutes);
app.use(projectRoutes);
app.use(issueRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Forge API listening on http://localhost:${PORT}`);
});
