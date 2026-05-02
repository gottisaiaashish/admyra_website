import express from 'express';
import { followUser, unfollowUser, getConnections } from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/follow/:id', protect, followUser);
router.delete('/unfollow/:id', protect, unfollowUser);
router.get('/connections/:id', getConnections);

export default router;
