"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * A documented exception to `machine/rules.yaml`'s `styled_components_for_new_features`.
 *
 * This scene was ported in from skene-marketing-website, where it predates the
 * package's Tailwind port and carries a real history: it was once rebuilt on
 * this package's own primitives (`MiniFunnel`, `AppPanel`, `DiffColumn`,
 * `PrReview` stood in for its three panels), and the founder rejected that
 * version on sight and restored this one. "Produced correct components and a
 * dead band: two panels that swapped wholesale, no ambient context, no
 * connectors, one fade on entry." The entry/reveal choreography, the
 * per-layout absolute positioning, and the connector paths are load-bearing
 * for how it reads, not incidental styling, which is why it stayed on
 * styled-components instead of being re-tried against the rule a second time.
 * See `documentation/20260825_journey_signal_scene_design.md`.
 *
 * Kept as its own island rather than converted: importing this file does not
 * pull styled-components into anything else in the package, since nothing
 * else here uses it.
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
 *   A `$dark` prop threaded through several styled components, and gsap loaded
 *   inside the entry effect rather than at module scope, which is the same
 *   change 0.18.0 made to `CardAnimationIntegrations` for the same reason.
 *
 * The two repository-local dependencies the source file carried did not need
 * porting. Its `useContainerScale` is character-for-character this package's
 * `lib/use-container-scale` apart from quoting, and its `media` import from
 * `@/styles/breakpoints` had ZERO uses in the file.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import styled, { css, keyframes } from "styled-components";
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
/* A long settle on the way in. Everything here eases the same way so the
   entry and the view switch feel like one motion system. */
const EASE_IN = "cubic-bezier(0.16, 1, 0.3, 1)";
const fadeInUp = keyframes `
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
/* Peach again. The ink ring below it was the cream-stage reading; the stage is
   back on near-black per the approved alt wireframe, which is the ground this
   pulse was drawn for in the first place. */
const softPulse = keyframes `
  0%, 100% { box-shadow: 0 0 0 0 rgba(254, 192, 137, 0.38); }
  50%      { box-shadow: 0 0 0 6px rgba(254, 192, 137, 0); }
