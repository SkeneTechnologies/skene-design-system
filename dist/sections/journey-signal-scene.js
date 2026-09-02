"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Evidence, a traced journey step, and the PR review that catches it breaking,
 * in one composition with a GTM/Engineering toggle.
 *
 * ## Plain CSS since 2026-09-02, and why it was styled-components before
 *
 * This scene was ported in from skene-marketing-website, where it predates the
 * package's Tailwind port and carries a real history: it was once rebuilt on
 * this package's own primitives (`MiniFunnel`, `AppPanel`, `DiffColumn`,
 * `PrReview` stood in for its three panels), and the founder rejected that
 * version on sight and restored this one. "Produced correct components and a
 * dead band: two panels that swapped wholesale, no ambient context, no
 * connectors, one fade on entry." The entry/reveal choreography, the
 * per-layout absolute positioning, and the connector paths are load-bearing
 * for how it reads, not incidental styling. That is why it arrived on
 * styled-components as a documented exception to `machine/rules.yaml`'s
 * `styled_components_for_new_features`, and stayed that way for a week; see
 * `documentation/20260825_journey_signal_scene_design.md`.
 *
 * The exception is closed. The rejection was about the composition changing,
 * not about the styling library, so the styled definitions were ported 1:1 to
 * `styles/journey-signal-scene.css` (issue #24): same declarations, same
 * numbers, with the props that drove a style (`$dark`, `$active`, `$tone`...)
 * as `data-*` attributes and the numbers a prop computed as inline styles. The
 * stylesheet ships through `styles/index.css`, so a consumer that has wired
 * the package stylesheet has it. gsap went in the same change: the entry
 * reveal is an IntersectionObserver and two CSS transitions now, at the
 * timings the timeline ran. Nothing in the package depends on either library
 * any more.
 *
 * One file, not three, unlike its skene-marketing-website source
 * (index.tsx/styles.ts/data.ts). Every other module in `src/sections` is a
 * single flat file, and both `scripts/build-inventory.mjs` and
 * `scripts/check-story-coverage.mjs` scan `src/sections` non-recursively for
 * `.tsx` files — a subfolder or a sibling `.ts` file is invisible to both, not
 * merely unconventional. The content block right below the imports is kept
 * separate from the styled-components definitions further down for the same
 * reason `data.ts` existed: edit the exported consts in that block for
 * different labels without touching the rest of the file.
 *
 * ## Re-synced from the source 2026-09-02
 *
 * The port above happened on 2026-08-25 and then the two copies drifted, in one
 * direction: skene-marketing-website put six more commits into its copy and this
 * file got none of them. Anything else consuming this section was rendering a
 * stale scene, and the drift was invisible from either side.
 *
 * What arrived with the re-sync:
 *
 *   TWO EVIDENCE SETS instead of one. `EVIDENCE_ENG` and `EVIDENCE_GTM`, on
 *   founder direction 2026-08-26: the panel showed a file path and a table in
 *   BOTH views, which is the engineer's answer handed to a GTM reader who has
 *   no use for it. The scene's whole claim is that one signal has two readings,
 *   and Evidence was the panel not making it. `EvidenceSource` widened from
 *   "code" | "db" to include "metric" and "flow" to carry it.
 *
 *   A COPY CORRECTION, 2026-08-29. "the metric it moves" became "the number it
 *   reports into". The shipped string asserted that the step MOVES the metric,
 *   which is a causal claim the consumer's `voice.md:57` bans, and it
 *   contradicted the panel's own "Feeds" label eight lines away.
 *
 *   A `$dark` prop threaded through several styled components (the
 *   `data-view` attribute on the stage, since the CSS port), and gsap loaded
 *   inside the entry effect rather than at module scope, which is the same
 *   change 0.18.0 made to `CardAnimationIntegrations` for the same reason
 *   (and which the 2026-09-02 change made moot by removing gsap).
 *
 * The two repository-local dependencies the source file carried did not need
 * porting. Its `useContainerScale` is character-for-character this package's
 * `lib/use-container-scale` apart from quoting, and its `media` import from
 * `@/styles/breakpoints` had ZERO uses in the file.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SkeneMark } from "../patterns/skene-mark.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, } from "../ui/dropdown-menu.js";
