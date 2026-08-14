import { Router } from 'express'

import attendanceRoutes from './modules/attendance/attendance.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import enrollmentRoutes from './modules/enrollments/enrollments.routes.js'
import healthRoutes from './modules/health/health.routes.js'
import studentRoutes from './modules/students/students.routes.js'
import subjectRoutes from './modules/subjects/subjects.routes.js'
import examRoutes from './modules/exams/exams.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/health', healthRoutes)
router.use('/subjects', subjectRoutes)
router.use('/students', studentRoutes)
router.use('/attendance', attendanceRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/exams', examRoutes)

export default router
