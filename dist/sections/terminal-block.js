'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';
import { Button } from '../ui/button.js';
import { ArtPanel, ArtTitle } from './artifact-shell.js';
import { TrafficLights } from './traffic-lights.js';
/**
 * The install block: a terminal frame holding one or more shell lines, each with
 * its own copy button, and an optional footnote under a rule.
 *
 * This is the one artifact a reader is meant to *use* rather than read. Every
 * other depiction on the page argues; this one hands over a command. That single
 * fact decides most of what follows — the copy control is a real button rather
 * than a click-anywhere affordance, the command text is a `string` rather than a
 * `ReactNode`, and the flash after a successful copy is the only state in the
 * file.
 *
 * ## Why this does not extend `patterns/Terminal`
 *
 * There is already a terminal in the package and it is deliberately not reused
 * here. `patterns/Terminal` is the `.skene-terminal` effects recipe: an 8px
 * `--radius-panel` corner, `--shadow-terminal`, and traffic lights drawn as a
 * `::before` with two box-shadows. This is the artifacts register: a 14px
 * `--radius-gtm` corner, no shadow at all (principles.md 16 — flat panels take a
 * border), and three real dot elements. The shadow and the pseudo-element are
 * both unreachable from a `className`, so "extending" it would mean overriding
 * the background, the border, the radius and the shadow and then living with a
 * second set of traffic lights I could not turn off. `patterns/TerminalLine` is
 * the same story one level down: it wraps, prompts in peach, and has no room for
 * a trailing control, where this line does not wrap, prompts in matcha, and is a
 * three-part flex row built around one.
 *
 * What IS composed: `ArtPanel` supplies the frame and the chrome bar (it is the
 * ported `.art` / `.art__bar` verbatim), and `ui/button` supplies the copy
 * control. The prototype's own comment on `.term__copy` reads "Button, outline
 * variant, size sm", and taking it at its word buys the focus ring and the
 * disabled handling that the hand-rolled CSS never had.
 *
 * ## Why the frame carries `dark`
 *
 * A terminal is a fixed-dark surface, so most of it takes the invariant
 * `terminal.*` tokens and is safe anywhere. Two colours in the prototype are not
 * invariant: the matcha prompt and the peach hover both resolve through
 * mode-aware tokens. On the marketing site — `<html class="dark">` — they are
 * `#d7f4ab` and `#fec089`, which is what the prototype was verified at. Drop the
 * same block into the dashboard, whose default theme is light, and they silently
 * become `#677552` and `#89684a` against `#1e1e1e`: 3.6:1 and 3.5:1, under the
 * 4.5:1 floor, in a component that looks completely fine to whoever added it.
 *
 * So the panel is a `dark` subtree and says so, which is `must:
 * wrap_dark_subtrees_in_dark_class` doing exactly the job it exists for. It is
 * the mirror of the `light` that `AppWindow` carries, for the mirror-image
 * reason, and it has the mirror-image caveat: `cn` cannot unset a theme class, so
 * a consumer who genuinely wants this to follow the ambient theme needs a prop
 * and a decision, not a `className`.
 *
 * ## Copy
 *
 * `navigator.clipboard.writeText` is the whole mechanism and the flash reverts
 * after 1400ms, both as the prototype has them. The important detail is that the
 * flash is inside the success path: an insecure context or a denied permission
 * rejects, and the button then says nothing rather than claiming a copy that did
 * not happen. Only one line can be lit at a time, so copying a second command
 * takes the highlight off the first — which is true, and a row of three
 * simultaneously-"copied" buttons is not.
 *
 * Each button's accessible name is its own label plus the command beside it
 * ("copy pip install skene"), assembled with `aria-labelledby` rather than an
 * invented `aria-label`, because the package ships no copy and three buttons all
 * named "copy" is what the prototype actually leaves a screen reader with. The
 * name changing to "copied …" is also what announces the result.
 *
 * All content is props. Nothing here knows what command Skene installs with.
 */
/**
 * 1400ms, from the prototype. Long enough to read "copied", short enough that a
 * reader copying the second of three lines is not looking at two green buttons.
 * Not a prop: it is feedback timing, not content, and a caller tuning it is
 * tuning the wrong thing.
 */
