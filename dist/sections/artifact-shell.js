import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../ui/table.js';
/**
 * Resolved against this module, never as `/img/card2_bg.webp`. A consumer
 * installing the package has no `public/img`, and a bare path would render as a
 * missing image in every app but the prototype it was written in. Same mechanism
 * as `SectionBackdrop`.
 */
const TEXTURE_URL = {
    gh: new URL('../../assets/card2_bg.webp', import.meta.url).href,
    db: new URL('../../assets/card3_bg.webp', import.meta.url).href,
    jr: new URL('../../assets/card1_bg.webp', import.meta.url).href,
};
/**
 * The dithered field an artifact floats on.
 *
 * Three things differ from the live site's `Container`, each on purpose:
 *
 *   - no `aspect-ratio`. The live depictions are square animations; these are
 *     real tables and reviews of wildly different heights, and forcing a square
 *     would either crop them or strand them in a void.
 *   - no border. The texture is bright enough to define its own edge, and this
 *     frame stands on the page ground rather than inside a card.
 *   - an opaque background COLOUR under the texture, so a frame whose image
 *     fails to load is still a surface and not a hole. `surface.deep-2` is the
 *     themed role, not `chrome.*`: this is page furniture and should invert with
 *     the page, and no text ever sits on it — every panel that lands here paints
 *     its own opaque ground, which is what terminates the contrast walk.
 *
 * The fixed padding is the visible texture and is set to land near the live
 * proportion rather than picked for looks: the live panel is 84–92% of a square
 * container, so ~4–8% of the width shows on each side. 48px on a 1216px frame is
 * 3.9%; 16px at 390px is 4.1%. Too little and the backdrop reads as a stray
 * border.
 *
 * `row` swaps that for 6% because padding alone does not give a card row the
 * live picture — the first attempt made exactly that mistake. A percentage holds
 * the proportion at every track width by construction instead of at three
 * breakpoints by arithmetic, and the min-height supplies the vertical room the
 * live square has so the texture is above and below the card and not only beside
 * it. min-height rather than aspect-ratio: a two-up row at 1440 is a 600px track,
 * and a true square there is a 600px tile carrying two lines of copy.
 *
 * Decorative: nothing here is announced, and the children own the frame.
 */
export function ArtFrame({ kind, row = false, className, children }) {
    return (_jsx("div", { className: cn('min-w-0 overflow-hidden rounded-xl bg-surface-deep-2 bg-cover bg-center bg-no-repeat', row
            ? // The child stretches so a two-card row keeps equal heights; min-w-0
                // so a long line inside it wraps instead of widening the track.
                'flex min-h-[16rem] items-center p-[6%] md:min-h-[22rem] [&>*]:min-w-0 [&>*]:flex-auto'
            : 'p-[16px] md:p-[32px] lg:p-[48px]', className), style: { backgroundImage: `url(${TEXTURE_URL[kind]})` }, children: children }));
}
/**
 * The artifact frame itself: a bordered, rounded, clipped box with an optional
 * chrome bar.
 *
 * `overflow: hidden` is load-bearing rather than tidy. Everything that goes in
 * here — a diff, a code column, a table — scrolls sideways inside its own
 * element, and without the clip a wide row bleeds past the rounded corner and
 * pushes the page body's horizontal scrollbar instead.
 *
 * The default border and bar are the fixed-dark developer chrome, because that
 * is what an unqualified artifact is. `AppWindow` below is the light Skene Cloud
 * variant and does not go through here; the marketing `.art--panel` flavour
 * (`bg-surface-1`, `border-surface-border`) is one `className` away.
 */
export function ArtPanel({ bar, className, children }) {
    return (_jsxs("div", { className: cn('min-w-0 max-w-full overflow-hidden rounded-xl border border-terminal-chrome-github-border', className), children: [bar ? (_jsx("div", { className: "flex min-h-[32px] items-center gap-[8px] border-b border-terminal-border bg-terminal-bar px-[12px] py-[8px] font-mono text-[13px] text-terminal-text", children: bar })) : null, children] }));
}
/**
 * The label in an `ArtPanel` bar. Exists only to carry the gap that separates it
 * from the traffic lights — which is wider than the bar's own `gap` because the
 * lights are one object and the title is the next.
 */
export function ArtTitle({ className, children }) {
    return _jsx("span", { className: cn('ml-[12px]', className), children: children });
}
/**
 * Skene Cloud's page chrome: breadcrumb, actions, body.
 *
 * Anatomy is copied from `DashboardPageShell`, not approximated — the padding
 * step at 640px, the breadcrumb's muted parent and medium current segment, the
 * right-held action cluster.
 *
 * It carries `light` unconditionally. See the file header: the product is light,
 * the page around it is dark, and an artifact that inherits the page's polarity
 * is a picture of a product that does not exist. If a consumer ever needs this
 * to follow the ambient theme — the dashboard rendering its own chrome inside
 * `.dark`, say — that wants a prop and a decision, not a `className` override,
 * because `cn` cannot unset a theme class.
 *
 * The bar is dropped whole when there is no crumb and no actions. That is not a
 * convenience: the funnel artifact is deliberately unbranded — product palette,
 * no product chrome — because no Skene surface renders a funnel and the chart is
 * the reader's own dashboard.
 */
