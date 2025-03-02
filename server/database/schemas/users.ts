import {
  pgTable,
  uniqueIndex,
  text,
  integer,
  bigint,
  primaryKey,
  type AnyPgColumn,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { snowflake, softDeleteColumns } from '../utils/columns'
import { sql, type SQL } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: snowflake.id,
    email: text().unique().notNull(),
    password: text().notNull(),
    ...softDeleteColumns,
  },
  (table) => [uniqueIndex('emailUniqueIndex').on(lower(table.email), table.id)]
)

export const credentials = pgTable(
  'credentials',
  {
    id: text().unique().notNull(),
    userId: bigint('user_id', { mode: 'bigint' }).notNull(),
    publicKey: text().unique().notNull(),
    counter: integer().notNull(),
    backedUp: integer('backed_up').notNull(),
    transports: text().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.userId] }),
    foreignKey({
      name: 'user_fk',
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete('cascade'),
  ]
)

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(
    ${email}
    )`
}
