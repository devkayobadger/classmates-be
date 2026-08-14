import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { exams } from './exams.js'
import { students } from './students.js'

export const examMarks = pgTable(
  'exam_marks',
  {
    id: uuid('id').primaryKey(),

    examId: uuid('exam_id')
      .notNull()
      .references(() => exams.id, { onDelete: 'cascade' }),

    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),

    marks: integer('marks').notNull(),

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
    examStudentUnique: uniqueIndex(
      'exam_marks_exam_student_unique',
    ).on(table.examId, table.studentId),
  }),
)