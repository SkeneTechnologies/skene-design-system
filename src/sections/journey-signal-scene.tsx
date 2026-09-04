"use client";

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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { SkeneMark } from "../patterns/skene-mark.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js";
import { useContainerScale } from "../lib/use-container-scale.js";

/**
 * Content for the JourneySignalScene.
 *
 * Every label here is checked against the company wiki
 * (skene-company-wiki/business/positioning.md, product.md, wiki-corrections.md):
 *
 *   - Vocabulary is the current docs vocabulary: Events, Flows, analytics
 *     destination. Not Tracking Signals, not Live Flows, not Analytics Bucket
 *     (the bucket archive was removed from the codebase).
 *   - The example journey is the SaaS upgrade path (upgrade_started /
 *     public.subscriptions), swapped from the original eCommerce checkout
 *     vocabulary on 2026-08-26 to match the approved alt wireframe
 *     (.webanatomy/build-page/home-calcom-style-alt/wireframe.html), whose
 *     header records the swap as this set's SaaS vocabulary. Skene sells to
 *     SaaS GTM teams (icp.md), so the hero example is a SaaS event.
 *   - Stage names come from the seven canonical lifecycle stages.
 *   - Evidence carries a source of "code" or "db": code evidence needs a file
 *     path, db evidence needs a table. That is the real Evidence model.
 *   - The PR review is an LLM judge and can be wrong, so it is labelled a
 *     review with a finding, never a guarantee.
 *   - The plans page is called Evaluator in the dashboard and Tracking plans in
 *     the docs. Unresolved, so it stays out of this scene entirely.
 */

type EvidenceSource = "code" | "db" | "metric" | "flow";

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
const EVIDENCE_ENG: { source: EvidenceSource; label: string }[] = [
  { source: "code", label: "app/upgrade/route.ts" },
  { source: "db", label: "public.subscriptions" },
];

const EVIDENCE_ENG_FOOTNOTE =
  "Where the step was found: the call in your code, and the table behind it.";

const EVIDENCE_GTM: { source: EvidenceSource; label: string }[] = [
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
const EVIDENCE_GTM_FOOTNOTE =
  "What the step feeds: the number it reports into, and the flow it sits in.";

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
  ] as { text: string; tone: "plain" | "removed" }[],
  table: "public.subscriptions",
  columns: "id, user_id, plan",
};

const FLOWS_FOOTNOTE = "How users actually move, captured by one script tag.";

const FLOW_ROWS: { label: string; count: string; active?: boolean }[] = [
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
  body:
    "upgrade_started no longer writes plan. Every activation number split by tier goes flat from this merge, and the weeks it stays broken are not recoverable later.",
  suggestionLabel: "Suggested change",
  suggestion: [
    { text: "  subscription_id: sub.id,", tone: "context" },
    { text: "  plan: sub.plan,", tone: "added" },
  ] as { text: string; tone: "context" | "added" }[],
  cta: "Apply suggestion",
  /** A model judging a diff can be wrong, so the panel says so out loud. */
  footnote: "A judgement on the diff, not a check against your plan.",
};


type Box = { x: number; y: number; w: number };

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
} as const;

/* The entry reveal is CSS, keyed on `data-entered`.
 *
 * It was a gsap timeline behind a dynamic import, and the import was dynamic
 * for a measured reason: a static `import gsap from "gsap"` put a 111 KB raw /
 * 43 KB gzipped chunk in the consuming homepage's initial script list, the
 * largest route-specific chunk on the page. Moving it into the effect took the
 * page's initial JavaScript from 310,100 to 265,801 gzipped bytes and kept
 * every word of the server-rendered copy, which the consumer's markdown corpus
 * is generated from. Removing the library keeps both properties and drops the
 * 43 KB that still shipped after the fold.
 *
 * What the timeline did is three declarations in `styles/journey-signal-scene.css`:
 * the panels rise in sequence (0.6s, 0.08s stagger, expo-out) and the two
 * connectors draw (0.5s, 0.1s stagger) once the stage is inside the top 80% of
 * the viewport, which was the ScrollTrigger's `start: "top 80%"`. An
 * IntersectionObserver sets the attribute once; nothing reverses it, which was
 * `toggleActions: "play none none none"`.
 */

type View = "gtm" | "eng";

