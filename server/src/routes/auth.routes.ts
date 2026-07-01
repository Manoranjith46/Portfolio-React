import { Router } from 'express';
import { loginHandler, logoutHandler, refreshHandler, oauthCallbackHandler } from '../modules/auth/authController.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
import passport from 'passport';

const router = Router();

// Local email/password login
router.post('/auth/login', loginRateLimiter, loginHandler);
router.post('/auth/logout', logoutHandler);
router.post('/auth/refresh', refreshHandler);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), oauthCallbackHandler);

// GitHub OAuth
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/' }), oauthCallbackHandler);

export default router;
