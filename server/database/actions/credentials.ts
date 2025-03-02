import { WebAuthnCredential } from '#auth-utils'
import { VerifiedAuthenticationResponse } from '@simplewebauthn/server'
import { eq, getTableColumns } from 'drizzle-orm'
import { lower } from '../schemas'

export async function getCredentialByEmail(
  email: string
): Promise<Credential | null> {
  const selectedColumns = getTableColumns(tbl.credentials)

  const [credential] = await useDrizzle()
    .select(selectedColumns)
    .from(tbl.users)
    .leftJoin(tbl.credentials, eq(tbl.credentials.userId, tbl.users.id))
    .where(eq(lower(tbl.users.email), email.toLowerCase()))

  return credential
}

export async function getCredentialById(
  credentialId: string
): Promise<Credential | null> {
  const [credential] = await useDrizzle()
    .select()
    .from(tbl.credentials)
    .where(eq(tbl.credentials.id, credentialId))

  return credential
}

export async function createCredential(
  user: User,
  credential: WebAuthnCredential
): Promise<void> {
  await useDrizzle()
    .insert(tbl.credentials)
    .values({
      userId: user.id as unknown as bigint,
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
  await useDrizzle()
    .update(tbl.credentials)
    .set({ counter: authenticationInfo.newCounter })
    .where(eq(tbl.credentials.id, credential.id))
}
