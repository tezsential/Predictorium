# Predictorium - Development Context

## Project Overview
F1 Season Predictor - Users predict driver and constructor championship standings before season lockdown (March 1st)

## Technical Stack
- **Framework**: Next.js 16.1.1
- **React**: 19.2.3
- **TypeScript**: ^5
- **Styling**: TailwindCSS ^4
- **Linting**: ESLint ^9

## Project Structure
```
predictorium/
├── app/                  # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/              # Static assets
├── docs/                # Project documentation
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md           # Main project readme
```

## Setup History
1. Initial Next.js project created with TypeScript and TailwindCSS
2. Folder renamed from "Predictorium" to "predictorium" (lowercase)
3. Dependencies installed and verified (357 packages)
4. Dev server runs on `http://localhost:3000`

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features
- **Authentication**: Supabase magic link (email-based, passwordless)
- **Predictions**: Users create PRIMARY and optional WILD predictions per season
- **Lock mechanism**: Predictions locked March 1st 00:00 Europe/Prague timezone
- **Security**: Row-Level Security (RLS) enforces user data isolation
- **Rankings**: Drag-and-drop ordering for 22-24 drivers, 10-11 constructors
- **Latest Users**: Dashboard shows up to 10 most recently active users per season
- **Read-only Viewer**: Click user avatars to view their predictions (read-only)
- **Side-by-side Layout**: Drivers and constructors displayed in two columns

## Data Model
### Tables
1. **predictions**: user_id, season_year, type (PRIMARY/WILD)
2. **prediction_items**: prediction_id, category (DRIVER/CONSTRUCTOR), name, rank

### Business Rules
- Max 1 PRIMARY + 1 WILD prediction per user per season
- Editable until March 1st 00:00 Europe/Prague
- Server-side + DB-level lock enforcement
- RLS policies ensure users only access their own data

## Architecture
- **Auth**: Supabase Auth with magic links
- **Database**: Supabase Postgres with RLS
- **Client**: @supabase/ssr for App Router cookie handling
- **UI**: Drag-and-drop with @dnd-kit library
- **Deployment**: Vercel-ready

## Notes
- macOS filesystem is case-insensitive but case-preserving
- Documentation stored in `docs/` folder for organization
- This file (`docs/context.md`) is maintained throughout development for session continuity
- Security: Only use anon key in browser, RLS enforces all access control
