import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from '../../config/env.js';
import { getDocument } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { UserDoc } from '../../types/firestore.js';

passport.serializeUser((user: any, done) => {
  done(null, user.id || user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getDocument<UserDoc>(Collections.USERS, id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        (req as any).user = profile;
        done(null, profile);
      },
    ),
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email'],
        passReqToCallback: true,
      },
      async (req: any, _accessToken: string, _refreshToken: string, profile: any, done: any) => {
        (req as any).user = profile;
        done(null, profile);
      },
    ),
  );
}
export default passport;
