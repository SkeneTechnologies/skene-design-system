'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '../lib/utils.js'
import { Button } from '../ui/button.js'
import { ArtPanel, ArtTitle } from './artifact-shell.js'
import { TrafficLights } from './traffic-lights.js'

/**
 * The install block: a terminal frame holding one or more shell lines, each with
 * its own copy button, and an optional footnote under a rule.
 *
 * This is the one artifact a reader is meant to *use* rather than read. Every
 * other depiction on the page argues; this one hands over a command. That single
 * fact decides most of what follows — the copy control is a real button rather
 * than a click-anywhere affordance, the command text is a `string` rather than a
 * `ReactNode`, and the flash after a successful copy is the only state in the
 * file.
 *
 * ## Why this does not extend `patterns/Terminal`
 *
 * There is already a terminal in the package and it is deliberately not reused
 * here. `patterns/Terminal` is the `.skene-terminal` effects recipe: an 8px
 * `--radius-panel` corner, `--shadow-terminal`, and traffic lights drawn as a
 * `::before` with two box-shadows. This is the artifacts register: a 14px
 * `--radius-gtm` corner, no shadow at all (principles.md 16 — flat panels take a
 * border), and three real dot elements. The shadow and the pseudo-element are
 * both unreachable from a `className`, so "extending" it would mean overriding
 * the background, the border, the radius and the shadow and then living with a
 * second set of traffic lights I could not turn off. `patterns/TerminalLine` is
 * the same story one level down: it wraps, prompts in peach, and has no room for
 * a trailing control, where this line does not wrap, prompts in matcha, and is a
 * three-part flex row built around one.
 *
 * What IS composed: `ArtPanel` supplies the frame and the chrome bar (it is the
 * ported `.art` / `.art__bar` verbatim), and `ui/button` supplies the copy
 * control. The prototype's own comment on `.term__copy` reads "Button, outline
 * variant, size sm", and taking it at its word buys the focus ring and the
 * disabled handling that the hand-rolled CSS never had.
 *
 * ## Why the frame carries `dark`
 *
 * A terminal is a fixed-dark surface, so most of it takes the invariant
 * `terminal.*` tokens and is safe anywhere. Two colours in the prototype are not
 * invariant: the matcha prompt and the peach hover both resolve through
 * mode-aware tokens. On the marketing site — `<html class="dark">` — they are
 * `#d7f4ab` and `#fec089`, which is what the prototype was verified at. Drop the
 * same block into the dashboard, whose default theme is light, and they silently
 * become `#677552` and `#89684a` against `#1e1e1e`: 3.6:1 and 3.5:1, under the
 * 4.5:1 floor, in a component that looks completely fine to whoever added it.
 *
 * So the panel is a `dark` subtree and says so, which is `must:
 * wrap_dark_subtrees_in_dark_class` doing exactly the job it exists for. It is
 * the mirror of the `light` that `AppWindow` carries, for the mirror-image
 * reason, and it has the mirror-image caveat: `cn` cannot unset a theme class, so
 * a consumer who genuinely wants this to follow the ambient theme needs a prop
 * and a decision, not a `className`.
 *
 * ## Copy
 *
 * `navigator.clipboard.writeText` is the whole mechanism and the flash reverts
 * after 1400ms, both as the prototype has them. The important detail is that the
 * flash is inside the success path: an insecure context or a denied permission
 * rejects, and the button then says nothing rather than claiming a copy that did
 * not happen. Only one line can be lit at a time, so copying a second command
 * takes the highlight off the first — which is true, and a row of three
 * simultaneously-"copied" buttons is not.
 *
 * Each button's accessible name is its own label plus the command beside it
 * ("copy pip install skene"), assembled with `aria-labelledby` rather than an
 * invented `aria-label`, because the package ships no copy and three buttons all
 * named "copy" is what the prototype actually leaves a screen reader with. The
 * name changing to "copied …" is also what announces the result.
 *
 * All content is props. Nothing here knows what command Skene installs with.
 */

/**
 * 1400ms, from the prototype. Long enough to read "copied", short enough that a
 * reader copying the second of three lines is not looking at two green buttons.
 * Not a prop: it is feedback timing, not content, and a caller tuning it is
 * tuning the wrong thing.
 */
const COPY_REVERT_MS = 1400

export interface TerminalBlockLine {
  /**
   * The command, as plain text. This is both what is shown and what reaches the
   * clipboard, which is the point of it being a `string`: what you copy is
   * exactly what you read.
   */
  command: string
  /**
   * Marked-up alternative for the *visible* text only — the clipboard still gets
   * `command`. The escape hatch for highlighting a flag or dimming a URL without
   * putting markup between the reader and the paste.
   */
  display?: React.ReactNode
  /**
   * The prompt glyph. Defaults to `$`. Pass `null` for an output line — one that
   * shows what the command printed rather than what to type.
   */
  prompt?: React.ReactNode
  /** `false` drops the copy button. Output lines rarely want one. */
  copyable?: boolean
}

export interface TerminalBlockProps {
  lines: TerminalBlockLine[]
  /** Bar label beside the traffic lights — the shell's name, usually. */
  title?: React.ReactNode
  /** Footnote under a rule. The caveat the commands do not carry themselves. */
  note?: React.ReactNode
  /** Idle label on the copy button. */
  copyLabel?: React.ReactNode
  /** Label during the flash, and half of the button's accessible name. */
  copiedLabel?: React.ReactNode
  /**
   * Fired after every copy attempt, successful or not.
   *
   * The component deliberately shows the reader nothing when the clipboard
   * fails — flashing "copied" for a copy that did not happen is worse than
   * silence. But that silence is only right for the reader. A consumer
   * measuring an install funnel needs the outcome, or it cannot tell "nobody
   * copied" from "the copy button does not work on this origin", and clipboard
   * writes fail routinely on insecure origins and when a user declines the
   * permission.
   *
   * `command` is what actually reached the clipboard, which is not always what
   * is on screen: a line may carry a `display` override.
   */
  onCopy?: (result: { command: string; index: number; ok: boolean }) => void
  className?: string
}

