'use client'

import { useEffect, useState } from 'react'
import { ClipboardCheck, Cloud, GitPullRequest, Terminal, type LucideIcon } from 'lucide-react'

import { cn } from '../lib/utils.js'
import { useContainerScale } from '../lib/use-container-scale.js'

/*
 * No animation library. This ran on a gsap timeline until 2026-09-02, and the
 * history is worth one paragraph because it is the measurement behind the
 * change: a static `import gsap from 'gsap'` put a 45 KB gzipped chunk in the
 * initial `<script>` list of the two product routes that render this, for an
 * animation below the fold. Moving the import into the effect (0.18.0) took it
 * out of the critical path and left it on the page. Removing the library
 * (issue #24) takes it off the page: what the timeline did is a sequence of
 * `setTimeout`s driving four booleans, and the fades are CSS transitions on
 * the elements they move, at the same durations and curves.
 *
 * `next/dynamic` around the component was measured NOT to achieve either:
 * without `ssr: false` the chunk stays in the initial list, and `ssr: false`
 * removes the server-rendered markup, which is not acceptable for a component
 * carrying copy.
 */

/** Resolved from this module so Vite emits a browser URL, not a file:// path. */
const INTEGRATIONS_TEXTURE = new URL('../../assets/plugin.png', import.meta.url).href

type CardVariant = 'mcp' | 'gh' | 'api' | 'audit'
type BadgeVariant = 'purple' | 'gray' | 'teal' | 'amber'

export interface IntegrationAnimationCard {
  variant: CardVariant
  icon: LucideIcon
  title: string
  context: string
}

export interface IntegrationAnimationDetail {
  badge: string
  badgeVariant: BadgeVariant
  text: string
  code: string
}

/**
 * The PR surface is a GitHub App that posts reviews; nothing ships as an Actions workflow.
 * The marketing site corrected this on 2026-08-19 — keep the `gh` card and its
 * detail on the App, or the dead `uses: skene-ai/action@v1` claim regresses.
 */
export const INTEGRATION_ANIMATION_CARDS: IntegrationAnimationCard[] = [
  {
    variant: 'mcp',
    icon: Terminal,
    title: 'MCP server',
    context: 'Cursor · Claude Code',
  },
  {
    variant: 'gh',
    icon: GitPullRequest,
    title: 'GitHub App',
    context: 'Runs on every PR',
  },
  {
    variant: 'api',
    icon: Cloud,
    title: 'Cloud API',
    context: 'Any script, any time',
  },
  {
    variant: 'audit',
    icon: ClipboardCheck,
    title: 'Repo audit',
    context: 'One-time · no commitment',
  },
]

export const INTEGRATION_ANIMATION_DETAILS: IntegrationAnimationDetail[] = [
  {
    badge: 'MCP server',
    badgeVariant: 'purple',
    text: 'Skene runs before the agent commits. Catches analytics issues in the agent loop, not after the PR lands.',
    code: 'skene mcp --cursor',
  },
  {
    badge: 'GitHub App',
    badgeVariant: 'gray',
    text: 'Install it on the repositories you pick and every pull request gets an analytics review automatically. Zero extra steps.',
    code: '/skene fix',
  },
  {
    badge: 'Cloud API',
    badgeVariant: 'teal',
    text: 'Hit the API directly from any script, pipeline, or internal tool. Bring Skene wherever your code runs.',
    code: 'POST /v1/compare',
  },
  {
    badge: 'Repo audit',
    badgeVariant: 'amber',
    // "tracking surface", not "instrumentation surface": the marketing repo's
    // deslop gate bans the word on GTM surfaces, and this default renders
    // there. The fact is unchanged.
    text: 'A one-time scan of your current tracking surface. See what you have before you adopt anything else.',
    // Not an audit-named command: no `audit` subcommand exists (the noun is
    // the free audit tier's), and the marketing repo's `check-claims.sh`
    // fails the string. This is the real one-time local invocation — note
    // the s-spelling; the z-spelled `analyze-journey` is a second claim the
    // same gate rejects. Corrected 2026-08-26 after the homepage shipped an
    // `AUDIT_DETAIL_FIX` override to carry exactly these two strings.
    code: 'uvx skene analyse-journey .',
  },
]

const DESIGN_WIDTH = 700
/* The timeline's own clock, in seconds, kept to the tenth the gsap version ran:
   a 0.3s lead, cards in over 0.45s with a 0.12s stagger, a 0.35s pause before
   the first card lights, the detail panel in over 0.4s, a 2.2s hold per detail,
   0.15s out and 0.3s in on each swap, then everything out over 0.4s after a 2s
   pause, and 0.5s before the next cycle. */
const LEAD = 0.3
const CARD_IN = 0.45
const CARD_STAGGER = 0.12
const DETAIL_IN = 0.4
const CYCLE_HOLD = 2.2
const SWAP_OUT = 0.15
const SWAP_IN = 0.3
const FIRST_ACTIVE_DELAY = 0.35
const EXIT_PAUSE = 2
const EXIT = 0.4
const REPEAT_DELAY = 0.5
/* gsap's `power2.out` and `power2.in`, as the cubic-beziers they are. */
const EASE_OUT = 'cubic-bezier(0.33, 1, 0.68, 1)'
const EASE_IN = 'cubic-bezier(0.32, 0, 0.67, 0)'

