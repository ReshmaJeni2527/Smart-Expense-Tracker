import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { ensureCategories } from '../utils/categories.js';

const COLLATION = { locale: 'en', strength: 2 };

export const list = asyncHandler(async (req, res) => {
  await ensureCategories(req.user);
  const items = await Category.find({ userId: req.user._id }).collation(COLLATION).sort({ createdAt: 1, name: 1 });
  res.json(items);
});

export const create = asyncHandler(async (req, res) => {
  await ensureCategories(req.user);
  const name = String(req.body.name || '').trim().replace(/\s+/g, ' ');
  if (!name) throw new HttpError(400, 'Category name is required.', { name: 'Category name is required.' });
  if (name.length > 30) throw new HttpError(400, 'Category name must be 30 characters or fewer.', { name: 'Use 30 characters or fewer.' });
  if (await Category.exists({ userId: req.user._id, name }).collation(COLLATION)) {
    throw new HttpError(409, 'This category already exists.', { name: 'This category already exists.' });
  }
  res.status(201).json(await Category.create({ userId: req.user._id, name }));
});

export const remove = asyncHandler(async (req, res) => {
  const cat = await Category.findOne({ _id: req.params.id, userId: req.user._id });
  if (!cat) throw new HttpError(404, 'Category not found.');
  const used = await Transaction.countDocuments({ userId: req.user._id, category: cat.name });
  if (used) throw new HttpError(409, `"${cat.name}" is used by ${used} transaction${used === 1 ? '' : 's'}. Delete or change those transactions first.`);
  await cat.deleteOne();
  res.json({ message: 'Category deleted.' });
});
