/** Fixture: two signature bands, so there is no signature. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { TrustPanel, TrustFact } from '@skene/design-system/sections/trust-panel'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[128px] md:py-[176px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="py-[128px] md:py-[176px]">
        <TrustPanel title="What we will not do"><TrustFact title="Region pinned">eu-west-1 only.</TrustFact></TrustPanel>
      </section>
    </>
  )
}