import { useContainerScale } from "../lib/use-container-scale.js";
/**
 * Evidence, once per view. Founder direction 2026-08-26: the panel showed a
 * file path and a table in BOTH views, which is the engineer's answer given to
 * a GTM reader who has no use for it. The scene's whole claim is that one
 * signal has two readings, and Evidence was the one panel not making it.
 *
 * Engineering gets the code evidence it already had. GTM gets the same step
 * stated as what it produces: the metric it feeds, and the flow it sits in.
 * Both pairs are already elsewhere in this file (`STEP.feeds`, `FLOW_ROWS`), so
 * the two views cannot drift apart.
 *
 * The footnote states where the pair came from, because a badge over a bare
 * string does not. Flows carries a line like it for the same reason.
 */
const EVIDENCE_ENG = [
    { source: "code", label: "app/upgrade/route.ts" },
    { source: "db", label: "public.subscriptions" },
];
const EVIDENCE_ENG_FOOTNOTE = "Where the step was found: the call in your code, and the table behind it.";
const EVIDENCE_GTM = [
    { source: "metric", label: "Paid conversion rate" },
    { source: "flow", label: "Upgrade started" },
];
/**
 * "the number it reports into", not "the metric it moves", corrected 2026-08-29.
 * The shipped string asserted that the step MOVES the metric, which is a causal
 * claim `voice.md:57` bans, and it contradicted the panel's own "Feeds" label
 * eight lines away. Reporting into a number is what the component actually
 * draws.
 */
const EVIDENCE_GTM_FOOTNOTE = "What the step feeds: the number it reports into, and the flow it sits in.";
const STEP = {
    name: "Upgrade started",
    stage: "activation",
    stageLabel: "First Value",
    /** Events detected in the codebase are reported at 100% confidence. */
    confidence: "Detected · 100%",
    feeds: "Paid conversion rate",
    gap: "1 property missing: plan",
};
const CALL_SITE = {
    path: "app/upgrade/route.ts",
    lines: [
        { text: 'skene.track("upgrade_started", {', tone: "plain" },
        { text: "  subscription_id: sub.id,", tone: "plain" },
        { text: "  plan: sub.plan,", tone: "removed" },
        { text: "})", tone: "plain" },
    ],
    table: "public.subscriptions",
    columns: "id, user_id, plan",
};
const FLOWS_FOOTNOTE = "How users actually move, captured by one script tag.";
const FLOW_ROWS = [
    { label: "Pricing viewed", count: "4,182" },
    { label: "Upgrade started", count: "1,097", active: true },
    { label: "Upgrade completed", count: "863" },
];
/**
 * What the GitHub App posts on a pull request.
 *
 * This is the LLM judge path: the webhook fetches the PR diff and asks a model
 * to judge the tracking changes in it. It does not read the evidence panel on
 * the left, and it is not the deterministic check. Those are separate paths
 * that share no code and can disagree, so this panel never claims to be a
 * comparison against the plan.
 *
 * The fix arrives as a GitHub suggestion block, and there are two ways to take
 * it: click apply on the suggestion, or comment /skene fix on the pull
 * request. Both happen in GitHub. Nothing is copied and pasted anywhere else,
 * so this panel must never show the reader a prompt to carry somewhere.
 */
/**
 * Trimmed 2026-08-26, founder note: "the #412 should be clear that this is a
 * PR. Now there is bit too much going on for a visitor to easily comprehend."
 *
 * Two changes. The panel now carries a `Pull request` label, so it opens the
 * same way its two neighbours do (`Evidence`, `Call site`) instead of starting
 * cold on a bare `#412` that only a developer reads as a PR number.
 *
 * And three things came out. The `Medium` severity badge was a third chip in a
 * row where the status chip is the one that matters. The `or comment
 * /skene fix` line was a second path offered before the reader has taken in the
 * first. The footnote's second sentence ("It holds the merge until you accept
 * it or dismiss it") is true and is documented on /product/features; what has
 * to survive HERE is the hedge, because a model judging a diff can be wrong and
 * the panel says so out loud. All three are recoverable from this comment.
 */
