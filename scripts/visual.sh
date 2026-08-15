#!/usr/bin/env bash
#
# Run docs-app's visual suite in the Playwright container.
#
#   VISUAL_MODE=update  (default)  regenerate baselines
#   VISUAL_MODE=verify            compare against committed baselines
#
# Baselines are committed as *-linux.png. A macOS run writes *-darwin.png, which
# is gitignored rather than allowed to overwrite them, because font rasterisation
# differs and every snapshot would mismatch in CI.
#
# node_modules lives in named volumes, one per platform. This is not incidental:
# an earlier version bind-mounted the repo and ran `npm ci` inside it, which
# replaced the host's darwin binaries with linux ones and broke every subsequent
# local run of vitest and the build.
#
# docs-app/.next is an ANONYMOUS volume, deliberately: fresh every run, and
# discarded with --rm. It used to be named, and that let a build cache outlive
# the package it was built against. The symptom was a snapshot changing height
# by 895px between two consecutive runs of identical source — a verify pass and
# the rebaseline right after it disagreed about the page. A gate whose cache can
# serve last week's bundle is worse than no gate, because it reports green.
# It still must not be a bind mount: that would write linux build output over
# the host's .next, the same way the npm ci above did to node_modules.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PW="$(node -p "require('$ROOT/docs-app/node_modules/@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${PW}-noble"
PLATFORM="${VISUAL_PLATFORM:-linux/amd64}"
SUFFIX="$(echo "$PLATFORM" | tr '/' '-')"

docker info >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }

echo "==> image:    $IMAGE"
echo "==> platform: $PLATFORM"

docker run --rm \
  --platform "$PLATFORM" \
  -v "$ROOT":/work \
  -v "skene-ds-node-$SUFFIX":/work/node_modules \
  -v "skene-ds-docs-node-$SUFFIX":/work/docs-app/node_modules \
  -v /work/docs-app/.next \
  -w /work \
  -e CI=1 -e NEXT_TELEMETRY_DISABLED=1 \
  -e "VISUAL_MODE=${VISUAL_MODE:-update}" \
  "$IMAGE" \
  bash -lc '
    set -euo pipefail
    npm ci --include=dev --no-audit --no-fund >/dev/null
    npm run build >/dev/null
    cd docs-app
    npm ci --include=dev --no-audit --no-fund >/dev/null
    if [ "${VISUAL_MODE:-update}" = "verify" ]; then
      npx playwright test
    else
      npx playwright test --update-snapshots
    fi
  '