/**
 * WHY THIS SCENE IS STILL LOCAL, re-decided 2026-08-27 (T3.5) against
 * `@skene/design-system@0.12.0` `sections/journey-signal-scene.tsx`.
 *
 * The package ships the same composition, ported out of this repo at 0.12.0
 * (CHANGELOG `5c062af`), and the standing question was whether the two reasons
 * this copy survived the port had been fixed upstream. Neither has, and the
 * first one moved further away rather than closer:
 *
 *   1. **The stage.** The packaged scene is light-themed by design, not by
 *      accident: its own leading comment says "THE SCENE IS LIGHT-THEMED, on
 *      the assumption it sits inside a `light`-classed band (e.g. `Bridge`)",
 *      it sets `--color-background-darker: #ffffff`, and its `softPulse` is ink
 *      rather than peach because "on cream a peach ring measures about 1.2:1".
 *      This scene's only home is the home hero, which sits on the near-black
 *      halftone the approved alt wireframe draws. Adopting it would put a white
 *      stage in the hero, which is the thing this copy was restored on
 *      2026-08-26 to undo.
 *   2. **The vocabulary.** The packaged content block is the PRE-swap
 *      onboarding set — `onboarding_started`, `public.accounts`, Signed up /
 *      Onboarding started / Reached first value, and an `orders` ambient table.
 *      `data.ts` here is the SaaS upgrade set the alt wireframe fixes
 *      (`upgrade_started`, `public.subscriptions`, Pricing viewed / Upgrade
 *      started / Upgrade completed), swapped 2026-08-26 for the reason recorded
 *      there. There are no props on the packaged scene, so the content is not
 *      reachable from a call site: adopting it would mean shipping the wrong
 *      example, not restyling the right one.
 *
 * Two further divergences the package cannot express either: Evidence is
 * per-view here (`EVIDENCE_ENG` / `EVIDENCE_GTM`, founder direction
 * 2026-08-26 — the packaged copy shows one shared pair), and the PR panel
 * carries the trimmed `Pull request` shape rather than the packaged severity
 * chip and second `/skene fix` path.
 *
 * The four geometry corrections below are the other half of the answer. Each
 * one is a real defect in the packaged MEDIUM/WIDE geometry, none is recorded
 * upstream, and all four are now filed as `UPLIFT-PLAN.md` T5.5 item 8. Fix
 * them upstream, land the dark stage and the SaaS vocabulary as props or as
 * exported content, and this directory can be deleted. Until then it stays,
 * and it stays for reasons, not inertia.
 */

/** Which hand-placed layout the container width calls for. */
type Mode = "wide" | "medium" | "compact";

const VIEW_LABEL: Record<View, string> = {
  gtm: "GTM",
  eng: "Engineering",
};

type Layout = {
  w: number;
  h: number;
  left: Box;
  center: Box;
  right: Box;
  connectors: string[];
};

/**
 * Three hand-placed layouts rather than one design scaled into illegibility.
 * WIDE is the three-panel chain; MEDIUM keeps evidence and the centre card
 * side by side but drops the densest panel to its own row, for hero-column
 * widths; COMPACT stacks all three, because a 1100px stage squeezed onto a
 * phone is unreadable at any scale.
 */
