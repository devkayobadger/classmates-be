import type { Request, Response } from 'express'

import app from '../src/app.js'
import { connectDB } from '../src/db/index.js'

let dbReady: Promise<void> | null = null

const ensureDbReady = () => {
  dbReady ??= connectDB()
  return dbReady
}

export default async function handler(req: Request, res: Response) {
  await ensureDbReady()

  return app(req, res)
}
