import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import analyzeRoutes from './routes/analyze.js';
import candidateRoutes from './routes/candidates.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (request, response) => response.json({ message: 'API is running' }));
app.use('/api/analyze', analyzeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError || error.message?.includes('File too large')) return response.status(400).json({ message: 'PDF must be smaller than 5 MB.' });
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));