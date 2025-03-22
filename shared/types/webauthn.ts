import type { GenerateAuthenticationOptionsOpts } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types'

export interface WebAuthnUser {
  userName: string
  displayName?: string

  [key: string]: unknown
}

export type CredentialsList = NonNullable<
  GenerateAuthenticationOptionsOpts['allowCredentials']
>

export interface WebAuthnCredential {
  id: string
  publicKey: string
  counter: number
  backedUp: boolean
  transports?: AuthenticatorTransportFuture[]

  [key: string]: unknown
}
