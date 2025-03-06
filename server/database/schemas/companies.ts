import { foreignKey, pgTable, text, index } from 'drizzle-orm/pg-core'
import {
  bigIntToString,
  snowflake,
  softDeleteColumns,
} from '~~/server/database/utils/columns'
import { users } from '~~/server/database/schemas/users'

export const companies = pgTable(
  'companies',
  {
    id: snowflake.id,
    userId: bigIntToString('user_id').notNull(),
    name: text().notNull(),
    address: text().notNull(),
    zipcode: text().notNull(),
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
    index('userIndex').on(table.userId),
  ]
)