export function AppWindow({ crumb, actions, className, children }) {
    return (_jsxs("div", { className: cn('light min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-background text-foreground', className), children: [crumb || actions ? (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-[12px] px-[16px] pt-[16px] sm:px-[24px] sm:pt-[24px]", children: [crumb ? (_jsx("div", { 
                        // on this card against a 4.5 floor — a real miss, not a rounding one,
                        // and it is a shared slot the dashboard also uses, so moving its value
                        // to win 0.01 here would reach further than the problem. text.muted is
                        // #525252 on light and clears comfortably.
                        className: "flex items-center gap-[8px] text-[14px] text-text-muted [&_b]:font-medium [&_b]:text-foreground", children: crumb })) : (_jsx("span", {})), actions ? _jsx("div", { className: "flex items-center gap-[8px]", children: actions }) : null] })) : null, _jsx("div", { className: "p-[16px] sm:p-[24px]", children: children })] }));
}
/**
 * The crumb and the bar an `AppWindow` takes, built from the flat props an
 * artifact receives.
 *
 * Four artifacts computed these inline — `discovery-table`, `integration-rows`,
 * `lifecycle-canvas` and, in a variant, `evaluator-*` — with the same twenty
 * lines and the same explanatory comment each time. Byte-identical, verified
 * before this extraction, which is why it changes no pixels.
 *
 * Both halves are `undefined` when empty rather than an empty element, and that
 * is the load-bearing part: `AppWindow` drops its whole bar when neither is
 * present, and an empty flex row above the panel reads as a rendering fault
 * rather than as an absence.
 */
export function artifactHeader({ title, source, separator, summary, 
// `bad`, matching what all three call sites defaulted to before this was
// extracted: an artifact with a headline count exists because a scan found
// something, and a clean scan passes `ok` and says so.
summaryStatus = 'bad', actions, }) {
    const crumb = title || source ? (_jsxs(_Fragment, { children: [title ? _jsx("b", { children: title }) : null, title && source ? _jsx("span", { children: separator }) : null, source ? _jsx("span", { children: source }) : null] })) : undefined;
    const bar = summary || actions ? (_jsxs(_Fragment, { children: [summary ? _jsx(StatPill, { status: summaryStatus, children: summary }) : null, actions] })) : undefined;
    return { crumb, bar };
}
/**
 * The caption strip at the head of an `AppPanel` — a title on the left, a count
 * or a note on the right, over the panel's own hairline.
 *
 * Written out character-for-character in four files before this existed:
 * `mcp-block`, `evaluator-check`, `evaluator-verify` and `evaluator-panel`. All
 * four import from this module and none of them found it here, because it was
 * not here — `McpBlock` is this strip wrapped in an `AppPanel`, under a name
 * that hides the fact.
 *
 * `items-baseline`, not `items-center`: the right-hand side is usually smaller
 * type, and centring it makes the two look misaligned at 12px.
 */
export function PanelCaption({ className, children }) {
    return (_jsx("div", { className: cn('flex flex-wrap items-baseline justify-between gap-[12px] border-b border-border px-[12px] py-[8px] text-[12px] text-foreground', className), children: children }));
}
/**
 * The content card inside an `AppWindow` body — the shadcn Card recipe from
 * layouts.yaml, with no shadow (principles.md 16: flat panels take a border).
 *
 * It clips vertically and scrolls horizontally, which is the pairing that keeps
 * a wide table inside the artifact. Put the `min-w` on the table, never here, or
 * the page body scrolls instead of the panel.
 */
export function AppPanel({ className, children }) {
    return (_jsx("div", { className: cn('overflow-hidden overflow-x-auto rounded-lg border border-border bg-card text-card-foreground', className), children: children }));
}
/**
 * The same three the dashboard uses, bound the same way `Finding` binds its
 * `good | warn | danger`. The vocabulary is fixed rather than free-form because a
 * marketing page and a product that disagree about what "broken" looks like teach
 * the reader the wrong colour.
 *
 * The prototype additionally darkened these for the light panel
 * (`--status-error-text` and friends). Those tokens do not exist in this package
 * and inventing them is `ask_first_when: a_token_value_would_change`, so the pill
 * ships on the untouched semantic tokens and the gap is reported rather than
 * papered over. See `known_gaps: light_mode_brand_palette`.
 */
/**
 * Two colours per status, not one, and this is the whole fix for the pills.
 *
 * GRAPHIC is the rim and the fill. TEXT is the label. They used to be the same
 * token, and on a light AppWindow card every label came in under the floor:
 * 3.98 for error-red, 4.26 matcha, 4.36 and 4.45 amber, all against 4.5:1,
 * measured off the rendered pill at 390, 768 and 1440 alike.
 *
 * The cause was subtler than the known_gaps table suggested. The light
 * variants of these tokens are real and were in use — the failing red WAS
 * #c44239, the light value. They were derived to clear 4.5:1 on the light
 * SURFACE ladder, and a pill does not sit on the surface ladder. It sits on a
 * 10% tint of its own graphic colour, a warmer and slightly different ground,
 * and the derivation missed it by 0.05 to 0.52.
 *
 * So the label takes a token derived against the ground it is actually on.
 * This is the split the prototype already had as --status-*-text against
 * --status-*-graphic; the package simply did not carry it across.
 */
