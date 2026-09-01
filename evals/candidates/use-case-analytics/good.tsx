/** Both load-bearing modules, artifact first, table under it. */
import { ArtFrame, ArtPanel, ArtTitle } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable, KeyValueRow } from '@skene/design-system/sections/key-value-table'
import { Funnel, FunnelStep } from '@skene/design-system/sections/funnel'

export default function AnalyticsUseCase() {
  return (
    <>
      <section className="py-[128px] md:py-[176px]">
        <ArtFrame kind="jr">
          <ArtPanel>
            <ArtTitle>checkout_completed</ArtTitle>
            <Funnel>
              <FunnelStep label="view_item" value="128,400" />
              <FunnelStep label="checkout_completed" value="0" />
            </Funnel>
          </ArtPanel>
        </ArtFrame>
      </section>
      <section className="py-[64px] md:py-[80px]">
        <KeyValueTable>
          <KeyValueRow label="Last seen" value="14 days ago" />
          <KeyValueRow label="Source" value="web-checkout@2.3.1" />
        </KeyValueTable>
      </section>
    </>
  )
}
