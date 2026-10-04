import Transaction from '../models/Transaction.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { validateTransaction } from '../utils/validate.js';

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildFilter(userId, q) {
  const f = { userId };
  if (['income', 'expense'].includes(q.type)) f.type = q.type;
  if (q.category) f.category = q.category;
  if (q.from || q.to) {
    f.date = {};
    if (q.from) f.date.$gte = new Date(q.from);
    if (q.to) f.date.$lt = new Date(new Date(q.to).getTime() + 86400000);
  }
  if (q.q?.trim()) {
    const re = new RegExp(escapeRe(q.q.trim()), 'i');
    const or = [{ description: re }, { category: re }];
    const num = Number(q.q.replace(/[₹,\s]/g, ''));
    if (!Number.isNaN(num)) or.push({ amount: num });
    f.$or = or;
  }
  return f;
}

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 5000);
  const filter = buildFilter(req.user._id, req.query);
  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

export const getOne = asyncHandler(async (req, res) => {
  const t = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
  if (!t) throw new HttpError(404, 'Transaction not found.');
  res.json(t);
});

export const create = asyncHandler(async (req, res) => {
  const t = await Transaction.create({ ...await validateTransaction(req.body, req.user), userId: req.user._id });
  res.status(201).json(t);
});

export const update = asyncHandler(async (req, res) => {
  const t = await Transaction.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, await validateTransaction(req.body, req.user), { new: true, runValidators: true });
  if (!t) throw new HttpError(404, 'Transaction not found.');
  res.json(t);
});

export const remove = asyncHandler(async (req, res) => {
  const t = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!t) throw new HttpError(404, 'Transaction not found.');
  res.json({ message: 'Transaction deleted.' });
});
