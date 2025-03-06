import { and, eq, getTableColumns, isNotNull, sql, isNull } from 'drizzle-orm'

export async function getCompanyById(
  id: string,
  withTrashed: boolean = false
): Promise<Company | null> {
  const selectedColumns = getTableColumns(tbl.companies)
  let prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.companies)
    .leftJoin(tbl.users, eq(tbl.users.id, tbl.companies.userId))
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
      .leftJoin(tbl.users, eq(tbl.users.id, tbl.companies.userId))
      .where(
        and(
          eq(tbl.companies.id, sql.placeholder('id')),
          isNotNull(tbl.companies.deletedAt)
        )
      )
      .prepare('get_company_by_id_with_trashed')
  }

  const [company] = await prepared.execute({ id: id })

  return company
}
