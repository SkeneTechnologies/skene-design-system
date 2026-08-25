"use client";

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
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styled, { css, keyframes } from "styled-components";

import { SkeneMark } from "../patterns/skene-mark.js";
import { useContainerScale } from "../lib/use-container-scale.js";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================== content ===
 * Content for the JourneySignalScene.
 *
 * Every label here was checked against the company wiki
 * (skene-company-wiki/business/positioning.md, product.md, wiki-corrections.md)
 * when this scene lived in skene-marketing-website. A consumer of this
 * package reusing the scene for a different product edits this block only —
 * everything below it (styles, layouts, component) is presentation.
 *
 *   - Vocabulary is the current docs vocabulary: Events, Flows, analytics
 *     destination. Not Tracking Signals, not Live Flows, not Analytics Bucket
 *     (the bucket archive was removed from the codebase).
 *   - Stage names come from the seven canonical lifecycle stages.
 *   - Evidence carries a source of "code" or "db": code evidence needs a file
 *     path, db evidence needs a table. That is the real Evidence model.
 *   - The PR review is an LLM judge and can be wrong, so it is labelled a
 *     review with a finding, never a guarantee.
 *   - The traced step is onboarding, not checkout. "checkout_started" reads
 *     as ecommerce on a page selling a product-analytics trust layer, not a
 *     store. Onboarding is the step every SaaS buyer actually recognises, and
 *     the account/plan model still carries a plan property worth losing (a
 *     new account choosing a tier), so the finding underneath it did not
 *     need to change, only the story.
 * ========================================================================= */

type EvidenceSource = "code" | "db";

const EVIDENCE: { source: EvidenceSource; label: string }[] = [
  { source: "code", label: "app/onboarding/route.ts" },
  { source: "db", label: "public.accounts" },
];

const STEP = {
  name: "Onboarding started",
  stage: "activation",
  stageLabel: "First Value",
  /** Events detected in the codebase are reported at 100% confidence. */
  confidence: "Detected · 100%",
  feeds: "Activation rate",
  gap: "1 property missing: plan",
};

const CALL_SITE = {
  path: "app/onboarding/route.ts",
  lines: [
    { text: 'skene.track("onboarding_started", {', tone: "plain" },
    { text: "  account_id: account.id,", tone: "plain" },
    { text: "  plan: account.plan,", tone: "removed" },
    { text: "})", tone: "plain" },
  ] as { text: string; tone: "plain" | "removed" }[],
  table: "public.accounts",
  columns: "id, user_id, plan",
};

const FLOWS_FOOTNOTE = "How users actually move, captured by one script tag.";

const FLOW_ROWS: { label: string; count: string; active?: boolean }[] = [
  { label: "Signed up", count: "4,182" },
  { label: "Onboarding started", count: "1,097", active: true },
  { label: "Reached first value", count: "863" },
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
const REVIEW = {
  pr: "Add plan tiers to onboarding",
  number: "#412",
  status: "Changes requested",
  severity: "Medium",
  body:
    "onboarding_started no longer writes plan. Every activation number split by tier goes flat from this merge, and the weeks it stays broken are not recoverable later.",
  suggestionLabel: "Suggested change",
  suggestion: [
    { text: "  account_id: account.id,", tone: "context" },
    { text: "  plan: account.plan,", tone: "added" },
  ] as { text: string; tone: "context" | "added" }[],
  cta: "Apply suggestion",
  altPrefix: "or comment",
  altCommand: "/skene fix",
  /** A model judging a diff can be wrong, so the panel says so out loud. */
  footnote:
    "A judgement on the diff, not a check against your plan. It holds the merge until you accept it or dismiss it.",
};

/* ============================================================== styles ==== */

/* A long settle on the way in. Everything here eases the same way so the
   entry and the view switch feel like one motion system. */
const EASE_IN = "cubic-bezier(0.16, 1, 0.3, 1)";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* Ink, not peach. On cream a peach ring measures about 1.2:1 and the pulse is
   simply invisible; it was drawn for the near-black stage this scene used to
   sit on. */
const softPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(20, 20, 20, 0.28); }
  50%      { box-shadow: 0 0 0 6px rgba(20, 20, 20, 0); }
