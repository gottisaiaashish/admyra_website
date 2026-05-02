import express from 'express';
import { applyPartner, getPartners } from '../controllers/partnerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', applyPartner);
router.get('/', protect, admin, getPartners);

export default router;
