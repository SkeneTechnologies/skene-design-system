/**
 * The MCP artifact's panels: a config snippet you are meant to paste, and the
 * list of tools the server answers with.
 *
 * This is one PANEL, not the whole window. The surface being depicted stacks two
 * of these inside a single `AppWindow` — the `mcp.json` example above, the tool
 * catalogue below — which is why the sibling gap lives here (see below) and why
 * there is no crumb or status prop on it. Compose:
 *
 *     <AppWindow crumb={…} actions={<StatPill status="ok">…</StatPill>}>
 *       <McpBlock title={…} meta={…}><McpCode>{configText}</McpCode></McpBlock>
 *       <McpBlock title={…} meta={…}>
 *         <McpTool name={…} description={…} />
 *       </McpBlock>
 *     </AppWindow>
 *
 * ## Themed tokens, not chrome
 *
 * A code block is the usual reason to reach for `chrome.*` — a terminal stays
 * dark on a light page. This one is the exception and takes `foreground` /
 * `muted-foreground` / `border` / `card` like every other panel in the product.
 * It is not a terminal: it is a settings screen at `/workspace/{slug}/skene-mcp`
 * rendering a config sample inside its own card, and the real screen is light.
 * Painting it dark would make the artifact depict a surface that does not exist,
 * and would put a black slab in the middle of an otherwise light `AppWindow`.
 * The invariant register is `ArtPanel`'s and the terminal artifacts use it.
 *
 * ## Spacing
 *
 * Read the header of `artifact-shell.tsx` before touching a padding here. The
 * package sets `--spacing: 0.2rem`, so Tailwind's `p-3` is 9.6px while the
 * prototype's `--spacing-3` is 12px. Every value below is the literal px the
 * prototype token carries, so it diffs against `artifacts.css` line for line.
 * `p-[12px]` is not a candidate for tidying into `p-3`.
 *
 * All content is props. Nothing here knows what a tool is called, what it does,
 * or what URL the server lives at — that is the consumer's, and in the prototype
 * it is a real endpoint and a real tool vocabulary.
 */
export interface McpBlockProps {
    /** The panel's heading, left. Prose, not an identifier — it is not monospace. */
    title?: React.ReactNode;
    /**
     * The quiet right-hand half of the heading: what kind of thing this is, or how
     * many of them there are. Optional, and the header collapses if both are absent.
     */
    meta?: React.ReactNode;
    /** `<McpCode>`, or a run of `<McpTool>`s. */
    children?: React.ReactNode;
    className?: string;
}
/**
 * One panel of the MCP screen: a two-part header rule, then whatever the panel
 * holds.
 *
 * ### The sibling gap
 *
 * The prototype's rule is `.mcp + .mcp { margin-top: 12px }` — the gap belongs to
 * the second panel, not to a wrapper, because the window body may hold one panel
 * or two and neither shape should need a different parent. So it is carried on the
 * block: `[&:not(:first-child)]:mt-[12px]`, which leaves a lone block with no
 * stray margin.
 *
 * One knowing deviation. `.mcp + .mcp` requires the PRECEDING sibling to be a
 * block; `:not(:first-child)` only requires that something precedes it. Reproducing
 * the original exactly would mean inventing a marker class or attribute to select
 * on, and `AppPanel` forwards neither. The difference is 12px above a block that
 * follows something else inside the window body, which is the gap you would want
 * there anyway. A caller stacking these with flex `gap` instead should pass the
 * same variant at zero (`[&:not(:first-child)]:mt-0`) — a bare `mt-0` will not win,
 * the variant carries more specificity and `cn` only merges classes whose variants
 * match.
 *
 * ### The header wraps, and the prototype's does not
 *
 * `.mcp__h` is a plain `space-between` row on the strength of knowing both its
 * strings. Here they are props, so `flex-wrap` is added: when the pair cannot
 * share a line the meta drops below the title instead of squeezing it to one word
 * per line. Same deviation, same reason, as the `AppWindow` bar. The title is
 * wrapped in a `<span>` rather than left as a bare text node so it can take
 * `min-w-0` — an anonymous flex item cannot.
 */
export declare function McpBlock({ title, meta, children, className }: McpBlockProps): import("react").JSX.Element;
export interface McpCodeProps {
    /**
     * The snippet, verbatim. Pass a template literal — the whitespace IS the
     * content, and JSX indentation would ship as indentation. Nothing here parses
     * or highlights it; a consumer wanting tokens colours them itself and passes
     * nodes.
     */
    children: React.ReactNode;
    className?: string;
}
/**
 * The config sample: a `<pre>` that scrolls sideways inside its own panel.
 *
 * `whitespace-pre` and `overflow-x-auto` are a pair and both are load-bearing at
 * 390px. The snippet is a nested JSON object whose deepest line is well past a
 * phone's width; wrapping it would break the shape a reader is meant to copy, so
 * it scrolls, and it scrolls HERE rather than in the body. `AppPanel` also clips
 * and scrolls, which makes two nested scroll containers — harmless, the inner one
 * wins, and the outer is what catches anything else the panel holds.
 *
 * Deliberately a bare `<pre>` and not `<pre><code>`: the UA sheet gives `code` its
 * own `font-family: monospace`, which would override the inherited Geist Mono and
 * silently swap the typeface for the browser default.
 *
 * No copy button. This is a drawing of a screen, not a widget, and the one on the
 * real screen belongs to the real screen.
 */
export declare function McpCode({ children, className }: McpCodeProps): import("react").JSX.Element;
export interface McpToolProps {
    /**
     * The tool's name as the agent calls it. Monospace, because the reader is meant
     * to match it against what their agent reports doing.
     */
    name: React.ReactNode;
    /** One sentence: what calling it does. */
    description?: React.ReactNode;
    className?: string;
}
/**
 * One row of the tool catalogue: a name, a sentence, a rule under it.
 *
 * The name is `font-normal` on purpose despite being a `<b>`. A monospace
 * identifier set bold reads as emphasis on the identifier, when the emphasis
 * belongs to the row as a whole — the prototype says `font-weight: regular` here
 * and it is the same judgement `TagChip` makes about not uppercasing a table name.
 *
 * `wrap-anywhere` on the name: `skene_journey_analyse` has no space to break at,
 * and at 390px inside a padded panel an unbroken identifier is exactly what pushes
 * the page's horizontal scrollbar.
 *
 * The last row drops its rule via `last:border-b-0`, so the panel's own bottom
 * edge is the only line there. Rows are `<div>`s rather than a `<ul>`, matching the
 * surface being depicted; if this ever grows past a handful of tools, a list with
 * a real accessible name is the better shape and is a change to make deliberately.
 */
export declare function McpTool({ name, description, className }: McpToolProps): import("react").JSX.Element;
//# sourceMappingURL=mcp-block.d.ts.map