`;

/* ---------------------------------------------------------------- section */

/*
 * THE SCENE IS LIGHT-THEMED, on the assumption it sits inside a `light`-classed
 * band (e.g. `Bridge`) or a `light`-classed wrapper around it directly.
 *
 * The values below are the LIGHT reading of the scene's own token names. Where
 * a package token says the same thing it is aliased rather than re-stated,
 * which is what makes those three lines resolve correctly under `light`. The
 * literals that remain are the ones the package has no name for.
 *
 * What does NOT flip: everything the engineering view draws. `--color-terminal
 * Chrome-*` is invariant across `light`/dark and stays dark on the cream, which
 * is `machine/rules.yaml:115-131` working as designed rather than an
 * oversight. A code block and a GitHub review are the exact case that role
 * exists for.
 */
const sceneTokens = css`
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-accent: var(--color-brand-peach);
  --color-accent-muted: rgba(137, 104, 74, 0.12);
  --color-text: var(--color-text-primary);
  --color-text-light: var(--color-text-muted);
  --color-text-dark: var(--color-text-primary);
  /* The three "on dark" roles now name ink on cream. The names are the scene's
     and are left alone; a rename would touch every panel for no rendered
     difference. */
  --color-text-on-dark: var(--color-text-primary);
  --color-text-on-dark-muted: var(--color-text-muted);
  --color-text-on-dark-subtle: rgba(0, 0, 0, 0.5);
  /* The quiet role INSIDE the two panels that stayed dark. The three
     "on dark" names above now mean ink on cream, so a dark-only panel reading
     one of them renders black on #0d1117: invisible, and invisible in exactly
     the way a build cannot catch. This is the reading they used to have. */
  --color-chrome-muted: rgba(201, 209, 217, 0.62);
  /* Brand, for those same two dark panels. --color-accent now resolves to the
     LIGHT reading of peach, #89684a, which is the value designed for cream and
     is muddy on #0d1117. warmTan is the invariant chrome-side warm and is what
     the rest of the review already uses. */
  --color-chrome-accent: var(--color-terminalChrome-warmTan);
  --color-background-dark: transparent;
  --color-background-darker: #ffffff;
  --color-border-on-dark: var(--color-chrome-line-on-light);
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

/* The consuming layout owns the band's ground, padding and max width, so this
   owns none of them. */
const Section = styled.section`
  ${sceneTokens};
  position: relative;
  /* A flex/grid ITEM in whatever row the consumer puts it in, and would
     otherwise size to its content. */
  width: 100%;
  min-width: 0;
`;

const Inner = styled.div`
  width: 100%;
`;

/* ------------------------------------------------------------ scale stage */

/* The frame follows whichever layout is in play, so the stage never leaves a
   band of empty floor underneath it. */
const Container = styled.div<{ $ratio: number }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  border-radius: var(--radius-md);
  overflow: hidden;
  /* A faint ink wash over white, so the floor still has a top-lit gradient
     rather than being a flat rectangle. */
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(20, 20, 20, 0.05), transparent 70%),
    var(--color-background-darker);
  border: 1px solid var(--color-border-on-dark);
`;

const ScaleWrapper = styled.div<{ $scale: number; $w: number; $h: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  transform: scale(${({ $scale }) => $scale});
  transform-origin: top left;
`;

const Stage = styled.div`
  position: absolute;
  inset: 0;
`;

type Box = { x: number; y: number; w: number };

const panelBase = css<{ $box: Box }>`
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

/* Ambient context. Present, never readable, never competing for attention.
   Two strengths, not one: in the GTM view the cards on top are light and
   sparse, so the texture can sit at a strength that actually reads as
   present rather than as a rendering artifact. In the Engineering view the
   call site and PR review cards are already dense with their own text, so
   the same strength would compete rather than add texture; it drops back
   down there instead. */
const Ambient = styled.div<{ $box: Box; $dark: boolean }>`
  ${panelBase};
  /* Ink at a lower alpha than the white it replaced. Dark text on white carries
     further than white on black at the same opacity, and this has to stay
     present without ever becoming readable. */
  opacity: ${({ $dark }) => ($dark ? 0.07 : 0.18)};
  transition: opacity 0.4s ${EASE_IN};
  transform: none;
  pointer-events: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.8;
  color: #141414;
  user-select: none;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Connectors = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  /* The stroke is ink; a dashed ink line at 30% on white is fainter than the
     same line would be in a brand colour on black, hence the higher value. */
  opacity: 0.55;
