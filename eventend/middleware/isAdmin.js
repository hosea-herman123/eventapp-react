import createError from 'http-errors';
import User from '../models/user.js';

export default async function isAdmin(req, res, next) {
  try {
    const userId = req.payload?.aud;
    if (!userId) return next(createError.Unauthorized());
    const user = await User.findById(userId);
    if (!user) return next(createError.Unauthorized());
    if (user.role !== 'admin') return next(createError.Forbidden('Admin only'));
    next();
  } catch (err) {
    next(err);
  }
}