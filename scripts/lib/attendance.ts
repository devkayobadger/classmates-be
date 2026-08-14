import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'

import { getDb } from '../../src/db/index.js'
import { attendanceRecords, enrollments, students, subjects } from '../../src/db/schema/index.js'

// Number of past class sessions to synthesize per student. The app
// calculates attendance % live as (present records / total records) * 100
// -- see attendance.service.ts getAttendanceSummary() -- so this is the
// "totalClasses" side of that formula for every student we touch here.
const SESSION_COUNT = 20

// Realistic-looking random % for students with no known target (e.g.
// .NET Centric, whose source CSV has no attendance column at all). About
// 20% of students land in the at-risk range (0-49%), the rest spread
// across 50-100%, mirroring the mix seen in the OOP with C++ / Operating
// System rosters.
export const randomAttendancePercentage = (): number => {
  if (Math.random() < 0.2) {
    return Math.floor(Math.random() * 50) // 0-49
  }
  return Math.floor(Math.random() * 51) + 50 // 50-100
}

// Builds SESSION_COUNT past class dates (going backward from today,
// Mon-Fri only, to look like a real class schedule).
const buildAttendanceDates = (): string[] => {
  const dates: string[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - 1) // start from yesterday

  while (dates.length < SESSION_COUNT) {
    const day = cursor.getDay() // 0 = Sun, 6 = Sat
    if (day !== 0 && day !== 6) {
      dates.push(cursor.toISOString().slice(0, 10))
    }
    cursor.setDate(cursor.getDate() - 1)
  }

  return dates
}

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

type EnrolledStudent = {
  id: string
  name: string
  rollNumber: string
  registrationNo: string
}

// Generates attendance_records for every student already enrolled in the
// given subject, so that (presentCount / SESSION_COUNT) * 100 lands on
// (approximately) whatever getTargetPercentage() returns for that student.
// Safe to re-run: existing (student, subject, date) records are skipped,
// never duplicated or overwritten.
export const synthesizeAttendanceForSubject = async (params: {
  subjectCode: string
  getTargetPercentage: (student: EnrolledStudent) => number
}): Promise<void> => {
  const { subjectCode, getTargetPercentage } = params
  const db = getDb()

  const [subject] = await db.select().from(subjects).where(eq(subjects.code, subjectCode)).limit(1)
  if (!subject) {
    throw new Error(`Subject with code "${subjectCode}" not found. Seed the subject/students first.`)
  }

  const roster: EnrolledStudent[] = await db
    .select({
      id: students.id,
      name: students.name,
      rollNumber: students.rollNumber,
      registrationNo: students.registrationNo,
    })
    .from(enrollments)
    .innerJoin(students, eq(enrollments.studentId, students.id))
    .where(eq(enrollments.subjectId, subject.id))

  console.log(`Synthesizing attendance for ${roster.length} students in "${subject.name}"...`)

  let created = 0
  let skipped = 0

  for (const student of roster) {
    const targetPercentage = getTargetPercentage(student)
    const dates = buildAttendanceDates()
    const presentCount = Math.round((targetPercentage / 100) * SESSION_COUNT)
    const statuses = shuffle([
      ...Array(presentCount).fill('present' as const),
      ...Array(SESSION_COUNT - presentCount).fill('absent' as const),
    ])

    for (let i = 0; i < dates.length; i++) {
      const [existingRecord] = await db
        .select()
        .from(attendanceRecords)
        .where(
          and(
            eq(attendanceRecords.studentId, student.id),
            eq(attendanceRecords.subjectId, subject.id),
            eq(attendanceRecords.date, dates[i]),
          ),
        )
        .limit(1)

      if (existingRecord) {
        skipped++
        continue
      }

      await db.insert(attendanceRecords).values({
        id: randomUUID(),
        studentId: student.id,
        subjectId: subject.id,
        date: dates[i],
        status: statuses[i],
      })
      created++
    }
  }

  console.log(`  Attendance records created: ${created}, already existed (skipped): ${skipped}`)
}
