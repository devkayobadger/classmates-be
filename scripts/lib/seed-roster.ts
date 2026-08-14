import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { eq, and } from 'drizzle-orm'

import { getDb } from '../../src/db/index.js'
import { findUserByEmail } from '../../src/modules/users/user.repository.js'
import { students, subjects, enrollments } from '../../src/db/schema/index.js'

// Must match backend/scripts/seed-demo-user.ts
export const TEACHER_EMAIL = 'amitkumar11@gmail.com'

export type RosterRow = {
  id: string
  name: string
  studentCode: string
  rollNumber: string
  subject: string
  attendancePercentage: number
  internalMarks: number
  internalMarksTotal: number
}

const ROSTER_PATH = new URL('../data/subject-rosters.json', import.meta.url)

export const loadRosterFor = (subjectName: string): RosterRow[] => {
  const all = JSON.parse(readFileSync(ROSTER_PATH, 'utf-8')) as RosterRow[]
  return all.filter((row) => row.subject === subjectName)
}

// Creates the subject (if needed) and enrolls every student in the roster.
// Internal marks always start at 0 -- real marks get entered later through
// the app itself, same as how .NET Centric already works. Attendance is
// handled separately by synthesizeAttendanceForSubject() in ./attendance.js.
export const seedRoster = async (params: {
  subjectName: string
  subjectCode: string
  semester: number
  program: string
}): Promise<void> => {
  const { subjectName, subjectCode, semester, program } = params
  const db = getDb()

  const teacher = await findUserByEmail(TEACHER_EMAIL)
  if (!teacher) {
    throw new Error(`Teacher account "${TEACHER_EMAIL}" not found. Run "npm run seed:demo-user" first.`)
  }

  const [existingSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.code, subjectCode))
    .limit(1)

  const subject =
    existingSubject ??
    (
      await db
        .insert(subjects)
        .values({
          id: randomUUID(),
          name: subjectName,
          code: subjectCode,
          semester,
          program,
          teacherId: teacher.id,
        })
        .returning()
    )[0]

  console.log(`Subject ready: "${subject.name}" (${subject.code}), teacher: ${TEACHER_EMAIL}`)

  const roster = loadRosterFor(subjectName)
  if (roster.length === 0) {
    throw new Error(`No roster rows found for subject "${subjectName}" in subject-rosters.json`)
  }

  console.log(`Loaded ${roster.length} students for "${subjectName}". Seeding...`)

  let studentsInserted = 0
  let studentsExisting = 0
  let enrollmentsCreated = 0
  let enrollmentsExisting = 0

  for (const row of roster) {
    // rollNumber and registrationNo are both required+unique on the
    // students table. This roster data only has one code per student
    // (e.g. "CSIT 208232" or "BCA8101"), so we use it for both fields.
    let [studentRow] = await db
      .select()
      .from(students)
      .where(eq(students.registrationNo, row.rollNumber))
      .limit(1)

    if (!studentRow) {
      ;[studentRow] = await db
        .insert(students)
        .values({
          id: randomUUID(),
          name: row.name,
          rollNumber: row.rollNumber,
          registrationNo: row.rollNumber,
          email: null,
          semester,
        })
        .returning()
      studentsInserted++
    } else {
      studentsExisting++
    }

    const [existingEnrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.studentId, studentRow.id), eq(enrollments.subjectId, subject.id)),
      )
      .limit(1)

    if (!existingEnrollment) {
      await db.insert(enrollments).values({
        id: randomUUID(),
        studentId: studentRow.id,
        subjectId: subject.id,
        internalMarks: 0,
        internalMarksTotal: 20,
      })
      enrollmentsCreated++
    } else {
      enrollmentsExisting++
    }
  }

  console.log(
    `\nDone with "${subjectName}".\n` +
      `  Students inserted: ${studentsInserted}, already existed: ${studentsExisting}\n` +
      `  Enrollments created: ${enrollmentsCreated}, already existed: ${enrollmentsExisting}`,
  )
}
