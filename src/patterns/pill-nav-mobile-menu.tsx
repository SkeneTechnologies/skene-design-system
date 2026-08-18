'use client'

import { ChevronDown, X } from 'lucide-react'
import { useEffect, useId } from 'react'

import { cn } from '../lib/utils.js'
import { PILL_NAV_FROSTED_STYLE } from './pill-nav-frosted.js'

export interface PillNavMobileLink {
  href: string
  label: React.ReactNode
  active?: boolean
}

export interface PillNavMobileMenuToggleProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  panelId: string
}

/** Menu/Close control. Must stay in the top bar, above the drawer layers. */
export function PillNavMobileMenuToggle({
  isOpen,
  onOpenChange,
  panelId,
}: PillNavMobileMenuToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        'pointer-events-auto relative z-[1050] flex items-center gap-2 rounded-[4px] px-4 py-2 font-mono text-xs',
        'font-medium uppercase tracking-[0.05em] text-white/90 md:hidden',
      )}
      style={PILL_NAV_FROSTED_STYLE}
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={() => onOpenChange(!isOpen)}
    >
      {isOpen ? 'Close' : 'Menu'}
      {isOpen ? <X size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
    </button>
  )
}

export interface PillNavMobileMenuLayersProps {
  links: PillNavMobileLink[]
  actions?: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  panelId: string
}

/**
 * Overlay + panel rendered as siblings of the nav bar, not inside it — same
 * arrangement as skene-marketing-website Navigation. Keeps the bar (and Close)
 * above z-[1040] while the drawer sits underneath at z-[1040].
 */
export function PillNavMobileMenuLayers({
  links,
  actions,
  isOpen,
  onOpenChange,
  panelId,
}: PillNavMobileMenuLayersProps) {
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[1040] bg-black/60 transition-[opacity,visibility] duration-[250ms] ease-in-out md:hidden',
          'visible opacity-100',
        )}
        aria-hidden={false}
        onClick={() => onOpenChange(false)}
      />

      <div
        id={panelId}
        role="dialog"
        aria-modal
        className={cn(
          'fixed inset-0 z-[1040] flex flex-col bg-[#141414] pt-14 transition-[opacity,visibility] duration-[250ms] ease-in-out md:hidden',
          'visible opacity-100',
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-4 pt-8">
          <nav className="flex flex-col px-6">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'block w-full border-t border-white/10 py-4 text-2xl transition-colors duration-150',
                  link.active ? 'text-brand-peach' : 'text-white/90',
                  'hover:text-white/90',
                  index === links.length - 1 && 'border-b border-white/10',
                )}
                onClick={() => onOpenChange(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        {actions ? (
          <div className="flex gap-2 px-6 pb-4 pt-6">{actions}</div>
        ) : null}
      </div>
    </>
  )
}

export function usePillNavMobileMenuId() {
  return useId()
}
