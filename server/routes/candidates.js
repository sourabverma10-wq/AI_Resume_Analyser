import express from 'express';
import { findCandidate, listCandidates } from '../services/candidateStore.js';

const router = express.Router();
router.get('/', async (request, response) => {
  response.json(listCandidates());
});
router.get('/:id', async (request, response) => {
  const candidate = findCandidate(request.params.id);
  if (!candidate) return response.status(404).json({ message: 'Candidate not found.' });
  response.json(candidate);
});
export default router;