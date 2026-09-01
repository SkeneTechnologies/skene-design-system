/** Both load-bearing modules, artifact first, table under it. */
import { ArtFrame, ArtPanel, ArtTitle } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable } from '@skene/design-system/sections/key-value-table'
import { Funnel, FunnelRow } from '@skene/design-system/sections/funnel'

export default function AnalyticsUseCase() {
  return (
    <>
      <section className="py-[128px] md:py-[176px]">
        <ArtFrame kind="jr">
          <ArtPanel>
            <ArtTitle>checkout_completed</ArtTitle>
            <Funnel title="Checkout">
              <FunnelRow label="view_item" value="128,400" state="ok" />
              <FunnelRow label="checkout_completed" value="0" state="broken" />
            </Funnel>
          </ArtPanel>
        </ArtFrame>
      </section>
      <section className="py-[64px] md:py-[80px]">
        <KeyValueTable
          columns={[{ header: 'Field' }, { header: 'Value', mono: true }]}
          rows={[
            { id: 'seen', cells: ['Last seen', '14 days ago'] },
            { id: 'src', cells: ['Source', 'web-checkout@2.3.1'] },
          ]}
        />
      </section>
    </>
  )
}
