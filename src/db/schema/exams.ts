import {
  date,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  text,
} from 'drizzle-orm/pg-core'

import { subjects } from './subjects.js'

export const examTypeEnum = pgEnum('exam_type', [
  'unit-test',
  'mid-term',
  'pre-board',
  'practical',
])

export const exams = pgTable('exams', {
  id: uuid('id').primaryKey(),

  subjectId: uuid('subject_id')
    .notNull()
    .references(() => subjects.id, { onDelete: 'cascade' }),

  type: examTypeEnum('type').notNull(),

  title: text('title').notNull(),

  totalMarks: integer('total_marks').notNull(),

  examDate: date('exam_date').notNull(),

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
})