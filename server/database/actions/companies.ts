import {
  and,
  eq,
  getTableColumns,
  sql,
  isNull,
  inArray,
  isNotNull,
} from 'drizzle-orm'
import type { Pagenation, PagenationParams, Company } from '#shared/types'
import { primaryKeyTransformer } from '~~/server/database/utils'

export async function getCompanies({
  userId,
  currentPage = 1,
  perPage = 10,
  withTrashed = false,
}: PagenationParams): Promise<Pagenation<Company>> {
  let preparedCursor = useDrizzle()
    .select({
      id: tbl.companies.id,
      count: sql<number>`count(*) over()`,
    })
    .from(tbl.companies)
    .innerJoin(tbl.users, eq(tbl.companies.userId, tbl.users.id))
    .where(
      and(
        eq(tbl.companies.userId, sql.placeholder('userId')),
        isNull(tbl.companies.deletedAt)
      )
    )
    .offset(
      ((sql.placeholder('currentPage') as unknown as number) - 1) *
        (sql.placeholder('perPage') as unknown as number)
    )
    .limit(sql.placeholder('perPage'))
    .prepare('companies_cursor_keys')

  if (withTrashed) {
    preparedCursor = useDrizzle()
      .select({
        id: tbl.companies.id,
        count: sql<number>`count(*) over()`,
      })
      .from(tbl.companies)
      .innerJoin(tbl.users, eq(tbl.companies.userId, tbl.users.id))
      .where(eq(tbl.companies.userId, sql.placeholder('userId')))
      .offset(
        ((sql.placeholder('currentPage') as unknown as number) - 1) *
          (sql.placeholder('perPage') as unknown as number)
      )
      .limit(sql.placeholder('perPage'))
      .prepare('companies_cursor_keys_with_trashed')
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

  const selectedColumns = getTableColumns(tbl.companies)

  const prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.companies)
    .innerJoin(tbl.users, eq(tbl.companies.userId, tbl.users.id))
    .where(inArray(tbl.companies.id, cursorKeys))
    .prepare('get_companies')

  const items = await prepared.execute()

  return {
    items,
    total,
    perPage,
    currentPage,
    lastPage: Math.ceil(total / perPage),
  }
}

export async function getCompanyById(
  id: string,
  withTrashed: boolean = false
): Promise<Company | null> {
  const selectedColumns = getTableColumns(tbl.companies)
  let prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.companies)
    .innerJoin(tbl.users, eq(tbl.users.id, tbl.companies.userId))
    .where(
      and(
        eq(tbl.companies.id, sql.placeholder('id')),
        isNull(tbl.companies.deletedAt)
      )
    )
    .prepare('get_company_by_id')

  if (withTrashed) {
    prepared = useDrizzle()
      .select(selectedColumns)
      .from(tbl.companies)
      .innerJoin(tbl.users, eq(tbl.users.id, tbl.companies.userId))
      .where(eq(tbl.companies.id, sql.placeholder('id')))
      .prepare('get_company_by_id_with_trashed')
  }

  const [company] = await prepared.execute({ id: id })

  return company
}

export async function createCompany(
  userId: string,
  payload: InsertCompany
): Promise<Company> {
  const prepared = useDrizzle()
    .insert(tbl.companies)
    .values({
      name: sql.placeholder('name'),
      address: sql.placeholder('address'),
      postalCode: sql.placeholder('postalCode'),
      city: sql.placeholder('city'),
      phone: sql.placeholder('phone'),
      identity: sql.placeholder('identity'),
      logo: sql.placeholder('logo'),
      userId: sql.placeholder('userId'),
    })
    .returning()
    .prepare('create_company')

  const [user] = await prepared.execute({
    name: payload.name,
    address: payload.address,
    postalCode: payload.postalCode,
    city: payload.city,
    phone: payload.phone,
    identity: payload.identity,
    logo: payload.logo,
    userId: userId,
  })

  return user
}

export async function updateCompany(
  id: string,
  payload: Partial<InsertCompany>
) {
  const prepared = useDrizzle()
    .update(tbl.companies)
    .set({
      name: sql.placeholder('name') as unknown as string,
      address: sql.placeholder('address') as unknown as string,
      postalCode: sql.placeholder('postalCode') as unknown as string,
      city: sql.placeholder('city') as unknown as string,
      phone: sql.placeholder('phone') as unknown as string,
      identity: sql.placeholder('identity') as unknown as string,
      logo: sql.placeholder('logo') as unknown as string,
    })
    .where(eq(tbl.companies.id, sql.placeholder('id')))
    .returning()
    .prepare('update_company')

  const [company] = await prepared.execute({
    name: payload.name,
    address: payload.address,
    postalCode: payload.postalCode,
    city: payload.city,
    phone: payload.phone,
    identity: payload.identity,
    logo: payload.logo,
  })

  return company
}

export async function deleteCompany(
  id: string,
  forceDelete: boolean = false
): Promise<Company> {
  if (forceDelete) {
    const prepared = useDrizzle()
      .delete(tbl.companies)
      .where(
        and(
          eq(tbl.companies.id, sql.placeholder('id')),
          isNotNull(tbl.companies.deletedAt)
        )
      )
      .returning()
      .prepare('force_delete_company')

    const [company] = await prepared.execute({ id: id })

    return company
  }

  const prepared = useDrizzle()
    .update(tbl.companies)
    .set({
      deletedAt: sql.placeholder('deletedAt') as unknown as Date,
    })
    .where(eq(tbl.companies.id, sql.placeholder('id')))
    .returning()
    .prepare('delete_company')

  const [company] = await prepared.execute({ deletedAt: new Date(), id: id })

  return company
}