`;
/* ---------------------------------------------------------------- section */
/*
 * THE SCENE IS DARK-THEMED AGAIN, restored 2026-08-26 to the approved alt
 * wireframe (.webanatomy/build-page/home-calcom-style-alt/wireframe.html).
 * The block between this restoration and the original dark cut was a
 * deliberate inversion to a white stage for the cream `Bridge` band; the
 * homepage hero is the scene's only remaining home and it sits on
 * `chrome.surface.darker`, which is the ground the wireframe draws: near-black
 * stage, dark translucent side panels with light ink, cream centre card in the
 * GTM view, faint light ambient text, light dashed connectors.
 *
 * Why the block still exists at all: the scene was authored against
 * `(landing)/globals.scss`, which the `(site)` routes do not load; only
 * `globals.css` is there, and it leaves most of these names undefined while
 * aliasing three of them (--color-accent, --color-primary, --color-secondary)
 * to the design-system palette. Declaring the set on this section keeps the
 * scene's own vocabulary intact without overriding those three for the package
 * components that share the page.
 *
 * The values are the DARK reading of the same names, transcribed from the
 * wireframe's `.scene` styles. Literals rather than theme-aware `text.*`
 * aliases on purpose: outside a `light` subtree those aliases resolve to light
 * ink, but the centre card is CREAM in the GTM view, so its internal roles
 * (--color-text-light / --color-text-dark) must stay ink-dark no matter what
 * ancestor the section gains. The stage-side roles are light literals for the
 * same reason in reverse.
 *
 * What never flipped in either direction: everything the engineering view
 * draws. `--color-terminalChrome-*` is invariant in `globals.css`, which is
 * `machine/rules.yaml:115-131` working as designed. A code block and a GitHub
 * review are the exact case that role exists for.
 */
const sceneTokens = css `
  --color-primary: #000000;
  /* The GTM centre card's ground: cream, the wireframe's .scene__center
     background (--cream = brand.light). Was #ffffff on the white stage. */
  --color-secondary: var(--color-brand-light);
  /* Outside a 'light' subtree this is the bright reading, #fec089 — the value
     drawn for near-black. (Inside the old cream band it resolved to #89684a,
     which is why the inversion had to route around it.) */
  --color-accent: var(--color-brand-peach);
  /* The active flow row's tint, back to a peach wash on dark. Was a
     brown-alpha tint tuned for white. */
  --color-accent-muted: rgba(254, 192, 137, 0.14);
  /* Stage-side ink: the toggle and the active flow row, both on dark. */
  --color-text: #faf1e9;
  /* CARD-side muted ink: the GTM card label and feeds value, on cream.
     Wireframe reads #525252 (.scene__feeds) beside a warm #8a6a4f label;
     one token serves both here, as it always has. */
  --color-text-light: #525252;
  /* CARD-side primary ink on cream, wireframe's #1a1a1a. */
  --color-text-dark: #1a1a1a;
  /* The three "on dark" roles mean what their names say again. The wireframe's
     readings: ev-path warm-strong, muted rows, and the .3-alpha subtle tier
     shared by panel labels, connectors and footnotes. */
  --color-text-on-dark: rgba(250, 241, 233, 0.82);
  --color-text-on-dark-muted: rgba(250, 241, 233, 0.64);
  --color-text-on-dark-subtle: rgba(250, 241, 233, 0.55);
  /* The quiet role inside the two GitHub-dark engineering panels. Unchanged by
     both the inversion and this restoration: those panels never flipped. */
  --color-chrome-muted: rgba(201, 209, 217, 0.62);
  /* Brand for those same GitHub-dark panels. warmTan is the invariant
     chrome-side warm the rest of the review already uses; kept even though
     --color-accent is bright again, so the review's warm stays the chrome
     family's rather than the brand's. */
  --color-chrome-accent: var(--color-terminalChrome-warmTan);
  --color-background-dark: transparent;
  /* The stage ground the comments kept naming through the white era: the
     near-black the dark-only panels were always read against. */
  --color-background-darker: #0d1117;
  /* Wireframe panel border: rgba(255,255,255,.10); one notch up so the frame
     edge survives the wash. Was chrome.line.onLight for the white stage. */
  --color-border-on-dark: rgba(255, 255, 255, 0.12);
  --font-primary:
    var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif), sans-serif;
  --font-mono: var(--font-geist-mono, ui-monospace, monospace), monospace;
  --font-size-xs: 12px;
  --font-size-base: 16px;
  --line-height-relaxed: 1.75;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --transition-fast: 150ms ease;
`;
/* `Bridge` owns the band's ground, padding and max width, so this owns none of
   them. `media` is still imported for the panels below. */
const Section = styled.section `
  ${sceneTokens};
  position: relative;
  /* Bridge wraps each child in its own flex track (bridge.tsx:246-260), so this
     is a flex ITEM and would otherwise size to its content. BridgeNode carries
     the same width for the same reason (bridge.tsx:99). */
  width: 100%;
  min-width: 0;
`;
const Inner = styled.div `
  width: 100%;
`;
/* ------------------------------------------------------------ scale stage */
/* The frame follows whichever layout is in play, so the stage never leaves a
   band of empty floor underneath it. */
const Container = styled.div `
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  overflow: hidden;
  /* No ground and no border, founder direction 2026-08-26.
     The stage used to paint its own near-black plus a top-lit white wash, and
     ring itself in the on-dark border token. That reads as a framed picture of
     the product sitting in the hero. Transparent, the hero's halftone field
     runs under the panels and they read as floating on it instead — the panels
     keep their own borders and grounds, so the chain is still legible; only
     the box around it is gone. overflow: hidden stays: it clips the scaled
     wrapper, which is layout, not decoration. */
  background: transparent;
  border: 0;
