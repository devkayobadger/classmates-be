import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { users } from './users.js'

export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  semester: integer('semester').notNull(),
  program: text('program').notNull().default(''),
  color: text('color').notNull().default('blue'),
  teacherId: uuid('teacher_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
