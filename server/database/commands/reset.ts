import { reset } from 'drizzle-seed'
import { consola } from 'consola'
import { dbConnection } from './utils'
import { tbl } from '../../utils/drizzle'

async function main() {
  consola.start('Resetting database started...')
  await reset(dbConnection(), tbl)
}

main()
  .then(() => {
    consola.success('Resetting complete')
  })
  .catch((error) => {
    consola.error(error)
  })
  .finally(() => {
    process.exit(0)
  })