const REVIEW = {
    pr: "Add plan tiers to upgrade",
    number: "#412",
    label: "Pull request",
    status: "Changes requested",
    body: "upgrade_started no longer writes plan. Every activation number split by tier goes flat from this merge, and the weeks it stays broken are not recoverable later.",
    suggestionLabel: "Suggested change",
    suggestion: [
        { text: "  subscription_id: sub.id,", tone: "context" },
        { text: "  plan: sub.plan,", tone: "added" },
    ],
    cta: "Apply suggestion",
    /** A model judging a diff can be wrong, so the panel says so out loud. */
    footnote: "A judgement on the diff, not a check against your plan.",
};
/* Four sources, two per view: `code`/`db` for Engineering and `metric`/`flow`
   for GTM. The first of each pair is the warm one and the second the green
   one, so the Evidence panel keeps the same two-tone reading whichever view is
   up. The colours per tone and ground are in the stylesheet, keyed on
   `data-warm`. */
const CHIP_TONE = {
    code: { warm: true },
    metric: { warm: true },
    db: { warm: false },
    flow: { warm: false },
};
const VIEW_LABEL = {
    gtm: "GTM",
    eng: "Engineering",
};
/**
 * Three hand-placed layouts rather than one design scaled into illegibility.
 * WIDE is the three-panel chain; MEDIUM keeps evidence and the centre card
 * side by side but drops the densest panel to its own row, for hero-column
 * widths; COMPACT stacks all three, because a 1100px stage squeezed onto a
 * phone is unreadable at any scale.
 */
const WIDE = {
    w: 1100,
    h: 516,
    left: { x: 8, y: 150, w: 268 },
    center: { x: 322, y: 58, w: 430 },
    right: { x: 800, y: 90, w: 292 },
    connectors: ["M 276 216 H 299 V 190 H 322", "M 752 216 H 776 V 190 H 800"],
};
/**
 * Rebuilt 2026-08-26 against the ENGINEERING view, and widened.
 *
 * The 400x1040 version was laid out against the GTM view's panel heights
 * (132 / 192 / 216), but the Engineering view runs the same three panels much
 * taller (132 / 238 / 354) and overran its own floor. Every box below is
 * placed against the taller view, so both read the same.
 *
 * The width went 400 to 460 for the hero swap. The stage scales to its
 * container, so wider design units mean a SMALLER rendered stage. The panels
 * widen with it (368 to 428, same 16px margins), so the extra units go to the
 * copy rather than to a right-hand gutter.
 */
const COMPACT = {
    w: 460,
    h: 904,
    left: { x: 16, y: 60, w: 428 },
    center: { x: 16, y: 266, w: 428 },
    right: { x: 16, y: 536, w: 428 },
    /* Straight drops down the stack's centre line (460/2 = 230), from each
       panel's bottom edge in the GTM view to the next panel's top edge. */
    connectors: ["M 230 234 V 266", "M 230 458 V 536"],
};
/**
 * For hero-column widths (roughly 420-720px), where WIDE's three-across chain
 * would clip and COMPACT's full vertical stack reads far too tall next to a
 * hero's text column. Evidence and the centre card stay side by side (the
 * pairing a reader scans first); the densest panel (Flows / PR review) drops
 * to its own full-width row below.
 *
 * Ported from `@skene/design-system@0.12.0`
 * `sections/journey-signal-scene.tsx`, which grew this layout for exactly this
 * slot, and then corrected in four places. See the standing note above `Mode`
 * for why the package version is not adopted wholesale; the four corrections
 * are annotated inline below. Three are upstream defects and are filed as
 * T5.5 item 8; the fourth is this repo's own, corrected 2026-08-27.
 */
