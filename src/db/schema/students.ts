import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const students = pgTable('students', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  rollNumber: text('roll_number').notNull().unique(),
  registrationNo: text('registration_no').notNull().unique(),
  email: text('email'),
  semester: integer('semester').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