`;

/* ------------------------------------------------------------ panel shell */

const LeftPanel = styled.div<{ $box: Box }>`
  ${panelBase};
  padding: 16px;
  /* An opaque card. A translucent white wash only reads as a panel when the
     ground behind it is near-black. */
  background: #ffffff;
  border: 1px solid var(--color-border-on-dark);
  box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
`;

const PanelLabel = styled.p`
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-on-dark-subtle);
  margin: 0 0 12px 0;
`;

const EvidenceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid var(--color-border-on-dark);
  }
`;

const SourceChip = styled.span<{ $source: "code" | "db" }>`
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  /* Ink-dark enough to clear 4.5:1 on their own tints, on a white ground. */
  color: ${({ $source }) => ($source === "code" ? "#0f6e56" : "#7a4e12")};
  background: ${({ $source }) =>
    $source === "code" ? "rgba(15, 110, 86, 0.1)" : "rgba(122, 78, 18, 0.1)"};
`;

const EvidencePath = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-on-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ------------------------------------------------------------ centre card */

const CenterCard = styled.div<{ $dark: boolean; $box: Box }>`
  ${panelBase};
  padding: 18px;
  transition: background 0.4s ${EASE_IN}, border-color 0.4s ${EASE_IN};
  background: ${({ $dark }) =>
    $dark ? "var(--color-terminalChrome-githubDarkBg)" : "var(--color-secondary)"};
  border: 1px solid
    ${({ $dark }) => ($dark ? "var(--color-terminalChrome-githubBorder)" : "transparent")};
  box-shadow: var(--shadow-modal, 0 12px 28px rgba(20, 20, 20, 0.12));
`;

const CardHead = styled.div`
  margin-bottom: 14px;
`;

const CardLabel = styled.p<{ $dark: boolean }>`
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0;
  color: ${({ $dark }) =>
    $dark ? "var(--color-terminalChrome-githubText)" : "var(--color-text-light)"};
`;

const StepName = styled.h3<{ $dark: boolean }>`
  font-family: var(--font-primary);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
  margin: 4px 0 0 0;
  color: ${({ $dark }) => ($dark ? "#ffffff" : "var(--color-text-dark)")};
`;

const PathName = styled.h3`
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 4px 0 0 0;
  color: #ffffff;
`;

/* The view switch, centred below the frame rather than the top right or
   floating over the bottom of it, because it changes the whole scene and not
   just a corner of it. A two-way segmented control reads as "the same scene,
   two positions" the way a dropdown menu does not: both options are always
   visible, and the sliding thumb is what actually moves when the view
   changes, rather than a label swapping inside a closed trigger. Plain
   buttons, not this package's own `DropdownMenu`: there is no menu to open
   here, so the radio-menu primitives (built for a closed-until-clicked list)
   do not fit; `role="group"` plus `aria-pressed` on each button is the
   standard accessible shape for a mutually-exclusive toggle pair.

   Below the card, in normal flow, NOT `position: absolute` pinned to the
   Stage's bottom edge. The Stage is a fixed design-space height per layout
   (WIDE/MEDIUM/COMPACT), but the panels inside it size to their own content,
   and the Engineering view's PR review card runs taller than the GTM view's
   Flows card. An absolutely-positioned switch anchored to the Stage's bottom
   overlapped that card's own footnote text. Flow layout sidesteps the
   mismatch entirely: the switch just sits after whatever height the card
   actually rendered at. */
const ViewSwitchRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ViewSwitchTrack = styled.div<{ $inviting: boolean }>`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  padding: 3px;
  border-radius: 999px;
  border: 1px solid var(--color-border-on-dark);
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
  ${({ $inviting }) =>
    $inviting &&
    css`
      animation: ${softPulse} 2.4s ease-in-out infinite;
    `};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* Slides under whichever button is active. Sized and positioned in JS
   (`$left`/`$width`, from the active button's own `offsetLeft`/`offsetWidth`)
   rather than a 50/50 CSS split, because "GTM" and "Engineering" are not the
   same width and a fixed half-and-half thumb would either clip the longer
   label or leave a gap around the shorter one. */
const ViewSwitchThumb = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  border-radius: 999px;
  background: var(--color-text);
  transition: left 0.3s ${EASE_IN}, width 0.3s ${EASE_IN};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ViewSwitchButton = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  padding: 6px 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  line-height: 1;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "#ffffff" : "var(--color-text)")};
  cursor: pointer;
  transition: color 0.3s ${EASE_IN};

  /* Ink, not accent. A peach ring on white is about 1.2:1 and fails the 3:1
     floor a focus indicator owes. */
  &:focus-visible {
    outline: 2px solid var(--color-text);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* The Skene mark in the centre card's head. Both connectors terminate on that
   card, so the middle of the diagram is where the mark belongs. */
const MarkSlot = styled.span`
  display: inline-flex;
  float: right;
  margin-left: var(--spacing-sm);
  line-height: 0;
