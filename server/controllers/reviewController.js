// Handles creating a new AI code review.

import Review from '../models/Review.js';
import { getCodeReview } from '../utils/aiClient.js';

const MAX_CODE_LENGTH = 20000;

// POST /api/review  body: { code, language }
export const createReview = async (req, res) => {
  const { code, language = 'plaintext' } = req.body ?? {};

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ message: 'Field "code" is required and must be a non-empty string' });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ message: `Code must be at most ${MAX_CODE_LENGTH} characters` });
  }
  if (typeof language !== 'string') {
    return res.status(400).json({ message: 'Field "language" must be a string' });
  }

  let reviewText;
  try {
    reviewText = await getCodeReview(code, language);
  } catch (err) {
    console.error('AI review failed:', err.message);
    return res.status(502).json({ message: 'AI provider failed to generate a review', error: err.message });
  }

  try {
    const saved = await Review.create({ code, language, review: reviewText });
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Saving review failed:', err.message);
    return res.status(500).json({ message: 'Failed to save review', error: err.message });
  }
};
