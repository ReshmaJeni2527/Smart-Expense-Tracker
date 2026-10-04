import { PAYMENT_METHODS } from '../models/Transaction.js';
import Category from '../models/Category.js';
import { HttpError } from '../middleware/error.js';
import { ensureCategories } from './categories.js';

const validDate = (v) => v && !Number.isNaN(new Date(v).getTime());
const fail = (errors) => { if (Object.keys(errors).length) throw new HttpError(400, 'Please fix the highlighted fields.', errors); };

// Validates a transaction body. The category must be one of the user's own categories stored in MongoDB.
export async function validateTransaction(b, user) {
  const e = {};
  if (!['income', 'expense'].includes(b.type)) e.type = 'Select a transaction type.';
  if (!b.description || !String(b.description).trim()) e.description = 'Description is required.';
  else if (String(b.description).length > 120) e.description = 'Description must be 120 characters or fewer.';
  const amount = Number(b.amount);
  if (b.amount === '' || b.amount == null || Number.isNaN(amount) || amount <= 0) e.amount = 'Amount must be greater than zero.';
  let category = String(b.category || '').trim();
  if (!category) e.category = 'Select a category.';
  else {
    await ensureCategories(user);
    const found = await Category.findOne({ userId: user._id, name: category }).collation({ locale: 'en', strength: 2 });
    if (!found) e.category = 'Select a category from your list.';
    else category = found.name;
  }
  if (!validDate(b.date)) e.date = 'Enter a valid date.';
  if (b.paymentMethod && !PAYMENT_METHODS.includes(b.paymentMethod)) e.paymentMethod = 'Invalid payment method.';
  fail(e);
  return { type: b.type, description: String(b.description).trim(), amount, category, date: new Date(b.date), paymentMethod: b.paymentMethod || 'Cash' };
}
