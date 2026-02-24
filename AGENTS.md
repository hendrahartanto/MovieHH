# MovieHH Codebase Guide

## Project Overview
MovieHH is a monorepo movie reservation system.
- **Backend**: Node.js, Express, PostgreSQL, Prisma ORM.
- **Frontend**: React 19, Vite, Tailwind CSS, React Query, Zustand.

## Directory Structure
- `backend/`: Express API server.
  - `src/apps/`: Feature modules (e.g., `auth`, `movie`, `reservation`).
  - `src/apps/*/entry-points`: Controllers.
  - `src/apps/*/domain`: Business logic and services.
  - `src/apps/*/dto`: Data Transfer Objects (often Zod schemas).
- `frontend/`: React application.
  - `src/features/`: Feature-based organization (e.g., `auth`, `movies`).
  - `src/app/`: App setup (router, providers).
  - `src/lib/`: Shared utilities (API client, React Query setup).
  - `src/components/`: Shared UI components.

## Build & Run Commands

### Backend (`/backend`)
- **Install**: `npm install`
- **Development**: `npm run dev` (runs with `nodemon`)
- **Start**: `npm start` (runs compiled JS or via `ts-node` depending on config)
- **Database**:
  - `npx prisma generate` (update client)
  - `npx prisma db push` (sync schema)
  - `npx prisma db seed` (run seed script)
- **Lint/Test**: Currently no dedicated lint or test scripts configured in `package.json`.
  - *Recommendation*: Use `eslint` for linting and `jest` or `vitest` for testing if implementing.

### Frontend (`/frontend`)
- **Install**: `npm install`
- **Development**: `npm run dev` (starts Vite server at `http://localhost:5173`)
- **Build**: `npm run build` (TSC check + Vite build)
- **Preview**: `npm run preview`
- **Lint**: `npm run lint` (runs `eslint .`)
- **Test**: Currently no test scripts configured.
  - *Recommendation*: Use `vitest` and `@testing-library/react`.

## Code Style & Conventions

### General
- **TypeScript**: Strict typing is enabled. Avoid `any`. Use interfaces/types for all data structures.
- **Imports**: Use absolute paths or clean relative imports. Group imports by third-party vs. local.
- **Formatting**: Prettier is likely implied (standard JS/TS formatting).

### Backend
- **Architecture**: Follow the `apps/{feature}` pattern.
  - **Routes**: Define in `*.routes.ts`.
  - **Controllers**: Place in `entry-points` folder. Handle HTTP req/res, validation, and call services.
  - **Services**: Place in `domain` folder. Handle business logic and DB interactions.
- **Validation**: Use `zod` for request body/query validation.
- **Database**: Use Prisma Client. prefer `await prisma.model.findMany()` style.
- **Async/Await**: Use `async/await` for all asynchronous operations. Wrap controller methods in try/catch or use a wrapper.

### Frontend
- **Components**: Functional components with hooks.
  - **Naming**: PascalCase for components (e.g., `LoginForm.tsx`).
  - **Props**: Define props with interfaces.
- **State Management**:
  - **Server State**: Use `@tanstack/react-query` (custom hooks in `lib` or `features`).
  - **Client State**: Use `zustand` for global UI state if needed, or local `useState`.
- **Forms**: Use `react-hook-form` integrated with `zod` resolvers.
- **Styling**: Utility-first with **Tailwind CSS**. Use `cn` (classnames/clsx) helper for conditional classes.
- **UI Library**: **Radix UI** primitives are used for accessible components.

## Error Handling
- **Backend**: Centralized error handling middleware (check `src/middlewares`). Controllers should pass errors to `next()`.
- **Frontend**: Use Error Boundaries or `react-query`'s error states to handle API errors gracefully.

## Testing Strategy (Recommended)
Since no tests exist yet:
- **Unit Tests**: Test utility functions and complex business logic.
- **Integration Tests**: Test API endpoints (backend) and critical user flows (frontend).
- **Tooling**: Recommend `vitest` for both backend and frontend due to speed and Vite compatibility.

## Git & Version Control
- **Commits**: Use descriptive messages (e.g., "feat: add movie reservation endpoint", "fix: login form validation").
- **Branches**: Feature branching workflow (e.g., `feature/add-reviews`, `fix/booking-bug`).