`;
const ScaleWrapper = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: top left;
`;
const Stage = styled.div `
  position: absolute;
  inset: 0;
`;
const panelBase = css `
  position: absolute;
  box-sizing: border-box;
  border-radius: var(--radius-sm);
  left: ${({ $box }) => $box.x}px;
  top: ${({ $box }) => $box.y}px;
  width: ${({ $box }) => $box.w}px;

  /* Sunk and hidden until the entry timeline lifts it, so nothing flashes
     into place first. Motion off means no timeline, so CSS shows it here. */
  opacity: 0;
  transform: translateY(16px);

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
  }
`;
/* Ambient context. Present, never readable, never competing for attention. */
const Connectors = styled.svg `
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  /* The stroke is --color-text-on-dark-subtle (0.55-alpha cream), so 0.55 here
     lands the drawn line at ~0.30 — the wireframe's dashed light reading
     (rgba(250,241,233,.3) on .scene__conn). */
  opacity: 0.55;
`;
/* ------------------------------------------------------------ panel shell */
/* All three panels carry the view, founder direction 2026-08-26. The centre
   card was the only one that flipped: cream for GTM, GitHub-dark for
   Engineering, with Evidence and Flows staying dark in both. That read as one
   card changing inside a fixed scene rather than as two different rooms. Now
   the whole stage flips together, so `$dark` means Engineering everywhere and
   the GTM view is three cream cards floating on the hero's halftone.

   The grounds and the lift are the centre card's, so nothing here invents a
   third surface treatment. */
const panelSkin = css `
  transition: background 0.4s ${EASE_IN}, border-color 0.4s ${EASE_IN};
  background: ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubDarkSurface)" : "var(--color-secondary)"};
  border: 1px solid
    ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubBorder)" : "transparent"};
  box-shadow: ${({ $dark }) => ($dark ? "none" : "0 20px 45px rgba(0, 0, 0, 0.45)")};
`;
const LeftPanel = styled.div `
  ${panelBase};
  ${panelSkin};
  padding: 16px;
`;
const PanelLabel = styled.p `
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  /* The centre card's own label pairing, reused: chrome text on the
     GitHub-dark ground, the muted card ink on cream. */
  color: ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubText)" : "var(--color-text-light)"};
  margin: 0 0 12px 0;
`;
const EvidenceRow = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid
      ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubBorder)" : "rgba(0, 0, 0, 0.08)"};
  }
