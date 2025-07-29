import express from 'express';
import { constants } from 'http2';
import { AuthService } from '#/services/auth';

const router = express.Router();
const authService = new AuthService();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and get a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await authService.login(username, password);
    res.json(result);
  } catch {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Invalid username or password' });
  }
});

export default router;
