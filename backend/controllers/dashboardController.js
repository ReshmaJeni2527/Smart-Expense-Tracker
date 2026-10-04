import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../middleware/error.js';
import { monthRange, oid, round, totals } from '../utils/helpers.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHART_MONTHS = 6;

// Expense total for each of the last 6 months, calculated from the stored expense transactions.
async function monthlyExpenses(userId) {
  const now = new Date();
  const buckets = Array.from({ length: CHART_MONTHS }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (CHART_MONTHS - 1 - i), 1));
    return { key: d.toISOString().slice(0, 7), label: `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`, expenses: 0 };
  });
  const since = new Date(`${buckets[0].key}-01T00:00:00.000Z`);
  const rows = await Transaction.aggregate([
    { $match: { userId: oid(userId), type: 'expense', date: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date', timezone: 'UTC' } }, total: { $sum: '$amount' } } },
  ]);
  const map = new Map(rows.map((r) => [r._id, r.total]));
  return buckets.map((b) => ({ label: b.label, expenses: round(map.get(b.key) || 0) }));
}

export const summary = asyncHandler(async (req, res) => {
  const uid = req.user._id;
  const month = monthRange();
  const [all, thisMonth, count, recent, monthly] = await Promise.all([
    totals(uid),
    totals(uid, month.start, month.end),
    Transaction.countDocuments({ userId: uid }),
    Transaction.find({ userId: uid }).sort({ date: -1, createdAt: -1 }).limit(6),
    monthlyExpenses(uid),
  ]);
  res.json({
    hasData: count > 0,
    totalIncome: all.income,
    totalExpenses: all.expenses,
    totalBalance: round(all.income - all.expenses),
    monthExpenses: thisMonth.expenses,
    monthly,
    recent,
  });
});