`;
/* Four sources now, two per view: `code`/`db` for Engineering and
   `metric`/`flow` for GTM. The first of each pair is the warm one and the
   second the green one, so the panel keeps the same two-tone reading whichever
   view is up. Each tone has a dark-ground and a cream-ground reading: peach on
   near-black is the wireframe's .ev-chip, and it is unreadable on cream, so the
   light column uses the centre card's own badge inks (`Badge` above). */
const CHIP_TONE = {
    code: { warm: true },
    metric: { warm: true },
    db: { warm: false },
    flow: { warm: false },
};
const SourceChip = styled.span `
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  ${({ $source, $dark }) => {
    const warm = CHIP_TONE[$source].warm;
    if ($dark)
        return css `
        color: ${warm ? "var(--color-accent)" : "#9db78a"};
        background: ${warm ? "rgba(254, 192, 137, 0.16)" : "rgba(157, 183, 138, 0.18)"};
      `;
    return css `
      color: ${warm ? "#8a3a12" : "#12633a"};
      background: ${warm ? "rgba(249, 115, 22, 0.16)" : "rgba(39, 201, 63, 0.16)"};
    `;
}};
`;
const EvidencePath = styled.span `
  font-family: var(--font-mono);
  font-size: 11px;
  color: ${({ $dark }) => ($dark ? "#ffffff" : "var(--color-text-dark)")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
/* ------------------------------------------------------------ centre card */
const CenterCard = styled.div `
  ${panelBase};
  padding: 18px;
  transition: background 0.4s ${EASE_IN}, border-color 0.4s ${EASE_IN};
  background: ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubDarkBg)" : "var(--color-secondary)"};
  border: 1px solid
    ${({ $dark }) => ($dark ? "var(--color-terminalChrome-githubBorder)" : "transparent")};
  /* Back to the deep lift. 0.45 was a bruise on the cream band; on the
     restored near-black stage it is what floats the cream card above the
     ground (the wireframe's .scene__center shadow-modal on dark). */
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
`;
const CardHead = styled.div `
  margin-bottom: 14px;
`;
const CardLabel = styled.p `
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0;
  color: ${({ $dark }) => $dark ? "var(--color-terminalChrome-githubText)" : "var(--color-text-light)"};
`;
const StepName = styled.h3 `
  font-family: var(--font-primary);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
  margin: 4px 0 0 0;
  color: ${({ $dark }) => ($dark ? "#ffffff" : "var(--color-text-dark)")};
`;
const PathName = styled.h3 `
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 4px 0 0 0;
  color: #ffffff;
`;
/* The view switch, in the frame's top right rather than on a card, because it
   changes the whole scene and not just the card it would sit in. The menu is the
   design system's `DropdownMenu`, so its surface, focus ring and item states are
   the package's; only the trigger is drawn here, in the scene's palette. */
const ToggleRow = styled.div `
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 2;
`;
const ViewTrigger = styled.button `
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 6px 10px;
  border-radius: var(--radius-xs);
  /* The wireframe's .scene__view: a light-hairline pill on the dark stage,
     no fill, peach on hover. The white-filled, ink-ringed cut was for the
     white stage. */
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  line-height: 1;
  color: var(--color-text);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast);
  ${({ $inviting }) => $inviting &&
    css `
      animation: ${softPulse} 2.4s ease-in-out infinite;
    `};

  &:hover {
    border-color: var(--color-accent);
  }

  /* Light ink, not accent: peach on this near-black clears 3:1, but the cream
     outline is the higher-contrast ring and matches the stage's ink. */
  &:focus-visible {
    outline: 2px solid var(--color-text);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
const ViewCaption = styled.span `
  color: var(--color-text-on-dark-subtle);
`;
/* Rotates when the menu is open. Radix sets `data-state` on the trigger. */
const ViewChevron = styled.span `
  display: inline-block;
  color: var(--color-text-on-dark-subtle);
  transition: transform var(--transition-fast);

  ${ViewTrigger}[data-state="open"] & {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
/* The Skene mark in the centre card's head. Both connectors terminate on that
   card, so the middle of the diagram is where the mark belongs. */
const MarkSlot = styled.span `
  display: inline-flex;
  float: right;
  margin-left: var(--spacing-sm);
  line-height: 0;
`;
/* Only the card contents cross-fade. The card itself never moves, which is
   what makes this read as one signal seen twice. */
const CardBody = styled.div `
  ${({ $animate }) => $animate &&
    css `
      animation: ${fadeInUp} 0.5s ${EASE_IN} both;
    `};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
const BadgeRow = styled.div `
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`;
const Badge = styled.span `
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  ${({ $tone }) => {
    if ($tone === "ok")
        return css `
        color: #12633a;
        background: rgba(39, 201, 63, 0.16);
      `;
    if ($tone === "warn")
        return css `
        color: #8a3a12;
        background: rgba(249, 115, 22, 0.16);
      `;
    return css `
      color: var(--color-text-dark);
      background: rgba(0, 0, 0, 0.06);
    `;
}};
`;
const FeedsRow = styled.div `
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 12px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--color-text-dark);
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;
const FeedsValue = styled.span `
  font-family: var(--font-mono);
  color: var(--color-text-light);
`;
const Code = styled.pre `
  margin: 0 0 12px 0;
  padding: 12px;
  border-radius: var(--radius-xs);
  background: var(--color-terminalChrome-githubDarkSurface);
  border: 1px solid var(--color-terminalChrome-githubBorder);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  overflow-x: auto;
`;
const CodeLine = styled.div `
  color: ${({ $removed }) => $removed ? "var(--color-terminalChrome-terminalRed)" : "var(--color-terminalChrome-githubText)"};
  ${({ $removed }) => $removed &&
    css `
      background: rgba(255, 85, 85, 0.12);
      text-decoration: line-through;
      margin: 0 -12px;
      padding: 0 12px;
    `};
`;
const TableLine = styled.div `
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-terminalChrome-githubText);
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-terminalChrome-githubBorder);
  padding-top: 12px;
`;
const TableCols = styled.span `
  color: var(--color-terminalChrome-warmTan);
`;
/* ------------------------------------------------------------ right panel */
const RightPanel = styled.div `
  ${panelBase};
  ${panelSkin};
  padding: 14px;
`;
/* Flows is a GTM-view panel, so it is always on cream now. Its inks were
   written for the dark stage it used to sit on; they are the card-side ones
   here. The active row keeps a peach wash, at the heavier alpha cream needs. */
const FlowRow = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 8px;
  margin: 0 -8px;
  border-radius: var(--radius-xs);
  font-family: var(--font-primary);
  font-size: 12px;
  color: ${({ $active }) => $active ? "var(--color-text-dark)" : "var(--color-text-light)"};
  background: ${({ $active }) => ($active ? "rgba(254, 192, 137, 0.30)" : "transparent")};
  transition: background var(--transition-fast);
`;
const FlowCount = styled.span `
  font-family: var(--font-mono);
  font-size: 12px;
  /* Ink weight, not accent. Bright peach as TEXT is the wireframe's reading on
     near-black; on cream it fails contrast, which is what the design system's
     light-surface rule (machine/rules.yaml:152-156) says. The active row is
     marked by its wash and its weight instead. */
  color: ${({ $active }) => $active ? "var(--color-text-dark)" : "var(--color-text-light)"};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
`;
const FlowBar = styled.div `
  height: 3px;
  margin: 0 0 8px 0;
  border-radius: 2px;
  width: ${({ $pct }) => $pct}%;
  /* Peach fill for the active bar (the wireframe's .flow-bar--active i). As a
     BAR rather than text it carries on cream, so it stays. The inactive fills
     are ink at low alpha, the cream-ground counterpart of the light wash. */
  background: ${({ $active }) => $active ? "var(--color-accent)" : "rgba(0, 0, 0, 0.16)"};
`;
const PrStrip = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-terminalChrome-githubBorder);
  font-family: var(--font-primary);
  font-size: 12px;
  color: var(--color-terminalChrome-githubText);
`;
const PrNumber = styled.span `
  font-family: var(--font-mono);
  color: var(--color-chrome-muted);
`;
const ReviewHead = styled.div `
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;
const BotBadge = styled.span `
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-terminalChrome-githubDarkBg);
  background: var(--color-chrome-accent);
