import { getUserByEmail } from '~~/server/database/actions/users'
import { z } from 'zod'
import { AuthLoginFormSchema } from '#shared/schemas'

const invalidCredentialsError = createError({
  statusCode: 401,
  message: 'Invalid Credentials',
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    AuthLoginFormSchema.parse
  )

  const user = await getUserByEmail(email)

  if (!user) {
    throw invalidCredentialsError
  }

  if (!(await verifyPassword(user.password, password))) {
    throw invalidCredentialsError
  }

  await setUserSession(event, {
    user: {
      email: user.email,
    },
    secure: {
      userId: user.id,
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})
