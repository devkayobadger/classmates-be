import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { getDb, closeDB } from '../src/db/index.js'
import { students } from '../src/db/schema/index.js'

const SEMESTER = 6
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
    const rollNumber = parts[0]?.trim() // S.N.
    const registrationNo = parts[1]?.trim() // Roll No
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
  const raw = readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCsv(raw)

  console.log(`Parsed ${rows.length} students. Inserting at semester ${SEMESTER}...`)

  const db = getDb()
  let inserted = 0
  let skipped = 0

  for (const row of rows) {
    try {
      await db.insert(students).values({
        id: randomUUID(),
        name: row.name,
        rollNumber: row.rollNumber,
        registrationNo: row.registrationNo,
        email: null,
        semester: SEMESTER,
      })
      inserted++
      console.log(`  [OK] [${row.rollNumber}] ${row.registrationNo} - ${row.name}`)
    } catch (err) {
      skipped++
      console.warn(
        `  [SKIP] [${row.rollNumber}] ${row.registrationNo} - ${row.name}: ${(err as Error).message}`,
      )
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`)
  await closeDB()
}

main().catch((err) => {
  console.error('Seed script failed:', err)
  process.exit(1)
})
