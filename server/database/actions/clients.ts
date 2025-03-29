import {
  and,
  eq,
  getTableColumns,
  sql,
  isNull,
  inArray,
  isNotNull,
} from 'drizzle-orm'
import type { Pagenation, PagenationParams } from '#shared/types'
import { primaryKeyTransformer } from '~~/server/database/utils'

export async function getClients({
  userId,
  currentPage = 1,
  perPage = 10,
  withTrashed = false,
}: PagenationParams): Promise<Pagenation<Client>> {
  let preparedCursor = useDrizzle()
    .select({
      id: tbl.clients.id,
      count: sql<number>`count(*) over()`,
    })
    .from(tbl.clients)
    .innerJoin(tbl.companies, eq(tbl.clients.companyId, tbl.companies.id))
    .where(
      and(
        eq(tbl.companies.userId, sql.placeholder('userId')),
        isNull(tbl.clients.deletedAt),
        isNull(tbl.companies.deletedAt)
      )
    )
    .offset(
      ((sql.placeholder('currentPage') as unknown as number) - 1) *
        (sql.placeholder('perPage') as unknown as number)
    )
    .limit(sql.placeholder('perPage'))
    .prepare('clients_cursor_keys')

  if (withTrashed) {
    preparedCursor = useDrizzle()
      .select({
        id: tbl.clients.id,
        count: sql<number>`count(*) over()`,
      })
      .from(tbl.clients)
      .innerJoin(tbl.companies, eq(tbl.clients.companyId, tbl.companies.id))
      .where(eq(tbl.companies.userId, sql.placeholder('userId')))
      .offset(
        ((sql.placeholder('currentPage') as unknown as number) - 1) *
          (sql.placeholder('perPage') as unknown as number)
      )
      .limit(sql.placeholder('perPage'))
      .prepare('clients_cursor_keys')
  }

  const cursor = await preparedCursor.execute({
    userId: userId,
    currentPage: Number(currentPage),
    perPage: Number(perPage),
  })

  const { cursorKeys, total } = primaryKeyTransformer(cursor)

  if (!cursorKeys.length)
    return {
      items: [],
      total,
      perPage,
      currentPage,
      lastPage: Math.ceil(total / perPage),
    }

  const selectedColumns = getTableColumns(tbl.clients)

  const prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.clients)
    .innerJoin(tbl.companies, eq(tbl.clients.companyId, tbl.companies.id))
    .where(inArray(tbl.clients.id, cursorKeys))
    .prepare('get_clients')

  const items = await prepared.execute()

  return {
    items,
    total,
    perPage,
    currentPage,
    lastPage: Math.ceil(total / perPage),
  }
}
