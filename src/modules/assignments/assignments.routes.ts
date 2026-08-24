import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  getAssignmentStatusesController,
  listAssignmentsController,
  saveAssignmentStatusesController,
  updateAssignmentController,
} from './assignments.controller.js'
import {
  AssignmentListQuerySchema,
  CreateAssignmentSchema,
  SaveAssignmentStatusesSchema,
  UpdateAssignmentSchema,
} from './assignments.schemas.js'

const router = Router()

router.use(authMiddleware)
router.post('/', validate(CreateAssignmentSchema), createAssignmentController)
router.get('/', validate(AssignmentListQuerySchema, 'query'), listAssignmentsController)
router.get('/:id', validate(IdParamSchema, 'params'), getAssignmentController)
router.put(
  '/:id',
  validate(IdParamSchema, 'params'),
  validate(UpdateAssignmentSchema),
  updateAssignmentController,
)
// eslint-disable-next-line drizzle/enforce-delete-with-where -- Express router.delete, not a Drizzle query
router.delete('/:id', validate(IdParamSchema, 'params'), deleteAssignmentController)
router.get('/:id/statuses', validate(IdParamSchema, 'params'), getAssignmentStatusesController)
router.put(
  '/:id/statuses',
  validate(IdParamSchema, 'params'),
  validate(SaveAssignmentStatusesSchema),
  saveAssignmentStatusesController,
)

export default router
