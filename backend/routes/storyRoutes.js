import express from 'express';
import { createStory, getStories } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createStory)
  .get(getStories);

export default router;