`;

/* Only the card contents cross-fade. The card itself never moves, which is
   what makes this read as one signal seen twice. */
const CardBody = styled.div<{ $animate: boolean }>`
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${fadeInUp} 0.5s ${EASE_IN} both;
    `};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`;

const Badge = styled.span<{ $tone: "stage" | "ok" | "warn" }>`
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  ${({ $tone }) => {
    if ($tone === "ok")
      return css`
        color: #12633a;
        background: rgba(39, 201, 63, 0.16);
      `;
    if ($tone === "warn")
      return css`
        color: #8a3a12;
        background: rgba(249, 115, 22, 0.16);
      `;
    return css`
      color: var(--color-text-dark);
      background: rgba(0, 0, 0, 0.06);
    `;
  }};
`;

const FeedsRow = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 12px;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--color-text-dark);
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const FeedsValue = styled.span`
  font-family: var(--font-mono);
  color: var(--color-text-light);
`;

const Code = styled.pre`
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

const CodeLine = styled.div<{ $removed: boolean }>`
  color: ${({ $removed }) =>
    $removed ? "var(--color-terminalChrome-terminalRed)" : "var(--color-terminalChrome-githubText)"};
  ${({ $removed }) =>
    $removed &&
    css`
      background: rgba(255, 85, 85, 0.12);
      text-decoration: line-through;
      margin: 0 -12px;
      padding: 0 12px;
    `};
`;

const TableLine = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-terminalChrome-githubText);
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-terminalChrome-githubBorder);
  padding-top: 12px;
`;

const TableCols = styled.span`
  color: var(--color-terminalChrome-warmTan);
`;

/* ------------------------------------------------------------ right panel */

const RightPanel = styled.div<{ $dark: boolean; $box: Box }>`
  ${panelBase};
  padding: 14px;
  transition: background 0.4s ${EASE_IN}, border-color 0.4s ${EASE_IN};
  background: ${({ $dark }) =>
    $dark ? "var(--color-terminalChrome-githubDarkSurface)" : "#ffffff"};
  border: 1px solid
    ${({ $dark }) => ($dark ? "var(--color-terminalChrome-githubBorder)" : "var(--color-border-on-dark)")};
`;

const FlowRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 8px;
  margin: 0 -8px;
  border-radius: var(--radius-xs);
  font-family: var(--font-primary);
  font-size: 12px;
  color: ${({ $active }) => ($active ? "var(--color-text)" : "var(--color-text-on-dark-muted)")};
  background: ${({ $active }) => ($active ? "var(--color-accent-muted)" : "transparent")};
  transition: background var(--transition-fast);
`;

const FlowCount = styled.span<{ $active: boolean }>`
  font-family: var(--font-mono);
  font-size: 12px;
  /* Not --color-accent as text: at low weight the brand colour reads under a
     4.5:1 floor on white. The active row is marked by its tint and by ink
     weight instead. */
  color: ${({ $active }) =>
    $active ? "var(--color-text)" : "var(--color-text-on-dark-subtle)"};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
`;

const FlowBar = styled.div<{ $pct: number; $active: boolean }>`
  height: 3px;
  margin: 0 0 8px 0;
  border-radius: 2px;
  width: ${({ $pct }) => $pct}%;
  /* Peach as a FILL is fine; it is text-as-peach that fails contrast. */
  background: ${({ $active }) =>
    $active ? "var(--color-accent)" : "rgba(20, 20, 20, 0.16)"};
`;

const PrStrip = styled.div`
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

