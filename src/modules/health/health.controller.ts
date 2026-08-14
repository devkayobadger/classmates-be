import { Request, Response } from 'express'

import { checkDB } from '../../db/index.js'
import { ApiResponse } from '../../shared/ApiResponse.js'

export function healthController(_req: Request, res: Response) {
  ApiResponse.ok(res, {
    status: 'ok',
    timestamp: Date.now(),
  })
}

export async function readinessController(_req: Request, res: Response) {
  const databaseReady = await checkDB()

  return res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ready' : 'not_ready',
    checks: {
      database: databaseReady ? 'ok' : 'unavailable',
    },
    timestamp: Date.now(),
  })
}
