/**
 * Fixture: the API is invented. This is the shape that scored 6/6 before
 * `props_exist` existed — right imports, wrong everything else.
 */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable, KeyValueRow } from '@skene/design-system/sections/key-value-table'

export default function AnalyticsUseCase() {
  return (
    <>
      <section className="py-[128px] md:py-[176px]">
        <ArtFrame kind="purple" spin={3}>
          <ArtPanel elevation="xxl">checkout_completed</ArtPanel>
        </ArtFrame>
      </section>
      <section className="py-[64px] md:py-[80px]">
        <KeyValueTable>
          {/* KeyValueRow is a TYPE, not a component */}
          <KeyValueRow label="Last seen" value="14 days ago" />
        </KeyValueTable>
      </section>
    </>
  )
}