const PrNumber = styled.span`
  font-family: var(--font-mono);
  color: var(--color-chrome-muted);
`;

const ReviewHead = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const BotBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-terminalChrome-githubDarkBg);
  background: var(--color-chrome-accent);
`;

const SeverityBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-terminalChrome-warmTan);
  background: rgba(172, 139, 93, 0.18);
`;

const ReviewBody = styled.p`
  font-family: var(--font-primary);
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-terminalChrome-githubText);
  margin: 0 0 12px 0;
`;

/* The one-click suggestion block. GitHub renders the fix inline and the author
   commits it without leaving the review. */
const Suggestion = styled.div`
  border: 1px solid var(--color-terminalChrome-githubBorder);
  border-radius: var(--radius-xs);
  overflow: hidden;
  margin-bottom: 10px;
`;

const SuggestionHead = styled.div`
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 6px 10px;
  color: var(--color-chrome-muted);
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid var(--color-terminalChrome-githubBorder);
`;

const SuggestionLine = styled.div<{ $added: boolean }>`
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.9;
  padding: 0 10px;
  color: ${({ $added }) =>
    $added
      ? "var(--color-terminalChrome-tailwindEmerald)"
      : "var(--color-chrome-muted)"};
  background: ${({ $added }) => ($added ? "rgba(34, 197, 94, 0.12)" : "transparent")};

  &::before {
    content: "${({ $added }) => ($added ? "+" : " ")}";
    display: inline-block;
    width: 12px;
  }
`;

const CommitButton = styled.div`
  font-family: var(--font-primary);
  font-size: 12px;
  text-align: center;
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  color: #ffffff;
  background: rgba(34, 197, 94, 0.18);
  border: 1px solid rgba(34, 197, 94, 0.4);
`;

/* The second way to take the fix. Same place, no context switch. */
const AltFix = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  font-family: var(--font-primary);
  font-size: 11px;
  color: var(--color-chrome-muted);
`;

const FixCommand = styled.code`
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-chrome-accent);
  background: rgba(255, 255, 255, 0.08);
`;

const StatusBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--color-terminalChrome-terminalRed);
  background: rgba(255, 85, 85, 0.14);
`;

/* The one shared caption: the flows panel uses it on white, the review on
   GitHub dark. It is the only element in the scene that crosses the polarity
   line, so it is the only one that has to be told which side it is on. */
const Footnote = styled.p<{ $dark?: boolean }>`
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.6;
  color: ${({ $dark }) =>
    $dark ? "var(--color-chrome-muted)" : "var(--color-text-on-dark-subtle)"};
  margin: 10px 0 0 0;
`;

/* ============================================================ component === */

type View = "gtm" | "eng";

const VIEW_LABEL: Record<View, string> = {
  gtm: "GTM",
  eng: "Engineering",
};

type Layout = {
  w: number;
  h: number;
  ambientA: Box;
  ambientB: Box;
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
  ambientA: { x: 26, y: 22, w: 206 },
  ambientB: { x: 296, y: 400, w: 206 },
  left: { x: 8, y: 150, w: 268 },
  center: { x: 322, y: 58, w: 430 },
  right: { x: 800, y: 90, w: 292 },
  connectors: ["M 276 216 H 299 V 190 H 322", "M 752 216 H 776 V 190 H 800"],
};

const COMPACT: Layout = {
  w: 400,
  h: 1040,
  ambientA: { x: 206, y: 516, w: 180 },
  ambientB: { x: 14, y: 946, w: 190 },
  left: { x: 16, y: 68, w: 368 },
  center: { x: 16, y: 240, w: 368 },
  right: { x: 16, y: 620, w: 368 },
  connectors: ["M 200 208 V 240", "M 200 548 V 620"],
};

/**
 * For hero-column widths (roughly 420-720px), where WIDE's three-across chain
 * would clip and COMPACT's full vertical stack reads far too tall next to a
 * hero's text column. Evidence and the centre card stay side by side (the
 * pairing a reader scans first); the densest panel (Flows / PR review) drops
 * to its own full-width row below.
 */
