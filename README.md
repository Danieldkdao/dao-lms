# Dao LMS

A modern learning management system built with Next.js. Dao LMS supports public course discovery, Stripe-powered enrollment, learner dashboards, lesson progress, and an admin workspace for managing courses, chapters, lessons, media, and analytics.

## Features

- Public course catalog with course detail pages
- Email and OAuth authentication with Better Auth
- Role-based admin and learner dashboards
- Course, chapter, and lesson management
- Drag-and-drop ordering for chapters and lessons
- Rich markdown lesson content with TipTap editing
- Markdown tables in the editor and renderer
- Video and image uploads through S3-compatible storage
- Stripe checkout and webhook-based enrollment
- Learner progress tracking
- Admin analytics with enrollment charts

## Project Management

- [DaoLMS Notion task list](https://www.notion.so/351b3d6d3d6f80b7a4cce92dbb1f93f1?v=352b3d6d3d6f80808d99000c27d12eb1)

## Tech Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- Neon Postgres
- Better Auth
- Stripe
- Tigris/S3-compatible object storage
- TipTap
- Recharts
- shadcn-style UI components

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env` file in the project root and fill in the required variables:

```bash
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=

TIGRIS_STORAGE_ACCESS_KEY_ID=
TIGRIS_STORAGE_SECRET_ACCESS_KEY=
TIGRIS_STORAGE_ENDPOINT=
TIGRIS_STORAGE_BUCKET=
NEXT_PUBLIC_TIGRIS_STORAGE_BUCKET=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=
```

Push the database schema:

```bash
pnpm db:push
```

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # Start the local dev server
pnpm build        # Build the production app
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm db:push      # Push Drizzle schema changes
pnpm db:migrate   # Run Drizzle migrations
pnpm db:generate  # Generate Drizzle migration files
pnpm db:studio    # Open Drizzle Studio
```

## Stripe Webhooks

Enrollments are written from Stripe webhook events after checkout succeeds. In local development, forward Stripe events to:

```bash
/api/webhooks/stripe
```

The webhook must send `checkout.session.completed` events and use the same signing secret stored in `STRIPE_WEBHOOK_SECRET`.

## Project Structure

```txt
src/app                App Router routes and API handlers
src/components         Shared UI, dashboard, auth, and markdown components
src/db                 Drizzle database setup and schemas
src/features           Feature modules for courses, chapters, lessons, enrollments
src/lib                Auth, actions, utilities, and emails
src/services           Stripe and storage integrations
```

## Dashboards

- `/admin` shows analytics and recent courses.
- `/admin/courses` manages course creation, editing, deletion, chapters, and lessons.
- `/dashboard` shows enrolled and available courses for learners.
- `/dashboard/[courseId]/[lessonId]` is the lesson player experience.

## Notes

- Course purchases depend on valid Stripe price IDs created for each course.
- Uploaded media is stored in the configured S3-compatible bucket.
- Lesson descriptions are stored as markdown and rendered safely through the project markdown renderer.
