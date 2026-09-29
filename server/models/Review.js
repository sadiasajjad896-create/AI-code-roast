// Mongoose model for a single code review ("roast").

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, default: 'plaintext' },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// History is always listed newest first
reviewSchema.index({ createdAt: -1 });

export default mongoose.model('Review', reviewSchema);
