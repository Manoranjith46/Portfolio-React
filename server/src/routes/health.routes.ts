import { Router } from 'express'
import { env } from '../config/env.js'
import { isFirebaseReady } from '../config/firebase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'

const router = Router()

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    sendSuccess(res, {
      status: 'ok',
      environment: env.NODE_ENV,
      firebase: isFirebaseReady() ? 'connected' : 'not_configured',
    })
  }),
)

export default router
