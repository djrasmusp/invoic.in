import { SnowflakeId } from '@akashrajpurohit/snowflake-id'
import { bigint, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const snowflake = SnowflakeId({
  workerId: process.pid % 1024,
  epoch: 1740865739,
})

export const snowflakeId = {
  id: bigint({ mode: 'number' })
    .primaryKey()
    .$defaultFn(() => snowflake.generate() as unknown as number),
}

export const solftDeleteColumns = {
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP() on
        update CURRENT_TIMESTAMP()`),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
}