`;
const ReviewBody = styled.p `
  font-family: var(--font-primary);
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-terminalChrome-githubText);
  margin: 0 0 12px 0;
`;
/* The one-click suggestion block. GitHub renders the fix inline and the author
   commits it without leaving the review. */
const Suggestion = styled.div `
  border: 1px solid var(--color-terminalChrome-githubBorder);
  border-radius: var(--radius-xs);
  overflow: hidden;
  margin-bottom: 10px;
`;
const SuggestionHead = styled.div `
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 6px 10px;
  color: var(--color-chrome-muted);
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid var(--color-terminalChrome-githubBorder);
`;
const SuggestionLine = styled.div `
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.9;
  padding: 0 10px;
  color: ${({ $added }) => $added
    ? "var(--color-terminalChrome-tailwindEmerald)"
    : "var(--color-chrome-muted)"};
  background: ${({ $added }) => ($added ? "rgba(34, 197, 94, 0.12)" : "transparent")};

  &::before {
    content: "${({ $added }) => ($added ? "+" : " ")}";
    display: inline-block;
    width: 12px;
  }
`;
const CommitButton = styled.div `
  font-family: var(--font-primary);
  font-size: 12px;
  text-align: center;
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  color: #ffffff;
  background: rgba(34, 197, 94, 0.18);
  border: 1px solid rgba(34, 197, 94, 0.4);
