import { SnowflakeId } from '@akashrajpurohit/snowflake-id'
import { timestamp, customType } from 'drizzle-orm/pg-core'

export const snowflakeId = SnowflakeId({
  workerId: process.pid % 1024,
  epoch: 1740865739,
})

// Custom Type for primary SnowflakeId
// This is to preserve the performance at DB level and not getting errors in javascript, as BigInt does work well with JSON
export const bigIntToString = customType<{
  data: string
  driverData: bigint
}>({
  dataType() {
    return 'bigint'
  },
  toDriver(value: string) {
    return BigInt(value)
  },
  fromDriver(value: bigint) {
    return value.toString()
  },
})

export const snowflake = {
  id: bigIntToString()
    .primaryKey()
    .$defaultFn(() => snowflakeId.generate()),
}

export const softDeleteColumns = {
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
    () => new Date()
  ),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
}
