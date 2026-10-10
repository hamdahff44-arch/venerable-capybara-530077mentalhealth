import { createServerFn } from '@tanstack/react-start'
import { getUser } from '@netlify/identity'
import { and, desc, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { submissions } from '../../db/schema.js'
import {
  CATEGORIES,
  GRATITUDE_CATEGORIES,
  MESSAGE_MAX,
  NAME_MAX,
  PARTICIPANT_TYPES,
  STATUSES,
  WALL_CATEGORIES,
} from './options'

export type PublicEntry = {
  id: number
  name: string | null
  participantType: string
  category: string
  recipient: string | null
  message: string
  hearts: number
  createdAt: string
}

export type AdminEntry = PublicEntry & { status: string; reviewedAt: string | null }

const keys = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]]

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null))

const submissionInput = z.object({
  name: optionalText(NAME_MAX),
  participantType: z.enum(keys(PARTICIPANT_TYPES)),
  category: z.enum(keys(CATEGORIES)),
  recipient: optionalText(NAME_MAX),
  message: z.string().trim().min(3).max(MESSAGE_MAX),
  // Honeypot field: real visitors never fill it in.
  website: z.string().optional(),
})

function toPublic(row: typeof submissions.$inferSelect): PublicEntry {
  return {
    id: row.id,
    name: row.name,
    participantType: row.participantType,
    category: row.category,
    recipient: row.recipient,
    message: row.message,
    hearts: row.hearts,
    createdAt: row.createdAt.toISOString(),
  }
}

export const submitEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => submissionInput.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }
    await db.insert(submissions).values({
      name: data.name,
      participantType: data.participantType,
      category: data.category,
      recipient: data.category === 'gratitude' ? data.recipient : null,
      message: data.message,
      status: 'pending',
    })
    return { ok: true }
  })

export const getPublishedEntries = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.status, 'approved'),
        inArray(submissions.category, [...WALL_CATEGORIES, ...GRATITUDE_CATEGORIES]),
      ),
    )
    .orderBy(desc(submissions.reviewedAt))
    .limit(120)
  const entries = rows.map(toPublic)
  return {
    wall: entries.filter((e) => (WALL_CATEGORIES as string[]).includes(e.category)),
    gratitude: entries.filter((e) => (GRATITUDE_CATEGORIES as string[]).includes(e.category)),
  }
})

export const sendHeart = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.number().int().positive() }).parse(data))
  .handler(async ({ data }) => {
    const [row] = await db
      .update(submissions)
      .set({ hearts: sql`${submissions.hearts} + 1` })
      .where(and(eq(submissions.id, data.id), eq(submissions.status, 'approved')))
      .returning({ hearts: submissions.hearts })
    return { hearts: row?.hearts ?? 0 }
  })

// ---- Administrator-only functions -------------------------------------------

async function requireAdmin() {
  const user = await getUser()
  if (!user) throw new Error('UNAUTHENTICATED')
  if (!user.roles?.includes('admin')) throw new Error('FORBIDDEN')
  return user
}

export const getAdminEntries = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  const rows = await db.select().from(submissions).orderBy(desc(submissions.createdAt)).limit(500)
  return rows.map(
    (row): AdminEntry => ({
      ...toPublic(row),
      status: row.status,
      reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    }),
  )
})

export const setEntryStatus = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z.object({ id: z.number().int().positive(), status: z.enum(keys(STATUSES)) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin()
    await db
      .update(submissions)
      .set({ status: data.status, reviewedAt: data.status === 'pending' ? null : new Date() })
      .where(eq(submissions.id, data.id))
    return { ok: true }
  })

export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => z.object({ id: z.number().int().positive() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin()
    await db.delete(submissions).where(eq(submissions.id, data.id))
    return { ok: true }
  })
