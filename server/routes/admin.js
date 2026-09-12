import express from 'express';
const router = express.Router();
router.post('/login', (request, response) => {
  const { username, password } = request.body;
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return response.status(503).json({ message: 'Admin login is not configured on the server.' });
  }
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) return response.json({ success: true });
  response.status(401).json({ message: 'Invalid admin username or password.' });
});
export default router;