import { consola } from 'consola'
import { getCompanies } from '~~/server/database/actions/companies'

export default defineEventHandler(async (event) => {
  //await requireUserSession(event)

  try {
    const response = await getCompanies({
      userId: '7296569609964749436',
      currentPage: 5,
      perPage: 3,
    })

    return response

    if (!response.items.length)
      return setResponseStatus(event, 404, 'Not Found')

    return response
  } catch (error) {
    consola.error(error)
  }
})
