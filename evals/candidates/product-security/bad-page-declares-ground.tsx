/** Fixture: the page sets a ground per band, re-inventing per-page grounds. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable } from '@skene/design-system/sections/key-value-table'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="bg-surface-deep-2 py-[96px] md:py-[128px]">
        <KeyValueTable columns={[{ header: 'Control' }, { header: 'Value' }]} rows={[{ id: 'r', cells: ['Retention', '30 days'] }]} />
      </section>
      <section className="bg-surface-deep-2 py-[96px] md:py-[128px]">
        <KeyValueTable columns={[{ header: 'Control' }, { header: 'Value' }]} rows={[{ id: 'r', cells: ['Residency', 'eu-west-1'] }]} />
      </section>
    </>
  )
}
