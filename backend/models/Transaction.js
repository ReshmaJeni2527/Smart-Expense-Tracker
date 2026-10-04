import mongoose from 'mongoose';

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  description: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than zero.'] },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true, index: true },
  paymentMethod: { type: String, enum: PAYMENT_METHODS, default: 'Cash' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
