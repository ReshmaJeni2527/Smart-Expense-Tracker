import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

export const oid = (id) => new mongoose.Types.ObjectId(String(id));
export const round = (n) => Math.round(n * 100) / 100;

// Month helpers use UTC so dates stored as YYYY-MM-DD never shift with the server timezone.
export function monthRange() {
  const now = new Date();
  const y = now.getUTCFullYear(), m = now.getUTCMonth();
  return { start: new Date(Date.UTC(y, m, 1)), end: new Date(Date.UTC(y, m + 1, 1)) };
}

// Sum of income and sum of expenses for a user, optionally limited to a date range.
export async function totals(userId, start = new Date(0), end = new Date('2999-01-01')) {
  const rows = await Transaction.aggregate([
    { $match: { userId: oid(userId), date: { $gte: start, $lt: end } } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  return {
    income: round(rows.find((r) => r._id === 'income')?.total || 0),
    expenses: round(rows.find((r) => r._id === 'expense')?.total || 0),
  };
}
