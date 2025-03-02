import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { consola } from 'consola'
import { dbConnection } from './utils'

export async function runMigration() {
  consola.start('Started database migration...')
  try {
    await migrate(dbConnection(), {
      migrationsFolder: './server/database/migrations',
    })
    consola.success('Database migration successfull')
  } catch (error) {
    consola.error(error)
  }
}
