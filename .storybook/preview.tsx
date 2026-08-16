import type { Decorator, Preview } from '@storybook/react-vite'
import React from 'react'

import './preview.css'

/**
 * ## Theme is a class, never a media query
 *
 * This package's theming is `.light` / `.dark` on an ancestor, and the tokens
 * ship dark-first — `styles/tokens.css` is generated with `--base-mode dark`, so
 * `:root` IS the dark palette and `.light` overrides it. There is no
 * `prefers-color-scheme` anywhere and adding one would break the nested case
 * the dashboard needs: a light panel inside a dark sidebar, arbitrarily deep.
 *
 * So the theme toolbar writes a class, and the decorator paints `bg-background`
 * underneath. Painting the ground explicitly is not cosmetic: several components
 * are transparent by design and read as broken on Storybook's default white,
 * which is a false alarm a reviewer then learns to ignore.
 *
 * ## The trap this decorator exists to make visible
 *
 * Two token families look interchangeable and are not. `text.*` is mode-aware
 * and follows the class; `chrome.text.*` is INVARIANT and cannot. A component
 * built from `chrome.*` is correct only on a surface that is always dark, and on
 * cream it renders `#faf1e9` on `#faf1e9` — absent, not dim, and invisible to
 * every check that reads source.
 *
 * That has cost this estate real defects: `NumberedStep` needed a two-utility
 * override to sit inside `LightSectionCard` at all, and it now has `onLight` for
 * exactly this reason. **So the light story is not a nicety.** Any component
 * that can appear on cream wants both, and the pair is what makes the failure
 * obvious the moment someone looks.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'light' ? 'light' : 'dark'
  return (
    <div className={`${theme} min-h-screen bg-background text-foreground p-8`}>
      <Story />
    </div>
  )
}

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'Palette class on the wrapper',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light (cream)' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'dark' },

  parameters: {
    // Storybook's own chrome, not the package's. Left dark so the canvas does
    // not flash white around a dark-first library.
    backgrounds: { disable: true },

    a11y: {
      // Report, do not fail the render. A failing story is a story nobody
      // opens; a reported violation is one somebody fixes. Chromatic and the
      // repo's own contrast gate are where a11y regressions get to be fatal.
      test: 'todo',
    },

    controls: { expanded: true },
  },
}

export default preview
