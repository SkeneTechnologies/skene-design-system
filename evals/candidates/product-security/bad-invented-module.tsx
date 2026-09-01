/** Fixture: reaches for a module that does not exist rather than the index. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { SecurityBadgeGrid } from '@skene/design-system/sections/security-badge-grid'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="py-[96px] md:py-[128px]"><SecurityBadgeGrid /></section>
    </>
  )
}
