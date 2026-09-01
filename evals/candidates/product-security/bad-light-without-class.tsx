/** Fixture: the 1.08:1 defect — a cream panel with no `light` class. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { KeyValueTable } from '@skene/design-system/sections/key-value-table'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="bg-brand-light py-[96px] md:py-[128px]">
        <KeyValueTable
          columns={[{ header: 'Control' }, { header: 'Value' }]}
          rows={[{ id: 'retention', cells: ['Retention', '30 days'] }]}
        />
      </section>
    </>
  )
}
