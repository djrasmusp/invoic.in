import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export type User = typeof tbl.users.$inferSelect
export type InsertUser = typeof tbl.users.$inferInsert
export const selectUserSchema = createSelectSchema(tbl.users)
export const insertUserSchema = createInsertSchema(tbl.users)
