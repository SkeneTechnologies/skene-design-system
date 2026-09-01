/** Fixture: the artifact without the reference half. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'

export default function AnalyticsUseCase() {
  return (
    <section className="py-[128px] md:py-[176px]">
      <ArtFrame kind="jr"><ArtPanel>checkout_completed</ArtPanel></ArtFrame>
    </section>
  )
}
