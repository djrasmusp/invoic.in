import { getUserByEmail } from '~~/server/database/actions/users'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  //await requireUserSession(event)

  try {
    const response = await getUserByEmail(
      'rocketing_joseth@hotmail.co.uk',
      true
    )

    if (!response) return setResponseStatus(event, 404, 'Not Found')

    return response
  } catch (error) {
    consola.error(error)
  }
})
