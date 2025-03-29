import { and, eq, getTableColumns, sql, isNull, isNotNull } from 'drizzle-orm'
import { lower } from '../schemas'
import type { WebAuthnCredential } from '#auth-utils'

export async function getUserByEmail(
  email: string,
  withTrashed: boolean = false
): Promise<User | null> {
  let prepared = useDrizzle()
    .select()
    .from(tbl.users)
    .where(
      and(
        eq(lower(tbl.users.email), sql.placeholder('email')),
        isNull(tbl.users.deletedAt)
      )
    )
    .prepare('get_user_by_email')

  if (withTrashed) {
    prepared = useDrizzle()
      .select()
      .from(tbl.users)
      .where(eq(lower(tbl.users.email), sql.placeholder('email')))
      .prepare('get_user_by_email_with_trashed')
  }

  const [user] = await prepared.execute({ email: email.toLowerCase() })

  return user
}

export async function getUserById(
  id: string,
  withTrashed: boolean = false
): Promise<User | null> {
  let prepared = useDrizzle()
    .select()
    .from(tbl.users)
    .where(
      and(eq(tbl.users.id, sql.placeholder('id')), isNull(tbl.users.deletedAt))
    )
    .prepare('get_user_by_id')

  if (withTrashed) {
    prepared = useDrizzle()
      .select()
      .from(tbl.users)
      .where(eq(tbl.users.id, sql.placeholder('id')))
      .prepare('get_user_by_id_with_trashed')
  }

  const [user] = await prepared.execute({ id: id })

  return user
}

export async function getUserByCredential(
  credential: WebAuthnCredential,
  withTrashed: boolean = false
): Promise<User | null> {
  const selectedColumns = getTableColumns(tbl.users)

  let prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.credentials)
    .innerJoin(tbl.users, eq(tbl.users.id, tbl.credentials.userId))
    .where(
      and(
        eq(tbl.credentials.id, sql.placeholder('id')),
        isNull(tbl.users.deletedAt)
      )
    )
    .prepare('get_user_by_credential')

  if (withTrashed) {
    prepared = useDrizzle()
      .select(selectedColumns)
      .from(tbl.credentials)
      .innerJoin(tbl.users, eq(tbl.users.id, tbl.credentials.userId))
      .where(eq(tbl.credentials.id, sql.placeholder('id')))
      .prepare('get_user_by_credential_with_trashed')
  }

  const [user] = await prepared.execute({ id: credential.id })

  return user
}

export async function createUser(payload: InsertUser): Promise<User> {
  const prepared = useDrizzle()
    .insert(tbl.users)
    .values({
      email: sql.placeholder('email'),
      password: sql.placeholder('password'),
    })
    .returning()
    .prepare('create_user')

  const [user] = await prepared.execute({
    email: payload.email,
    password: await hashPassword(payload.password),
  })

  return user
}

export async function updateUser(id: string, payload: Partial<InsertUser>) {
  const prepared = useDrizzle()
    .update(tbl.users)
    .set({
      email: sql.placeholder('email') as unknown as string,
      password: sql.placeholder('password') as unknown as string,
    })
    .where(eq(tbl.credentials.id, sql.placeholder('id')))
    .returning()
    .prepare('update_user')

  const [user] = await prepared.execute({
    email: payload.email,
    password: payload.password,
  })

  return user
}

export async function deleteUser(
  id: string,
  forceDelete: boolean = false
): Promise<User> {
  if (forceDelete) {
    const prepared = useDrizzle()
      .delete(tbl.users)
      .where(
        and(
          eq(tbl.users.id, sql.placeholder('id')),
          isNotNull(tbl.users.deletedAt)
        )
      )
      .returning()
      .prepare('force_delete_user')

    const [user] = await prepared.execute({ id: id })

    return user
  }

  const prepared = useDrizzle()
    .update(tbl.users)
    .set({
      deletedAt: sql.placeholder('deletedAt') as unknown as Date,
    })
    .where(eq(tbl.users.id, sql.placeholder('id')))
    .returning()
    .prepare('delete_user')

  const [user] = await prepared.execute({
    deletedAt: new Date(),
    id: id,
  })

  return user
}
