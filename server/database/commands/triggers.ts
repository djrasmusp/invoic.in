import { consola } from 'consola'
import { sql } from 'drizzle-orm'

const triggerInvoiceTotalsAfterInsert = sql`
    CREATE TRIGGER update_invoice_totals_after_insert
        AFTER INSERT
        ON invoice_items
        FOR EACH ROW
    BEGIN
        UPDATE invoices
        SET total_amount = (SELECT SUM(total_price) FROM invoice_items WHERE invoice_id = NEW.invoice_id),
            total_tax    = (SELECT SUM(tax) FROM invoice_items WHERE invoice_id = NEW.invoice_id)
        WHERE id = NEW.invoice_id;
    END;`

const triggerInvoiceTotalsAfterUpdate = sql`
    CREATE TRIGGER update_invoice_totals_after_update
        AFTER UPDATE
        ON invoice_items
        FOR EACH ROW
    BEGIN
        UPDATE invoices
        SET total_amount = (SELECT SUM(total_price) FROM invoice_items WHERE invoice_id = NEW.invoice_id),
            total_tax    = (SELECT SUM(tax) FROM invoice_items WHERE invoice_id = NEW.invoice_id)
        WHERE id = NEW.invoice_id;
    END;
`

async function main() {
  consola.start('Start adding database triggers...')

  await useDrizzle()
    .execute(triggerInvoiceTotalsAfterInsert)
    .then(() => {
      consola.info('Added trigger: Invoice Totals after INSERT')
    })
    .catch((error) => {
      consola.error(error)
    })

  await useDrizzle()
    .execute(triggerInvoiceTotalsAfterUpdate)
    .then(() => {
      consola.info('Added trigger: Invoice Totals after UPDATE')
    })
    .catch((error) => {
      consola.error(error)
    })
}

main()
  .then(() => {
    consola.success('Successfully added database triggers')
  })
  .catch((error) => {
    consola.error(error)
  })
  .finally(() => {
    process.exit(0)
  })
