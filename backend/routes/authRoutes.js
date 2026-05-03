import express from 'express';
import { authUser, registerUser, googleAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/signup', registerUser);
router.post('/google', googleAuth);

// TEMPORARY EMERGENCY RESET - DELETE AFTER USE
router.get('/emergency-reset/:email', async (req, res) => {
  const { email } = req.params;
  const hashedPassword = await (await import('bcryptjs')).default.hash('Admyra@123', 10);
  try {
    await (await import('../config/prisma.js')).default.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword }
    });
    res.send(`Password for ${email} reset to: Admyra@123. PLEASE LOGIN AND CHANGE IT!`);
  } catch (err) {
    res.status(400).send('User not found or error');
  }
});

export default router;
