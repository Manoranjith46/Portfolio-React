import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export function optionalAdmin(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      if (decoded.role === 'admin') {
        (req as any).user = decoded;
      }
    } catch (err) {
      // Ignore invalid token error on public visitor endpoints; treat request as non-admin
    }
  }
  next();
}
