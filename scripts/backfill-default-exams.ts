import 'dotenv/config'

import { getDb } from '../src/db/index.js'
import { subjects } from '../src/db/schema/index.js'
import { createDefaultExams } from '../src/modules/exams/exams.repository.js'

const db = getDb()

const allSubjects = await db.select().from(subjects)

console.log(`Found ${allSubjects.length} subjects.`)

for (const subject of allSubjects) {
  console.log(`Processing: ${subject.name} (${subject.code})`)

  const exams = await createDefaultExams(subject.id)

  console.log(`  Exams available: ${exams.length}`)
}

console.log('Exam backfill completed.')

process.exit(0)