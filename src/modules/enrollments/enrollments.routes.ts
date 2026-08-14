import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  enrollStudentController,
  listRosterController,
  unenrollController,
  updateEnrollmentController,
} from './enrollments.controller.js'
import {
  CreateEnrollmentSchema,
  EnrollmentQuerySchema,
  UpdateEnrollmentSchema,
} from './enrollments.schemas.js'

const router = Router()

router.use(authMiddleware)

router.post('/', validate(CreateEnrollmentSchema), enrollStudentController)
router.get('/', validate(EnrollmentQuerySchema, 'query'), listRosterController)
router.put(
  '/:id',
  validate(IdParamSchema, 'params'),
  validate(UpdateEnrollmentSchema),
  updateEnrollmentController,
)
// eslint-disable-next-line drizzle/enforce-delete-with-where -- Express router.delete, not a Drizzle query
router.delete('/:id', validate(IdParamSchema, 'params'), unenrollController)

export default router