`;
const StatusBadge = styled.span `
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-terminalChrome-terminalRed);
  background: rgba(255, 85, 85, 0.14);
`;
/* The one shared caption, on both grounds: cream in the GTM view (Evidence and
   Flows), GitHub dark in the Engineering one (Evidence and the review). */
const Footnote = styled.p `
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.6;
  /* The dark flag is the Engineering view, which is where the GitHub-dark
     panels are. The GTM reading is cream-ground now, not stage-ground, so it
     takes the card's muted ink rather than the on-dark subtle tier. */
  color: ${({ $dark }) => $dark ? "var(--color-chrome-muted)" : "var(--color-text-light)"};
  margin: 10px 0 0 0;
`;
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
    /* Entry: connectors draw, then the three panels rise in sequence. */
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene)
            return;
        /* `[data-reveal]` panels are `opacity: 0` in the stylesheet so nothing
           flashes into place before the timeline lifts them. With gsap now loaded
           asynchronously there is a window where it has not arrived, and if the
           import ever fails there would be no timeline at all, so this is the
           floor: cancelled on success, and on failure it reveals the panels
           through the same CSS the reduced-motion path uses. Without it a network
           error would leave the section permanently blank. */
        let cancelled = false;
        const reveal = () => {
            scene.querySelectorAll("[data-reveal]").forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });
        };
        let revert;
        void (async () => {
            const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]).catch((error) => {
                reveal();
                throw error;
            });
            if (cancelled)
                return;
            gsap.registerPlugin(ScrollTrigger);
            if (reduced) {
                gsap.set(scene.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
                return;
            }
            const ctx = gsap.context(() => {
                const paths = scene.querySelectorAll("[data-connector]");
                paths.forEach((path) => {
                    const len = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                });
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: scene,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });
                tl.to(scene.querySelectorAll("[data-reveal]"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "expo.out",
                }).to(paths, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: "expo.out" }, "-=0.35");
            }, scene);
            if (cancelled)
                ctx.revert();
            else
                revert = () => ctx.revert();
        })();
        return () => {
            cancelled = true;
            revert?.();
        };
    }, [reduced]);
    return (_jsx(Section, { children: _jsx(Inner, { children: _jsx(Container, { ref: containerRef, "$ratio": layout.w / layout.h, children: _jsx(ScaleWrapper, { "$scale": effectiveScale, "$w": layout.w, "$h": layout.h, children: _jsxs(Stage, { ref: sceneRef, children: [_jsx(ToggleRow, { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(ViewTrigger, { type: "button", onFocus: () => setTouched(true), "$inviting": !touched && !reduced, children: [_jsx(ViewCaption, { children: "View" }), VIEW_LABEL[view], _jsx(ViewChevron, { "aria-hidden": true, children: _jsx(ChevronDown, { size: 14 }) })] }) }), _jsx(DropdownMenuContent, { align: "end", sideOffset: 6, children: _jsxs(DropdownMenuRadioGroup, { value: view, onValueChange: (next) => selectView(next), children: [_jsx(DropdownMenuRadioItem, { value: "gtm", children: VIEW_LABEL.gtm }), _jsx(DropdownMenuRadioItem, { value: "eng", children: VIEW_LABEL.eng })] }) })] }) }), _jsx(Connectors, { viewBox: `0 0 ${layout.w} ${layout.h}`, "aria-hidden": true, children: layout.connectors.map((d) => (_jsx("path", { "data-connector": true, d: d, fill: "none", stroke: "var(--color-text-on-dark-subtle)", strokeWidth: 1.5, strokeDasharray: "4 4" }, d))) }), _jsxs(LeftPanel, { "data-reveal": true, "$dark": dark, "$box": layout.left, children: [_jsx(PanelLabel, { "$dark": dark, children: "Evidence" }), _jsxs(CardBody, { "$animate": !reduced, children: [(dark ? EVIDENCE_ENG : EVIDENCE_GTM).map((row) => (_jsxs(EvidenceRow, { "$dark": dark, children: [_jsx(SourceChip, { "$source": row.source, "$dark": dark, children: row.source }), _jsx(EvidencePath, { "$dark": dark, children: row.label })] }, row.label))), _jsx(Footnote, { "$dark": dark, children: dark ? EVIDENCE_ENG_FOOTNOTE : EVIDENCE_GTM_FOOTNOTE })] }, view)] }), _jsxs(CenterCard, { "data-reveal": true, "$dark": dark, "$box": layout.center, children: [_jsxs(CardHead, { children: [_jsx(MarkSlot, { "aria-hidden": true, children: _jsx(SkeneMark, { tone: "block", size: 20 }) }), _jsxs("div", { children: [_jsx(CardLabel, { "$dark": dark, children: dark ? "Call site" : "Journey step" }), dark ? (_jsx(PathName, { children: CALL_SITE.path })) : (_jsx(StepName, { "$dark": dark, children: STEP.name }))] })] }), _jsx(CardBody, { "$animate": !reduced, children: dark ? (_jsxs(_Fragment, { children: [_jsx(Code, { children: CALL_SITE.lines.map((line) => (_jsx(CodeLine, { "$removed": line.tone === "removed", children: line.text }, line.text))) }), _jsxs(TableLine, { children: [_jsx("span", { children: CALL_SITE.table }), _jsx(TableCols, { children: CALL_SITE.columns })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(BadgeRow, { children: [_jsxs(Badge, { "$tone": "stage", children: [STEP.stage, " \u00B7 ", STEP.stageLabel] }), _jsx(Badge, { "$tone": "ok", children: STEP.confidence }), _jsx(Badge, { "$tone": "warn", children: STEP.gap })] }), _jsxs(FeedsRow, { children: [_jsx("span", { children: "Feeds" }), _jsx(FeedsValue, { children: STEP.feeds })] })] })) }, view)] }), _jsx(RightPanel, { "data-reveal": true, "$dark": dark, "$box": layout.right, children: _jsx(CardBody, { "$animate": !reduced, children: dark ? (_jsxs(_Fragment, { children: [_jsx(PanelLabel, { "$dark": dark, children: REVIEW.label }), _jsxs(PrStrip, { children: [_jsx(PrNumber, { children: REVIEW.number }), _jsx("span", { children: REVIEW.pr })] }), _jsxs(ReviewHead, { children: [_jsx(BotBadge, { children: "Skene" }), _jsx(StatusBadge, { children: REVIEW.status })] }), _jsx(ReviewBody, { children: REVIEW.body }), _jsxs(Suggestion, { children: [_jsx(SuggestionHead, { children: REVIEW.suggestionLabel }), REVIEW.suggestion.map((line) => (_jsx(SuggestionLine, { "$added": line.tone === "added", children: line.text }, line.text)))] }), _jsx(CommitButton, { children: REVIEW.cta }), _jsx(Footnote, { "$dark": true, children: REVIEW.footnote })] })) : (_jsxs(_Fragment, { children: [_jsx(PanelLabel, { "$dark": dark, children: "Flows" }), FLOW_ROWS.map((row) => {
                                                const active = Boolean(row.active);
                                                const pct = (Number(row.count.replace(/,/g, "")) / FLOW_MAX) * 100;
                                                return (_jsxs("div", { children: [_jsxs(FlowRow, { "$active": active, children: [_jsx("span", { children: row.label }), _jsx(FlowCount, { "$active": active, children: row.count })] }), _jsx(FlowBar, { "$pct": pct, "$active": active })] }, row.label));
                                            }), _jsx(Footnote, { children: FLOWS_FOOTNOTE })] })) }, view) })] }) }) }) }) }));
}
export default JourneySignalScene;