const MEDIUM: Layout = {
  w: 600,
  h: 640,
  ambientA: { x: 16, y: 14, w: 160 },
  ambientB: { x: 340, y: 300, w: 160 },
  left: { x: 16, y: 60, w: 170 },
  center: { x: 202, y: 24, w: 382 },
  right: { x: 16, y: 300, w: 568 },
  /**
   * Anchored to measured geometry, not guessed. Evidence (left) runs two
   * rows and sits ~132px tall, so 60 + 132/2 = 126 is its right edge's
   * vertical mid-point. Journey step / Call site (center) bottoms out at
   * ~24 + 192 = 216, which is where the second connector starts, straight
   * down to Flows / PR review's top edge at 300.
   */
  connectors: ["M 186 126 H 194 V 60 H 202", "M 393 216 V 300"],
};

const AUTO_ADVANCE_MS = 6000;
const WIDE_MIN = 720;
const MEDIUM_MIN = 420;

const AMBIENT_FILES = ["app/", "  onboarding/", "    route.ts", "  pricing/", "lib/track.ts"];
const AMBIENT_TABLES = ["orders", "accounts", "subscriptions", "sessions"];

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
  const [mode, setMode] = useState<"wide" | "medium" | "compact">("wide");
  const reduced = usePrefersReducedMotion();
  const gtmButtonRef = useRef<HTMLButtonElement>(null);
  const engButtonRef = useRef<HTMLButtonElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  const layout = mode === "wide" ? WIDE : mode === "medium" ? MEDIUM : COMPACT;
  const dark = view === "eng";

  // The container hook always measures against the WIDE design width, so
  // `scale` alone only holds for that layout; the others need their own
  // divisor. This reduces to `scale` when layout.w === WIDE.w.
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

  /* The thumb's position and width come from the active button's own
     rendered box, not a 50/50 split: "GTM" and "Engineering" are different
     lengths, and a fixed half-and-half thumb would either clip the longer
     label or leave slack around the shorter one. */
  useEffect(() => {
    const btn = view === "gtm" ? gtmButtonRef.current : engButtonRef.current;
    if (!btn) return;
    setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [view]);

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

  /* Entry: connectors draw, then the three panels rise in sequence. */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (reduced) {
      gsap.set(scene.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const paths = scene.querySelectorAll<SVGPathElement>("[data-connector]");
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
      }).to(
        paths,
        { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: "expo.out" },
        "-=0.35"
      );
    }, scene);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section>
      <Inner>
        <Container ref={containerRef} $ratio={layout.w / layout.h}>
          <ScaleWrapper $scale={effectiveScale} $w={layout.w} $h={layout.h}>
            <Stage ref={sceneRef}>
              <Ambient $box={layout.ambientA} $dark={dark} aria-hidden>
                {AMBIENT_FILES.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </Ambient>
              <Ambient $box={layout.ambientB} $dark={dark} aria-hidden>
                {AMBIENT_TABLES.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </Ambient>

              <Connectors viewBox={`0 0 ${layout.w} ${layout.h}`} aria-hidden>
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
              </Connectors>

              <LeftPanel data-reveal $box={layout.left}>
                <PanelLabel>Evidence</PanelLabel>
                {EVIDENCE.map((row) => (
                  <EvidenceRow key={row.label}>
                    <SourceChip $source={row.source}>{row.source}</SourceChip>
                    <EvidencePath>{row.label}</EvidencePath>
                  </EvidenceRow>
                ))}
              </LeftPanel>

              <CenterCard data-reveal $dark={dark} $box={layout.center}>
                <CardHead>
                  {/* The middle of the diagram is this card: both connectors
                      terminate on it. `tone="block"` is the mark variant that
                      brings its own tile and is safe on any ground, since this
                      card is cream in one view and near-black in the other. */}
                  <MarkSlot aria-hidden>
                    <SkeneMark tone="block" size={20} />
                  </MarkSlot>
                  <div>
                    <CardLabel $dark={dark}>
                      {dark ? "Call site" : "Journey step"}
                    </CardLabel>
                    {dark ? (
                      <PathName>{CALL_SITE.path}</PathName>
                    ) : (
                      <StepName $dark={dark}>{STEP.name}</StepName>
                    )}
                  </div>
                </CardHead>

                <CardBody key={view} $animate={!reduced}>
                  {dark ? (
                    <>
                      <Code>
                        {CALL_SITE.lines.map((line) => (
                          <CodeLine key={line.text} $removed={line.tone === "removed"}>
                            {line.text}
                          </CodeLine>
                        ))}
                      </Code>
                      <TableLine>
                        <span>{CALL_SITE.table}</span>
                        <TableCols>{CALL_SITE.columns}</TableCols>
                      </TableLine>
                    </>
                  ) : (
                    <>
                      <BadgeRow>
                        <Badge $tone="stage">
                          {STEP.stage} · {STEP.stageLabel}
                        </Badge>
                        <Badge $tone="ok">{STEP.confidence}</Badge>
                        <Badge $tone="warn">{STEP.gap}</Badge>
                      </BadgeRow>
                      <FeedsRow>
                        <span>Feeds</span>
                        <FeedsValue>{STEP.feeds}</FeedsValue>
                      </FeedsRow>
                    </>
                  )}
                </CardBody>
              </CenterCard>

              <RightPanel data-reveal $dark={dark} $box={layout.right}>
                <CardBody key={view} $animate={!reduced}>
                  {dark ? (
                    <>
                      <PrStrip>
                        <PrNumber>{REVIEW.number}</PrNumber>
                        <span>{REVIEW.pr}</span>
                      </PrStrip>
                      <ReviewHead>
                        <BotBadge>Skene</BotBadge>
                        <StatusBadge>{REVIEW.status}</StatusBadge>
                        <SeverityBadge>{REVIEW.severity}</SeverityBadge>
                      </ReviewHead>
                      <ReviewBody>{REVIEW.body}</ReviewBody>
                      <Suggestion>
                        <SuggestionHead>{REVIEW.suggestionLabel}</SuggestionHead>
                        {REVIEW.suggestion.map((line) => (
                          <SuggestionLine key={line.text} $added={line.tone === "added"}>
                            {line.text}
                          </SuggestionLine>
                        ))}
                      </Suggestion>
                      <CommitButton>{REVIEW.cta}</CommitButton>
                      <AltFix>
                        <span>{REVIEW.altPrefix}</span>
                        <FixCommand>{REVIEW.altCommand}</FixCommand>
                      </AltFix>
                      <Footnote $dark>{REVIEW.footnote}</Footnote>
                    </>
                  ) : (
                    <>
                      <PanelLabel>Flows</PanelLabel>
                      {FLOW_ROWS.map((row) => {
                        const active = Boolean(row.active);
                        const pct =
                          (Number(row.count.replace(/,/g, "")) / FLOW_MAX) * 100;
                        return (
                          <div key={row.label}>
                            <FlowRow $active={active}>
                              <span>{row.label}</span>
                              <FlowCount $active={active}>{row.count}</FlowCount>
                            </FlowRow>
                            <FlowBar $pct={pct} $active={active} />
                          </div>
                        );
                      })}
                      <Footnote>{FLOWS_FOOTNOTE}</Footnote>
                    </>
                  )}
                </CardBody>
              </RightPanel>
            </Stage>
          </ScaleWrapper>
        </Container>

        {/* Outside `Container`, in normal flow. Not pinned to the Stage's
            fixed design-space height: the panels inside size to their own
            content, and the Engineering view's PR review card runs taller
            than the GTM view's Flows card, taller in fact than an absolute
            "bottom: 20px" reservation accounted for, which is what left the
            switch overlapping the review card's own footnote text. Flow
            layout means the switch just follows whatever height the card
            actually rendered at, for every layout and every view. */}
        <ViewSwitchRow>
          <ViewSwitchTrack role="group" aria-label="View" $inviting={!touched && !reduced}>
            <ViewSwitchThumb $left={thumb.left} $width={thumb.width} />
            <ViewSwitchButton
              ref={gtmButtonRef}
              type="button"
              aria-pressed={view === "gtm"}
              $active={view === "gtm"}
              onClick={() => selectView("gtm")}
              onFocus={() => setTouched(true)}
            >
              {VIEW_LABEL.gtm}
            </ViewSwitchButton>
            <ViewSwitchButton
              ref={engButtonRef}
              type="button"
              aria-pressed={view === "eng"}
              $active={view === "eng"}
              onClick={() => selectView("eng")}
              onFocus={() => setTouched(true)}
            >
              {VIEW_LABEL.eng}
            </ViewSwitchButton>
          </ViewSwitchTrack>
        </ViewSwitchRow>
      </Inner>
    </Section>
  );
}

export default JourneySignalScene;
