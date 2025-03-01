import { seed } from 'drizzle-seed'
import { consola } from 'consola'

async function main() {
  consola.start('Seeding started...')
  await seed(useDrizzle(), tbl).refine((f) => ({}))
}

main().then(() => {
  consola.suc
})
