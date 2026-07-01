import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized: Missing or invalid token'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.role !== 'admin') {
      return next(new AppError(403, ErrorCodes.ERR_FORBIDDEN, 'Forbidden: admin only'));
    }
    // Attach decoded user info to request object
    (req as any).user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
