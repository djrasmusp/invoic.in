import {
  bigint,
  integer,
  pgTable,
  date,
  timestamp,
  foreignKey,
  pgEnum,
  text,
  index,
} from 'drizzle-orm/pg-core'
import { bigIntToString, snowflake, softDeleteColumns } from '../utils'
import { companies } from './companies'
import { clients } from './clients'

export const invoices = pgTable(
  'invoices',
  {
    id: snowflake.id,
    companyId: bigIntToString('company_id').notNull(),
    clientId: bigIntToString('client_id').notNull(),
    invoiceDate: date('invoice_date', { mode: 'date' }).notNull(),
    dueDate: date('due_date', { mode: 'date' }).notNull(),
    totalTaxAmount: bigint('total_tax_amount', { mode: 'number' })
      .notNull()
      .default(0),
    totalAmount: bigint('total_amount', { mode: 'number' })
      .notNull()
      .default(0),
    sentAt: timestamp('sent_at', { mode: 'date' }),
    viewedAt: timestamp('viewed_at', { mode: 'date' }),
    paidAt: timestamp('paid_at', { mode: 'date' }),
    ...softDeleteColumns,
  },
  (table) => [
    foreignKey({
      name: 'company_fk',
      columns: [table.companyId],
      foreignColumns: [companies.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'client_fk',
      columns: [table.clientId],
      foreignColumns: [clients.id],
    }).onDelete('cascade'),
    index('invoiceIndex').on(table.id, table.deletedAt),
  ]
)

export const typesEnum = pgEnum('typesenum', ['item', 'discount'])

export const invoiceItems = pgTable(
  'invoices_items',
  {
    id: snowflake.id,
    invoiceId: bigIntToString('invoice_id').notNull(),
    type: typesEnum('type').notNull().default('item'),
    name: text().notNull(),
    description: text(),
    quantity: integer().notNull().default(1),
    price: bigint({ mode: 'number' }).notNull().default(0),
    tax: bigint({ mode: 'number' }).notNull().default(0),
  },
  (table) => [
    foreignKey({
      name: 'invoice_fk',
      columns: [table.invoiceId],
      foreignColumns: [invoices.id],
    }).onDelete('cascade'),
    index('invoiceItemIndex').on(table.invoiceId),
  ]
)
