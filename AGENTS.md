# Agent Guidelines for Loan Service Project

This document provides essential information for AI agents operating within the `loan-service` repository. Adhere to these guidelines to ensure consistency, quality, and compatibility with the existing codebase.

## 1. Project Overview

- **Type**: Node.js Microservice
- **Language**: TypeScript (Target ES2022)
- **Framework**: Express (currently), moving to NestJS
- **Database**: PostgreSQL (using `pg` driver directly)
- **Testing**: Vitest
- **Linting/Formatting**: ESLint, Prettier

## 2. Operational Commands

Use the following commands to build, test, and verify your changes.

### Build & Run

- **Start Development**: `npm run dev` (uses `tsx` with watch mode)
- **Start Production**: `npm start` (runs built JS from `dist/`)
- **Build**: `npm run build` (compiles TS to `dist/`)
- **Type Check**: `npm run type-check` (runs `tsc --noEmit`)

### Testing

- **Run All Tests**: `npm test` (runs `vitest`)
- **Run Single Test**: `npx vitest <path/to/test-file>`
  - _Example_: `npx vitest src/__tests__/service.spec.ts`
- **Run Coverage**: `npm run test:coverage`
- **Watch Mode**: `vitest` runs in watch mode by default. For CI/single run, use `vitest run`.

### Quality Assurance

- **Lint Code**: `npm run lint`
- **Fix Lint Issues**: `npm run lint:fix`
- **Check Formatting**: `npm run format:check`
- **Format Code**: `npm run format`

## 3. Code Style & Conventions

### Imports

- **Path Aliases**: ALWAYS use the `#/` alias for imports from `src/`.
  - _Correct_: `import { db } from '#/database/db';`
  - _Incorrect_: `import { db } from '../../database/db';`
- **Relative Imports**: Use relative imports only for files within the same directory or for importing the subject under test in spec files (e.g., `../services/loan`).
- **Grouping**: Group external library imports first, then internal imports.

### Formatting & Syntax

- **Indentation**: 2 spaces (Prettier default).
- **Quotes**: Single quotes `'` generally preferred over double quotes.
- **Semicolons**: Always use semicolons.
- **Trailing Commas**: ES5 compatible (Prettier default).

### Naming Conventions

- **Variables/Functions**: `camelCase` (e.g., `getAllLoans`, `applicantName`).
- **Classes/Interfaces**: `PascalCase` (e.g., `LoanService`, `Loan`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `LOAN_STATUS`, `MAX_RETRIES`).
- **Files**: `kebab-case` or `snake_case` seems mixed, but prefer `camelCase` or `kebab-case` consistent with existing `loan.ts`, `server.ts`. Current structure uses `name.ts`.

### TypeScript Usage

- **Strict Mode**: Enabled. No implicit `any`.
- **Explicit Types**: Define return types for all functions, especially public methods.
  - _Example_: `async getLoanById(id: string): Promise<Loan | null> { ... }`
- **Interfaces**: Use `interface` for object definitions and `type` for unions/primitives.

### Error Handling

- **Return Values**: For expected "not found" scenarios, return `null` rather than throwing errors, unless the framework dictates otherwise (e.g., NestJS might prefer Exceptions).
  - _Example_: `if (result.rowCount === 0) return null;`
- **Logging**: Use `console.error` for errors. (Consider moving to a logger service in refactor).

## 4. Testing Guidelines (Vitest)

- **Structure**:
  - `describe` blocks for grouping tests (usually by method).
  - `it` or `test` for individual test cases.
  - `beforeEach` to reset state/mocks.
- **Mocking**:
  - Use `vi.mock()` for module mocking.
  - Use `vi.spyOn()` for method mocking.
  - Clear mocks: `vi.clearAllMocks()` in `beforeEach`.
- **Assertions**:
  - Use `expect(value).toEqual(...)` for objects.
  - Use `expect(value).toBe(...)` for primitives.
  - Use `expect(value).toBeNull()` for null checks.

### Example Test Pattern

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoanService } from '../services/loan';
import { db } from '../database/db'; // Mocked

vi.mock('../database/db', () => ({
  db: { query: vi.fn() },
}));

describe('LoanService', () => {
  const service = new LoanService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loan when found', async () => {
    (db.query as any).mockResolvedValue({ rowCount: 1, rows: [{ id: '1' }] });
    const result = await service.getLoanById('1');
    expect(result).toEqual({ id: '1' });
  });
});
```

## 5. NestJS Structure (Current State)

The service now uses NestJS. Follow these conventions:

- **Structure**: Use standard modules (`.module.ts`, `.controller.ts`, `.service.ts`).
- **Dependency Injection**: Use constructor injection in controllers/services.
- **DTOs**: Use `class-validator` + `class-transformer` with `ValidationPipe`.
- **Swagger**: Use `@nestjs/swagger` decorators and `SwaggerModule` in `main.ts`.
- **Testing**: Use NestJS testing utilities (`Test.createTestingModule`) with Vitest.
