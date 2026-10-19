# Accadmy — Quran & Noor Al-Bayan

Academy website structure for teaching **the Holy Quran** and **Noor Al-Bayan** to **non-Arabic speakers (أعاجم)**.

## Why this shape

- **Literacy before tajweed:** Noor Al-Bayan first, then Mushaf reading, then tajweed, then hifz.
- **Locales + RTL:** `en`, `ar`, `ur`, `fr`, `id`, `tr` with `dir` set from locale.
- **Roles:** student, teacher, admin, guardian — separate route groups.
- **Domain modules:** UI routes stay thin; Quran, Noor Bayan, progress, and media live under `src/modules`.
- **Audio-first:** media types are first-class (letter clips, ayah recitation, teacher notes).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Authentication and database

- Authentication uses Better Auth with PostgreSQL via Prisma. New self-service accounts receive the `STUDENT` role; teacher, guardian, and admin roles must be assigned by a trusted administrator.
- The Mushaf page requires an authenticated session. Unauthenticated visitors are sent to sign in and returned to the requested page afterward; the signed-in name is shown in the site header.
- Copy `.env.example` to `.env.local`, generate a unique `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), and set `DATABASE_URL` and `BETTER_AUTH_URL`.
- For Google login, create a Google OAuth web client and add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` on the server; never expose the secret with a `NEXT_PUBLIC_` prefix.
- Production email/password accounts require email verification. Configure `RESEND_API_KEY` and `AUTH_EMAIL_FROM` for verification and password reset email delivery.
- Apply the schema locally with `npm run db:migrate`, then generate the Prisma client with `npm run db:generate`. Deploy an existing migration with `npm run db:migrate:deploy`.
- Do not commit `.env.local` or real OAuth, database, auth, or email secrets.

## Folder map

```text
src/app/[locale]/          # pages (marketing, auth, learn, role dashboards)
                           # /student /teacher /admin are unique URLs inside route groups
src/modules/               # domain logic (quran, noor-bayan, learning, identity, progress, media, live-sessions)
src/components/            # shared UI
src/config/                # site + pedagogical order
src/i18n/                  # next-intl routing
messages/                  # UI copy per language
content/                   # curriculum JSON (CMS-ready)
prisma/schema.prisma       # data model for later
```

## Next implementation steps

1. Auth (students / teachers / guardians)
2. Letter board + tracing + audio for Noor Al-Bayan
3. Mushaf viewer with ayah audio
4. Teacher recitation review
5. Postgres + Prisma from `prisma/schema.prisma`
