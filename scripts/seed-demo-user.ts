import 'dotenv/config'

import { closeDB, getDb } from '../src/db/index.js'
import { findUserByEmail, createUser } from '../src/modules/users/user.repository.js'
import { hashPassword } from '../src/shared/hash.js'

const DEMO_EMAIL = 'amitkumar11@gmail.com'
const DEMO_PASSWORD = 'Kayobadgerclassmate'
const DEMO_NAME = 'Amit Sir'

const seedDemoUser = async () => {
  // Touch the db so a missing connection fails fast with a clear error.
  getDb()

  const existing = await findUserByEmail(DEMO_EMAIL)

  if (existing) {
    console.log(`Demo user already exists: ${DEMO_EMAIL}`)
    return
  }

  const hashedPassword = await hashPassword(DEMO_PASSWORD)

  await createUser({
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    password: hashedPassword,
  })

  console.log('Demo user created:')
  console.log(`  email:    ${DEMO_EMAIL}`)
  console.log(`  password: ${DEMO_PASSWORD}`)
}

seedDemoUser()
  .catch((error) => {
    console.error('Failed to seed demo user:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await closeDB()
  })