const MEDIUM = {
    w: 600,
    h: 690,
    /* Every box starts below y 48, because `ToggleRow` is absolutely positioned
       at top 20 / right 24 of the STAGE, not of a panel. With the packaged
       centre card at y 24 the View control landed inside it: white-on-cream,
       which is why it kept reading as an empty pill in the GTM view. The strip
       is reserved now, in this layout and in COMPACT.
  
       NOT an upstream defect, corrected 2026-08-27. The absolute placement is
       OURS, at `styles.ts:351-359`; the package puts the switch in flow below
       the stage (`journey-signal-scene.tsx:445-449`, with a comment saying why),
       so `MEDIUM.center.y: 24` collides with nothing there. It is a porting
       hazard rather than a defect, and is filed upstream as one. This layout
       keeps the reserved strip because this repo keeps the absolute toggle.
  
       The height is the ENGINEERING view's, not the GTM one. Upstream's 640
       leaves 5px under the PR review panel, so any copy change clips it. This is
       336 + 317 with a real floor under it, re-measured after the review panel
       was trimmed. UPSTREAM DEFECT 1 of 3: packaged `MEDIUM.h` is 640. Nothing
       consumed MEDIUM upstream before this site did, so none of the three was
       caught there; re-verified unrecorded in the package at 0.12.0 on
       2026-08-27. */
    /* UPSTREAM DEFECT 2 of 3, T5.5 item 8.
       Evidence is 230 wide, not the package's 170. At 170 both of its rows
       ellipsis — `app/upgrade/…` and `public.subscri…` — and the panel's whole
       job is naming the file and the table. 230 clears the longer of the two
       (`app/upgrade/route.ts`, 20 mono characters after the `code` badge) with
       16px to spare. Journey step / Call site gives up the 60: at 322 it still
       holds its widest line, `skene.track("upgrade_started", {`, unwrapped. */
    left: { x: 16, y: 60, w: 230 },
    center: { x: 262, y: 60, w: 322 },
    right: { x: 16, y: 336, w: 568 },
    /**
     * Anchored to measured geometry, not guessed. Evidence (left) runs two rows
     * and a footnote and sits 190px tall, so 60 + 190/2 = 155 is its right
     * edge's vertical mid-point, and 16 + 230 = 246 is that edge (the package's
     * 186/126 was for a 170-wide, footnote-less box).
     * Journey step / Call site (center) bottoms out at 60 + 192 = 252 in the GTM
     * view, which is where the second connector starts, straight down to Flows /
     * PR review's top edge at 336. The Engineering view runs that card to 298, so
     * the connector begins under it there — upstream's behaviour, kept: a
     * connector that moved with the toggle would redraw on every auto-advance.
     */
    connectors: ["M 246 155 H 254 V 96 H 262", "M 423 252 V 336"],
};
const AUTO_ADVANCE_MS = 6000;
/* UPSTREAM DEFECT 3 of 3, T5.5 item 8.
   WIDE needs 900, not the package's 720. At 768 the hero stacks and the scene
   takes the full 730px column — over 720, so WIDE fired and scaled its 1100px
   stage to 0.66, putting the panel body copy at 8.6px. The tablet got the
   desktop layout and the desktop got the phone one. 900 is the width where
   WIDE holds 0.82 or better; below it MEDIUM reads better at any size. */
