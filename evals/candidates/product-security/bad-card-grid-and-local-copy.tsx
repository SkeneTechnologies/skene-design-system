/** Fixture: marketing cards as Card in a grid, plus a locally copied Button. */
import { ArtFrame, ArtPanel } from '@skene/design-system/sections/artifact-shell'
import { Card, CardContent } from '@skene/design-system/ui/card'
import { Button } from '../../components/ui/button'

export default function SecurityPage() {
  return (
    <>
      <section className="py-[96px] md:py-[128px]">
        <ArtFrame kind="gh"><ArtPanel>scopes</ArtPanel></ArtFrame>
      </section>
      <section className="py-[96px] md:py-[128px]">
        <div className="grid grid-cols-3 gap-6">
          <Card><CardContent>No write access</CardContent></Card>
          <Card><CardContent>Region pinned</CardContent></Card>
          <Card><CardContent>30-day retention</CardContent></Card>
        </div>
        <Button>Talk to us</Button>
      </section>
    </>
  )
}
