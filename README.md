# MLBuilder

Fullstack web application built with Next.js 14+ App Router, Prisma ORM, PostgreSQL, and NextAuth.js.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Database ORM:** Prisma
- **Database:** PostgreSQL (run locally via Docker Compose)
- **Authentication:** NextAuth.js v5 (Credentials Email/Password Provider)
- **Styling:** Tailwind CSS v4 (PostCSS config)
- **Analytics:** PostHog

---

## Getting Started (First-Time Setup)

Follow these steps in order to spin up the local development environment:

1. **Clone the Repository & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy the example variables to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Generate a NextAuth secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - Update `.env.local` with the generated secret and any additional API keys.

3. **Start PostgreSQL Database:**
   - Start the containerized PostgreSQL database using Docker Compose:
     ```bash
     npm run db:start
     ```

4. **Initialize Database Schema:**
   - Run Prisma migrations to set up schema tables:
     ```bash
     npm run db:migrate
     ```
   - Seed the database with default lead magnets:
     ```bash
     npx prisma db seed
     ```

5. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Daily Development Workflow

1. Start database: `npm run db:start`
2. Start development server: `npm run dev`
3. Access Prisma Studio (DB explorer) if needed: `npm run db:studio`

---

## Command Reference

- `npm run dev` — Boot Next.js dev server on port 3000 (handles UI + API routes)
- `npm run build` — Build production bundles
- `npm run start` — Run production server
- `npm run db:start` — Start PostgreSQL Docker container
- `npm run db:stop` — Stop PostgreSQL Docker container
- `npm run db:migrate` — Run schema migrations locally
- `npm run db:seed` — Seed default database items
- `npm run db:studio` — Open local database admin panel (gui)
- `npm run dev:all` — Start database and Next.js in a single terminal (using concurrently)

---

## Migration Details
This project was migrated from a client-side React + Vite architecture on June 28, 2026. See [MIGRATION_AUDIT.md](file:///d:/Movies/mlbuilder/MIGRATION_AUDIT.md) for full details and checklists.
To roll back or reference legacy code, refer to the [legacy-vite-backup](file:///d:/Movies/mlbuilder/legacy-vite-backup) directory or the git commit history.
