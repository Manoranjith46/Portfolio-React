import { Request, Response, NextFunction } from 'express';
import { login, refreshToken, oauthCallback } from './authService.js';

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    // set refresh token as HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ success: true, data: { accessToken: result.accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken');
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    const accessToken = await refreshToken(refreshTokenCookie);
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function oauthCallbackHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await oauthCallback(req);
    // set refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${result.accessToken}`;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
}