/**
 * One resting state of the scene: which elements are shown and which detail is
 * up. `instant` is the reset at the top of a cycle, which the timeline did with
 * `gsap.set` rather than a tween, so it turns the transitions off for a frame.
 */
type Phase = {
  cards: boolean
  detail: boolean
  inner: boolean
  activeIdx: number | null
  instant: boolean
}

const HIDDEN: Phase = { cards: false, detail: false, inner: true, activeIdx: null, instant: true }

/** The frame `frame={n}` pins: everything in, detail `n` up, nothing moving. */
const framePhase = (idx: number): Phase => ({
  cards: true,
  detail: true,
  inner: true,
  activeIdx: idx,
  instant: true,
})

const ICON_STYLES: Record<
  CardVariant,
  { dark: { background: string; color: string }; light: { background: string; color: string } }
> = {
  mcp: {
    dark: { background: 'rgba(83, 74, 183, 0.25)', color: '#b4adf7' },
    light: { background: '#eeedfe', color: '#534ab7' },
  },
  gh: {
    dark: { background: 'rgba(255, 255, 255, 0.08)', color: '#a1a1a1' },
    light: { background: '#f1efe8', color: '#444441' },
  },
  api: {
    dark: { background: 'rgba(15, 110, 86, 0.25)', color: '#6ecfad' },
    light: { background: '#e1f5ee', color: '#0f6e56' },
  },
  audit: {
    dark: { background: 'rgba(133, 79, 11, 0.25)', color: '#f0b866' },
    light: { background: '#faeeda', color: '#854f0b' },
  },
}

const BADGE_STYLES: Record<BadgeVariant, { background: string; color: string }> = {
  purple: { background: '#eeedfe', color: '#3c3489' },
  gray: { background: '#f1efe8', color: '#444441' },
  teal: { background: '#e1f5ee', color: '#085041' },
  amber: { background: '#faeeda', color: '#633806' },
}

/**
 * `autoAlpha`, as gsap called it: opacity plus visibility, with visibility
 * flipping at the START of a fade-in and at the END of a fade-out so a hidden
 * element is out of the accessibility tree and hit-testing while invisible.
 */
function fade(
  shown: boolean,
  duration: number,
  ease: string,
  offsetY: number,
  delay = 0,
  instant = false,
): React.CSSProperties {
  const d = instant ? 0 : duration
  const wait = instant ? 0 : delay
  return {
    opacity: shown ? 1 : 0,
    visibility: shown ? 'visible' : 'hidden',
    transform: shown ? 'none' : `translateY(${offsetY}px)`,
    transition: instant
      ? 'none'
      : [
          `opacity ${d}s ${ease} ${wait}s`,
          `transform ${d}s ${ease} ${wait}s`,
          `visibility 0s linear ${shown ? wait : wait + d}s`,
        ].join(', '),
  }
}

function getDisplayDetail(
  details: IntegrationAnimationDetail[],
  activeIdx: number | null,
) {
  if (activeIdx !== null && activeIdx >= 0 && activeIdx < details.length) {
    return details[activeIdx]
  }
  return details[0]
}

export interface CardAnimationIntegrationsProps {
  /** Texture behind the scene. Defaults to the shipped `plugin.png`. */
  backgroundImage?: string
  cards?: IntegrationAnimationCard[]
  details?: IntegrationAnimationDetail[]
  className?: string
  /**
   * Hold one frame instead of cycling: every card in, detail `frame` up, and
   * nothing moving. For a gallery, a screenshot baseline or a print surface,
   * where a cycling scene is either a timeout or a lottery. The docs-app's two
   * cases use `0` and `3`, which are the frames its baselines held when the
   * playhead was gsap's.
   */
  frame?: number
}

/**
 * Four integration cards on a textured field, cycling detail copy.
 * Ported from skene-marketing-website's `CardAnimationIntegrations`.
 */