/**
 * ## The same frame exists twice, and this one is not the deprecated half
 *
 * `patterns/terminal`'s `Terminal` draws the same object — same tokens, same
 * 10px traffic lights, same mono body — and the two do not match: that frame
 * comes from the `.skene-terminal` class in `effects.css` at an 8px radius,
 * this one draws its own through `ArtPanel` at 12px. Two terminals that
 * disagree is worse than either, and settling them is decision `terminals`.
 *
 * This file carried an `@deprecated` tag for one afternoon on 2026-08-13. That
 * was wrong twice over: the tag means "this will be removed" and the decision
 * was explicitly not to remove it, and it is the only one of the two with a
 * copy affordance — which is the reason `skene-site` renders it on five pages
 * and had just extended it with `onCopy`. A deprecation whose own text tells
 * you to keep using the thing is a deprecation that teaches readers to ignore
 * the tag.
 *
 * Reach for `Terminal` when you want a transcript with no copy button. Reach
 * for this when a reader is meant to run the line.
 */
export function TerminalBlock({
  lines,
  title,
  note,
  copyLabel = 'copy',
  copiedLabel = 'copied',
  onCopy,
  className,
}: TerminalBlockProps) {
  const uid = useId()
  const [copied, setCopied] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // The flash outliving its component would setState on an unmounted tree; a
  // section that scrolls out of a virtualised list is enough to hit it.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // No clipboard (insecure origin) or the user declined. Say nothing rather
      // than flash a success the reader does not have.
      //
      // Report it, though. Silence here is right for the READER and wrong for
      // the consumer: a swallowed failure is indistinguishable from a copy that
      // never happened, so an install-funnel metric built on this component
      // could not tell "nobody copied" from "the copy button is broken on this
      // origin". onCopy carries the outcome; what to do with it is the caller's.
      onCopy?.({ command: text, index, ok: false })
      return
    }
    onCopy?.({ command: text, index, ok: true })
    if (timer.current) clearTimeout(timer.current)
    setCopied(index)
    timer.current = setTimeout(() => setCopied(null), COPY_REVERT_MS)
  }

  return (
    <ArtPanel
      // `dark`: see the file header. `bg-terminal-bg` / `border-terminal-border`
      // are `.term`'s two overrides of `.art`, and land after ArtPanel's own base
      // so they win the merge.
      className={cn('dark border-terminal-border bg-terminal-bg', className)}
      bar={
        <>
          {/* Was three loose spans here until 2026-08-14, which is one of the
              five places the recipe was written out. `TrafficLights` defaults to
              the 8px gap this bar was already giving them, so the row is
              unchanged: same 46px of lights, same 20px to the title. */}
          <TrafficLights />
          {title ? <ArtTitle>{title}</ArtTitle> : null}
        </>
      }
    >
      <div className="px-[16px] pb-[24px] pt-[16px] font-mono text-[14px] text-terminal-text">
        {lines.map((line, i) => {
          const done = copied === i
          const cmdId = `${uid}-cmd-${i}`
          const labelId = `${uid}-label-${i}`
          const prompt = line.prompt === undefined ? '$' : line.prompt
          return (
            <div key={i} className="flex min-w-0 items-center gap-[12px] py-[8px]">
              {prompt ? (
                <span aria-hidden className="shrink-0 select-none text-semantic-matcha">
                  {prompt}
                </span>
              ) : null}
              {/*
                The command scrolls inside itself. `min-w-0` on a flex child is
                what lets it: without it the child's automatic min-width is its
                content, a 90-character curl widens the panel, and at 390px the
                page body gets the scrollbar instead of this element. The copy
                button is also the keyboard route to the far end of the line.
              */}
              <span id={cmdId} className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
                {line.display ?? line.command}
              </span>
              {line.copyable === false ? null : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void copy(line.command, i)}
                  aria-labelledby={`${labelId} ${cmdId}`}
                  className={cn(
                    // 24px is the WCAG 2.2 2.5.8 target floor, which is what the
                    // prototype's comment on this height is recording.
                    'h-[24px] shrink-0 px-[8px] font-mono text-[11px] font-normal duration-200 ease-out',
                    // The outline variant's themed border/ink/hover-fill are all
                    // replaced: this button sits on invariant terminal ground and
                    // must not follow the page. `hover:bg-transparent` cancels the
                    // variant's `hover:bg-muted`.
                    'hover:bg-transparent',
                    done
                      ? 'border-semantic-matcha text-semantic-matcha hover:border-semantic-matcha hover:text-semantic-matcha'
                      : 'border-terminal-border text-terminal-text hover:border-brand-peach hover:text-brand-peach',
                  )}
                >
                  <span id={labelId}>{done ? copiedLabel : copyLabel}</span>
                </Button>
              )}
            </div>
          )
        })}
        {note ? (
          <div className="mt-[8px] border-t border-terminal-border pt-[16px] text-[13px] text-terminal-text">
            {note}
          </div>
        ) : null}
      </div>
    </ArtPanel>
  )
}
