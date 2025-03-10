import { foreignKey, pgTable, text, index } from 'drizzle-orm/pg-core'
import { bigIntToString, snowflake, softDeleteColumns } from '../utils'
import { users } from './users'

export const companies = pgTable(
  'companies',
  {
    id: snowflake.id,
    userId: bigIntToString('user_id').notNull(),
    name: text().notNull(),
    address: text().notNull(),
    postalCode: text().notNull(),
    city: text().notNull(),
    phone: text().notNull(),
    identity: text().notNull(),
    logo: text().notNull(),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'user_fk',
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete('cascade'),
    index('companyIndex').on(table.id, table.userId),
    index('companyUserIndex').on(table.userId),
  ]
)
