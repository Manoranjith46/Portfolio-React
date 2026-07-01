import 'dotenv/config'
import bcrypt from 'bcrypt'
import { initFirebase } from '../src/config/firebase.js'
import { env, hasFirebaseConfig } from '../src/config/env.js'
import { Collections, DocIds } from '../src/types/collections.js'
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_NAME,
  DEFAULT_ADMIN_PASSWORD,
  SEED_EDUCATION,
  SEED_PROFILE,
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_SETTINGS,
  SEED_SKILLS,
} from '../src/constants/seedData.js'
import {
  batchSet,
  clearCollection,
  commitBatch,
  createBatch,
  setDocument,
} from '../src/utils/firestoreService.js'

async function seed(): Promise<void> {
  if (!hasFirebaseConfig()) {
    console.error('[Seed] Firebase credentials missing. Copy .env.example → .env and set FIREBASE_* vars.')
    process.exit(1)
  }

  initFirebase()

  const adminEmail = env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL
  const adminPassword = env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  console.log('[Seed] Clearing existing seed collections...')
  await clearCollection(Collections.SKILLS)
  await clearCollection(Collections.PROJECTS)
  await clearCollection(Collections.EDUCATION)
  await clearCollection(Collections.SERVICES)
  await clearCollection(Collections.EXPERIENCE)

  console.log('[Seed] Writing admin user...')
  await setDocument(Collections.USERS, DocIds.ADMIN, {
    email: adminEmail,
    name: DEFAULT_ADMIN_NAME,
    role: 'admin',
    passwordHash,
  })

  console.log('[Seed] Writing published portfolio profile...')
  await setDocument(Collections.PORTFOLIO_PUBLISHED, DocIds.PORTFOLIO_MAIN, {
    ...SEED_PROFILE,
    version: 1,
  })

  console.log('[Seed] Writing site settings...')
  await setDocument(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL, SEED_SETTINGS)

  const batch = createBatch()

  SEED_SKILLS.forEach((skill, index) => {
    batchSet(batch, Collections.SKILLS, `skill-${index}`, skill)
  })

  SEED_PROJECTS.forEach((project, index) => {
    batchSet(batch, Collections.PROJECTS, `project-${index + 1}`, project)
  })

  SEED_EDUCATION.forEach((edu, index) => {
    batchSet(batch, Collections.EDUCATION, `edu-${index + 1}`, edu)
  })

  SEED_SERVICES.forEach((service, index) => {
    batchSet(batch, Collections.SERVICES, `service-${index}`, service)
  })

  await commitBatch(batch)

  console.log('[Seed] Complete!')
  console.log(`  Admin email:    ${adminEmail}`)
  console.log(`  Admin password: ${adminPassword === DEFAULT_ADMIN_PASSWORD ? adminPassword + ' (default — change in production)' : '(from ADMIN_PASSWORD env)'}`)
  console.log(`  Collections:    users, portfolioPublished, settings, skills, projects, education, services`)
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err)
  process.exit(1)
})
