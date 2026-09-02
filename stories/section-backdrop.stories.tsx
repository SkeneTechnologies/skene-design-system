import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { SectionBackdrop } from '@skene/design-system/sections/section-backdrop'

/**
 * The textured field behind a drawn artifact. Three shipped textures, or `src`
 * for your own.
 *
 * The URLs resolve with `new URL(..., import.meta.url)`, so a consumer gets a
 * bundled asset from importing the package rather than having to copy webp files
 * into its own `public/`. That is why there is no "texture path" prop.
 */
const meta = {
  title: 'Sections/SectionBackdrop',
  component: SectionBackdrop,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    texture: { control: 'inline-radio', options: ['journey', 'github', 'schema'] },
    inset: { control: { type: 'range', min: 0, max: 80, step: 4 } },
  },
} satisfies Meta<typeof SectionBackdrop>

export default meta
type Story = StoryObj<typeof meta>

const panel = (
  <div className="rounded-xl border border-chrome-line-on-light bg-surface-1 p-6 text-text-primary">
    An artifact sitting on the field.
  </div>
)

export const Journey: Story = { args: { texture: 'journey', children: panel } }
export const Github: Story = { args: { texture: 'github', children: panel } }
export const Schema: Story = { args: { texture: 'schema', children: panel } }

/** No child — the texture alone, which is how you judge the crop. */
export const Bare: Story = { args: { texture: 'journey', className: 'h-[220px]' } }

/** A wide inset, so the field reads as a mat rather than as a background. */
export const Inset: Story = { args: { texture: 'schema', inset: 48, children: panel } }

/**
 * `field="css"` against the raster, all three textures.
 *
 * The pair is here so the difference is judged rather than described. The
 * module comment on this component records that an earlier CSS field "read as a
 * chunky checkerboard next to the actual fine dot halftone"; that note stands
 * against that implementation. This one is `.skene-field` from
 * `styles/effects.css`, which shipped for `ArtFrame` in 0.17.0. It is still not
 * pixel-identical, which is why `field` defaults to `image`.
 *
 * The reason to opt in: a raster backdrop is a Largest Contentful Paint
 * candidate the preload scanner cannot see, and on www.skene.ai that discovery
 * delay measured 2,281 ms. A CSS field is not an image.
 */
export const RasterVsCss: Story = {
  render: () => (
    <div className="grid gap-6">
      {(['journey', 'github', 'schema'] as const).map((texture) => (
        <div key={texture} className="grid gap-4 md:grid-cols-2">
          {(['image', 'css'] as const).map((field) => (
            <SectionBackdrop key={field} texture={texture} field={field}>
              <div className="rounded-xl border border-chrome-line-on-light bg-surface-1 p-6 text-text-primary">
                {texture} · {field}
              </div>
            </SectionBackdrop>
          ))}
        </div>
      ))}
    </div>
  ),
}
