import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { eq, and } from 'drizzle-orm'

import { closeDB, getDb } from '../src/db/index.js'
import { findUserByEmail } from '../src/modules/users/user.repository.js'
import { students, subjects, enrollments } from '../src/db/schema/index.js'
import { randomAttendancePercentage, synthesizeAttendanceForSubject } from './lib/attendance.js'

// Must match backend/scripts/seed-demo-user.ts
const TEACHER_EMAIL = 'amitkumar11@gmail.com'

const SEMESTER = 6
const SUBJECT_NAME = '.NET Centric'
const SUBJECT_CODE = 'DOTNET601'

const CSV_PATH = new URL('./Students_List.csv', import.meta.url)

type Row = {
  rollNumber: string // CSV "S.N." — short sequence number (1, 2, 3...)
  registrationNo: string // CSV "Roll No" — long code (e.g. 5-2-354-1-2023)
  name: string
}

const parseCsv = (raw: string): Row[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const [, ...dataLines] = lines // drop header row: S.N.,Roll No,Student Name,Gender

  return dataLines.map((line) => {
    const parts = line.split(',')
    const rollNumber = parts[0]?.trim()
    const registrationNo = parts[1]?.trim()
    const name = parts
      .slice(2, parts.length - 1)
      .join(',')
      .trim()

    if (!rollNumber || !registrationNo || !name) {
      throw new Error(`Malformed row, could not parse: "${line}"`)
    }

    return { rollNumber, registrationNo, name }
  })
}

const main = async () => {
  const db = getDb()

  // 1. Find the teacher account this subject should belong to.
  const teacher = await findUserByEmail(TEACHER_EMAIL)

  if (!teacher) {
    throw new Error(
      `Teacher account "${TEACHER_EMAIL}" not found. Run "npm run seed:demo-user" first.`,
    )
  }

  // 2. Create the ".NET Centric" subject (or reuse it if it already exists).
  const [existingSubject] = await db
    .select()
    .from(subjects)
    .where(eq(subjects.code, SUBJECT_CODE))
    .limit(1)

  const subject =
    existingSubject ??
    (
      await db
        .insert(subjects)
        .values({
          id: randomUUID(),
          name: SUBJECT_NAME,
          code: SUBJECT_CODE,
          semester: SEMESTER,
          teacherId: teacher.id,
        })
        .returning()
    )[0]

  console.log(`Subject ready: "${subject.name}" (${subject.code}), teacher: ${TEACHER_EMAIL}`)

  // 3. Parse and upsert the CSIT 6th-sem roster.
  const raw = readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCsv(raw)

  console.log(`Parsed ${rows.length} students from CSV. Seeding at semester ${SEMESTER}...`)

  let studentsInserted = 0
  let studentsExisting = 0
  let enrollmentsCreated = 0
  let enrollmentsExisting = 0

  for (const row of rows) {
    let [studentRow] = await db
      .select()
      .from(students)
      .where(eq(students.registrationNo, row.registrationNo))
      .limit(1)

    if (!studentRow) {
      ;[studentRow] = await db
        .insert(students)
        .values({
          id: randomUUID(),
          name: row.name,
          rollNumber: row.rollNumber,
          registrationNo: row.registrationNo,
          email: null,
          semester: SEMESTER,
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
    `\nDone.\n` +
      `  Students inserted: ${studentsInserted}, already existed: ${studentsExisting}\n` +
      `  Enrollments created: ${enrollmentsCreated}, already existed: ${enrollmentsExisting}`,
  )

  // This CSV has no attendance data, so each student gets a randomized
  // but realistic-looking target % (mix of high/mid/low, ~20% at-risk),
  // then synthetic attendance_records are generated to match it.
  await synthesizeAttendanceForSubject({
    subjectCode: SUBJECT_CODE,
    getTargetPercentage: () => randomAttendancePercentage(),
  })

  await closeDB()
}

main().catch((err) => {
  console.error('Seed script failed:', err)
  process.exit(1)
})
