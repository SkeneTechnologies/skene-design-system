'use client'

import { useState } from 'react'
import { Button } from '@skene/design-system/ui/button'
import { PlanGrid, PlanCard } from '@skene/design-system/sections/plan-card'
import { BillingToggle } from '@skene/design-system/sections/billing-toggle'
import { CheckList, CheckItem } from '@skene/design-system/sections/check-list'

/**
 * The live pricing band. A client island because the billing switch holds state;
 * everything it renders is server-renderable on its own.
 *
 * Prices are the yearly/monthly pair from the live site, so the toggle changes
 * something real rather than miming.
 *
 * They are a snapshot for layout purposes and nothing updates them. skene.ai is
 * the only place pricing is stated; a number here that has drifted is a stale
 * fixture, not an offer. Worth saying now that this repository is public.
 */
const PLANS = [
  {
    tier: 'PRO',
    flag: 'Popular',
    monthly: 29,
    yearly: 24,
    summary: '1.5M monthly tokens',
    featured: true,
    features: ['Local MCP server', 'GitHub Action with PR comments', 'Cloud validation API', '1.5M monthly tokens'],
  },
  {
    tier: 'SCALE',
    monthly: 99,
    yearly: 82,
    summary: '6M monthly tokens',
    features: ['Local MCP server', 'GitHub Action with PR comments', 'Cloud validation API', '6M monthly tokens (4x Pro)'],
  },
  {
    tier: 'ULTRA',
    monthly: 199,
    yearly: 166,
    summary: '15M monthly tokens',
    features: ['Local MCP server', 'GitHub Action with PR comments', 'Cloud validation API', '15M monthly tokens (10x Pro)', 'Priority support'],
  },
]

export function PricingDemo() {
  const [yearly, setYearly] = useState(false)
  return (
    <div>
      <BillingToggle yearly={yearly} onChange={setYearly} />
      <PlanGrid>
        {PLANS.map((p) => (
          <PlanCard
            key={p.tier}
            tier={p.tier}
            flag={p.flag}
            featured={p.featured}
            price={`$${yearly ? p.yearly : p.monthly}`}
            unit="/mo"
            summary={p.summary}
            features={
              <CheckList dense onLight={p.featured}>
                {p.features.map((f) => (
                  <CheckItem dense key={f}>
                    {f}
                  </CheckItem>
                ))}
              </CheckList>
            }
            action={
              <Button className="w-full" variant={p.featured ? 'default' : 'outline'}>
                Start free →
              </Button>
            }
          />
        ))}
      </PlanGrid>
    </div>
  )
}
