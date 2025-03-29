import { z } from 'zod'
import { createUser } from '~~/server/database/actions/users'
import { AuthLoginFormSchema } from '#shared/schemas'

defineRouteMeta({
  openAPI: {
    description: 'Create a new user',
    parameters: [
      {
        in: 'query',
        name: 'email',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'password',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      201: {
        description: 'User created successfully.',
      },
    },
  },
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    AuthLoginFormSchema.parse
  )

  const hashedPassword = await hashPassword(password)

  const user = await createUser({ email: email, password: hashedPassword })

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
