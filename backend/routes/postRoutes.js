import express from 'express';
import { 
  createPost, 
  toggleLike, 
  toggleSave, 
  getPostsByCollege, 
  getAllPosts,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllPosts)
  .post(protect, createPost);

router.route('/:id')
  .delete(protect, deletePost);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.get('/college/:tagName', getPostsByCollege);

export default router;