const STATUS_GRAPHIC = {
    bad: 'var(--color-semantic-error-red)',
    warn: 'var(--color-semantic-warning-amber)',
    ok: 'var(--color-semantic-matcha)',
};
const STATUS_TEXT = {
    bad: 'var(--color-semantic-error-red-on-tint)',
    warn: 'var(--color-semantic-warning-amber-on-tint)',
    ok: 'var(--color-semantic-matcha-on-tint)',
};
/** `ok` is the calmer state, so its edge and fill sit a notch differently. */
const STATUS_MIX = {
    bad: { border: 40, fill: 10 },
    warn: { border: 40, fill: 10 },
    ok: { border: 35, fill: 12 },
};
/**
 * The status pill: a dot, a word, a tinted capsule.
 *
 * The dot is a real element, not a `::before`. The prototype draws it as a
 * pseudo-element filled with `currentColor` and that is invisible to the
 * pixel-contrast harness's glyph diff — it reads as a glyph pixel and quietly
 * skews the measurement of every artifact containing a pill. Rendering it keeps
 * the appearance (still `currentColor`, still 6px) and makes it a thing the
 * harness can see and exclude. It is `aria-hidden`: the word beside it already
 * says what it is.
 *
 * Every edge and fill is derived from the one status colour rather than picked,
 * so a caller cannot produce a red pill with an amber rim.
 */
export function StatPill({ status, className, children }) {
    const graphic = STATUS_GRAPHIC[status];
    const text = STATUS_TEXT[status];
    const mix = STATUS_MIX[status];
    return (_jsxs("span", { className: cn('inline-flex items-center gap-[4px] whitespace-nowrap rounded-full border px-[8px] py-[4px] font-sans text-[11px] font-medium leading-none', className), style: {
            color: text,
            borderColor: `color-mix(in oklab, ${graphic} ${mix.border}%, transparent)`,
            background: `color-mix(in oklab, ${graphic} ${mix.fill}%, transparent)`,
        }, children: [_jsx("span", { "aria-hidden": true, className: "size-[6px] shrink-0 rounded-full", style: { background: graphic } }), children] }));
}
/**
 * The product's table, at the product's density.
 *
 * This composes `@skene/design-system/ui/table` rather than restating it. That
 * primitive already owns the scroll container, the semantic element tree and the
 * last-row rule suppression; what it does not own is Skene Cloud's density, which
 * is materially tighter than shadcn's default — a 36px header against `h-10`,
 * 11px uppercase headings at 0.16em against 14px sentence case, 13px
 * tabular-numeral cells against `text-sm`. Copying the primitive to change those
 * numbers is `copy_a_primitive_into_an_app_to_tweak_it`; overriding them through
 * `cn` is the same edit with one table left in the package.
 *
 * The rule sits on the row, not the cell, which is where the prototype put it.
 * Identical rendering under `border-collapse`, and it lets `TableBody`'s own
 * `[&_tr:last-child]:border-0` drop the last rule for free instead of a second
 * selector doing it by hand.
 *
 * Rows are children rather than a `rows` array because the cells are not
 * uniform: an event name is monospace, a location is monospace and quiet, and a
 * status is a `StatPill`. A data-shaped API would have to grow a renderer prop
 * per column to say so.
 */
export function DataTable({ columns, children, className }) {
    return (_jsxs(Table, { className: cn('border-collapse bg-card', className), children: [_jsx(TableHeader, { children: _jsx(TableRow, { className: "border-b hover:bg-transparent", style: { borderColor: 'var(--border)' }, children: columns.map((column, i) => (_jsx(TableHead, { scope: "col", className: "h-[36px] px-[12px] align-middle font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground", children: column }, i))) }) }), _jsx(TableBody, { children: children })] }));
}
/**
 * One body row. The rule is 60% of `--border` — a full-strength line at this row
 * height turns a six-row table into a grid, and the header rule above it stops
 * reading as the header rule.
 */
export function DataRow({ children, className }) {
    return (_jsx(TableRow, { className: cn('border-b hover:bg-muted', className), style: { borderColor: 'color-mix(in oklab, var(--border) 60%, transparent)' }, children: children }));
}
/**
 * One body cell. `tabular-nums` is on by default and is not a nicety: these
 * tables are read by scanning a column of counts, and proportional digits make
 * the column jitter.
 */
export function DataCell({ mono, muted, children, className }) {
    return (_jsx(TableCell, { className: cn('px-[12px] py-[8px] align-middle text-[13px] tabular-nums text-foreground', mono && 'font-mono', muted && 'text-[12px] text-muted-foreground', className), children: children }));
}
