import express from 'express';
import { jobs } from '../jobs/index.js';

const router = express.Router();

router.get('/', (request, response) => {
  response.json(jobs.map(({ id, title }) => ({ id, title })));
});

export default router;