const COPY_REVERT_MS = 1400;
/**
 * ## The same frame exists twice, and this one is not the deprecated half
 *
 * `patterns/terminal`'s `Terminal` draws the same object — same tokens, same
 * 10px traffic lights, same mono body — and the two do not match: that frame
 * comes from the `.skene-terminal` class in `effects.css` at an 8px radius,
 * this one draws its own through `ArtPanel` at 12px. Two terminals that
 * disagree is worse than either, and settling them is decision `terminals`.
 *
 * This file carried an `@deprecated` tag for one afternoon on 2026-08-13. That
 * was wrong twice over: the tag means "this will be removed" and the decision
 * was explicitly not to remove it, and it is the only one of the two with a
 * copy affordance — which is the reason `skene-site` renders it on five pages
 * and had just extended it with `onCopy`. A deprecation whose own text tells
 * you to keep using the thing is a deprecation that teaches readers to ignore
 * the tag.
 *
 * Reach for `Terminal` when you want a transcript with no copy button. Reach
 * for this when a reader is meant to run the line.
 */
export function TerminalBlock({ lines, title, note, copyLabel = 'copy', copiedLabel = 'copied', onCopy, className, }) {
    const uid = useId();
    const [copied, setCopied] = useState(null);
    const timer = useRef(undefined);
    // The flash outliving its component would setState on an unmounted tree; a
    // section that scrolls out of a virtualised list is enough to hit it.
    useEffect(() => () => {
        if (timer.current)
            clearTimeout(timer.current);
    }, []);
    async function copy(text, index) {
        try {
            await navigator.clipboard.writeText(text);
        }
        catch {
            // No clipboard (insecure origin) or the user declined. Say nothing rather
            // than flash a success the reader does not have.
            //
            // Report it, though. Silence here is right for the READER and wrong for
            // the consumer: a swallowed failure is indistinguishable from a copy that
            // never happened, so an install-funnel metric built on this component
            // could not tell "nobody copied" from "the copy button is broken on this
            // origin". onCopy carries the outcome; what to do with it is the caller's.
            onCopy?.({ command: text, index, ok: false });
            return;
        }
        onCopy?.({ command: text, index, ok: true });
        if (timer.current)
            clearTimeout(timer.current);
        setCopied(index);
        timer.current = setTimeout(() => setCopied(null), COPY_REVERT_MS);
    }
    return (_jsx(ArtPanel
    // `dark`: see the file header. `bg-terminal-bg` / `border-terminal-border`
    // are `.term`'s two overrides of `.art`, and land after ArtPanel's own base
    // so they win the merge.
    , { 
        // `dark`: see the file header. `bg-terminal-bg` / `border-terminal-border`
        // are `.term`'s two overrides of `.art`, and land after ArtPanel's own base
        // so they win the merge.
        className: cn('dark border-terminal-border bg-terminal-bg', className), bar: _jsxs(_Fragment, { children: [_jsx(TrafficLights, {}), title ? _jsx(ArtTitle, { children: title }) : null] }), children: _jsxs("div", { className: "px-[16px] pb-[24px] pt-[16px] font-mono text-[14px] text-terminal-text", children: [lines.map((line, i) => {
                    const done = copied === i;
                    const cmdId = `${uid}-cmd-${i}`;
                    const labelId = `${uid}-label-${i}`;
                    const prompt = line.prompt === undefined ? '$' : line.prompt;
                    return (_jsxs("div", { className: "flex min-w-0 items-center gap-[12px] py-[8px]", children: [prompt ? (_jsx("span", { "aria-hidden": true, className: "shrink-0 select-none text-semantic-matcha", children: prompt })) : null, _jsx("span", { id: cmdId, className: "min-w-0 flex-1 overflow-x-auto whitespace-nowrap", children: line.display ?? line.command }), line.copyable === false ? null : (_jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => void copy(line.command, i), "aria-labelledby": `${labelId} ${cmdId}`, className: cn(
                                // 24px is the WCAG 2.2 2.5.8 target floor, which is what the
                                // prototype's comment on this height is recording.
                                'h-[24px] shrink-0 px-[8px] font-mono text-[11px] font-normal duration-200 ease-out', 
                                // The outline variant's themed border/ink/hover-fill are all
                                // replaced: this button sits on invariant terminal ground and
                                // must not follow the page. `hover:bg-transparent` cancels the
                                // variant's `hover:bg-muted`.
                                'hover:bg-transparent', done
                                    ? 'border-semantic-matcha text-semantic-matcha hover:border-semantic-matcha hover:text-semantic-matcha'
                                    : 'border-terminal-border text-terminal-text hover:border-brand-peach hover:text-brand-peach'), children: _jsx("span", { id: labelId, children: done ? copiedLabel : copyLabel }) }))] }, i));
                }), note ? (_jsx("div", { className: "mt-[8px] border-t border-terminal-border pt-[16px] text-[13px] text-terminal-text", children: note })) : null] }) }));
}
