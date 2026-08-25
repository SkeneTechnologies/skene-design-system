'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ClipboardCheck, Cloud, GitPullRequest, Terminal, type LucideIcon } from 'lucide-react'

import { cn } from '../lib/utils.js'
import { useContainerScale } from '../lib/use-container-scale.js'

gsap.registerPlugin(ScrollTrigger)

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
    title: 'GitHub Action',
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
    badge: 'GitHub Action',
    badgeVariant: 'gray',
    text: 'Add it to your workflow file and every PR gets an analytics diff comment automatically. Zero extra steps.',
    code: 'uses: skene-ai/action@v1',
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
    text: 'A one-time scan of your current instrumentation surface. See what you have before you adopt anything else.',
    code: 'skene audit .',
  },
]

const DESIGN_WIDTH = 700
const CYCLE_HOLD = 2.2
const SWAP_OUT = 0.15
const SWAP_IN = 0.3
const FIRST_ACTIVE_DELAY = 0.35

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

function resetElements(
  cards: HTMLDivElement[],
  detailPanel: HTMLDivElement | null,
  detailInner: HTMLDivElement | null,
  setActiveIdx: (idx: number | null) => void,
) {
  gsap.set(cards, { autoAlpha: 0, y: 12 })
  gsap.set(detailPanel, { autoAlpha: 0, y: 8 })
  gsap.set(detailInner, { autoAlpha: 1, y: 0 })
  setActiveIdx(null)
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
}

/**
 * Four integration cards on a textured field, cycling detail copy with GSAP.
 * Ported from skene-marketing-website's `CardAnimationIntegrations`.
 */
export function CardAnimationIntegrations({
  backgroundImage = INTEGRATIONS_TEXTURE,
  cards = INTEGRATION_ANIMATION_CARDS,
  details = INTEGRATION_ANIMATION_DETAILS,
  className,
}: CardAnimationIntegrationsProps) {
  const { containerRef, scale } = useContainerScale(DESIGN_WIDTH)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const detailPanelRef = useRef<HTMLDivElement>(null)
  const detailInnerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  useEffect(() => {
    const cardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const detailPanel = detailPanelRef.current
    const detailInner = detailInnerRef.current
    const visibleElements = [...cardElements, detailPanel].filter(Boolean)

    const ctx = gsap.context(() => {
      resetElements(cardElements, detailPanel, detailInner, setActiveIdx)

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
        delay: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play pause resume pause',
        },
      })

      tl.call(() => {
        resetElements(cardElements, detailPanel, detailInner, setActiveIdx)
      })
        .to(cardElements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.12,
        })
        .to({}, { duration: FIRST_ACTIVE_DELAY })
        .call(() => setActiveIdx(0))
        .to(
          detailPanel,
          { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '<',
        )
        .to({}, { duration: CYCLE_HOLD })
        .to(detailInner, {
          autoAlpha: 0,
          y: 4,
          duration: SWAP_OUT,
          ease: 'power2.in',
        })

      for (let idx = 1; idx < details.length; idx++) {
        tl.call(() => setActiveIdx(idx)).to(detailInner, {
          autoAlpha: 1,
          y: 0,
          duration: SWAP_IN,
          ease: 'power2.out',
        })

        if (idx < details.length - 1) {
          tl.to({}, { duration: CYCLE_HOLD - SWAP_OUT - SWAP_IN }).to(detailInner, {
            autoAlpha: 0,
            y: 4,
            duration: SWAP_OUT,
            ease: 'power2.in',
          })
        } else {
          tl.to({}, { duration: CYCLE_HOLD - SWAP_IN })
        }
      }

      tl.to(visibleElements, {
        autoAlpha: 0,
        duration: 0.4,
        delay: 2,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

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
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className={cn(
                    'rounded-xl border-[0.5px] p-4 transition-[background,border-color] duration-200',
                    isActive
                      ? 'border-black/20 bg-[#faf1e9]'
                      : 'border-white/10 bg-surface-1',
                  )}
                  style={{ visibility: 'hidden' }}
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
            ref={detailPanelRef}
            className="min-h-[72px] rounded-xl border-[0.5px] border-black/12 bg-[#f0e8df] px-5 py-4"
            style={{ visibility: 'hidden' }}
          >
            <div ref={detailInnerRef} className="flex items-start gap-3">
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
