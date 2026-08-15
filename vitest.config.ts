import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // docs-app holds Playwright specs. They share the .spec.ts extension with
    // vitest's default glob, and vitest fails with "did not expect test() to be
    // called here" rather than anything that names the cause. Playwright owns
    // them via `npx playwright test` in that directory.
    // `.claude/**` for the same reason one level down: a session working in a
    // git worktree under `.claude/worktrees/<id>/` puts a second copy of
    // docs-app inside this repo, where `docs-app/**` no longer matches it. Those
    // copies have no node_modules, so the Playwright specs in them fail the
    // whole run with "Cannot find package '@playwright/test'" — a failure about
    // a directory the developer did not know was being scanned.
    exclude: ['**/node_modules/**', '**/dist/**', 'docs-app/**', '.claude/**'],
  },
})
