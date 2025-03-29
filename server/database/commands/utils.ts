import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { consola } from 'consola'

export function dbConnection() {
  if (!process.env.NUXT_POSTGRES_URL) {
    throw createError('Missing `NUXT_POSTGRES_URL` environment variable')
  }

  try {
    return drizzle(process.env.NUXT_POSTGRES_URL)
  } catch (error) {
    consola.error(error)
    throw createError('Error connection to database : ' + error)
  }
}
