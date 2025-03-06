import { WebAuthnCredential } from '#auth-utils'
import { VerifiedAuthenticationResponse } from '@simplewebauthn/server'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { lower } from '../schemas'
import { type Credential } from '@@/shared/types'

export async function getCredentialByEmail(
  email: string
): Promise<Credential | null> {
  const selectedColumns = getTableColumns(tbl.credentials)

  const prepared = useDrizzle()
    .select(selectedColumns)
    .from(tbl.credentials)
    .leftJoin(tbl.users, eq(tbl.credentials.userId, tbl.users.id))
    .where(eq(lower(tbl.users.email), sql.placeholder('email')))

  const [credential] = await prepared.execute({ email: email.toLowerCase() })

  return credential
}

export async function getCredentialById(
  id: string
): Promise<Credential | null> {
  const prepared = useDrizzle()
    .select()
    .from(tbl.credentials)
    .where(eq(tbl.credentials.id, sql.placeholder('id')))

  const [credential] = await prepared.execute({ id: id })

  return credential
}

export async function createCredential(
  user: User,
  credential: WebAuthnCredential
): Promise<void> {
  const prepared = useDrizzle()
    .insert(tbl.credentials)
    .values({
      userId: sql.placeholder('userId'),
      id: sql.placeholder('id'),
      publicKey: sql.placeholder('publicKey'),
      counter: sql.placeholder('counter'),
      backedUp: sql.placeholder('backedUp'),
      transports: sql.placeholder('transports'),
    })

  await prepared.execute({
    userId: user.id,
    id: credential.id,
    publicKey: credential.publicKey,
    counter: credential.counter,
    backedUp: credential.backedUp ? 1 : 0,
    transports: JSON.stringify(credential.transports ?? []),
  })
}

export async function updateCredential(
  credential: WebAuthnCredential,
  authenticationInfo: VerifiedAuthenticationResponse['authenticationInfo']
): Promise<void> {
  const prepared = useDrizzle()
    .update(tbl.credentials)
    .set({
      counter: sql.placeholder('counter') as unknown as number,
    })
    .where(eq(tbl.credentials.id, sql.placeholder('id')))

  await prepared.execute({
    counter: authenticationInfo.newCounter,
    id: credential.id,
  })
}
