import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { initFirebase } from './config/firebase.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import apiRoutes from './routes/index.js'

import passport from 'passport';
import './modules/auth/passportStrategies.js';

export function createApp() {
  initFirebase()

  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(passport.initialize());

  app.use('/api', apiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
