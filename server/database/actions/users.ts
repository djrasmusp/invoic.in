import { eq, getTableColumns } from 'drizzle-orm'
import { lower } from '../schemas'
import { WebAuthnCredential } from '#auth-utils'

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await useDrizzle()
    .select()
    .from(tbl.users)
    .where(eq(lower(tbl.users.email), email.toLowerCase()))
  return user
}

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await useDrizzle()
    .select()
    .from(tbl.users)
    .where(eq(tbl.users.id, id))
  return user
}

export async function getUserByCredential(
  credential: WebAuthnCredential
): Promise<User | null> {
  const selectedColumns = getTableColumns(tbl.users)

  const [user] = await useDrizzle()
    .select(selectedColumns)
    .from(tbl.credentials)
    .innerJoin(tbl.users, eq(tbl.users.id, tbl.credentials.userId))
    .where(eq(tbl.credentials.id, credential.id))

  return user
}

export async function createUser(payload: InsertUser): Promise<User> {
  const [user] = await useDrizzle()
    .insert(tbl.users)
    .values(payload)
    .returning()
  return user
}

export async function updateUser(id: string, payload: Partial<InsertUser>) {
  const [user] = await useDrizzle()
    .update(tbl.users)
    .set(payload)
    .where(eq(tbl.users.id, id))
    .returning()

  return user
}

export async function deleteUser(id: string): Promise<void> {
  await useDrizzle()
    .update(tbl.users)
    .set({ deletedAt: new Date() })
    .where(eq(tbl.users.id, id))
}
