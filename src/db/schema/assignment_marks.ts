import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { assignments } from './assignments.js'
import { students } from './students.js'

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'done',
  'not_done',
  'late_done',
  'excused',
])

export const assignmentMarks = pgTable(
  'assignment_marks',
  {
    id: uuid('id').primaryKey(),

    assignmentId: uuid('assignment_id')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),

    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),

    status: assignmentStatusEnum('status').notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    assignmentStudentUnique: uniqueIndex(
      'assignment_marks_assignment_student_unique',
    ).on(table.assignmentId, table.studentId),
  }),
)