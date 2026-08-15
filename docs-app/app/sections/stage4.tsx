'use client'

import { useState } from 'react'
import { Button } from '@skene/design-system/ui/button'
import { ProductWindow } from '@skene/design-system/sections/product-window'
import { PipelineStepper } from '@skene/design-system/sections/pipeline-stepper'
import { AskWidget } from '@skene/design-system/sections/ask-widget'
import { AnnotatedCurve } from '@skene/design-system/sections/annotated-curve'
import { LightSectionCard } from '@skene/design-system/sections/light-section-card'
import { StatChip, MetaChip } from '@skene/design-system/sections/stat-chip'

/**
 * The six archetypes added in Stage 4, in the shape the live homepage uses them.
 *
 * A client island only because AskWidget is controlled; the rest are
 * server-renderable and are rendered here purely to keep the demo in one file.
 */
export function Stage4() {
  const [ask, setAsk] = useState('')
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3">
        <StatChip icon={<span aria-hidden>★</span>}>121 stars</StatChip>
        <MetaChip icon={<span aria-hidden>◷</span>} status="Roadmap">
          Turnkey dollar-revenue view
        </MetaChip>
      </div>

      <ProductWindow title="skene · journey analysis" >
        <div className="p-6">
          <PipelineStepper
            onLight
            title="Starting journey analysis…"
            subtitle="This may take a few minutes. Stay on this page to see live pipeline updates."
            steps={[
              { label: 'Analyzing Schema', state: 'done' },
              { label: 'Events from codebase', state: 'active' },
              { label: 'Generating plan', state: 'pending' },
            ]}
          />
        </div>
      </ProductWindow>

      <AskWidget
        avatar={
          <span className="grid size-9 place-items-center rounded-full bg-chrome-surface-2 text-[13px]">
            T
          </span>
        }
        name="Teemu"
        question="Would Skene work with your stack?"
        lede="Name your tools. We'll show what Skene can check, how it connects, and where it won't fit."
        placeholder="For example: Next.js, Supabase, GitHub Actions, PostHog"
        submitLabel="Check my setup"
        value={ask}
        onValueChange={setAsk}
      />

      <div className="rounded-2xl border border-chrome-line-subtle bg-chrome-surface-1 p-8">
        <AnnotatedCurve
          points={[
            { x: 12, y: 82, label: '1. A tracking call goes missing in a green PR.' },
            { x: 48, y: 55, label: '2. An agent renames it? Skene catches it on your PR.' },
            { x: 86, y: 18, label: '3. Every event still fires. The number holds.' },
          ]}
        />
      </div>

      <LightSectionCard
        title="Four ways to plug Skene in."
        lede="Ask questions from your coding agent (MCP server). Run it on every pull request (GitHub Action). Call it from your own scripts (Cloud API)."
        actions={
          <>
            <Button>Start free</Button>
            <Button variant="outline">Read more</Button>
          </>
        }
      >
        <p>Same engine behind each.</p>
      </LightSectionCard>
    </div>
  )
}
