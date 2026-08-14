import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  createSubjectController,
  deleteSubjectController,
  getSubjectController,
  listSubjectsController,
  updateSubjectController,
} from './subjects.controller.js'
import { CreateSubjectSchema, UpdateSubjectSchema } from './subjects.schemas.js'

const router = Router()

router.use(authMiddleware)

router.post('/', validate(CreateSubjectSchema), createSubjectController)
router.get('/', listSubjectsController)
router.get('/:id', validate(IdParamSchema, 'params'), getSubjectController)
router.put(
  '/:id',
  validate(IdParamSchema, 'params'),
  validate(UpdateSubjectSchema),
  updateSubjectController,
)
// eslint-disable-next-line drizzle/enforce-delete-with-where -- Express router.delete, not a Drizzle query
router.delete('/:id', validate(IdParamSchema, 'params'), deleteSubjectController)

export default router