export function CardAnimationIntegrations({
  backgroundImage = INTEGRATIONS_TEXTURE,
  cards = INTEGRATION_ANIMATION_CARDS,
  details = INTEGRATION_ANIMATION_DETAILS,
  className,
  frame,
}: CardAnimationIntegrationsProps) {
  const { containerRef, scale } = useContainerScale(DESIGN_WIDTH)
  const [phase, setPhase] = useState<Phase>(frame === undefined ? HIDDEN : framePhase(frame))
  const cardCount = cards.length
  const detailCount = details.length

  /* The cycle, as a sequence of waits. Two things the gsap ScrollTrigger did are
     kept: it started when the scene reached 80% of the viewport, and it paused
     while the scene was off screen and resumed where it left off. Here every
     wait first waits for the scene to be on screen, so a cycle pauses at the
     next step boundary rather than mid-fade, which nobody can see. */
  useEffect(() => {
    if (frame !== undefined) return
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    let visible = false
    let wake: (() => void) | null = null
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && wake) {
          wake()
          wake = null
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)

    const onScreen = () =>
      visible
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            wake = resolve
          })
    const wait = async (seconds: number) => {
      await onScreen()
      if (cancelled) return
      await new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000))
    }
    const set = (next: Phase | ((p: Phase) => Phase)) => {
      if (!cancelled) setPhase(next)
    }

    void (async () => {
      await wait(LEAD)
      while (!cancelled) {
        set(HIDDEN)
        // One frame with transitions off, then the reveal can run.
        await wait(0.02)
        set({ cards: true, detail: false, inner: true, activeIdx: null, instant: false })
        await wait(CARD_IN + CARD_STAGGER * (cardCount - 1) + FIRST_ACTIVE_DELAY)
        set((p) => ({ ...p, detail: true, activeIdx: 0 }))
        await wait(DETAIL_IN + CYCLE_HOLD)
        for (let idx = 1; idx < detailCount && !cancelled; idx++) {
          set((p) => ({ ...p, inner: false }))
          await wait(SWAP_OUT)
          set((p) => ({ ...p, inner: true, activeIdx: idx }))
          await wait(
            idx < detailCount - 1
              ? SWAP_IN + (CYCLE_HOLD - SWAP_OUT - SWAP_IN)
              : SWAP_IN + (CYCLE_HOLD - SWAP_IN),
          )
        }
        await wait(EXIT_PAUSE)
        set((p) => ({ ...p, cards: false, detail: false }))
        await wait(EXIT + REPEAT_DELAY)
      }
    })()

    return () => {
      cancelled = true
      io.disconnect()
      wake?.()
    }
    // `cards`/`details` are content and stable per call site; the cycle reads
    // their lengths once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, cardCount, detailCount])

  const { activeIdx } = phase
  const detail = getDisplayDetail(details, activeIdx)

  return (
    <div
      ref={containerRef}
      aria-label="Skene integrations animation"
      className={cn('relative aspect-square w-full overflow-hidden rounded-sm', className)}
    >
      <img
        src={backgroundImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute left-0 top-0 z-[1] flex items-center justify-center"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="flex w-[84%] flex-col gap-5 px-6 pb-5 pt-7 font-sans">
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, i) => {
              const Icon = card.icon
              const isActive = activeIdx === i
              const iconStyle = ICON_STYLES[card.variant][isActive ? 'light' : 'dark']
              return (
                <div
                  key={card.title}
                  className={cn(
                    'rounded-xl border-[0.5px] p-4',
                    isActive
                      ? 'border-black/20 bg-[#faf1e9]'
                      : 'border-white/10 bg-surface-1',
                  )}
                  /* The card's own 200ms background and border-color transition
                     rides along with the fade, since one `transition` list is
                     all an element gets. Cards come in staggered and go out
                     together, which is why the delay only applies on the way
                     in. */
                  style={{
                    ...fade(
                      phase.cards,
                      phase.cards ? CARD_IN : EXIT,
                      EASE_OUT,
                      12,
                      phase.cards ? i * CARD_STAGGER : 0,
                      phase.instant,
                    ),
                    transition: phase.instant
                      ? 'none'
                      : `background 0.2s, border-color 0.2s, ${
                          fade(
                            phase.cards,
                            phase.cards ? CARD_IN : EXIT,
                            EASE_OUT,
                            12,
                            phase.cards ? i * CARD_STAGGER : 0,
                          ).transition
                        }`,
                  }}
                >
                  <div
                    className="mb-2.5 flex size-9 items-center justify-center rounded-lg text-lg"
                    style={iconStyle}
                  >
                    <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </div>
                  <div
                    className={cn(
                      'mb-1 text-[13px] font-medium leading-snug',
                      isActive ? 'text-[#0a0a0a]' : 'text-chrome-text-primary',
                    )}
                  >
                    {card.title}
                  </div>
                  <div
                    className={cn(
                      'text-[11px] leading-normal',
                      isActive ? 'text-[#737373]' : 'text-chrome-text-muted-strong',
                    )}
                  >
                    {card.context}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="min-h-[72px] rounded-xl border-[0.5px] border-black/12 bg-[#f0e8df] px-5 py-4"
            style={fade(
              phase.detail,
              phase.detail ? DETAIL_IN : EXIT,
              EASE_OUT,
              8,
              0,
              phase.instant,
            )}
          >
            <div
              className="flex items-start gap-3"
              style={fade(
                phase.inner,
                phase.inner ? SWAP_IN : SWAP_OUT,
                phase.inner ? EASE_OUT : EASE_IN,
                4,
                0,
                phase.instant,
              )}
            >
              <span
                className="mt-0.5 shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={BADGE_STYLES[detail.badgeVariant]}
              >
                {detail.badge}
              </span>
              <div>
                <div className="text-[13px] leading-relaxed text-[#737373]">{detail.text}</div>
                <code className="mt-1.5 inline-block rounded-lg border border-black/12 bg-[#faf1e9] px-1.5 py-0.5 font-mono text-xs text-[#0a0a0a]">
                  {detail.code}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
