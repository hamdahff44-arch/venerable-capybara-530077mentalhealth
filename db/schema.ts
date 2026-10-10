import { integer, pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core'

// Every public-facing submission starts as "pending" and only becomes visible
// on the site after an administrator approves it.
export const submissions = pgTable(
  'submissions',
  {
    id: serial().primaryKey(),
    name: text(),
    participantType: text('participant_type').notNull(),
    category: text().notNull(),
    recipient: text(),
    message: text().notNull(),
    status: text().notNull().default('pending'),
    hearts: integer().notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  (t) => [index('submissions_status_category_idx').on(t.status, t.category)],
)

export type Submission = typeof submissions.$inferSelect
