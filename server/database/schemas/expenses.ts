import { bigint, foreignKey, index, pgTable, text } from 'drizzle-orm/pg-core'
import { bigIntToString, snowflake, softDeleteColumns } from '../utils'
import { companies } from './companies'

export const expenseTypes = pgTable(
  'expense_types',
  {
    id: snowflake.id,
    companyId: bigIntToString('company_id').notNull(),
    name: text().notNull(),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'company_fk',
      columns: [table.companyId],
      foreignColumns: [companies.id],
    }).onDelete('cascade'),
    index('expenseTypeIndex').on(table.id, table.deletedAt),
  ]
)

export const expenses = pgTable(
  'expenses',
  {
    id: snowflake.id,
    companyId: bigIntToString('company_id').notNull(),
    typeId: bigIntToString('type_id'),
    name: text().notNull(),
    tax: bigint({ mode: 'number' }).notNull().default(0),
    total: bigint({ mode: 'number' }).notNull().default(0),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'company_fk',
      columns: [table.companyId],
      foreignColumns: [companies.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'type_fk',
      columns: [table.typeId],
      foreignColumns: [expenseTypes.id],
    }),
    index('expenseIndex').on(table.id, table.deletedAt),
    index('expenseCompanyIndex').on(table.companyId, table.deletedAt),
  ]
)

export const expenseFiles = pgTable(
  'expense_files',
  {
    id: snowflake.id,
    expenseId: bigIntToString('expense_id').notNull(),
    file: text().notNull(),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'expense_fk',
      columns: [table.expenseId],
      foreignColumns: [expenses.id],
    }).onDelete('cascade'),
    index('expenseFileIndex').on(table.expenseId, table.deletedAt),
  ]
)
