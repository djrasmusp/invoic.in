import {
  pgTable,
  uniqueIndex,
  text,
  integer,
  primaryKey,
  type AnyPgColumn,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { bigIntToString, snowflake, softDeleteColumns } from '../utils/columns'
import { sql, type SQL } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: snowflake.id,
    email: text().unique().notNull(),
    password: text().notNull(),
    ...softDeleteColumns,
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
    index('userIndex').on(table.id, table.deletedAt),
  ]
)

export const credentials = pgTable(
  'credentials',
  {
    id: text().unique().notNull(),
    userId: bigIntToString('user_id').notNull(),
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
    index('credentialIndex').on(table.id),
  ]
)

export function lower(email: AnyPgColumn | any): SQL {
  return sql`lower(
    ${email}
    )`
}
