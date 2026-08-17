import type { Meta, StoryObj } from '@storybook/react-vite'

import { Code, PROSE_CODE } from '@skene/design-system/sections/code'

/**
 * Every state that shipped a defect, per the gallery's own rule.
 *
 * The one that matters is `On cream`. `brand.peach` is mode-aware and resolves
 * to a legible brown under `light`; `surface.2` is invariant and stays dark. A
 * chip that relied on inheritance would put brown ink on a near-black box in the
 * middle of a cream card — which is why `onLight` swaps the fill explicitly, and
 * why that story renders on the real cream ground rather than a grey stand-in.
 */
const meta = {
  title: 'Sections/Code',
  component: Code,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Code>

export default meta
type Story = StoryObj<typeof meta>

export const InASentence: Story = {
  args: { children: 'events_tracked' },
  render: () => (
    <p className="max-w-[62ch] text-chrome-text-muted-strong">
      Say an update stops sending <Code>plan_tier</Code> with a usage signal. The signal keeps
      firing and the volume is unchanged, so nothing looks broken.
    </p>
  ),
}

/** The case the component exists for: several marks in one paragraph. */
export const SeveralInOneParagraph: Story = {
  args: { children: 'events_tracked' },
  render: () => (
    <p className="max-w-[62ch] text-chrome-text-muted-strong">
      It takes one of two inputs, never both: a directory of exported{' '}
      <Code>.sql</Code> files via <Code>--schema-dir</Code>, or a live connection string via{' '}
      <Code>--db-url</Code>.
    </p>
  ),
}

/**
 * On cream. If this ever renders dark-on-dark, the `onLight` swap has been
 * replaced by inheritance and the mark is invisible inside a tonal band.
 */
export const OnCream: Story = {
  args: { children: 'events_tracked' },
  render: () => (
    <div className="light rounded-3xl bg-brand-light p-10">
      <p className="max-w-[62ch] text-text-muted">
        The plan carries a success formula. After launch it runs against real data and records
        what it found for <Code onLight>checkout_abandoned</Code>.
      </p>
    </div>
  ),
}

/**
 * The second mechanism. For prose the caller does not author element by element,
 * the recipe is a descendant selector on the containing block.
 */
export const InProseTheCallerDoesNotAuthor: Story = {
  args: { children: 'events_tracked' },
  render: () => (
    <div
      className={`max-w-[62ch] text-chrome-text-muted-strong ${PROSE_CODE}`}
      dangerouslySetInnerHTML={{
        __html:
          'A dropped field is one of the four things the check looks for. It names ' +
          '<code>days_since_last_order</code> and the table it reads from, ' +
          '<code>public.customers</code>, rather than reporting a score.',
      }}
    />
  ),
}
