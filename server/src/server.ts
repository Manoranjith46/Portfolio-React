import { createApp } from './app.js'
import { env } from './config/env.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`[Server] Portfolio OS API running on http://localhost:${env.PORT}`)
  console.log(`[Server] Health check: http://localhost:${env.PORT}/api/health`)
  console.log(`[Server] CORS origin: ${env.CLIENT_URL}`)
})
