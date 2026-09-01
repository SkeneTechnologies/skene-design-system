/** Fixture: a literal hex in a class, and chrome.* on a surface that flips. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'

export default function SecurityPage() {
  return (
    <section className="py-[96px] md:py-[128px] bg-[#0a0a0a]">
      <div className="bg-chrome-surface-1 text-chrome-text-primary p-6">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </div>
    </section>
  )
}
