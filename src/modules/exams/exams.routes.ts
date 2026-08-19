import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { IdParamSchema } from '../../shared/common.schemas.js'
import {
  createExamController,
  getExamController,
  getExamMarksController,
  listExamsController,
  saveExamMarksController,
} from './exams.controller.js'
import { CreateExamSchema, SaveExamMarksSchema } from './exams.schemas.js'

const router = Router()

router.use(authMiddleware)

router.post('/', validate(CreateExamSchema), createExamController)

router.get('/', listExamsController)

router.get('/:id', validate(IdParamSchema, 'params'), getExamController)

router.get('/:id/marks', validate(IdParamSchema, 'params'), getExamMarksController)

router.put(
  '/:id/marks',
  validate(IdParamSchema, 'params'),
  validate(SaveExamMarksSchema),
  saveExamMarksController,
)

export default router
