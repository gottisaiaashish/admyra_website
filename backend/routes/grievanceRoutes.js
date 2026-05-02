import express from 'express';
import { reportIssue, getGrievances } from '../controllers/grievanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, reportIssue)
  .get(getGrievances);

export default router;
