import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Storybook for the design system.
 *
 * ## What this is for, given `docs-app` already exists
 *
 * `docs-app` is not replaced and is not a duplicate of this. It renders whole
 * SECTIONS in composition, and its `decisions/` and `gaps/` routes are wired to
 * `machine/inventory.json` — the same contract agents read. Storybook does not
 * inherit that and is not trying to: it covers the axis `docs-app` does not,
 * which is one component at a time with its props exposed as controls, so a
 * reviewer can put a component into a state no page currently renders.
 *
 * That distinction is the reason both exist. It is also the thing that will rot
 * first, so: if a story starts composing three sections into a page, it belongs
 * in `docs-app`. If a `docs-app` case exists only to show one prop's variants,
 * it belongs here.
 *
 * ## Why `@storybook/react-vite` and not the Next builder
 *
 * The package is plain React compiled by `tsc`; it has no Next dependency and
 * `next` is not even a peer. Pulling the Next builder in to render library
 * components would add a framework this package deliberately does not have.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],

  addons: [
    // Runs axe on every story. This is the half of Chromatic's job that does
    // not need a network call, and it catches the class of defect that has
    // actually shipped here: a colour resolved against the wrong ground.
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Vite needs the same aliases the package's own exports map provides, because
  // stories import through the public specifier — `@skene/design-system/...` —
  // rather than by relative path. Importing by relative path would let a story
  // pass while the published entry point is broken, which is the one failure a
  // gallery must never hide.
  viteFinal: async (config) => {
    const { default: react } = await import('@vitejs/plugin-react')
    const { default: tailwind } = await import('@tailwindcss/vite')
    config.plugins = [...(config.plugins ?? []), react(), tailwind()]
    return config
  },
}

export default config
