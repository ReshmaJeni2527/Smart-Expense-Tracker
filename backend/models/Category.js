import mongoose from 'mongoose';

export const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Education', 'Entertainment', 'Other'];

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 30 },
  createdAt: { type: Date, default: Date.now },
});

// Same user cannot have two categories with the same name (case-insensitive).
categorySchema.index({ userId: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export default mongoose.model('Category', categorySchema);
