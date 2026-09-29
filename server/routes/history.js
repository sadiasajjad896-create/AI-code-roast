// Routes for browsing past reviews.
//
// GET    /api/history     -> getHistory     (optional ?userId=&limit=&page=)
// GET    /api/history/:id -> getReviewById
// DELETE /api/history/:id -> deleteReview

import { Router } from 'express';
import {
  getHistory,
  getReviewById,
  deleteReview,
} from '../controllers/historyController.js';

const router = Router();

router.get('/', getHistory);
router.get('/:id', getReviewById);
router.delete('/:id', deleteReview);

export default router;
