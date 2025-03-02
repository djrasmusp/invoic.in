import { eq } from 'drizzle-orm'

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await useDrizzle()
    .select()
    .from(tbl.users)
    .where(eq(tbl.users.email, email))
    .limit(1)
  return user
}

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await useDrizzle()
    .select()
    .from(tbl.users)
    .where(eq(tbl.users.id, id))
    .limit(1)
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
