import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { getDocument, queryDocuments } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { UserDoc } from '../../types/firestore.js';

async function getUserByEmail(email: string): Promise<(UserDoc & { id: string }) | null> {
  const docs = await queryDocuments<UserDoc>(Collections.USERS, [
    { field: 'email', op: '==', value: email }
  ]);
  return docs.length > 0 ? docs[0] : null;
}

async function getUserById(id: string): Promise<(UserDoc & { id: string }) | null> {
  return getDocument<UserDoc>(Collections.USERS, id);
}

/**
 * Validate credentials and return JWT tokens.
 */
export async function login(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new Error('Invalid credentials');
  }
  const accessToken = await signAccessToken(user.id, { role: user.role });
  const refreshToken = await signRefreshToken(user.id);
  return { accessToken, refreshToken };
}

export async function logout(_refreshToken: string) {
  // Since we use stateless refresh tokens stored in HttpOnly cookie, logout is just clearing the cookie.
  // If a token blacklist is later required, implement here.
  return;
}

export async function refreshToken(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken);
  const user = await getUserById(payload.sub);
  if (!user) {
    throw new Error('User not found');
  }
  const newAccess = await signAccessToken(user.id, { role: user.role });
  return newAccess;
}

/**
 * OAuth callback handling. `req` contains provider info set by Passport.
 * This function should map the provider profile to the pre‑seeded admin user.
 */
export async function oauthCallback(req: any) {
  // Passport attaches `user` after successful authentication.
  const profile = req.user; // { id, displayName, emails, provider }
  // For this MVP we only allow the pre‑seeded admin email.
  if (!profile || !profile.emails || profile.emails.length === 0) {
    throw new Error('No email returned from provider');
  }
  const email = profile.emails[0].value;
  const admin = await getUserByEmail(email);
  if (!admin || admin.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  const accessToken = await signAccessToken(admin.id, { role: admin.role });
  const refreshToken = await signRefreshToken(admin.id);
  return { accessToken, refreshToken };
}
