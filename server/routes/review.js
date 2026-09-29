// Routes for generating new reviews.
//
// POST /api/review -> createReview
//   body:    { code, language, userId? }
//   returns: the saved Review document

import { Router } from 'express';
import { createReview } from '../controllers/reviewController.js';

const router = Router();

router.post('/', createReview);

export default router;
