import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export type User = typeof tbl.users.$inferSelect
export type InsertUser = typeof tbl.users.$inferInsert
export const selectUserSchema = createSelectSchema(tbl.users)
export const insertUserSchema = createInsertSchema(tbl.users)

export type Credential = typeof tbl.credentials.$inferSelect
export type InsertCredential = typeof tbl.credentials.$inferInsert
export const selectCredentialSchema = createSelectSchema(tbl.credentials)
export const insertCredentialSchema = createInsertSchema(tbl.credentials)

export type Company = typeof tbl.companies.$inferSelect
export type InsertCompany = typeof tbl.companies.$inferInsert
export const selectCompanySchema = createSelectSchema(tbl.companies)
export const insertCompanySchema = createInsertSchema(tbl.companies)

export type Client = typeof tbl.clients.$inferSelect
export type InsertClient = typeof tbl.clients.$inferInsert
export const selectClientSchema = createSelectSchema(tbl.clients)
export const insertClientSchema = createInsertSchema(tbl.clients)

export interface Pagenation<T> {
  items: T[]
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export interface PagenationParams {
  userId: string
  currentPage?: number
  perPage?: number
  withTrashed?: boolean
}
