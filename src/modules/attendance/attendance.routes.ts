import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  copyAttendanceController,
  deleteAttendanceController,
  getAttendanceSummaryController,
  listAttendanceController,
  markAttendanceController,
  updateAttendanceController,
} from './attendance.controller.js'
import {
  AttendanceQuerySchema,
  AttendanceSummaryQuerySchema,
  CopyAttendanceSchema,
  CreateAttendanceSchema,
  UpdateAttendanceSchema,
} from './attendance.schemas.js'

const router = Router()

router.use(authMiddleware)

router.post('/', validate(CreateAttendanceSchema), markAttendanceController)
router.post('/copy', validate(CopyAttendanceSchema), copyAttendanceController)
router.get(
  '/summary',
  validate(AttendanceSummaryQuerySchema, 'query'),
  getAttendanceSummaryController,
)
router.get('/', validate(AttendanceQuerySchema, 'query'), listAttendanceController)
router.put(
  '/:id',
  validate(IdParamSchema, 'params'),
  validate(UpdateAttendanceSchema),
  updateAttendanceController,
)
// eslint-disable-next-line drizzle/enforce-delete-with-where -- Express router.delete, not a Drizzle query
router.delete('/:id', validate(IdParamSchema, 'params'), deleteAttendanceController)

export default router
