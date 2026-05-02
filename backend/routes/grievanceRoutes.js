import express from 'express';
import { reportIssue, getGrievances, toggleAgree, resolveGrievance } from '../controllers/grievanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, reportIssue)
  .get(getGrievances);

router.post('/:id/agree', protect, toggleAgree);
router.put('/:id/resolve', protect, resolveGrievance);

export default router;
