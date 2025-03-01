import * as schema from '@@/server/database/schemas'
import { drizzle } from 'drizzle-orm/node-postgres'

export const tbl = schema

export function useDrizzle() {
  const runtimeConfig = useRuntimeConfig()

  if (!runtimeConfig.database) {
    throw createError('Missing `NUXT_POSTGRES_URL` environment variable')
  }

  return drizzle(runtimeConfig.database as string, {
    schema,
    logger: true,
  })
}
