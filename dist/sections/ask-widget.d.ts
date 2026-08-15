/**
 * The "ask us anything" prompt block — an attributed question, a box to answer
 * it in, and a small submit.
 *
 * Its own module because it is genuinely interactive: a controlled textarea and
 * a submit handler. Folding it into a file with server-renderable siblings
 * would pull `'use client'` around them too, which is the mistake
 * `billing-toggle.tsx` exists to avoid.
 *
 * The panel paints its OWN ground — invariant `chrome.surface.1` inside an
 * invariant border — rather than sitting transparent on whatever the page ground
 * happens to be. That is what makes `chrome.text.*` the correct role here and
 * not the trap it is elsewhere: `chrome.*` cannot invert, so it is only safe
 * when the surface under it cannot either. The moment this fill is swapped for a
 * flipping one, every text class in here has to move to the theme-aware `text.*`
 * role, and the peach submit already uses the mode-aware `brand.peach` /
 * `brand.peach-text` pair, which stays legible either way because both halves
 * move together.
 *
 * The submit is bottom-RIGHT and sized to its label, not full width. This is a
 * low-commitment probe — the reader is naming their tools, not buying anything —
 * and a full-bleed primary button asks for more resolve than the question does.
 * For the same reason the textarea is a quiet fill with no border: the heading is
 * the loud element, and a boxed input competing with it makes the block read as a
 * form rather than as a question.
 *
 * `showAiBadge` defaults to `true`. Disclosure that an answer is model-generated
 * is not a decoration to opt into; the flag exists for the case where the
 * surrounding section already says so and repeating it is noise.
 */
export interface AskWidgetProps {
    /** Usually an image or initials block; rendered inside a 32px circle. */
    avatar?: React.ReactNode;
    /** Who is asking — sits next to the avatar. */
    name?: React.ReactNode;
    /** The loud line. Also labels the textarea. */
    question: React.ReactNode;
    /** One supporting line under the question. */
    lede?: React.ReactNode;
    placeholder?: string;
    submitLabel: React.ReactNode;
    /** Controlled: the consumer owns the text. */
    value: string;
    onValueChange: (value: string) => void;
    /** Called on submit with the current value; the form never navigates. */
    onSubmit?: (value: string) => void;
    /** Marks the answer as model-generated. On by default — see the file header. */
    showAiBadge?: boolean;
    aiBadgeLabel?: React.ReactNode;
    className?: string;
}
export declare function AskWidget({ avatar, name, question, lede, placeholder, submitLabel, value, onValueChange, onSubmit, showAiBadge, aiBadgeLabel, className, }: AskWidgetProps): import("react").JSX.Element;
//# sourceMappingURL=ask-widget.d.ts.map