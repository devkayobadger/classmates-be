import { date, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { students } from './students.js'
import { subjects } from './subjects.js'

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'excused',
])

export const attendanceRecords = pgTable(
  'attendance_records',
  {
    id: uuid('id').primaryKey(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    subjectId: uuid('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    status: attendanceStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    studentSubjectDateUnique: uniqueIndex('attendance_student_subject_date_unique').on(
      table.studentId,
      table.subjectId,
      table.date,
    ),
  }),
)
