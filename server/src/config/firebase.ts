import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'
import { env, hasFirebaseConfig } from './env.js'

let firebaseApp: App | null = null
let firestore: Firestore | null = null
let storage: Storage | null = null

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, '\n')
}

export function initFirebase(): App | null {
  if (!hasFirebaseConfig()) {
    console.warn('[Firebase] Credentials not configured — skipping initialization (Step 2+)')
    return null
  }

  if (firebaseApp) {
    return firebaseApp
  }

  if (getApps().length > 0) {
    firebaseApp = getApps()[0]!
    return firebaseApp
  }

  firebaseApp = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID!,
      clientEmail: env.FIREBASE_CLIENT_EMAIL!,
      privateKey: normalizePrivateKey(env.FIREBASE_PRIVATE_KEY!),
    }),
    storageBucket: env.FIREBASE_STORAGE_BUCKET!,
  })

  firestore = getFirestore(firebaseApp)
  storage = getStorage(firebaseApp)

  console.log('[Firebase] Initialized successfully')
  return firebaseApp
}

export function getFirebaseApp(): App {
  const app = initFirebase()
  if (!app) {
    throw new Error('Firebase is not configured. Set FIREBASE_* environment variables.')
  }
  return app
}

export function getDb(): Firestore {
  if (!firestore) {
    getFirebaseApp()
  }
  return firestore!
}

export function getBucket(): ReturnType<Storage['bucket']> {
  if (!storage) {
    getFirebaseApp()
  }
  return storage!.bucket()
}

export function isFirebaseReady(): boolean {
  return hasFirebaseConfig() && firebaseApp !== null
}
