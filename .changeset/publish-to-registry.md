---
"@skene/design-system": patch
---

Make the package publishable to a registry, so the product repos consolidating
onto it stop installing it as a git dependency.

- `publishConfig` names npmjs and stays `restricted`. npmjs rather than GitHub
  Packages because GitHub Packages requires the scope to equal the repository
  owner: the package would become `@skenetechnologies/design-system` and rewrite
  the import specifier in every file of every consumer, which is the churn this
  consolidation exists to remove. npmjs keeps `@skene`, so migrating a consumer
  is one line in its `package.json`.
- `prepublishOnly` runs `npm run verify`, so a publish rebuilds rather than
  shipping whatever `dist` happened to be on disk. `prepare` stays absent: npm
  runs it for GIT dependencies, and consumers are on that path until they
  migrate.
- `.github/workflows/publish.yml` publishes on a `v*` tag, authenticating from
  `secrets.NPM_TOKEN` through `actions/setup-node`. It refuses to publish when
  the tag disagrees with `package.json` — the version string in this repo has
  drifted from reality four times, and npm does not let you reuse a number.
- `.npmrc` is gitignored. This repository is public, and `npm config set` run in
  the project directory writes the token there in plaintext.
- README documents the registry install and where the token belongs; the git
  dependency stays documented as the legacy path until every consumer moves.
- `__tests__/publishing.test.ts` gates all of it, including a scan for real npm
  token shapes that still allows the placeholder the README has to show.

No component changes. `dist/` stays committed and the CI job that proves it is
current stays with it, because git-dependency consumers still need both.
