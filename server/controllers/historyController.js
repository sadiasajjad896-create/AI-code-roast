// Handles reading and deleting past reviews.

import mongoose from 'mongoose';
import Review from '../models/Review.js';

// GET /api/history
export const getHistory = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    console.error('Fetching history failed:', err.message);
    return res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

// GET /api/history/:id
export const getReviewById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid review id' });
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.json(review);
  } catch (err) {
    console.error('Fetching review failed:', err.message);
    return res.status(500).json({ message: 'Failed to fetch review', error: err.message });
  }
};

// DELETE /api/history/:id
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid review id' });
  }

  try {
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(204).end();
  } catch (err) {
    console.error('Deleting review failed:', err.message);
    return res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
