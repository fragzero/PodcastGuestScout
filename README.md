
# GuestFinder - Podcast Guest Research Platform

A platform for discovering and managing podcast guest candidates.

## Prerequisites

- Node.js 20.x or later
- PostgreSQL 16 or later

## Setup & Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
```
DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database
```

4. Push the database schema:
```bash
npm run db:push
```

## Running the Project

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://0.0.0.0:5000`

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS + Shadcn/ui

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes
