# Express API Starter

A TypeScript Express starter with Drizzle ORM, PostgreSQL, Zod validation, OpenAPI docs, Docker, ESLint, and Prettier.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set real values:

```bash
cp .env.example .env
```

3. Start the app and database with Docker:

```bash
docker compose up --build
```

The API runs on `http://localhost:4000` by default.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` compiles TypeScript.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm run lint` runs ESLint.
- `npm run format:check` checks Prettier formatting.

## API Docs

- OpenAPI JSON: `/api/openapi.json`
- Swagger UI: `/api/docs`
