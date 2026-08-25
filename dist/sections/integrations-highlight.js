import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { CardAnimationIntegrations } from './card-animation-integrations.js';
import { LightSectionCard } from './light-section-card.js';
/**
 * The homepage integrations band: cream copy column plus the four-card GSAP
 * animation. Ported from skene-marketing-website's `IntegrationsHighlight`.
 */
export function IntegrationsHighlight({ backgroundImage, actions, className, }) {
    return (_jsx("div", { className: cn('mx-auto max-w-[1350px] px-4 pb-6 md:px-6 md:pb-12', className), children: _jsx(LightSectionCard, { title: "Four ways to plug Skene in.", titleScale: "section", lede: "MCP server for your coding agent. GitHub Action for CI. Cloud API for custom runs. One-time repo audit.", actions: actions, visual: _jsx("div", { className: "flex min-h-[250px] items-center justify-center overflow-hidden p-6 md:min-h-0 md:p-8", children: _jsx(CardAnimationIntegrations, { backgroundImage: backgroundImage }) }), children: "Install the MCP server into Cursor or Claude Code and Skene runs before the agent commits. Add the GitHub Action and it runs on every PR. Hit the cloud API directly from any script. Or run a one-time audit of your current instrumentation surface before you adopt anything else." }) }));
}
