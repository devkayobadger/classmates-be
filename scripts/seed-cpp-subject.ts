import 'dotenv/config'

import { closeDB } from '../src/db/index.js'
import { synthesizeAttendanceForSubject } from './lib/attendance.js'
import { loadRosterFor, seedRoster } from './lib/seed-roster.js'

const SUBJECT_NAME = 'OOP with C++'
const SUBJECT_CODE = 'CSIT-OOPCPP'

const main = async () => {
  await seedRoster({
    subjectName: SUBJECT_NAME,
    subjectCode: SUBJECT_CODE,
    semester: 2,
    program: 'CSIT',
  })

  // Attendance % target per student comes from the real roster data you
  // uploaded (subject-rosters.json), keyed by roll number.
  const roster = loadRosterFor(SUBJECT_NAME)
  const percentageByRollNumber = new Map(
    roster.map((row) => [row.rollNumber, row.attendancePercentage]),
  )

  await synthesizeAttendanceForSubject({
    subjectCode: SUBJECT_CODE,
    getTargetPercentage: (student) => percentageByRollNumber.get(student.rollNumber) ?? 0,
  })

  await closeDB()
}

main().catch((err) => {
  console.error('Seed script failed:', err)
  process.exit(1)
})
