import { H3Event } from 'h3'
import { z } from 'zod'
import { getUserByEmail } from '~~/server/database/actions/users'
import { createCredential } from '~~/server/database/actions/credentials'

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(
    event: H3Event,
    challenge: string,
    attemptId: string
  ): Promise<void> {
    useStorage().setItem(`attempt:${attemptId}`, challenge)
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
  async validateUser(userBody, event: H3Event) {
    const session = await getUserSession(event)
    if (session.user?.email && session.user.email !== userBody.userName) {
      throw createError({
        statusCode: 400,
        message: 'Email not matching current session',
      })
    }

    return z
      .object({
        userName: z.string().email(),
      })
      .parse(userBody)
  },
  async onSuccess(event: H3Event, { credential, user }): Promise<void> {
    let dbUser = await getUserByEmail(user.userName)

    if (!dbUser)
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    await createCredential(dbUser, credential)

    await setUserSession(event, {
      user: {
        email: dbUser.email,
        webauthn: dbUser.email,
      },
      secure: {
        userId: dbUser.id,
      },
      loggedInAt: Date.now(),
    })
  },
})
