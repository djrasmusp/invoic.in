import { foreignKey, index, pgTable, text } from 'drizzle-orm/pg-core'
import { bigIntToString, snowflake, softDeleteColumns } from '../utils'
import { companies } from './companies'

export const clients = pgTable(
  'clients',
  {
    id: snowflake.id,
    companyId: bigIntToString('company_id').notNull(),
    name: text().notNull(),
    address: text(),
    postalCode: text(),
    city: text(),
    phone: text(),
    email: text(),
    identity: text(),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'company_fk',
      columns: [table.companyId],
      foreignColumns: [companies.id],
    }),
    index('clientIndex').on(table.id, table.deletedAt),
    index('clientCompanyIndex').on(table.companyId, table.deletedAt),
  ]
)
