import { reset } from 'drizzle-seed'
import { consola } from 'consola'

async function main() {
  consola.start('Resetting database started...')
  await reset(useDrizzle(), tbl)
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
