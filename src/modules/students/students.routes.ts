import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  createStudentController,
  deleteStudentController,
  getStudentController,
  listStudentsController,
  updateStudentController,
} from './students.controller.js'
import { CreateStudentSchema, UpdateStudentSchema } from './students.schemas.js'

const router = Router()

router.use(authMiddleware)

router.post('/', validate(CreateStudentSchema), createStudentController)
router.get('/', listStudentsController)
router.get('/:id', validate(IdParamSchema, 'params'), getStudentController)
router.put(
  '/:id',
  validate(IdParamSchema, 'params'),
  validate(UpdateStudentSchema),
  updateStudentController,
)
// eslint-disable-next-line drizzle/enforce-delete-with-where -- Express router.delete, not a Drizzle query
router.delete('/:id', validate(IdParamSchema, 'params'), deleteStudentController)

export default router
