import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../middleware/error.js';

export const resetData = asyncHandler(async (req, res) => {
  await Transaction.deleteMany({ userId: req.user._id });
  res.json({ message: 'All your transactions have been deleted.' });
});
