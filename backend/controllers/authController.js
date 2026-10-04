import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { signToken } from '../middleware/auth.js';
import { ensureCategories } from '../utils/categories.js';

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required.';
  if (!EMAIL_RE.test(email || '')) errors.email = 'Enter a valid email address.';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (Object.keys(errors).length) throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  if (await User.exists({ email: email.toLowerCase() })) throw new HttpError(409, 'An account with this email already exists.', { email: 'Email already registered.' });
  const user = await User.create({ name: name.trim(), email, passwordHash: await bcrypt.hash(password, 10) });
  await ensureCategories(user);
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) throw new HttpError(401, 'Invalid email or password.');
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }));

export const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) throw new HttpError(400, 'Name is required.', { name: 'Name is required.' });
  req.user.name = name.trim();
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});
