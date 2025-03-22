import type { H3Event } from 'h3'
import type { WebAuthnCredential } from '#shared/types'
import {
  getCredentialByEmail,
  getCredentialById,
  updateCredential,
} from '~~/server/database/actions/credentials'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types'
import { getUserByCredential } from '~~/server/database/actions/users'
import type { VerifiedAuthenticationResponse } from '@simplewebauthn/server'

export default defineWebAuthnAuthenticateEventHandler({
  async storeChallenge(
    event: H3Event,
    challenge: string,
    attemptId: string
  ): Promise<void> {
    await useStorage().setItem(`attempt:${attemptId}`, challenge)
  },
  async getChallenge(event: H3Event, attemptId: string): Promise<string> {
    const challenge = (await useStorage().getItem(`attempt:${attemptId}`)) as
      | string
      | null
    await useStorage().removeItem(`attempt:${attemptId}`)

    if (!challenge)
      throw createError({ statusCode: 400, message: 'Challenge expired' })

    return challenge
  },
  async allowCredentials(
    event: H3Event,
    userName: string
  ): Promise<CredentialsList> {
    const credential = await getCredentialByEmail(userName)

    if (!credential)
      throw createError({ statusCode: 400, message: 'User not found' })

    return [
      {
        id: credential.id,
        transports:
          credential.transports as unknown as AuthenticatorTransportFuture[],
      },
    ]
  },
  async getCredential(
    event: H3Event,
    credentialId: string
  ): Promise<WebAuthnCredential> {
    const credential = await getCredentialById(credentialId)

    if (!credential)
      throw createError({
        statusCode: 400,
        message: 'Credential does not exist',
      })

    return {
      ...credential,
      backedUp: Boolean(credential.backedUp),
      transports: JSON.parse(credential.transports),
    }
  },
  async onSuccess(
    event: H3Event,
    {
      credential,
      authenticationInfo,
    }: {
      credential: WebAuthnCredential
      authenticationInfo: VerifiedAuthenticationResponse['authenticationInfo']
    }
  ): Promise<void> {
    const user = await getUserByCredential(credential)

    if (!user) throw createError({ statusCode: 400, message: 'User not found' })

    await updateCredential(credential, authenticationInfo)

    await setUserSession(event, {
      user: {
        email: user.email,
        webauthn: user.email,
      },
      secure: {
        userId: user.id,
      },
      loggedInAt: Date.now(),
    })
  },

  //async onError(event: H3Event, error: H3Error): Promise<void> {},
})
