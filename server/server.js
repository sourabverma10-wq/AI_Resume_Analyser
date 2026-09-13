import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import analyzeRoutes from './routes/analyze.js';
import candidateRoutes from './routes/candidates.js';
import adminRoutes from './routes/admin.js';

const app = express();
const asMiddleware = routeModule => routeModule?.default || routeModule;
const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);
const isAllowedOrigin = origin => !origin
  || allowedOrigins.has(origin)
  || /^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(origin);

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`Origin is not allowed by CORS: ${origin}`));
  }
}));
app.use(express.json());
app.get('/api/health', (request, response) => response.json({ status: 'ok' }));
app.use('/api/analyze', asMiddleware(analyzeRoutes));
app.use('/api/candidates', asMiddleware(candidateRoutes));
app.use('/api/admin', asMiddleware(adminRoutes));
app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError || error.message?.includes('File too large')) return response.status(400).json({ message: 'PDF must be smaller than 5 MB.' });
  if (error.message?.includes('Origin is not allowed by CORS')) return response.status(403).json({ message: 'The deployed frontend is not allowed to access this API. Check FRONTEND_URL in Netlify environment variables.' });
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

export default app;

if (!process.env.NETLIFY) {
  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`));
}