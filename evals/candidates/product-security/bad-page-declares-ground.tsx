/** Fixture: the page sets a ground per band, re-inventing per-page grounds. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable, KeyValueRow } from '@skene/design-system/sections/key-value-table'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="bg-surface-deep-2 py-[96px] md:py-[128px]">
        <KeyValueTable><KeyValueRow label="Retention" value="30 days" /></KeyValueTable>
      </section>
      <section className="bg-surface-deep-2 py-[96px] md:py-[128px]">
        <KeyValueTable><KeyValueRow label="Residency" value="eu-west-1" /></KeyValueTable>
      </section>
    </>
  )
}
