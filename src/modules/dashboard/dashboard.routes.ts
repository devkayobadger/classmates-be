import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { getDashboardOverviewController } from './dashboard.controller.js'

const router = Router()

router.use(authMiddleware)

router.get('/overview', getDashboardOverviewController)

export default router
