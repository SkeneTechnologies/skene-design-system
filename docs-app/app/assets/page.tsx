import { SkeneLockup, SkeneMark } from '@skene/design-system/patterns/skene-mark'
import { SectionBackdrop } from '@skene/design-system/sections/section-backdrop'

/**
 * Everything the package ships as a FILE, in one place.
 *
 * The gallery answers "what components exist" and `/decisions` answers "which
 * one do I use". Neither shows the artwork, and the artwork is the half of this
 * package a consumer cannot re-derive: a texture is not a colour, and the mark
 * is not a glyph. Until this page existed the only way to see what
 * `assets/` held was to list the directory.
 *
 * Every asset is rendered through the component that owns it where one exists,
 * rather than as a bare <img> — the point is what the file is FOR.
 */

const DITHER_URL = new URL(
  '../../node_modules/@skene/design-system/assets/dither-subpage.webp',
  import.meta.url,
).href
const PIXEL_URL = new URL(
  '../../node_modules/@skene/design-system/assets/pixel-bg.webp',
  import.meta.url,
).href

function Row({
  name,
  importPath,
  note,
  children,
}: {
  name: string
  importPath: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,20rem)_1fr]">
      <div>
        <h2 className="text-lg">{name}</h2>
        <p className="mt-1 font-mono text-[11px] wrap-anywhere text-muted-foreground">
          {importPath}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{note}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function AssetsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl">Assets</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        The eleven files this package ships. All are exported —{' '}
        <code className="font-mono text-[12px]">&quot;./assets/*&quot;</code> in the export map,
        and <code className="font-mono text-[12px]">assets</code> in{' '}
        <code className="font-mono text-[12px]">files</code> — so a consumer reaches them by
        import path and never copies them into its own <code className="font-mono text-[12px]">public/</code>.
      </p>

      <Row
        name="The Skene symbol"
        importPath="@skene/design-system/assets/skene-symbol-{block,on-dark,on-light}.svg — or the SkeneMark component"
        note="Three files picked by the ground they sit on. block brings its own black tile and is safe anywhere; onDark is the white glyph; onLight is the BLACK one. The prop names the ground, not the ink."
      >
        <div className="flex flex-wrap gap-4">
          <figure className="grid gap-3 rounded-xl bg-chrome-surface-1 p-5">
            <SkeneMark size={72} radius={18} />
            <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-text-muted">
              block
            </figcaption>
          </figure>
          <figure className="grid gap-3 rounded-xl bg-chrome-surface-1 p-5">
            <SkeneMark tone="onDark" size={72} />
            <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-text-muted">
              onDark
            </figcaption>
          </figure>
          <figure className="light grid gap-3 rounded-xl bg-brand-light p-5">
            <SkeneMark tone="onLight" size={72} />
            <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
              onLight
            </figcaption>
          </figure>
        </div>
      </Row>

      <Row
        name="The lockup"
        importPath="@skene/design-system/assets/skene-lockup-{on-dark,on-light,accent}.svg — or the SkeneLockup component"
        note="Symbol and wordmark as one object, sized by HEIGHT. onDark and accent are byte-identical to the marketing site's skene-logo.svg and skene-logo-accent.svg; onLight is derived from onDark by swapping its 61 fills, because the brand folder had no black lockup and a wordmark nobody can put on a cream band gets re-drawn locally."
      >
        <div className="grid gap-3">
          <div className="rounded-xl bg-chrome-surface-1 px-6 py-5">
            <SkeneLockup height={30} />
          </div>
          <div className="rounded-xl bg-chrome-surface-1 px-6 py-5">
            <SkeneLockup tone="accent" height={30} />
          </div>
          <div className="light rounded-xl bg-brand-light px-6 py-5">
            <SkeneLockup tone="onLight" height={30} />
          </div>
        </div>
      </Row>

      <Row
        name="Halftone fields"
        importPath="@skene/design-system/assets/card{1,2,3}_bg.webp — or SectionBackdrop"
        note="The pairing is fixed and follows the live site: card1 behind journeys and measurement, card2 behind GitHub and editor chrome, card3 behind schema and connections. A reader who knows the site meets the same field behind the same kind of panel."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {(['journey', 'github', 'schema'] as const).map((texture) => (
            <figure key={texture} className="grid gap-2">
              <SectionBackdrop texture={texture} className="min-h-0 rounded-xl" inset={4}>
                <div className="h-24 rounded-lg bg-chrome-surface-1" />
              </SectionBackdrop>
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {texture}
              </figcaption>
            </figure>
          ))}
        </div>
      </Row>

      <Row
        name="Subpage dither"
        importPath="@skene/design-system/assets/dither-subpage.webp — assetUrls.subpageDither"
        note="The ground a subpage header sits on: a dithered photograph, already dark (mean rgb 33/30/25), used as a background image rather than as an overlay. DitherOverlay's `src` takes a TEXTURE to blend over media, which is a different job — put this file there and soft-light tints it to whatever is underneath."
      >
        <div
          className="h-52 rounded-xl bg-chrome-surface-1"
          style={{
            backgroundImage: `url(${DITHER_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        />
      </Row>

      <Row
        name="Pixel field"
        importPath="@skene/design-system/assets/pixel-bg.webp"
        note="The closing-CTA backdrop. FinalCta ships it, so a caller renders that section without knowing this file exists."
      >
        <div
          className="h-44 rounded-xl bg-chrome-surface-1"
          style={{ backgroundImage: `url(${PIXEL_URL})`, backgroundSize: 'cover' }}
        />
      </Row>

      <section className="mt-10 rounded-xl border border-border p-5">
        <h2 className="text-lg">What stays in the marketing repo</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Six files there were byte-identical to these and were deleted on 2026-08-13:{' '}
          <code className="font-mono text-[12px]">card1_bg</code>,{' '}
          <code className="font-mono text-[12px]">card2_bg</code>,{' '}
          <code className="font-mono text-[12px]">card3_bg</code>,{' '}
          <code className="font-mono text-[12px]">pixel-bg</code>,{' '}
          <code className="font-mono text-[12px]">subpage-bg</code> and{' '}
          <code className="font-mono text-[12px]">skene-logo-accent.svg</code>. What is left there
          is content and one crawler dependency:{' '}
          <code className="font-mono text-[12px]">skene-logo.svg</code> stays in{' '}
          <code className="font-mono text-[12px]">public/</code> because the site cites it as an
          absolute URL from structured data,{' '}
          <code className="font-mono text-[12px]">skene-logo-footer.svg</code> is a watermark this
          package does not ship, and the vendor logos, screenshots and hero video are page content.
        </p>
      </section>
    </main>
  )
}
