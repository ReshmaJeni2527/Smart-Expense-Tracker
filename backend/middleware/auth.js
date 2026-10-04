import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, HttpError } from './error.js';

const secret = () => process.env.JWT_SECRET || 'dev-secret';
export const signToken = (id) => jwt.sign({ id }, secret(), { expiresIn: '7d' });

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please log in to continue.');
  let payload;
  try { payload = jwt.verify(token, secret()); }
  catch { throw new HttpError(401, 'Your session has expired. Please log in again.'); }
  const user = await User.findById(payload.id).select('-passwordHash');
  if (!user) throw new HttpError(401, 'Account not found.');
  req.user = user;
  next();
});
