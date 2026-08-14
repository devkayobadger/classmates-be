import { integer, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { students } from './students.js'
import { subjects } from './subjects.js'

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    subjectId: uuid('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    internalMarks: integer('internal_marks').notNull().default(0),
    internalMarksTotal: integer('internal_marks_total').notNull().default(20),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    studentSubjectUnique: uniqueIndex('enrollments_student_subject_unique').on(
      table.studentId,
      table.subjectId,
    ),
  }),
)
