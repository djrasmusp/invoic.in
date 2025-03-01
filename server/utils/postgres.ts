import postgres from 'postgres'

export function usePostgres() {
    const runtimeConfig = useRuntimeConfig()

    if(!runtimeConfig.database) {
        throw createError('Missing `NUXT_POSTGRES_URL` environment variable')
    }

    return postgres(runtimeConfig.database as string)
}