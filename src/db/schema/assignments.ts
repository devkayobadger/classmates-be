import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { subjects } from './subjects.js'

export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey(),

  subjectId: uuid('subject_id')
    .notNull()
    .references(() => subjects.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),

  description: text('description'),

  assignedDate: date('assigned_date').notNull(),

  dueDate: date('due_date').notNull(),

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