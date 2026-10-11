# أثر طيب لصحة نفسية أفضل 💗

The website for the mental well-being initiative at **Al-Fuwailiq Elementary School (ابتدائية الفويلق)**. It is fully in Arabic with a right-to-left layout and works on phones, tablets and desktops.

## What's on the site

- **Homepage**: the welcome hero and an introduction to the initiative.
- **About the initiative (عن المبادرة)**: emotional well-being, kindness, positive communication, self-awareness and a supportive school environment.
- **Mental well-being corner (ركن الصحة النفسية)**: an animated breathing exercise, a "how do you feel today?" check-in, tips for managing emotions, and flip cards for positive self-talk.
- **Positive impact wall (جدار الأثر الطيب)**: automatically published submissions from all five categories, with category filters, a "random kind word" button, and hearts that visitors can send.
- **Gratitude corner (ركن الامتنان)**: a thank-you form and automatically published thank-you notes.
- **Participation form (شاركي معنا)**: optional name, participant type, category (kind word, encouragement, gratitude, activity idea, suggestion) and message.
- **School activities (الأنشطة)**: school activity ideas, visitor-submitted activity ideas, and an interactive 7-day kindness challenge. Progress is saved in the visitor's browser.
- **Privacy and safety (الخصوصية)**: clear notice of immediate public publishing, post-publication admin review, and why sensitive information is never collected.
- **Admin review panel (`/admin`)**: a protected page for reviewing, publishing, hiding, deleting and exporting submissions.

## Netlify Forms (`athar-tayeb`)

Every submission from the participation form and the gratitude form is saved in Netlify Database first. The form also attempts to save an additional copy in **Netlify Forms** under the form name `athar-tayeb`. A database failure displays an error rather than claiming publication; a Forms-copy failure does not prevent database publication. Netlify detects the form at build time from the static file `public/__forms.html`, and the React form in `src/components/EntryForm.tsx` posts to that path with `fetch`. If you add or rename a field, update both files so the names match.

To read submissions: Netlify dashboard → this project → **Forms** → **athar-tayeb**. Each entry has the name (or «بدون اسم»), participant type, category, message and send date.

## How automatic publishing works

1. Every new submission is saved in the existing Netlify Database with the status **approved** and becomes public immediately. The page refreshes its public entries after a successful submission.
2. Existing **pending** submissions are public too, without rewriting their statuses, messages, or review history. **Rejected** submissions remain hidden and cannot receive public hearts.
3. All five categories appear on the wall and in its filters. Gratitude also appears in the gratitude corner, and activity ideas also appear in the school activities section. Public queries have no entry-count limit and show the newest submissions first.
4. Admins still sign in at `/admin` to review, hide, republish, delete, or export submissions. Marking an entry **pending** means it is unreviewed but still public; only **rejected** hides it. No existing data or migrations need to be changed for this policy.

### Setting up the first administrator

1. In the Netlify dashboard, open **Identity** for this project and click **Invite users**. Enter the reviewer's email.
2. The reviewer opens the invite email and picks a password on the `/admin` page.
3. Back in **Identity**, click the user and add the role **`admin`** under **Roles**.
4. Recommended: under **Project configuration → Identity**, set **Registration** to **Invite only** so nobody else can create an account.

The reviewer can then sign in at `/admin` (there is also a link in the footer).

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions)
- Tailwind CSS 4, with the fonts El Messiri, Tajawal and Aref Ruqaa
- Netlify Database (managed Postgres) with Drizzle ORM
- Netlify Identity (`@netlify/identity`) for admin sign-in and the `admin` role
- Netlify Image CDN for the watercolor illustrations in `public/img`

## Running locally

```bash
pnpm install
netlify dev
```

`netlify dev` provides the local database. Admin sign-in only works on a deployed Netlify site, because Identity isn't available on localhost.

When you change the database schema in `db/schema.ts`, generate a migration:

```bash
npx drizzle-kit generate --name <describe_change>
```

Migrations in `netlify/database/migrations/` are applied automatically on deploy.
