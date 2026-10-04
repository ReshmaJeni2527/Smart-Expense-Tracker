import Category, { DEFAULT_CATEGORIES } from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// Creates the default categories for a user the first time they are needed.
// Categories already used by the user's older transactions are kept too, so editing old transactions still works.
export async function ensureCategories(user) {
  if (user.categoriesSeeded) return;
  const used = await Transaction.distinct('category', { userId: user._id });
  const names = [...new Set([...DEFAULT_CATEGORIES, ...used.filter(Boolean)])];
  try {
    await Category.insertMany(names.map((name) => ({ userId: user._id, name })), { ordered: false });
  } catch (err) {
    if (err.code !== 11000 && !err.writeErrors) throw err; // duplicates are fine (e.g. two requests at once)
  }
  await User.updateOne({ _id: user._id }, { categoriesSeeded: true });
  user.categoriesSeeded = true;
}
