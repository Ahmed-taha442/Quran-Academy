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
