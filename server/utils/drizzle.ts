import * as schema from "@@/server/database/schemas"
import { drizzle } from 'drizzle-orm/postgres-js'
import {usePostgres} from "~~/server/utils/postgres";

export const tbl = schema

export function useDrizzle() {
    return drizzle(usePostgres(), {schema, logger: true})
}