const WIDE_MIN = 900;
const MEDIUM_MIN = 420;
/** Flow bar widths, as a share of the top of the funnel. */
const FLOW_MAX = 4182;
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => setReduced(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);
    return reduced;
}
export function JourneySignalScene() {
    const { containerRef, scale } = useContainerScale(WIDE.w);
    const sceneRef = useRef(null);
    const [view, setView] = useState("gtm");
    const [touched, setTouched] = useState(false);
    const [inView, setInView] = useState(false);
    const [mode, setMode] = useState("wide");
    const reduced = usePrefersReducedMotion();
    const layout = mode === "wide" ? WIDE : mode === "medium" ? MEDIUM : COMPACT;
    const dark = view === "eng";
    // The container hook measures against the wide design, so every other
    // layout needs its own divisor. Same observed width either way.
    const effectiveScale = (scale * WIDE.w) / layout.w;
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const ro = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            setMode(width >= WIDE_MIN ? "wide" : width >= MEDIUM_MIN ? "medium" : "compact");
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [containerRef]);
    const selectView = useCallback((next) => {
        setTouched(true);
        setView(next);
    }, []);
    /* Auto-advance while the scene is on screen, and hand over for good the
       moment someone reaches for the toggle themselves. */
    useEffect(() => {
        if (reduced || touched || !inView)
            return;
        const id = window.setInterval(() => setView((v) => (v === "gtm" ? "eng" : "gtm")), AUTO_ADVANCE_MS);
        return () => window.clearInterval(id);
    }, [reduced, touched, inView]);
    /* Whether the stage is on screen, which is all the auto-advance needs.
  
       An IntersectionObserver and not the entry timeline's ScrollTrigger
       callbacks, which is what this used to be. `onEnter` fires on CROSSING the
       start line, so a reader who lands with the section already in the viewport
       never crosses it and the switch just sits there. An observer reports the
       state rather than the transition, so it is right on load and right after a
       resize. */
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene)
            return;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "-10% 0px" });
        io.observe(scene);
        return () => io.disconnect();
    }, []);
    /* Entry, in two parts. `data-entered` on the stage is what the stylesheet
       keys the reveal on; the observer's bottom margin is the old ScrollTrigger's
       `start: "top 80%"`, so the stage counts as entered once any of it is inside
       the top 80% of the viewport. Set once and never cleared. */
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene || entered)
            return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting)
                setEntered(true);
        }, { rootMargin: "0px 0px -20% 0px" });
        io.observe(scene);
        return () => io.disconnect();
    }, [entered]);
    /* Each connector's length, so the stylesheet can hide the stroke behind a
       dash offset and draw it on entry. Measured rather than guessed: the paths
       are hand-placed per layout and change with it. Under reduced motion the
       stylesheet ignores this and keeps the dashed presentation attribute. */
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene)
            return;
        scene.querySelectorAll("[data-connector]").forEach((path) => {
            path.style.setProperty("--jss-len", String(path.getTotalLength()));
        });
    }, [layout]);
    const box = (b) => ({ left: b.x, top: b.y, width: b.w });
    const animate = !reduced || undefined;
    return (_jsx("section", { className: "jss", children: _jsx("div", { className: "jss-inner", children: _jsx("div", { ref: containerRef, className: "jss-frame", style: { aspectRatio: layout.w / layout.h }, children: _jsx("div", { className: "jss-scale", style: {
                        width: layout.w,
                        height: layout.h,
                        transform: `scale(${effectiveScale})`,
                    }, children: _jsxs("div", { ref: sceneRef, className: "jss-stage", "data-view": view, "data-entered": entered || undefined, children: [_jsx("div", { className: "jss-toggle-row", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: "jss-view-trigger", onFocus: () => setTouched(true), "data-inviting": (!touched && !reduced) || undefined, children: [_jsx("span", { className: "jss-view-caption", children: "View" }), VIEW_LABEL[view], _jsx("span", { className: "jss-view-chevron", "aria-hidden": true, children: _jsx(ChevronDown, { size: 14 }) })] }) }), _jsx(DropdownMenuContent, { align: "end", sideOffset: 6, children: _jsxs(DropdownMenuRadioGroup, { value: view, onValueChange: (next) => selectView(next), children: [_jsx(DropdownMenuRadioItem, { value: "gtm", children: VIEW_LABEL.gtm }), _jsx(DropdownMenuRadioItem, { value: "eng", children: VIEW_LABEL.eng })] }) })] }) }), _jsx("svg", { className: "jss-connectors", viewBox: `0 0 ${layout.w} ${layout.h}`, "aria-hidden": true, children: layout.connectors.map((d) => (_jsx("path", { "data-connector": true, d: d, fill: "none", stroke: "var(--color-text-on-dark-subtle)", strokeWidth: 1.5, strokeDasharray: "4 4" }, d))) }), _jsxs("div", { "data-reveal": true, className: "jss-panel jss-skin jss-left", style: box(layout.left), children: [_jsx("p", { className: "jss-panel-label", children: "Evidence" }), _jsxs("div", { className: "jss-card-body", "data-animate": animate, children: [(dark ? EVIDENCE_ENG : EVIDENCE_GTM).map((row) => (_jsxs("div", { className: "jss-ev-row", children: [_jsx("span", { className: "jss-chip", "data-warm": String(CHIP_TONE[row.source].warm), children: row.source }), _jsx("span", { className: "jss-ev-path", children: row.label })] }, row.label))), _jsx("p", { className: "jss-footnote", children: dark ? EVIDENCE_ENG_FOOTNOTE : EVIDENCE_GTM_FOOTNOTE })] }, view)] }), _jsxs("div", { "data-reveal": true, className: "jss-panel jss-center", style: box(layout.center), children: [_jsxs("div", { className: "jss-card-head", children: [_jsx("span", { className: "jss-mark-slot", "aria-hidden": true, children: _jsx(SkeneMark, { tone: "block", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "jss-card-label", children: dark ? "Call site" : "Journey step" }), dark ? (_jsx("h3", { className: "jss-path-name", children: CALL_SITE.path })) : (_jsx("h3", { className: "jss-step-name", children: STEP.name }))] })] }), _jsx("div", { className: "jss-card-body", "data-animate": animate, children: dark ? (_jsxs(_Fragment, { children: [_jsx("pre", { className: "jss-code", children: CALL_SITE.lines.map((line) => (_jsx("div", { className: "jss-code-line", "data-removed": line.tone === "removed" || undefined, children: line.text }, line.text))) }), _jsxs("div", { className: "jss-table-line", children: [_jsx("span", { children: CALL_SITE.table }), _jsx("span", { className: "jss-table-cols", children: CALL_SITE.columns })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "jss-badge-row", children: [_jsxs("span", { className: "jss-badge", "data-tone": "stage", children: [STEP.stage, " \u00B7 ", STEP.stageLabel] }), _jsx("span", { className: "jss-badge", "data-tone": "ok", children: STEP.confidence }), _jsx("span", { className: "jss-badge", "data-tone": "warn", children: STEP.gap })] }), _jsxs("div", { className: "jss-feeds-row", children: [_jsx("span", { children: "Feeds" }), _jsx("span", { className: "jss-feeds-value", children: STEP.feeds })] })] })) }, view)] }), _jsx("div", { "data-reveal": true, className: "jss-panel jss-skin jss-right", style: box(layout.right), children: _jsx("div", { className: "jss-card-body", "data-animate": animate, children: dark ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "jss-panel-label", children: REVIEW.label }), _jsxs("div", { className: "jss-pr-strip", children: [_jsx("span", { className: "jss-pr-number", children: REVIEW.number }), _jsx("span", { children: REVIEW.pr })] }), _jsxs("div", { className: "jss-review-head", children: [_jsx("span", { className: "jss-bot-badge", children: "Skene" }), _jsx("span", { className: "jss-status-badge", children: REVIEW.status })] }), _jsx("p", { className: "jss-review-body", children: REVIEW.body }), _jsxs("div", { className: "jss-suggestion", children: [_jsx("div", { className: "jss-suggestion-head", children: REVIEW.suggestionLabel }), REVIEW.suggestion.map((line) => (_jsx("div", { className: "jss-suggestion-line", "data-added": line.tone === "added" || undefined, children: line.text }, line.text)))] }), _jsx("div", { className: "jss-commit", children: REVIEW.cta }), _jsx("p", { className: "jss-footnote", children: REVIEW.footnote })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "jss-panel-label", children: "Flows" }), FLOW_ROWS.map((row) => {
                                                const active = Boolean(row.active) || undefined;
                                                const pct = (Number(row.count.replace(/,/g, "")) / FLOW_MAX) * 100;
                                                return (_jsxs("div", { children: [_jsxs("div", { className: "jss-flow-row", "data-active": active, children: [_jsx("span", { children: row.label }), _jsx("span", { className: "jss-flow-count", "data-active": active, children: row.count })] }), _jsx("div", { className: "jss-flow-bar", "data-active": active, style: { width: `${pct}%` } })] }, row.label));
                                            }), _jsx("p", { className: "jss-footnote", children: FLOWS_FOOTNOTE })] })) }, view) })] }) }) }) }) }));
}
export default JourneySignalScene;
