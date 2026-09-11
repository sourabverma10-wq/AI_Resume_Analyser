import express from 'express';
const ADMIN_USERNAME="sourabh"
const ADMIN_PASSWORD="sourab123"
const router = express.Router();
router.post('/login', (request, response) => {
  const { username, password } = request.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) return response.json({ success: true });
  response.status(401).json({ message: 'Invalid admin username or password.' });
});
export default router;