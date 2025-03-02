import 'dotenv/config'
import { seed } from 'drizzle-seed'
import { consola } from 'consola'
import { seedArrayOfSnowflakeIds } from '~~/server/database/utils/seed'
import { tbl } from '../../utils/drizzle'
import { dbConnection } from './utils'

async function main() {
  consola.start('Seeding started...')
  await seed(dbConnection(), tbl).refine((f) => ({
    users: {
      count: 10,
      columns: {
        ...primaryKeyId(f),
        email: f.email(),
        ...softDeleteColumns(f),
      },
    },
  }))
}

const primaryKeyId = (f: {
  valuesFromArray(args: { values: number[]; isUnique: boolean }): object
}): { id: object } => {
  return {
    id: f.valuesFromArray({
      values: seedArrayOfSnowflakeIds(5000),
      isUnique: true,
    }),
  }
}

const softDeleteColumns = (f: {
  timestamp(): object
  default(args: { defaultValue: null }): object
  datetime(): object
  weightedRandom(args: { weight: number; value: object }[]): object
}): { createdAt: object; updatedAt: object; deletedAt: object } => {
  return {
    createdAt: f.timestamp(),
    updatedAt: f.weightedRandom([
      {
        weight: 0.7,
        value: f.default({
          defaultValue: null,
        }),
      },
      {
        weight: 0.3,
        value: f.datetime(),
      },
    ]),
    deletedAt: f.weightedRandom([
      {
        weight: 0.9,
        value: f.default({
          defaultValue: null,
        }),
      },
      {
        weight: 0.1,
        value: f.datetime(),
      },
    ]),
  }
}

main()
  .then(() => {
    consola.success('Seeding finished!')
  })
  .catch((error) => {
    consola.error(error)
  })
  .finally(() => {
    process.exit(0)
  })