const WIDE: Layout = {
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
const COMPACT: Layout = {
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
const MEDIUM: Layout = {
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
  const sceneRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("gtm");
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const [mode, setMode] = useState<Mode>("wide");
  const reduced = usePrefersReducedMotion();

  const layout = mode === "wide" ? WIDE : mode === "medium" ? MEDIUM : COMPACT;
  const dark = view === "eng";

  // The container hook measures against the wide design, so every other
  // layout needs its own divisor. Same observed width either way.
  const effectiveScale = (scale * WIDE.w) / layout.w;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setMode(width >= WIDE_MIN ? "wide" : width >= MEDIUM_MIN ? "medium" : "compact");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const selectView = useCallback((next: View) => {
    setTouched(true);
    setView(next);
  }, []);

  /* Auto-advance while the scene is on screen, and hand over for good the
     moment someone reaches for the toggle themselves. */
  useEffect(() => {
    if (reduced || touched || !inView) return;
    const id = window.setInterval(
      () => setView((v) => (v === "gtm" ? "eng" : "gtm")),
      AUTO_ADVANCE_MS
    );
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
    if (!scene) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-10% 0px" }
    );
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
    if (!scene || entered) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(scene);
    return () => io.disconnect();
  }, [entered]);

  /* Each connector's length, so the stylesheet can hide the stroke behind a
     dash offset and draw it on entry. Measured rather than guessed: the paths
     are hand-placed per layout and change with it. Under reduced motion the
     stylesheet ignores this and keeps the dashed presentation attribute. */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.querySelectorAll<SVGPathElement>("[data-connector]").forEach((path) => {
      path.style.setProperty("--jss-len", String(path.getTotalLength()));
    });
  }, [layout]);

  const box = (b: Box) => ({ left: b.x, top: b.y, width: b.w });
  const animate = !reduced || undefined;

  return (
    /* `dark` is a literal here, not decoration: it is what tells
       `polarityOf` (scripts/build-context.mjs) this module applies a theme
       rather than inheriting one, and it is true rather than asserted for the
       gate's benefit. Every ink value in journey-signal-scene.css is a dark-
       ground literal (see the block comment above .jss), the stage never reads
       a `.light`/`.dark` ancestor, and the GTM centre card being cream is
       internal composition, not the section adapting to a light page. Until
       this class existed the derivation fell through to `inherits`, its default
       for "no theme literal found" rather than a claim anyone made.

       Two consumers were separately compensating for that absence, and both
       come off with this: docs-app's gallery case now wraps this module in
       `Chrome` instead of leaving it on the mode-aware page background (see
       `page.tsx`), and `JourneySceneCase` no longer paints a `bg-brand-light`
       card behind it (see `islands.tsx`) — that wrapper's own doc comment
       explained it as a fix for this exact `inherits` state, and painting
       cream behind a module whose `.jss-frame` is deliberately transparent
       ("so the hero's halftone field runs under the panels") defeated the one
       rule the stylesheet states outright. Every gallery baseline taken before
       this fix had the scene floating on a cream rectangle no page has ever
       actually shown it on, with the connectors and every "on dark" ink value
       cream-on-cream at roughly 0.55 alpha: present in the DOM, invisible on
       screen. */
    <section className="dark jss">
      <div className="jss-inner">
        <div
          ref={containerRef}
          className="jss-frame"
          style={{ aspectRatio: layout.w / layout.h }}
        >
          <div
            className="jss-scale"
            style={{
              width: layout.w,
              height: layout.h,
              transform: `scale(${effectiveScale})`,
            }}
          >
            <div
              ref={sceneRef}
              className="jss-stage"
              data-view={view}
              data-entered={entered || undefined}
            >
              <div className="jss-toggle-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/*
                      No `aria-label`. It would override the element's own
                      content, so the computed name would be the instruction and
                      the current value would never be announced. The visible
                      "View" caption makes the name "View GTM", which is what a
                      sighted reader reads too.
                    */}
                    <button
                      type="button"
                      className="jss-view-trigger"
                      onFocus={() => setTouched(true)}
                      data-inviting={(!touched && !reduced) || undefined}
                    >
                      <span className="jss-view-caption">View</span>
                      {VIEW_LABEL[view]}
                      <span className="jss-view-chevron" aria-hidden>
                        <ChevronDown size={14} />
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={6}>
                    <DropdownMenuRadioGroup
                      value={view}
                      onValueChange={(next) => selectView(next as View)}
                    >
                      <DropdownMenuRadioItem value="gtm">
                        {VIEW_LABEL.gtm}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="eng">
                        {VIEW_LABEL.eng}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <svg
                className="jss-connectors"
                viewBox={`0 0 ${layout.w} ${layout.h}`}
                aria-hidden
              >
                {layout.connectors.map((d) => (
                  <path
                    key={d}
                    data-connector
                    d={d}
                    fill="none"
                    stroke="var(--color-text-on-dark-subtle)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>

              <div data-reveal className="jss-panel jss-skin jss-left" style={box(layout.left)}>
                <p className="jss-panel-label">Evidence</p>
                {/* Keyed on the view, like the other two panels' bodies, so the
                    rows cross-fade on the toggle instead of swapping in place. */}
                <div key={view} className="jss-card-body" data-animate={animate}>
                  {(dark ? EVIDENCE_ENG : EVIDENCE_GTM).map((row) => (
                    <div key={row.label} className="jss-ev-row">
                      <span className="jss-chip" data-warm={String(CHIP_TONE[row.source].warm)}>
                        {row.source}
                      </span>
                      <span className="jss-ev-path">{row.label}</span>
                    </div>
                  ))}
                  <p className="jss-footnote">
                    {dark ? EVIDENCE_ENG_FOOTNOTE : EVIDENCE_GTM_FOOTNOTE}
                  </p>
                </div>
              </div>

              <div data-reveal className="jss-panel jss-center" style={box(layout.center)}>
                <div className="jss-card-head">
                  {/* The middle of the diagram is this card: both connectors
                      terminate on it, and it is the identity the dropped
                      `BridgeNode` used to carry. `tone` names the GROUND rather
                      than the ink (skene-mark.tsx:15-23), and this card is cream
                      in one view and near-black in the other, so `block` is the
                      variant that survives the switch: it brings its own tile
                      and is the only one safe on any ground. */}
                  <span className="jss-mark-slot" aria-hidden>
                    <SkeneMark tone="block" size={20} />
                  </span>
                  <div>
                    <p className="jss-card-label">{dark ? "Call site" : "Journey step"}</p>
                    {dark ? (
                      <h3 className="jss-path-name">{CALL_SITE.path}</h3>
                    ) : (
                      <h3 className="jss-step-name">{STEP.name}</h3>
                    )}
                  </div>
                </div>

                <div key={view} className="jss-card-body" data-animate={animate}>
                  {dark ? (
                    <>
                      <pre className="jss-code">
                        {CALL_SITE.lines.map((line) => (
                          <div
                            key={line.text}
                            className="jss-code-line"
                            data-removed={line.tone === "removed" || undefined}
                          >
                            {line.text}
                          </div>
                        ))}
                      </pre>
                      <div className="jss-table-line">
                        <span>{CALL_SITE.table}</span>
                        <span className="jss-table-cols">{CALL_SITE.columns}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="jss-badge-row">
                        <span className="jss-badge" data-tone="stage">
                          {STEP.stage} · {STEP.stageLabel}
                        </span>
                        <span className="jss-badge" data-tone="ok">
                          {STEP.confidence}
                        </span>
                        <span className="jss-badge" data-tone="warn">
                          {STEP.gap}
                        </span>
                      </div>
                      <div className="jss-feeds-row">
                        <span>Feeds</span>
                        <span className="jss-feeds-value">{STEP.feeds}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div data-reveal className="jss-panel jss-skin jss-right" style={box(layout.right)}>
                <div key={view} className="jss-card-body" data-animate={animate}>
                  {dark ? (
                    <>
                      {/* The same opening as its two neighbours. Without it the
                          panel starts on a bare `#412`, which reads as a PR
                          number only to someone who already works in PRs. */}
                      <p className="jss-panel-label">{REVIEW.label}</p>
                      <div className="jss-pr-strip">
                        <span className="jss-pr-number">{REVIEW.number}</span>
                        <span>{REVIEW.pr}</span>
                      </div>
                      <div className="jss-review-head">
                        <span className="jss-bot-badge">Skene</span>
                        <span className="jss-status-badge">{REVIEW.status}</span>
                      </div>
                      <p className="jss-review-body">{REVIEW.body}</p>
                      <div className="jss-suggestion">
                        <div className="jss-suggestion-head">{REVIEW.suggestionLabel}</div>
                        {REVIEW.suggestion.map((line) => (
                          <div
                            key={line.text}
                            className="jss-suggestion-line"
                            data-added={line.tone === "added" || undefined}
                          >
                            {line.text}
                          </div>
                        ))}
                      </div>
                      <div className="jss-commit">{REVIEW.cta}</div>
                      <p className="jss-footnote">{REVIEW.footnote}</p>
                    </>
                  ) : (
                    <>
                      <p className="jss-panel-label">Flows</p>
                      {FLOW_ROWS.map((row) => {
                        const active = Boolean(row.active) || undefined;
                        const pct =
                          (Number(row.count.replace(/,/g, "")) / FLOW_MAX) * 100;
                        return (
                          <div key={row.label}>
                            <div className="jss-flow-row" data-active={active}>
                              <span>{row.label}</span>
                              <span className="jss-flow-count" data-active={active}>
                                {row.count}
                              </span>
                            </div>
                            <div
                              className="jss-flow-bar"
                              data-active={active}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        );
                      })}
                      <p className="jss-footnote">{FLOWS_FOOTNOTE}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySignalScene;
