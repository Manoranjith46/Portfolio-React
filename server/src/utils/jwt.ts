import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError, ErrorCodes } from './AppError.js';

type JwtPayload = {
  sub: string; // user id
  role: string;
  iat?: number;
  exp?: number;
};

/** Sign access token (short‑lived) */
export function signAccessToken(userId: string, payload: { role: string }) {
  if (!env.JWT_ACCESS_SECRET) {
    throw new AppError(500, ErrorCodes.ERR_INTERNAL, 'Missing JWT_ACCESS_SECRET');
  }
  const token = jwt.sign(
    { sub: userId, role: payload.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' },
  );
  return token;
}

/** Sign refresh token (long‑lived) */
export function signRefreshToken(userId: string) {
  if (!env.JWT_REFRESH_SECRET) {
    throw new AppError(500, ErrorCodes.ERR_INTERNAL, 'Missing JWT_REFRESH_SECRET');
  }
  const token = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return token;
}

/** Verify refresh token and return payload */
export function verifyRefreshToken(token: string): JwtPayload {
  if (!env.JWT_REFRESH_SECRET) {
    throw new AppError(500, ErrorCodes.ERR_INTERNAL, 'Missing JWT_REFRESH_SECRET');
  }
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Invalid refresh token');
  }
}

/** Verify access token and return payload */
export function verifyAccessToken(token: string): JwtPayload {
  if (!env.JWT_ACCESS_SECRET) {
    throw new AppError(500, ErrorCodes.ERR_INTERNAL, 'Missing JWT_ACCESS_SECRET');
  }
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Invalid access token');
  }
}

