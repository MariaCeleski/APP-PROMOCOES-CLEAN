import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRouter from './routes/auth'
import promotionsRouter from './routes/promotions'
import favoritesRouter from './routes/favorites'
import uploadRouter from './routes/upload'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
const PORT = process.env.PORT || 3333

// ─── Middlewares globais ─────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health check ────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Rotas ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter)
app.use('/api/promotions', promotionsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/upload', uploadRouter)

// ─── Error handler (deve ser o último middleware) ────────────────────────────

app.use(errorHandler)

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app
