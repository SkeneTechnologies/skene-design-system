import {
  ClipboardCheck, Cloud, GitPullRequest, Terminal as TerminalGlyph,
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@skene/design-system/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@skene/design-system/ui/alert'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@skene/design-system/ui/alert-dialog'
import { Badge } from '@skene/design-system/ui/badge'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator,
} from '@skene/design-system/ui/breadcrumb'
import { Button } from '@skene/design-system/ui/button'
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@skene/design-system/ui/card'
import { Checkbox } from '@skene/design-system/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@skene/design-system/ui/collapsible'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  CommandSeparator, CommandShortcut,
} from '@skene/design-system/ui/command'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@skene/design-system/ui/dialog'
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from '@skene/design-system/ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@skene/design-system/ui/hover-card'
import { Input } from '@skene/design-system/ui/input'
import {
  InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText,
} from '@skene/design-system/ui/input-group'
import { Label } from '@skene/design-system/ui/label'
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger,
} from '@skene/design-system/ui/navigation-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@skene/design-system/ui/popover'
import { Progress } from '@skene/design-system/ui/progress'
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator,
  SelectTrigger, SelectValue,
} from '@skene/design-system/ui/select'
import { SettingsInput, SettingsSelect, SettingsSwitch } from '@skene/design-system/ui/settings-field'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@skene/design-system/ui/sheet'
import { Skeleton } from '@skene/design-system/ui/skeleton'
import { Slider } from '@skene/design-system/ui/slider'
import { Switch } from '@skene/design-system/ui/switch'
import {
  Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader,
  TableRow,
} from '@skene/design-system/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@skene/design-system/ui/tabs'
import { Textarea } from '@skene/design-system/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@skene/design-system/ui/tooltip'

import { assetUrls } from '@skene/design-system/asset-urls'

import { DitheredMedia } from '@skene/design-system/patterns/dither'
import { HeroBackdrop } from '@skene/design-system/patterns/hero-backdrop'
import {
  Accent, DisplayHeading, Eyebrow, NumberedStep, PillNav, PillNavLink, SplitAuthLayout,
} from '@skene/design-system/patterns/marketing'
import {
  PILL_NAV_FROSTED_STYLE, PILL_NAV_POSITION,
} from '@skene/design-system/patterns/pill-nav-frosted'
import { Terminal, TerminalLine } from '@skene/design-system/patterns/terminal'

import { SkeneLockup, SkeneMark } from '@skene/design-system/patterns/skene-mark'

import { AgentCallout } from '@skene/design-system/sections/agent-callout'
import { AnnotatedCurve } from '@skene/design-system/sections/annotated-curve'
import {
  AppPanel, AppWindow, ArtFrame, ArtPanel, ArtTitle, DataCell, DataRow, DataTable, StatPill,
} from '@skene/design-system/sections/artifact-shell'
import { DiscoveryTable } from '@skene/design-system/sections/discovery-table'
import {
  CheckChip, CheckFigure, CheckOperand, CheckResult, EvaluatorCheck,
} from '@skene/design-system/sections/evaluator-check'
import { EvaluatorList, EvaluatorNote } from '@skene/design-system/sections/evaluator-list'
import { EvaluatorPanel } from '@skene/design-system/sections/evaluator-panel'
import { EvaluatorVerify } from '@skene/design-system/sections/evaluator-verify'
import { FaqBand, FaqRow } from '@skene/design-system/sections/faq-band'
import { FlowDiagram, FlowEdge, FlowNode } from '@skene/design-system/sections/flow-diagram'
import { Funnel, FunnelRow } from '@skene/design-system/sections/funnel'
import { IntegrationRows } from '@skene/design-system/sections/integration-rows'
import {
  KeyValueTable, MaskedValue, TableNote, TagChip,
} from '@skene/design-system/sections/key-value-table'
import { LifecycleCanvas } from '@skene/design-system/sections/lifecycle-canvas'
import { McpBlock, McpCode, McpTool } from '@skene/design-system/sections/mcp-block'
import { OverviewTile, OverviewTiles } from '@skene/design-system/sections/overview-tiles'
import { PrReview } from '@skene/design-system/sections/pr-review'
import { DiffColumn, SideBySideDiff } from '@skene/design-system/sections/side-by-side-diff'
import { TerminalBlock } from '@skene/design-system/sections/terminal-block'
import { Bridge, BridgeNode } from '@skene/design-system/sections/bridge'
import { CheckItem, CheckList } from '@skene/design-system/sections/check-list'
import { Code, PROSE_CODE } from '@skene/design-system/sections/code'
import { Chip } from '@skene/design-system/sections/chip'
import {
  ComparisonRow, ComparisonTable, TableCheck, TableDash,
} from '@skene/design-system/sections/comparison-table'
import { FeatureIcon, FeatureRow } from '@skene/design-system/sections/feature-row'
import { FinalCta } from '@skene/design-system/sections/final-cta'
import { Finding, MetricCard, Sparkline } from '@skene/design-system/sections/finding-card'
import {
  FooterColumn, FooterLink, SiteFooter, SocialLink, SocialLinks,
} from '@skene/design-system/sections/footer'
import { GlyphBadge } from '@skene/design-system/sections/glyph-badge'
import { IntegrationsHighlight } from '@skene/design-system/sections/integrations-highlight'
import { JourneyStep, JourneyTrack, MiniFunnel } from '@skene/design-system/sections/journey-track'
import { LightSectionCard } from '@skene/design-system/sections/light-section-card'
import { LogoRow } from '@skene/design-system/sections/logo-row'
import { PipelineStepper } from '@skene/design-system/sections/pipeline-stepper'
import { PlanCard, PlanGrid } from '@skene/design-system/sections/plan-card'
import {
  ProductWindow, WindowChip, WindowStatus, WindowToolbar,
} from '@skene/design-system/sections/product-window'
import { QuestionCard, QuestionGrid } from '@skene/design-system/sections/question-grid'
import { RecommendationCard } from '@skene/design-system/sections/recommendation-card'
import { ScoreRing } from '@skene/design-system/sections/score-ring'
import { SectionBackdrop } from '@skene/design-system/sections/section-backdrop'
import { MetaChip, StatChip } from '@skene/design-system/sections/stat-chip'
import { SurfaceCards } from '@skene/design-system/sections/surface-cards'
import {
  SurfaceDetail, SurfaceTile, SurfaceTiles,
} from '@skene/design-system/sections/surface-tiles'
import { TeamCard, TeamGrid } from '@skene/design-system/sections/team-card'
import { TrafficLights } from '@skene/design-system/sections/traffic-lights'
import { TrustFact, TrustPanel } from '@skene/design-system/sections/trust-panel'
import { ValueCard, ValueCards } from '@skene/design-system/sections/value-cards'

import { AskWidgetCase, BillingToggleCase, FrozenGsap, HashScroll } from './islands'

/**
 * Per-component gallery. NOT a documentation page — the three pages under
 * `/`, `/surfaces` and `/pages` are the documentation, and they are also the
 * three page-level snapshots this suite used to consist of entirely.
 *
 * Why a second gallery exists: three page snapshots covering thirty primitives,
 * seven patterns and nine sections is too coarse to name a culprit. Three shadcn
 * token values were repainted — one of them the active sidebar item — and the
 * page suite reported 3/3 green. It was the marketing repo's per-component
 * suite that caught it. This page moves that capability into the package.
 *
 * Contract with tests/components.spec.ts:
 *
 *   data-visual="<name>"        this element is a snapshot target
 *   data-visual-open="click"    before capturing, act on [data-visual-act]
 *                    |"hover"   inside this case
 *   data-visual-content="<sel>" ...then capture THAT element instead, as
 *                               "<name>-open". Needed because Radix portals
 *                               overlay content to document.body, outside the
 *                               case element entirely.
 *
 * A case with `data-visual-content` therefore yields two snapshots: the closed
 * trigger and the open surface. The case list is read out of the DOM, so adding
 * a <Case> here adds baselines with no change to the spec.
 *
 * NO mode wrapper anywhere on this page. The spec toggles `light`/`dark` on
 * <html> and runs the whole sweep twice, which is the only way portalled
 * content inherits the mode — a `.light` div in the page body cannot reach a
 * dialog rendered into document.body. It is also the reason both modes matter:
 * this package exists because the two consuming apps invert, and several tokens
 * differ ONLY in light, so a dark-only gallery is blind to half of them.
 */

function Case({
  name,
  width = 'w-[720px]',
  open,
  content,
  children,
}: {
  name: string
  width?: string
  open?: 'click' | 'hover'
  content?: string
  children: React.ReactNode
}) {
  return (
    <section
      // Deep-link target. /decisions links here per component, and an anchor
      // needs an id — the spec locates cases by [data-visual], so the snapshot
      // contract above is unaffected by this.
      id={name}
      data-visual={name}
      data-visual-open={open}
      data-visual-content={content}
      className={`scroll-mt-6 bg-background text-foreground p-6 ${width}`}
    >
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {name}
      </h2>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

/** A fixed-dark ground for the patterns that are chrome-only by design. */
function Chrome({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-chrome-surface-darker ${className}`}>{children}</div>
}

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const

export default function ComponentGalleryPage() {
  return (
    <main className="flex flex-col items-start gap-6 p-6">
      <HashScroll />
      {/* Holds every GSAP timeline on the page at 2.5s. Two cases below are
          GSAP-driven and neither can hold a baseline without it — see the
          component's own header in ./islands for what 2.5 is and why the CSS
          freeze does not reach this. Mounted once, at the top, rather than per
          case: the freeze is global by construction (there is one
          `gsap.globalTimeline`), and two copies would just seek the same
          timelines twice. */}
      <FrozenGsap seconds={2.5} />
      <h1 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        component gallery
      </h1>

      {/* ---------------------------------------------------------------- ui */}

      <Case name="ui-accordion">
        <Accordion type="single" defaultValue="a" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>What does Skene check?</AccordionTrigger>
            <AccordionContent>
              Every write that records an event, against the schema it lands in.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Does it move my data?</AccordionTrigger>
            <AccordionContent>No. It reads, read-only.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Case>

      <Case name="ui-alert">
        <div className="space-y-3">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>The tracking plan changed on this branch.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>checkout_started is gone</AlertTitle>
            <AlertDescription>Three call sites still reference it.</AlertDescription>
          </Alert>
        </div>
      </Case>

      <Case
        name="ui-alert-dialog"
        open="click"
        content="[data-slot=alert-dialog-content]"
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-visual-act>
              Delete plan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this tracking plan?</AlertDialogTitle>
              <AlertDialogDescription>
                Forty-two events lose their contract. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Case>

      <Case name="ui-badge">
        <Row>
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="destructive">destructive</Badge>
          <Badge variant="outline">outline</Badge>
        </Row>
      </Case>

      <Case name="ui-breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>How it works</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Case>

      <Case name="ui-button" width="w-[880px]">
        <div className="space-y-3">
          {BUTTON_SIZES.map((size) => (
            <Row key={size}>
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} size={size}>
                  {variant}
                </Button>
              ))}
            </Row>
          ))}
          <Row>
            <Button size="icon">×</Button>
            <Button disabled>disabled</Button>
            <Button variant="outline" disabled>
              disabled
            </Button>
          </Row>
        </div>
      </Case>

      <Case name="ui-card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Tracking plan</CardTitle>
            <CardDescription>Three events changed on this branch.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Skene re-reads the changed files on every pull request.
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="outline">
              Review diff
            </Button>
          </CardFooter>
        </Card>
      </Case>

      <Case name="ui-checkbox">
        <Row>
          <span className="flex items-center gap-2 text-sm">
            <Checkbox id="cb-1" /> <Label htmlFor="cb-1">Unchecked</Label>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Checkbox id="cb-2" defaultChecked /> <Label htmlFor="cb-2">Checked</Label>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Checkbox id="cb-3" disabled /> <Label htmlFor="cb-3">Disabled</Label>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Checkbox id="cb-4" disabled defaultChecked />{' '}
            <Label htmlFor="cb-4">Disabled checked</Label>
          </span>
        </Row>
      </Case>

      <Case name="ui-collapsible">
        <Collapsible defaultOpen className="max-w-sm">
          <CollapsibleTrigger className="text-sm underline underline-offset-4">
            42 matched events
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1 font-mono text-[12px] text-muted-foreground">
            <p>events_tracked</p>
            <p>checkout_started</p>
            <p>plan_upgraded</p>
          </CollapsibleContent>
        </Collapsible>
      </Case>

      <Case name="ui-command">
        <Command className="max-w-sm rounded-md border">
          <CommandInput placeholder="Search events…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Events">
              <CommandItem>
                events_tracked
                <CommandShortcut>⌘1</CommandShortcut>
              </CommandItem>
              <CommandItem>checkout_started</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>Run a data audit</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Case>

      <Case name="ui-dialog" open="click" content="[data-slot=dialog-content]">
        <Dialog>
          <DialogTrigger asChild>
            <Button data-visual-act>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve the tracking plan</DialogTitle>
              <DialogDescription>
                Two events are breaking changes. Approving pins the new contract.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Case>

      <Case name="ui-dropdown-menu" open="click" content="[data-slot=dropdown-menu-content]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" data-visual-act>
              Open menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Plan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Review diff
              <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Approve</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Notify on break</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Case>

      <Case name="ui-hover-card" open="hover" content="[data-slot=hover-card-content]">
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <Button variant="link" data-visual-act>
              checkout_started
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <p className="text-sm font-medium">checkout_started</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Renamed in release 184. Three call sites still write the old name.
            </p>
          </HoverCardContent>
        </HoverCard>
      </Case>

      <Case name="ui-input">
        <div className="max-w-sm space-y-3">
          <Input placeholder="Placeholder" />
          <Input defaultValue="With a value" />
          <Input disabled placeholder="Disabled" />
          <Input aria-invalid defaultValue="Invalid" />
        </div>
      </Case>

      <Case name="ui-input-group">
        <div className="max-w-sm space-y-3">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="Search events" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="sm">Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Case>

      <Case name="ui-label">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="lbl-1">Event name</Label>
          <Input id="lbl-1" placeholder="checkout_started" />
        </div>
      </Case>

      {/* Opened by hover rather than `defaultValue`: the viewport measures its
          own height from the active content, and on a first paint with no
          pointer interaction it settles at 0 and the panel is invisible.
          The panel is `bg-card/95` over a backdrop blur, so the case keeps a
          spacer — over a neighbouring case it would sample whatever happened to
          be behind it. */}
      <Case
        name="ui-navigation-menu"
        open="hover"
        content="[data-slot=navigation-menu-viewport]"
      >
        <div className="h-[220px]">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem value="product">
                <NavigationMenuTrigger data-visual-act>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[380px] gap-1 p-3">
                    {['How it works', 'Features', 'Supabase', 'Architecture'].map((l) => (
                      <li key={l}>
                        <NavigationMenuLink
                          href="#"
                          className="block rounded-md p-2 text-sm hover:bg-accent"
                        >
                          {l}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="pricing">
                <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[240px] p-3 text-sm">Three tiers.</div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Case>

      <Case name="ui-popover" open="click" content="[data-slot=popover-content]">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" data-visual-act>
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <p className="text-sm font-medium">Coverage</p>
            <p className="mt-1 text-xs text-muted-foreground">
              42 of 44 events are matched to a table.
            </p>
          </PopoverContent>
        </Popover>
      </Case>

      <Case name="ui-progress">
        <div className="max-w-sm space-y-3">
          <Progress value={0} />
          <Progress value={62} />
          <Progress value={100} />
        </div>
      </Case>

      <Case name="ui-select" open="click" content="[data-slot=select-content]">
        <Select>
          <SelectTrigger className="w-[220px]" data-visual-act>
            <SelectValue placeholder="Pick an environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Branches</SelectLabel>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="release">release/184</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem value="preview">preview</SelectItem>
          </SelectContent>
        </Select>
      </Case>

      <Case name="ui-settings-field">
        <div className="max-w-sm space-y-3">
          <SettingsInput defaultValue="skene_prod" />
          <SettingsInput defaultValue="1.5M tokens" mono />
          <SettingsInput defaultValue="Renamed field" validation="warning" />
          <SettingsInput defaultValue="Missing table" validation="error" />
          <SettingsInput defaultValue="Verified" validation="success" />
          <SettingsInput defaultValue="Locked" disabled />
          <SettingsSelect defaultValue="main">
            <option value="main">main</option>
            <option value="release">release/184</option>
          </SettingsSelect>
          <SettingsSwitch label="Comment on every PR" description="Off means digest only." />
          <SettingsSwitch label="Block the merge" defaultChecked />
        </div>
      </Case>

      <Case name="ui-sheet" open="click" content="[data-slot=sheet-content]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" data-visual-act>
              Open sheet
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Event detail</SheetTitle>
            </SheetHeader>
            <div className="space-y-2 p-4 text-sm text-muted-foreground">
              <p>checkout_started</p>
              <p>Renamed in release 184.</p>
            </div>
          </SheetContent>
        </Sheet>
      </Case>

      <Case name="ui-skeleton">
        <div className="max-w-sm space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Case>

      <Case name="ui-slider">
        <div className="max-w-sm space-y-6">
          <Slider defaultValue={[40]} max={100} step={1} />
          <Slider defaultValue={[20, 70]} max={100} step={1} />
          <Slider defaultValue={[50]} max={100} step={1} disabled />
        </div>
      </Case>

      {/* ui/sonner has no case. `Toaster` renders nothing until `toast()` is
          called, and `toast` comes from `sonner`, which is a dependency of the
          PACKAGE, not of this app — docs-app cannot import it, and adding its
          own copy would give the two a separate toast store, so the button
          would fire into a Toaster that never hears it. Covering it needs
          either a `toast` re-export from the package or a docs-app dependency
          on sonner; both are API decisions, not test decisions. Its wrapper
          hardcodes `theme="light"` and consumes no package token, so the
          uncovered surface is sonner's own CSS. */}

      <Case name="ui-switch">
        <Row>
          <span className="flex items-center gap-2 text-sm">
            <Switch id="sw-1" /> <Label htmlFor="sw-1">Off</Label>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Switch id="sw-2" defaultChecked /> <Label htmlFor="sw-2">On</Label>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Switch id="sw-3" disabled /> <Label htmlFor="sw-3">Disabled</Label>
          </span>
        </Row>
      </Case>

      <Case name="ui-table">
        <Table>
          <TableCaption>Events on release/184.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['events_tracked', 'Verified', 2568],
              ['checkout_started', 'Renamed', 1284],
              ['plan_upgraded', 'Verified', 642],
            ].map(([event, status, volume]) => (
              <TableRow key={event as string}>
                <TableCell className="font-mono text-[12px]">{event}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell className="text-right">{volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">4494</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Case>

      <Case name="ui-tabs">
        <Tabs defaultValue="one" className="max-w-md">
          <TabsList>
            <TabsTrigger value="one">Overview</TabsTrigger>
            <TabsTrigger value="two">Events</TabsTrigger>
            <TabsTrigger value="three">Schema</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="pt-3 text-sm text-muted-foreground">
            First panel
          </TabsContent>
          <TabsContent value="two" className="pt-3 text-sm text-muted-foreground">
            Second panel
          </TabsContent>
        </Tabs>
      </Case>

      <Case name="ui-textarea">
        <div className="max-w-sm space-y-3">
          <Textarea placeholder="Textarea" rows={3} />
          <Textarea defaultValue="A renamed event passes every test." rows={3} />
          <Textarea disabled placeholder="Disabled" rows={2} />
        </div>
      </Case>

      <Case name="ui-tooltip" open="hover" content="[data-slot=tooltip-content]">
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" data-visual-act>
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Checked on every pull request</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Case>

      {/* ---------------------------------------------------------- patterns */}

      <Case name="pattern-hero-backdrop" width="w-[880px]">
        <HeroBackdrop className="px-8 py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-text-muted">
            Tracking that holds
          </p>
          <h3 className="mt-3 max-w-lg text-[34px] leading-[1.15] tracking-[-0.02em] text-chrome-text-primary">
            Catch the break on the PR
          </h3>
          <div className="mt-6 flex gap-3">
            <Button>Start free</Button>
            <Button variant="outline">Install Skene</Button>
          </div>
        </HeroBackdrop>
      </Case>

      <Case name="pattern-dithered-media" width="w-[880px]">
        <DitheredMedia className="min-h-[260px]">
          <div className="px-8 py-16 text-center">
            <DisplayHeading size="section">Trust your product data.</DisplayHeading>
          </div>
        </DitheredMedia>
      </Case>

      <Case name="pattern-pill-nav" width="w-[880px]">
        <Chrome className="relative min-h-[120px]">
          <PillNav
            brand={<span className="text-[15px] font-medium text-chrome-text-primary">Skene</span>}
            actions={
              <>
                <Button variant="outline" size="sm">
                  Log In
                </Button>
                <Button size="sm">Start free</Button>
              </>
            }
          >
            {['Product', 'Pricing', 'Docs', 'Blog'].map((l) => (
              <PillNavLink key={l} href="#">
                {l}
              </PillNavLink>
            ))}
          </PillNav>
        </Chrome>
      </Case>

      <Case name="pattern-display-heading" width="w-[880px]">
        <Chrome className="space-y-4 p-8">
          <Eyebrow>How it works</Eyebrow>
          <DisplayHeading size="hero">
            Trust your product data. <Accent>Live in one click.</Accent>
          </DisplayHeading>
          <DisplayHeading size="page" as="h2">
            Setup, the PR check, and the fix.
          </DisplayHeading>
          <DisplayHeading size="section" as="h3">
            A section head.
          </DisplayHeading>
        </Chrome>
      </Case>

      <Case name="pattern-numbered-step" width="w-[880px]">
        <Chrome className="space-y-8 p-8">
          <NumberedStep n="01" title="Setup">
            Connect the repository and your Supabase project, read-only.
          </NumberedStep>
          <NumberedStep n="02" title="The PR check">
            Skene re-reads the changed files on every pull request.
          </NumberedStep>
        </Chrome>
      </Case>

      <Case name="pattern-split-auth" width="w-[880px]">
        <Chrome>
          <SplitAuthLayout
            className="min-h-[420px]"
            form={
              <div className="text-center">
                <h3 className="text-[22px] text-chrome-text-primary">Sign in</h3>
                <p className="mt-2 text-[13px] text-chrome-text-muted">
                  Enter your email to receive a magic link.
                </p>
                <div className="mt-6 space-y-3 text-left">
                  <Input placeholder="you@company.com" />
                  <Button className="w-full">Continue with email</Button>
                </div>
              </div>
            }
            meta={
              <>
                <span>Secure sign in</span>
                <span>Magic link auth</span>
              </>
            }
            showcase={
              <div className="flex h-full items-center justify-center bg-brand-light p-10">
                <Card className="light w-full max-w-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-[14px] font-medium">Starting journey analysis…</p>
                  </CardContent>
                </Card>
              </div>
            }
          />
        </Chrome>
      </Case>

      <Case name="pattern-terminal" width="w-[880px]">
        <Terminal title="skene">
          <TerminalLine prompt>uvx skene analyse-journey .</TerminalLine>
          <TerminalLine className="text-[var(--color-semantic-matcha)]">
            ✓ 42 events matched the tracking plan
          </TerminalLine>
          <TerminalLine className="text-[var(--color-semantic-error-red)]">
            ✗ checkout_started renamed, 3 call sites stale
          </TerminalLine>
        </Terminal>
      </Case>

      <Case name="pattern-skene-mark">
        {/* All three tones side by side, on both a dark and a cream tile, which
            is the only way the naming trap is visible: `onLight` is the BLACK
            glyph, and rendering it on the dark half shows what a caller who
            read the prop as "the light-coloured one" would ship. */}
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 rounded-xl bg-chrome-surface-1 p-4">
              <SkeneMark />
              <SkeneMark tone="onDark" />
            </div>
            <div className="light flex items-center gap-4 rounded-xl bg-brand-light p-4">
              <SkeneMark />
              <SkeneMark tone="onLight" />
            </div>
          </div>
          {/* The lockup on both grounds and in the accent treatment. `accent` is
              the one tone not named after a ground — peach symbol, WHITE
              wordmark — so it is shown on the dark tile beside onDark, which is
              the only place it is legible. */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid gap-3 rounded-xl bg-chrome-surface-1 px-5 py-4">
              <SkeneLockup height={26} />
              <SkeneLockup tone="accent" height={26} />
            </div>
            <div className="light grid gap-3 rounded-xl bg-brand-light px-5 py-4">
              <SkeneLockup tone="onLight" height={26} />
            </div>
          </div>
        </div>
      </Case>

      {/* ---------------------------------------------------------- sections */}

      <Case name="section-agent-callout" width="w-[880px]">
        {/* Both shipped instances. The first is the standing one — eyebrow,
            claim, evidence — and the second is the nested one, which fills only
            the claim. They are stacked rather than shown once because the
            component's whole justification is that two different-looking blocks
            are the same three slots with different ones filled. */}
        <div className="grid gap-4">
          <AgentCallout
            eyebrow="Skene found the cause"
            evidence="One broken signal · one missing signal · caught before the next decision"
          >
            The funnel changed because the tracking did.
          </AgentCallout>
          <AgentCallout>Skene left a precise review.</AgentCallout>
        </div>
      </Case>

      <Case name="section-annotated-curve" width="w-[880px]">
        {/* The callouts are HTML boxes translated OUT of the plotting box, so
            the case has to pad for them — an `above` box on the last node hangs
            a full box height above the frame and would be clipped by the
            snapshot otherwise. The two unlabelled points are shaping anchors:
            they carry the sweep to the edges without inventing a tail past the
            last thing the reader is told. `align` is set on the outer two
            because a centred box at x=16 or x=88 hangs outside the frame. */}
        <div className="px-6 pb-4 pt-14">
          <AnnotatedCurve
            points={[
              // A J-curve, not a diagonal. Evenly-spaced points along a straight
              // line — which is what this case used to hold — make the spline a
              // ruler, and the figure's whole claim is that the effect
              // ACCELERATES. The y values are an exponential: the first third
              // barely lifts, the last third climbs almost vertically.
              { x: 0, y: 99 },
              { x: 28, y: 93, label: '1. A tracking call goes missing in a green PR.', align: 'start' },
              { x: 64, y: 70, label: '2. An agent renames it. Skene catches it on the PR.' },
              { x: 88, y: 26, label: '3. Every event still fires. The number holds.', align: 'end' },
              { x: 97, y: 4 },
            ]}
          />
        </div>
      </Case>

      <Case name="section-ask-widget" width="w-[880px]">
        <AskWidgetCase />
      </Case>

      <Case name="section-billing-toggle">
        <BillingToggleCase />
      </Case>

      <Case name="section-bridge" width="w-[1120px]">
        {/* The doubly nested inversion, which is the only reason this case
            exists. The band root carries `light` over a cream fill and the
            MIDDLE card carries `dark` back over a near-black one, so a single
            snapshot holds both switches at once — and both are exactly the
            mechanism that shipped invisible twice in this package already.

            Rendered whole rather than as three bare nodes: the eyebrow chip,
            the heading and the caption are the parts that resolve against
            cream, and a node-only case would show none of them. `<Accent>` is
            in the title on purpose — peach is mode-aware, and inside a `light`
            band it must land on its light value, not the dark one.

            The outer two cards take no icon, matching the live section: the
            glyph marks the subject, and putting one on all three would flatten
            the middle card back into a peer. */}
        <Bridge
          eyebrow="The product"
          title={
            <>
              Between the team that asks and the team that <Accent>ships</Accent>.
            </>
          }
          lede="One side needs the number to be right. The other side changes the code that produces it. Skene is the check that sits between them."
          caption="Every answer traces back to an event in your own database."
        >
          <BridgeNode
            label="GTM"
            title={<>&ldquo;Why did activation drop last week?&rdquo;</>}
            items={['Asks in plain language', 'Needs the number to hold', 'Does not read the schema']}
          />
          <BridgeNode
            featured
            // The real symbol. This was a ◎ glyph standing in for artwork the
            // package did not ship; it ships now, and the featured card is
            // exactly the place the product speaks for itself.
            icon={<SkeneMark size={34} radius={11} />}
            label="Skene"
            title="Checks every event against the schema it lands in."
            items={['Reads the repo and the database', 'Comments on the pull request', 'Names the call site that drifted']}
          />
          <BridgeNode
            label="Engineering"
            title={<>&ldquo;It passed every test. What broke?&rdquo;</>}
            items={['Renames a field mid-sprint', 'Ships green', 'Hears about it weeks later']}
          />
        </Bridge>
      </Case>

      <Case name="section-check-list">
        <div className="grid grid-cols-2 gap-6">
          <CheckList>
            <CheckItem>Connect your repo and Supabase, read-only</CheckItem>
            <CheckItem>Adds the events you&rsquo;re missing</CheckItem>
            <CheckItem>Your data never leaves Supabase</CheckItem>
          </CheckList>
          {/* onLight is the cream-card case: the one CheckList variant that
              inverts, and the one that shipped invisible once already. */}
          <div className="light rounded-2xl bg-brand-light p-4">
            <CheckList dense onLight>
              <CheckItem dense>Local MCP server</CheckItem>
              <CheckItem dense>GitHub App with PR reviews</CheckItem>
              <CheckItem dense>1.5M monthly tokens</CheckItem>
            </CheckList>
          </div>
        </div>
      </Case>

      <Case name="section-chip">
        {/* The whole tone table on both grounds, because two of the three tones
            are mode-aware and only the cream panel shows their light value:
            healthy and live mix their fill from semantic.matcha / accent.violet
            through color-mix, so they follow the `light` ancestor down. neutral
            is the one tone that must NOT move — it is near-black on both, which
            is what makes it an identity marker rather than a state.

            The last row is the tracking exception in the flesh. Chip holds
            0.08em (PlanCard's tier chip); WindowStatus overrides to 0.05em,
            which is what it shipped and was verified at. They are side by side
            so the difference is a baseline someone can look at and settle,
            rather than a number in two files. */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-wrap items-start gap-3">
            <Chip>Pro</Chip>
            <Chip tone="healthy">Dashboard: healthy</Chip>
            <Chip tone="live">Live</Chip>
          </div>
          <div className="light flex flex-wrap items-start gap-3 rounded-2xl bg-brand-light p-4">
            <Chip>Pro</Chip>
            <Chip tone="healthy">Dashboard: healthy</Chip>
            <Chip tone="live">Live</Chip>
          </div>
          <div className="col-span-2 flex flex-wrap items-center gap-3">
            <Chip tone="healthy">Dashboard: healthy</Chip>
            <WindowStatus>Dashboard: healthy</WindowStatus>
          </div>
        </div>
      </Case>

      <Case name="section-comparison-table" width="w-[1120px]">
        {/* The featured column is the reason for the case: `featuredIndex` is an
            index into `columns`, so it has to wash the header AND every body
            cell under it — a baseline that only held the head would go green
            the day the body wash stopped being cloned onto the rows. Both
            markers appear, because they are not one glyph with two colours:
            TableCheck is semantic.matcha, TableDash is mixed from the
            mode-aware text.primary and is the one that would vanish on cream.
            Left on the case's own ground (no `onLight`), which pins the
            hairline to chrome.line.subtle — the polarity this gallery's ground
            actually is. */}
        <ComparisonTable
          columns={['Capability', 'Hosted analytics', 'Skene', 'By hand']}
          featuredIndex={2}
          caption="Compared on what happens when an event changes name."
        >
          <ComparisonRow
            header="Events live in a database you own"
            cells={[<TableDash />, <TableCheck />, <TableCheck />]}
          />
          <ComparisonRow
            header="Checked on the pull request, before the merge"
            cells={[<TableDash />, <TableCheck />, <TableDash />]}
          />
          <ComparisonRow
            header="Names the call site that drifted"
            cells={[<TableDash />, <TableCheck />, 'If you know where to look']}
          />
          <ComparisonRow
            header="Effort per release"
            cells={['Dashboard review', 'None', 'A morning']}
          />
        </ComparisonTable>
      </Case>

      <Case name="section-faq-band" width="w-[1120px]">
        {/* Rendered whole, not as a bare row: the band IS the thing that was
            missing — the cream ground, the two-column split and the hairline
            per row. The first row is left open in the baseline via the
            component's own resting behaviour (one at a time, collapsible), so
            the snapshot holds a closed trigger, an open one and the + / ×
            rotation at the same time. */}
        <FaqBand
          eyebrow="FAQ"
          title="Questions GTM leaders ask before they bring in Engineering."
          note="Need an answer for your exact setup? Talk with Skene."
        >
          <FaqRow question="What does the free analysis cover?">
            A one-time map of the product data currently being collected: broken and incomplete
            signals, missing journey steps, and the highest-priority gaps for GTM and Engineering.
          </FaqRow>
          <FaqRow question="Does Skene replace our analytics or BI tool?">
            No. Skene protects the collection layer that feeds the systems you already use. Your
            dashboard stays where you explore the numbers.
          </FaqRow>
          <FaqRow question="Do marketers or CS leaders need to touch code?">
            No. GTM defines the journeys that need reliable evidence; Skene turns that into
            findings inside the release workflow, where Engineering reviews them.
          </FaqRow>
        </FaqBand>
      </Case>

      <Case name="section-feature-row" width="w-[1120px]">
        <FeatureRow
          n="01"
          texture="journey"
          icon={<FeatureIcon accent="peach">◎</FeatureIcon>}
          title="Analytics live in your own Supabase."
          lede="Connect once. Skene adds the tracking you're missing."
          actions={<Button>Start free</Button>}
          visual={
            <ProductWindow
              title="Activation funnel · Last 28 days"
              status={<WindowStatus>Dashboard: healthy</WindowStatus>}
            >
              <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
                <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
              </MetricCard>
            </ProductWindow>
          }
        >
          <CheckList>
            <CheckItem>Connect your repo and Supabase, read-only</CheckItem>
            <CheckItem>Checks each PR against its preview branch</CheckItem>
          </CheckList>
        </FeatureRow>
      </Case>

      {/* The second arrangement, and the second adopter's shape. The case above
          is the homepage: three rows under one band heading, so an `h3` title,
          no per-row eyebrow, and a visual that fits a half track. This one is a
          lone row standing in for a whole section — its own eyebrow, its title
          as the section `h2`, and a visual too wide to be split at any width.
          Both are `FeatureRow`; only the props differ. */}
      <Case name="section-feature-row-stacked" width="w-[1120px]">
        <FeatureRow
          splitAt="never"
          titleAs="h2"
          sheen={false}
          eyebrow={<Eyebrow>The PR check</Eyebrow>}
          title="What step 03 looks like on a release."
          visual={
            <ProductWindow
              title="Activation funnel · Last 28 days"
              status={<WindowStatus>Dashboard: healthy</WindowStatus>}
            >
              <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
                <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
              </MetricCard>
            </ProductWindow>
          }
        />
      </Case>

      <Case name="section-final-cta" width="w-[1120px]">
        <FinalCta
          lede="A renamed event passes every test, ships green, and sits broken for weeks."
          actions={
            <>
              <Button>Start free</Button>
              <Button variant="outline">Install Skene</Button>
            </>
          }
        >
          Patch the code tomorrow. The data from this week is already gone.
        </FinalCta>
      </Case>

      <Case name="section-finding-card" width="w-[880px]">
        <div className="grid grid-cols-2 gap-6">
          {/* onLight true and false are two different colour sets, not a tint. */}
          <div className="grid gap-2 rounded-md bg-brand-light p-4">
            <Finding status="good" tag="01" title="Signed up" note="Event verified" />
            <Finding status="warn" tag="02" title="Invited team" note="Field renamed" />
            <Finding status="danger" tag="03" title="First value" note="Not measured" />
          </div>
          <div className="grid gap-2 rounded-md bg-chrome-surface-1 p-4">
            <Finding onLight={false} status="good" tag="ok" title="plan_upgraded" note="Unchanged" />
            <Finding onLight={false} status="warn" tag="dif" title="invited_team" note="Renamed" />
            <Finding
              onLight={false}
              status="danger"
              tag="err"
              title="checkout_started"
              note="3 call sites stale"
            />
          </div>
        </div>
      </Case>

      <Case name="section-journey-track" width="w-[1120px]">
        {/* All three states in one track, because the connector is a gradient
            BETWEEN a pair and there is no way to see that from a single state:
            good→good is matcha at both ends, good→warn fades to the border grey
            rather than to amber, and warn→danger arrives in error red. Three
            states in sequence is the smallest track that holds all three
            connectors at once.

            The standalone `JourneyStep` below is the direct-render path, where
            the caller owns `index` — the track fills in 1..n, so a glyph in the
            ring is only ever seen here. `MiniFunnel` sits beside it as it does
            on the live band: its bar is brand.peach in every row, deliberately
            NOT the status triple, and the last row is the drop the danger step
            names. */}
        <div className="space-y-8">
          <JourneyTrack
            title="Signup → first analysis"
            subtitle="Re-read from the changed files on every pull request."
            steps={[
              { label: 'Signed up', note: 'Event verified', state: 'good' },
              { label: 'Connected a repo', note: 'Event verified', state: 'good' },
              { label: 'Invited a teammate', note: 'Renamed field, no longer measured', state: 'warn' },
              { label: 'First analysis', note: 'checkout_started is gone, 3 call sites stale', state: 'danger' },
            ]}
          />
          <div className="grid grid-cols-2 gap-8">
            <MiniFunnel
              rows={[
                { label: 'Signed up', value: '2,568', fill: 100 },
                { label: 'Connected a repo', value: '1,284', fill: 50 },
                { label: 'Invited a teammate', value: '642', fill: 25 },
                { label: 'First analysis', value: 'Not measured', fill: 0 },
              ]}
            />
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              <JourneyStep
                index="◎"
                state="good"
                label="Checkout"
                note="Matched to a table"
              />
              <JourneyStep
                index="✕"
                state="danger"
                label="Confirmation"
                note="The event stopped firing between the two"
              />
            </ol>
          </div>
        </div>
      </Case>

      <Case name="section-light-section-card" width="w-[1120px]">
        {/* All four slots at once — lede, body, actions and visual. The body
            and the actions had never been seen together with the visual, and
            this is the package's one light-on-dark section: the `light` on its
            root is the whole reason the tokens inside resolve against cream
            rather than keeping their dark values.

            The window is tone="dark" deliberately. The default light window is
            the same brand cream as the card, so the frame would dissolve into
            it. `tone="dark"` only sets the invariant chrome.* fill, so the
            window also needs `className="dark"` — it is the mirror of the rule
            above. A dark surface nested in a `light` context inherits that
            context, and every mode-aware token inside it (semantic.matcha on
            the WindowChip, the WindowStatus tones) would otherwise resolve to
            its LIGHT value against chrome.surface.1: matcha #677552 on #171717
            is 3.62:1, where the designed dark value is 14.87:1. Unlike the
            other tone="dark" windows, which sit on the flipping page ground and
            are correct in dark mode, the `light` ancestor pins this one wrong
            in BOTH modes. The buttons are left at their normal variants for the same kind
            of reason the card's header gives: peach inverts in here, and the
            baseline should record what a caller who did not think about it
            actually gets. */}
        <LightSectionCard
          title="Four ways to plug Skene in."
          lede="Ask from your coding agent, run it on every pull request, or call it from your own scripts."
          actions={
            <>
              <Button>Start free</Button>
              <Button variant="outline">Read the docs</Button>
            </>
          }
          visual={
            // The real composition, which this case used to omit: the visual
            // column of the live section is a HALFTONE FIELD with the surface
            // tiles floating on it, not a bare window on cream. Without the
            // field the column reads as empty space with a widget in it, and
            // the two components that only ever appear here — SurfaceTiles and
            // SurfaceDetail — had no baseline at all.
            <SectionBackdrop texture="journey" inset={5} className="w-full self-stretch">
              <div className="grid gap-2.5">
                <SurfaceTiles>
                  <SurfaceTile
                    icon={<TerminalGlyph className="size-4" />}
                    accent="violet"
                    name="MCP server"
                    note="Cursor · Claude Code"
                  />
                  <SurfaceTile
                    icon={<GitPullRequest className="size-4" />}
                    name="GitHub App"
                    note="Runs on every PR"
                  />
                  <SurfaceTile
                    icon={<Cloud className="size-4" />}
                    accent="blue"
                    name="Cloud API"
                    note="Any script, any time"
                  />
                  <SurfaceTile
                    selected
                    icon={<ClipboardCheck className="size-4" />}
                    accent="peach"
                    name="Repo audit"
                    note="One-time · no commitment"
                  />
                </SurfaceTiles>
                <SurfaceDetail tag="Repo audit" code="uvx skene analyse-journey .">
                  A one-time scan of your current tracking. See what you have before you adopt
                  anything else.
                </SurfaceDetail>
              </div>
            </SectionBackdrop>
          }
        >
          <CheckList onLight>
            <CheckItem>MCP server, local and read-only</CheckItem>
            <CheckItem>GitHub App with PR reviews</CheckItem>
            <CheckItem>Cloud API for your own scripts</CheckItem>
          </CheckList>
        </LightSectionCard>
      </Case>

      <Case name="section-pipeline-stepper" width="w-[880px]">
        {/* Inside a light ProductWindow, because that is the only surface it
            renders on. Showing it on the case's own ground would be showing it
            somewhere it never appears, and would hide the thing worth watching:
            the theme-aware text roles and `chrome.line.onLight` resolving
            against a cream fill. No dark twin for the same reason — `onLight`
            switches the hairline token, and the one it switches to is white at
            12%, which needs a dark ground this component is never given. */}
        <ProductWindow
          title="skene · journey analysis"
          status={<WindowStatus tone="live">Running</WindowStatus>}
        >
          <PipelineStepper
            onLight
            title="Starting journey analysis…"
            subtitle="This may take a few minutes. Stay on this page to see live pipeline updates."
            steps={[
              { label: 'Analyzing schema', state: 'done' },
              { label: 'Events from codebase', state: 'active' },
              { label: 'Generating plan', state: 'pending' },
            ]}
          />
        </ProductWindow>
      </Case>

      <Case name="section-plan-card" width="w-[1120px]">
        <PlanGrid>
          <PlanCard
            tier="PRO"
            flag="Popular"
            featured
            price="$29"
            unit="/mo"
            summary="1.5M monthly tokens"
            features={
              <CheckList dense onLight>
                <CheckItem dense>Local MCP server</CheckItem>
                <CheckItem dense>GitHub App with PR reviews</CheckItem>
              </CheckList>
            }
            action={<Button className="w-full">Start free →</Button>}
            footnote="No credit card required."
          />
          <PlanCard
            tier="SCALE"
            price="$99"
            unit="/mo"
            summary="6M monthly tokens"
            features={
              <CheckList dense>
                <CheckItem dense>Local MCP server</CheckItem>
                <CheckItem dense>Cloud validation API</CheckItem>
              </CheckList>
            }
            bestFor={{ label: 'Best for', value: 'Teams shipping weekly' }}
            action={
              <Button className="w-full" variant="outline">
                Start free →
              </Button>
            }
          />
        </PlanGrid>
      </Case>

      <Case name="section-product-window" width="w-[880px]">
        <div className="space-y-6">
          <ProductWindow
            title="Activation funnel · Last 28 days"
            status={<WindowStatus>Dashboard: healthy</WindowStatus>}
          >
            {/* Boxed to the captured width instead of spanning the window. Run
                full-bleed — which this case did — the eight bars stretch to
                ~90px each and a 74→45 fall reads as a flat row of slabs, because
                the eye judges a bar's slope against its own width. At the
                captured ~300px the same numbers read as the drop they are.
                The window is the reader's OWN dashboard, so it keeps its
                healthy status while the shape underneath is already failing. */}
            <div className="max-w-[320px]">
              <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
                <Sparkline bars={[88, 96, 90, 84, 52, 44, 38, 33]} highlight={4} />
              </MetricCard>
            </div>
          </ProductWindow>
          <ProductWindow
            tone="dark"
            title="skene · tracking plan"
            status={<WindowStatus tone="live">Live</WindowStatus>}
          >
            <WindowToolbar>
              <div className="flex items-center gap-2.5 font-mono text-[11px]">
                main → release/184
              </div>
              <WindowChip>42 matched</WindowChip>
            </WindowToolbar>
          </ProductWindow>
        </div>
      </Case>

      <Case name="section-question-grid" width="w-[1120px]">
        {/* The captured three-column layout, because the card has no fill and
            the two things worth watching are both edge cases of that: the peach
            corner glow anchored top-right, and the fixed 58px under the tag that
            keeps every tag on one baseline across a row where the questions run
            to different lengths. The second card's question is deliberately the
            long one — a card whose title wraps to two lines is exactly what a
            `mt-auto` body would knock out of line. */}
        <QuestionGrid>
          <QuestionCard tag="Activation" title="Where do new teams stop?">
            Every step is an event in your own tables, so the drop-off is a query rather
            than a guess.
          </QuestionCard>
          <QuestionCard tag="Attribution" title="Which channel brought the accounts that stayed?">
            Signup and retention read from the same schema, so the join is one you can
            check by hand.
          </QuestionCard>
          <QuestionCard tag="Regression" title="What changed on this release?">
            Skene re-reads the changed files against the schema they land in and names the
            events that moved.
          </QuestionCard>
        </QuestionGrid>
      </Case>

      <Case name="section-recommendation-card" width="w-[880px]">
        {/* Inside a light AppWindow, which is where it shipped, and again on the
            case's own dark ground. Both, because every colour in it is mixed
            from currentColor precisely so it needs no `onLight` prop — and a
            single-ground case would prove nothing about that. */}
        <div className="grid gap-4">
          <AppWindow crumb="Journey improvement" actions={<StatPill status="ok">2 opportunities</StatPill>}>
            <AppPanel>
              <RecommendationCard
                eyebrow="Recommended next step"
                title="Help solo workspaces invite a teammate"
                meta={
                  <>
                    <TagChip>Expected insight: activation blocker</TagChip>
                    <TagChip>Evidence: 3 signals</TagChip>
                  </>
                }
              >
                Add an &ldquo;invite skipped&rdquo; reason, then trigger a contextual prompt when
                setup is otherwise complete.
              </RecommendationCard>
            </AppPanel>
          </AppWindow>

          <RecommendationCard
            eyebrow="Recommended next step"
            title="Name the release that moved the funnel"
            meta={<TagChip>Evidence: 1 signal</TagChip>}
          >
            The same card on the dark page ground, with nothing switched by the caller.
          </RecommendationCard>
        </div>
      </Case>

      <Case name="section-score-ring" width="w-[880px]">
        {/* All three statuses, and the artifact header they shipped in. The
            reserved vocabulary is the reason this case shows three: a reader
            deciding which one to pass needs to see that `good` is matcha and not
            "the nice-looking one". */}
        <div className="grid gap-4">
          <AppWindow crumb="Product data audit" actions={<StatPill status="ok">Complete</StatPill>}>
            <AppPanel>
              <div className="flex items-center gap-4">
                <ScoreRing value={72} status="warn" label="Coverage" />
                <div>
                  <p className="text-[15px] font-medium text-text-primary">
                    Coverage needs attention
                  </p>
                  <p className="mt-0.5 text-[13px] text-text-muted">3 critical journey gaps found</p>
                </div>
              </div>
            </AppPanel>
          </AppWindow>

          <div className="flex items-center gap-6">
            <ScoreRing value={94} status="good" label="Coverage" />
            <ScoreRing value={72} status="warn" label="Coverage" />
            <ScoreRing value={31} status="danger" label="Coverage" size={88} />
          </div>
        </div>
      </Case>

      <Case name="section-surface-tiles" width="w-[880px]">
        {/* On the halftone field, because that is the only place these render —
            and the selected tile is the case's real subject: it carries `light`,
            so its type resolves against cream while its three dark siblings keep
            the invariant chrome roles. */}
        <SectionBackdrop texture="schema" inset={5} className="rounded-2xl">
          <div className="grid gap-2.5">
            <SurfaceTiles>
              <SurfaceTile
                icon={<TerminalGlyph className="size-4" />}
                accent="violet"
                name="MCP server"
                note="Cursor · Claude Code"
              />
              <SurfaceTile
                icon={<GitPullRequest className="size-4" />}
                name="GitHub App"
                note="Runs on every PR"
              />
              <SurfaceTile
                icon={<Cloud className="size-4" />}
                accent="blue"
                name="Cloud API"
                note="Any script, any time"
              />
              <SurfaceTile
                selected
                icon={<ClipboardCheck className="size-4" />}
                accent="peach"
                name="Repo audit"
                note="One-time · no commitment"
              />
            </SurfaceTiles>
            <SurfaceDetail tag="Repo audit" code="uvx skene analyse-journey .">
              A one-time scan of your current tracking. See what you have before you adopt anything
              else.
            </SurfaceDetail>
          </div>
        </SectionBackdrop>
      </Case>

      <Case name="section-backdrop" width="w-[880px]">
        {/* All three site textures. The pairing is the point — journey/github/
            schema are not interchangeable tints, they are the fields the live
            site puts behind those three kinds of panel. */}
        <div className="grid grid-cols-3 gap-4">
          {(['journey', 'github', 'schema'] as const).map((texture) => (
            <SectionBackdrop key={texture} texture={texture} className="rounded-xl">
              <div className="rounded-lg bg-chrome-surface-1 p-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-text-muted">
                  {texture}
                </p>
              </div>
            </SectionBackdrop>
          ))}
        </div>
      </Case>

      <Case name="section-stat-chip" width="w-[880px]">
        {/* Both chips on both grounds. Neither takes an `onLight` prop — the
            border and the fill are mixed from `currentColor`, which already
            follows the `light` ancestor through the text role — so the cream
            panel is the case that proves one rule really does cover both. It is
            also where MetaChip's peach status word is at risk: that token is
            mode-aware, and the panel is the only place the baseline sees its
            light value. */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-wrap items-start gap-3">
            <StatChip icon="★">121 stars</StatChip>
            <MetaChip icon="◷" status="Roadmap">
              Turnkey dollar-revenue view
            </MetaChip>
          </div>
          <div className="light flex flex-wrap items-start gap-3 rounded-2xl bg-brand-light p-4">
            <StatChip icon="★">121 stars</StatChip>
            <MetaChip icon="◷" status="Roadmap">
              Turnkey dollar-revenue view
            </MetaChip>
          </div>
        </div>
      </Case>

      <Case name="section-trust-panel" width="w-[1120px]">
        {/* No `light` wrapper here, and that is the case: the panel carries the
            class on its own root, so this baseline is what proves it — every
            mode-aware token inside resolves against cream WITHOUT the caller
            doing anything, on a page that never sets a mode. Two facts rather
            than one, because the separating rule belongs to the item and
            `last:` drops it: a single fact would show a stack that can never be
            wrong. The facts column also only exists when children are passed,
            so this is the two-track template — the one-track collapse is the
            other half of that prop and is not what the live band uses. */}
        <TrustPanel
          title="Your data never leaves your Supabase."
          lede="Skene reads the repository and the database read-only. Nothing is copied out, and nothing is written back."
          links={
            <>
              <a href="#">Privacy policy</a>
              <a href="#">Security</a>
            </>
          }
        >
          <TrustFact icon="◎" title="Read-only by construction">
            The connection Skene asks for cannot write to your tables.
          </TrustFact>
          <TrustFact icon="◍" title="Checked on the pull request">
            The GitHub App reads the changed files and posts a review on the PR.
          </TrustFact>
          <TrustFact icon="◷" title="The MCP server runs locally">
            It is open source, so you can read what it sends before it sends it.
          </TrustFact>
        </TrustPanel>
      </Case>

      <Case name="section-value-cards" width="w-[1120px]">
        {/* Both tones, in argument order, because the section IS the contrast:
            read alone a cost card is a complaint and a gain card is a boast.
            The middle card takes no `tone` on purpose — `cost` is the default,
            and the baseline should record what a caller who did not think about
            it gets. The gain card is the one with two extra paints: a peach
            hairline at 34% and a directional wash entering from the left edge,
            neither of which the cost cards draw. */}
        <ValueCards>
          <ValueCard label="Cost" tone="cost" title="A renamed event ships green.">
            Every test passes. The chart keeps drawing a line, and the line is wrong.
          </ValueCard>
          <ValueCard label="Cost" title="Nobody reads it until someone asks.">
            By the time the number is questioned, the weeks it covers are already gone.
          </ValueCard>
          <ValueCard label="Result" tone="gain" title="The break is named on the pull request.">
            Skene checks each event against the schema it lands in, and says which call site
            drifted.
          </ValueCard>
        </ValueCards>
      </Case>

      <Case name="section-footer" width="w-[1120px]">
        <SiteFooter
          wordmark="Skene"
          copyright="© 2026 Skene. All rights reserved."
          legal="Privacy Policy"
          brand={
            <div>
              <span className="text-[15px] text-chrome-text-primary">Skene</span>
              <p className="mt-5 max-w-[250px] text-[14px] text-chrome-text-muted-warm">
                Product analytics in your own Supabase.
              </p>
              <SocialLinks>
                <SocialLink href="#" label="LinkedIn">
                  in
                </SocialLink>
                <SocialLink href="#" label="GitHub">
                  gh
                </SocialLink>
              </SocialLinks>
            </div>
          }
        >
          {[
            ['Product', ['How it works', 'Features', 'Pricing']],
            ['Resources', ['Documentation', 'Glossary', 'Blog']],
            ['Company', ['About', 'Open source', 'Terms']],
          ].map(([title, links]) => (
            <FooterColumn key={title as string} title={title as string}>
              {(links as string[]).map((l) => (
                <FooterLink key={l} href="#">
                  {l}
                </FooterLink>
              ))}
            </FooterColumn>
          ))}
        </SiteFooter>
      </Case>

      {/* The three-column case above was the only one, which is why the grid
          could hardcode `repeat(3,1fr)` for months without anyone seeing it.
          skene-site ships four columns and its fourth wrapped under the brand.
          This is that shape — the consumer's actual columns, in their order. */}
      <Case name="section-footer-four-columns" width="w-[1120px]">
        <SiteFooter
          wordmark="Skene"
          copyright="© 2026 Skene. All rights reserved."
          legal="Privacy Policy"
          brand={
            <div>
              <span className="text-[15px] text-chrome-text-primary">Skene</span>
              <p className="mt-5 max-w-[250px] text-[14px] text-chrome-text-muted-warm">
                Product analytics in your own Supabase.
              </p>
              <SocialLinks>
                <SocialLink href="#" label="LinkedIn">
                  in
                </SocialLink>
                <SocialLink href="#" label="GitHub">
                  gh
                </SocialLink>
              </SocialLinks>
            </div>
          }
        >
          {[
            ['Product', ['How it works', 'Features', 'Integrations', 'Pricing']],
            ['Developers', ['Documentation', 'Open source', 'MCP server']],
            ['Resources', ['Blog', 'Glossary', 'Playbooks', 'Releases']],
            ['Company', ['About', 'Community', 'Contact']],
          ].map(([title, links]) => (
            <FooterColumn key={title as string} title={title as string}>
              {(links as string[]).map((l) => (
                <FooterLink key={l} href="#">
                  {l}
                </FooterLink>
              ))}
            </FooterColumn>
          ))}
        </SiteFooter>
      </Case>

      {/* ------------------------------------------------ product artifacts */}
      {/* The sixteen below had no case until 2026-08-13, which meant no
          baseline: they are drawn Skene Cloud screens, they never appear on a
          composed route, and `gallery.spec.ts` snapshots only `/`, `/surfaces`
          and `/pages` — none of which import a section. Every one of them is
          also a party to a duplication finding, and a merge that cannot be
          shown to change nothing is not a merge anyone should accept. */}

      <Case name="section-artifact-shell" width="w-[1120px]">
        {/* The shell every artifact is built from, in both polarities at once:
            the light AppWindow/AppPanel/DataTable ladder inside the fixed-dark
            ArtFrame, and the dark ArtPanel beside it. That pairing is the whole
            reason this module exists as one file — see its header — and a case
            that showed only one half would not catch a token crossing the line. */}
        <div className="grid gap-4">
          <ArtFrame kind="db" row>
            <AppWindow
              crumb={
                <>
                  <b>acme-production</b>
                  <span> · </span>
                  <span>events</span>
                </>
              }
              actions={<StatPill status="ok">42 matched</StatPill>}
            >
              <AppPanel>
                <DataTable columns={['Event', 'Rows', 'Last seen']}>
                  <DataRow>
                    <DataCell mono>checkout_started</DataCell>
                    <DataCell>18,402</DataCell>
                    <DataCell muted>2 min ago</DataCell>
                  </DataRow>
                  <DataRow>
                    <DataCell mono>purchase_complete</DataCell>
                    <DataCell>4,118</DataCell>
                    <DataCell muted>3 min ago</DataCell>
                  </DataRow>
                </DataTable>
              </AppPanel>
            </AppWindow>
          </ArtFrame>

          <ArtPanel bar={<ArtTitle>skene · release/184</ArtTitle>}>
            <div className="flex flex-wrap items-center gap-2 p-[16px]">
              <StatPill status="ok">Passing</StatPill>
              <StatPill status="warn">2 drifted</StatPill>
              <StatPill status="bad">1 removed</StatPill>
            </div>
          </ArtPanel>
        </div>
      </Case>

      <Case name="section-discovery-table" width="w-[880px]">
        {/* Four rows because the fourth is the one with no `foundAt` — the
            column that is allowed to be empty is the column that breaks a
            table's alignment when it is. */}
        <DiscoveryTable
          title="Events"
          source="acme/checkout"
          summary="3 of 4 verified"
          summaryStatus="warn"
          columns={{ event: 'Event', type: 'Type', foundAt: 'Found at', status: 'Status' }}
          rows={[
            { event: 'checkout_started', type: 'track', foundAt: 'src/checkout/start.ts:42', status: 'ok', statusLabel: 'Verified' },
            { event: 'purchase_complete', type: 'track', foundAt: 'src/checkout/pay.ts:118', status: 'ok', statusLabel: 'Verified' },
            { event: 'plan_tier', type: 'property', foundAt: 'src/billing/plan.ts:9', status: 'warn', statusLabel: 'Renamed' },
            { event: 'invite_sent', type: 'track', status: 'bad', statusLabel: 'Not found' },
          ]}
        />
      </Case>

      <Case name="section-evaluator-check" width="w-[880px]">
        {/* Every slot filled, because the formula row and the results row are
            two different grids and the case exists to hold both at once. */}
        <EvaluatorCheck
          crumb="Evaluator · activation"
          heading="Trial activation"
          headingNote="Recomputed on every release"
          metric={<CheckFigure label="Current" value="31.4%" />}
          formula={
            <>
              <CheckOperand
                name="purchase_complete"
                tone="ok"
                chips={<CheckChip role>numerator</CheckChip>}
                figures={<CheckFigure label="Rows" value="4,118" />}
              />
              <CheckOperand
                name="trial_started"
                tone="warn"
                chips={<CheckChip>renamed in 184</CheckChip>}
                figures={<CheckFigure label="Rows" value="13,101" />}
              />
            </>
          }
          results={
            <>
              <CheckResult label="Denominator" value="13,101" />
              <CheckResult label="Ratio" value="0.314" />
              <CheckResult label="Confidence" value="Low" />
            </>
          }
          note={
            <>
              The denominator moved because <code>trial_started</code> was renamed, not because
              fewer people started a trial.
            </>
          }
        />
      </Case>

      <Case name="section-evaluator-list" width="w-[880px]">
        {/* frame="jr" on purpose: the frame is a prop here, not a wrapper the
            caller writes, and `false` is a real value — a case at the default
            would never show which. */}
        <EvaluatorList
          crumb="Evaluator"
          summary={{ status: 'warn', label: '1 unconfirmed' }}
          frame="jr"
          columns={{ name: 'Evaluation', check: 'Check', metric: 'Metric', confirmed: 'Confirmed' }}
          evaluations={[
            { name: 'Trial activation', check: { status: 'ok', label: 'Passing' }, metric: '31.4%', confirmed: '2 min ago' },
            { name: 'Invite accepted', check: { status: 'warn', label: 'Partial' }, metric: '61%', confirmed: '2 min ago' },
            { name: 'First value', check: { status: 'bad', label: 'No signal' }, metric: '—' },
          ]}
          note={
            <>
              <code>invite_accepted</code> fires, but its <code>plan_tier</code> property is
              missing on 39% of rows.
            </>
          }
        />
      </Case>

      <Case name="section-evaluator-panel" width="w-[1120px]">
        {/* The two-pane artifact: the same list as above on the left and the
            same requirement rows as EvaluatorVerify on the right. It is here as
            its own case precisely because those two halves are copied — a
            merge has to leave this snapshot untouched. */}
        <EvaluatorPanel
          crumb="Evaluator · activation"
          summary={{ status: 'warn', label: '1 unconfirmed' }}
          list={{
            columns: { name: 'Evaluation', check: 'Check', metric: 'Metric', confirmed: 'Confirmed' },
            evaluations: [
              { name: 'Trial activation', check: { status: 'ok', label: 'Passing' }, metric: '31.4%', confirmed: '2 min ago' },
              { name: 'Invite accepted', check: { status: 'warn', label: 'Partial' }, metric: '61%' },
            ],
          }}
          detail={{
            title: 'Invite accepted',
            subtitle: 'Two events, four required fields',
            requirements: [
              {
                name: 'invite_sent',
                status: 'ok',
                verdict: 'Found',
                tags: ['event', 'numerator'],
                fields: [
                  { name: 'workspace_id', status: 'ok', verdict: 'Present' },
                  { name: 'plan_tier', status: 'warn', verdict: '39% null', note: 'Added in release 184' },
                ],
              },
              { name: 'invite_accepted', status: 'ok', verdict: 'Found', tags: ['event'] },
            ],
          }}
        />
      </Case>

      <Case name="section-evaluator-verify" width="w-[880px]">
        {/* One requirement with nested fields and one without: the indent is
            the artifact's way of saying "this is the one to read", and a case
            with uniform rows would not show it. */}
        <EvaluatorVerify
          crumb="Evaluator · verify"
          summary={{ status: 'warn', label: '1 field short' }}
          title="Invite accepted"
          subtitle="Two events, four required fields"
          requirements={[
            {
              name: 'invite_sent',
              status: 'ok',
              verdict: 'Found',
              tags: ['event', 'numerator'],
              fields: [
                { name: 'workspace_id', status: 'ok', verdict: 'Present' },
                { name: 'plan_tier', status: 'warn', verdict: '39% null', note: 'Added in release 184' },
              ],
            },
            { name: 'invite_accepted', status: 'bad', verdict: 'Missing', tags: ['event'] },
          ]}
          note={<>Re-run after the next deploy to confirm <code>plan_tier</code> backfilled.</>}
        />
      </Case>

      <Case name="section-flow-diagram" width="w-[880px]">
        <FlowDiagram note={<>Counts are rows, measured at <code>2026-08-13T09:00Z</code>.</>}>
          <FlowNode label="checkout_started" detail="18,402 rows" />
          <FlowEdge value="76%" meta="drop 4,301" />
          <FlowNode label="payment_method" detail="14,101 rows" />
          <FlowEdge value="29%" meta="drop 9,983" />
          <FlowNode label="purchase_complete" detail="4,118 rows" />
        </FlowDiagram>
      </Case>

      <Case name="section-funnel" width="w-[880px]">
        {/* All three states in one snapshot. `broken` is a hatch and `unknown`
            is an empty dashed track with no fill element at all — two rules
            that only a case carrying both can protect. */}
        <Funnel title="Activation funnel" badge="Last 28 days" meta="acme-production" status="ok">
          <FunnelRow label="Signed up" value="18,402" state="ok" fill={100} />
          <FunnelRow label="Invited team" value="11,204" state="ok" fill={61} />
          <FunnelRow label="Plan chosen" note="Field renamed in release 184" value="6,140" state="broken" fill={33} />
          <FunnelRow label="First value" note="Not measured" state="unknown" />
        </Funnel>
      </Case>

      <Case name="section-integration-rows" width="w-[880px]">
        {/* Two rows whose note is a TagChip and two whose note is prose — the
            case the header calls out, because that is the pair a two-column
            table cannot hold at one width. */}
        <IntegrationRows
          title="Integrations"
          source="acme"
          summary="3 connected"
          summaryStatus="ok"
          rows={[
            { name: 'Supabase', note: <TagChip>acme-production</TagChip>, status: 'ok', statusLabel: 'Connected' },
            { name: 'GitHub', note: <TagChip>acme/checkout</TagChip>, status: 'ok', statusLabel: 'Connected' },
            { name: 'Branch', note: <TagChip>main</TagChip>, status: 'ok', statusLabel: 'Tracking' },
            { name: 'Coding agent', note: 'No MCP client has connected in the last 30 days.', status: 'warn', statusLabel: 'Not assigned' },
          ]}
        />
      </Case>

      <Case name="section-key-value-table" width="w-[880px]">
        {/* Both densities, because `density` is the whole API surface: the
            reference variant drops the row fill and hover so a settings screen
            does not read as a data grid. */}
        <div className="grid gap-4">
          <KeyValueTable
            columns={[{ header: 'Key', mono: true }, { header: 'Value', muted: true }]}
            rows={[
              { cells: ['SUPABASE_URL', 'https://acme.supabase.co'] },
              { cells: ['SUPABASE_ANON_KEY', <MaskedValue key="k" prefix="eyJhbGci" length={24} />] },
              { cells: ['SKENE_ENV', <TagChip key="t" variant="solid">production</TagChip>] },
            ]}
          />
          <KeyValueTable
            density="reference"
            columns={[{ header: 'Property', strong: true }, { header: 'Type', mono: true }, { header: 'Required', nowrap: true }]}
            rows={[
              { cells: ['workspace_id', 'uuid', 'Yes'] },
              { cells: ['plan_tier', 'text', 'No'] },
            ]}
          />
          <TableNote>Values are read from the workspace, never from the repository.</TableNote>
        </div>
      </Case>

      <Case name="section-lifecycle-canvas" width="w-[1120px]">
        {/* A stage with milestones and a stage without: the nested level is
            optional and the column has to hold its width either way. */}
        <LifecycleCanvas
          title="Lifecycle"
          source="acme-production"
          summary="4 stages"
          summaryStatus="ok"
          stages={[
            {
              key: '01',
              name: 'Acquire',
              description: 'First touch to signup.',
              milestones: [
                { name: 'Signed up', description: 'Account row created.', bindings: ['user_signed_up'] },
              ],
            },
            {
              key: '02',
              name: 'Activate',
              description: 'Signup to first value.',
              milestones: [
                { name: 'Invited team', bindings: ['invite_sent', 'invite_accepted'] },
                { name: 'First value', description: 'Not measured yet.' },
              ],
            },
            { key: '03', name: 'Expand', description: 'Seats and usage growth.' },
          ]}
        />
      </Case>

      <Case name="section-mcp-block" width="w-[880px]">
        {/* Two panels in one AppWindow, which is the composition the header
            documents and the reason the sibling gap lives in the block rather
            than in the window. */}
        <AppWindow
          crumb={<b>skene · mcp</b>}
          actions={<StatPill status="ok">Live</StatPill>}
        >
          <McpBlock title="mcp.json" meta="Cursor · Claude Code">
            <McpCode>{`{
  "mcpServers": {
    "skene": { "command": "uvx", "args": ["skene", "mcp"] }
  }
}`}</McpCode>
          </McpBlock>
          <McpBlock title="Tools" meta="4 exposed">
            <McpTool name="skene_check" description="Check a diff against the tracking plan." />
            <McpTool name="skene_gap" description="List the signals a journey is missing." />
          </McpBlock>
        </AppWindow>
      </Case>

      <Case name="section-overview-tiles" width="w-[880px]">
        <OverviewTiles>
          <OverviewTile label="Coverage" value="72 / 100" note="3 critical gaps" />
          <OverviewTile label="Evaluations" value="2 / 1 / 0 / 0" note="ok / warn / bad / muted" />
          <OverviewTile label="Integrations" value="3" note="Supabase, GitHub, branch" />
          <OverviewTile label="Lifecycle" value="4" note="stages mapped" />
        </OverviewTiles>
      </Case>

      <Case name="section-pr-review" width="w-[880px]">
        {/* status="fail" with issues at all three severities, because the
            severity colours are a third copy of the good/warn/danger map and
            this snapshot is what proves a merge of them changes nothing. */}
        <PrReview
          status="fail"
          statusLabel="Changes requested"
          repo="acme/checkout"
          author="skene-bot"
          badge="bot"
          action="#184"
          title="Two signals moved in this pull request"
          summary="Fix these before the release changes your activation data."
          issuesLabel="Findings"
          issues={[
            { severity: 'high', text: 'trial_activated stopped firing — conditional path removed in onboarding.ts' },
            { severity: 'medium', text: 'plan renamed to plan_tier — the dashboard field no longer matches' },
            { severity: 'low', text: '28 signals unchanged' },
          ]}
          fixLabel="Suggested fix"
          fix="Re-add the call inside the new branch, or update the plan to the new name."
          file="src/onboarding.ts"
          fileNote="line 42"
        />
      </Case>

      <Case name="section-side-by-side-diff" width="w-[1120px]">
        <SideBySideDiff>
          <DiffColumn
            side="before"
            label="What the agent wrote"
            lines={[
              { kind: 'ctx', text: 'export function onPlanChange(plan: Plan) {' },
              { kind: 'del', text: "  track('plan', { plan })" },
              { kind: 'ctx', text: '}' },
            ]}
          />
          <DiffColumn
            side="after"
            label="What the check expected"
            lines={[
              { kind: 'ctx', text: 'export function onPlanChange(plan: Plan) {' },
              { kind: 'add', text: "  track('plan_tier', { plan_tier: plan })" },
              { kind: 'ctx', text: '}' },
            ]}
          />
        </SideBySideDiff>
      </Case>

      <Case name="section-terminal-block" width="w-[880px]">
        {/* The one client component in the artifact set, and deliberately not
            in the barrel — a "use client" directive on a re-exported module
            poisons the barrel for server rendering, which package-contract
            asserts against. Imported from its own subpath here for that reason. */}
        {/* The command is the OSS CLI's real invocation — s-spelled, uvx-run.
            No audit-named subcommand exists (the noun belongs to the free
            audit tier), and the marketing repo's check-claims.sh fails the
            string; same correction as src/sections/card-animation-integrations.
            The note matches what the command actually does: reads the codebase
            read-only, writes one local artifact. */}
        <TerminalBlock
          title="Scan"
          note="Reads the repo read-only. Writes skene-context/journey.yaml."
          lines={[
            { command: 'uvx skene analyse-journey .', prompt: '$', copyable: true },
            { command: '✓ 42 events matched the journey plan', prompt: ' ', copyable: false },
            { command: '✗ trial_activated missing from 2 product paths', prompt: ' ', copyable: false },
          ]}
        />
      </Case>

      {/* ------------------------------------------------- the eyebrow slots */}
      {/* Appended rather than folded into the existing trust-panel and
          final-cta cases, deliberately. Those two prove the prop is INERT when
          omitted — their baselines must not move — and a case cannot prove that
          and exercise the slot at the same time. Placed last so nothing below
          them reflows. */}

      <Case name="section-trust-panel-eyebrow" width="w-[1120px]">
        {/* The override Bridge documents: Eyebrow's own colours are invariant
            chrome.*, which are near-invisible on this band's cream. */}
        <TrustPanel
          eyebrow={
            <Eyebrow className="border-chrome-line-on-light text-text-muted">
              Built for trust on both sides
            </Eyebrow>
          }
          title="GTM gets clarity. Engineering keeps control."
          lede="Skene works alongside the systems your teams already use. Findings stay specific and reviewable, and the technical surface stays transparent."
          links={
            <>
              <a href="#">Security →</a>
              <a href="#">Architecture →</a>
            </>
          }
        >
          <TrustFact icon="⌂" title="Your systems remain the source of truth">
            Local and CI surfaces run where your engineering team already works; cloud validation is
            opt-in.
          </TrustFact>
          <TrustFact icon="✓" title="Every finding is reviewable">
            Skene names the signal, the location and the failure instead of handing over another
            mystery score.
          </TrustFact>
        </TrustPanel>
      </Case>

      <Case name="section-final-cta-eyebrow" width="w-[1120px]">
        {/* No override here: this band is always dark, so Eyebrow is correct as
            it ships — which is the difference the two slots document. */}
        <FinalCta
          eyebrow={<Eyebrow>Your next decision deserves better evidence</Eyebrow>}
          lede="Run a free analysis of the product data your GTM team relies on."
          actions={
            <>
              <Button>Run the free audit</Button>
              <Button variant="outline">See pricing</Button>
            </>
          }
        >
          Stop debating whether behavior changed—or the tracking did.
        </FinalCta>
      </Case>

      {/*
        Appended, never inserted. A case dropped into the middle of this list
        reflows every case below it and moves dozens of unrelated baselines —
        64 of them on 2026-08-13, of which 2 were the actual change.
      */}

      <Case name="ui-card-surface" width="w-[880px]">
        {/* The `default` variant keeps its own case above; this one proves the
            addition is additive. Both cards are the same component. */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card variant="surface">
            <div className="text-sm font-medium text-foreground">Tracking plan</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Three events changed on this branch, and two of them are already live.
            </p>
          </Card>
          {/* asChild: the same card as a real anchor. `no-underline` and `block`
              are in the variant, so the call site adds neither. */}
          <Card asChild variant="surface">
            <a href="#">
              <div className="text-sm font-medium text-foreground">How verification works</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Skene re-reads the changed files on every pull request.
              </p>
            </a>
          </Card>
        </div>
      </Case>

      <Case name="section-glyph-badge" width="w-[880px]">
        <div className="space-y-4">
          {/* `tint` is cream-only: its hairline is chrome.line.onLight, the
              invariant dark rule made for a cream fill. On the page ground it
              would be all but invisible, so the demo gives it the ground it is
              for — and `light` is what makes the wash resolve there. */}
          <div className="light flex items-center gap-4 rounded-xl bg-brand-light p-6">
            <GlyphBadge>✓</GlyphBadge>
            <GlyphBadge size={32}>✓</GlyphBadge>
            <GlyphBadge size={32} className="font-mono text-[13px]">
              HEL
            </GlyphBadge>
          </div>
          {/* `muted` follows the page, which is why it is the events-row tone. */}
          <div className="flex items-center gap-4">
            <GlyphBadge tone="muted">✓</GlyphBadge>
            <GlyphBadge tone="muted" size={32} className="font-mono text-[13px]">
              HEL
            </GlyphBadge>
            <GlyphBadge tone="muted" size={32} className="font-mono text-[13px]">
              DUB
            </GlyphBadge>
          </div>
        </div>
      </Case>

      <Case name="section-traffic-lights" width="w-[880px]">
        <div className="space-y-4">
          {/* The terminal bar, at the 8px default — the spacing TerminalBlock
              was already giving three loose spans. */}
          <div className="flex min-h-[32px] items-center gap-[8px] rounded-xl border border-terminal-border bg-terminal-bar px-[12px] py-[8px] font-mono text-[13px] text-terminal-text">
            <TrafficLights />
            <span className="ml-[12px]">bash</span>
          </div>
          {/* GitHub's header, a step roomier. `gap-[12px]` is the one override
              the component documents, and cn resolves it against the default. */}
          <div className="flex items-center gap-[12px] rounded-xl border border-terminal-chrome-github-border bg-terminal-chrome-github-dark-surface px-[16px] py-[12px] font-mono text-[13px] text-terminal-chrome-github-text">
            <TrafficLights className="gap-[12px]" />
            <span>skene/checkout-service</span>
          </div>
        </div>
      </Case>

      <Case name="light-section-card-steps" width="w-[1120px]">
        {/* The composition skene-site renders at home-s05, overrides included —
            which is the point of the case. `NumberedStep` is built from the
            invariant chrome.text.* roles, so inside this card its heading and
            body are #faf1e9 on #faf1e9: absent, not dim, and nothing in a build
            catches it. The two utilities below are what a caller currently has
            to write, so the baseline records the real cost rather than a version
            that works only because the case avoided the trap.

            Appended, not folded into `section-light-section-card`: that case
            proves the card renders without steps, and a case cannot prove that
            and carry them at once. */}
        <LightSectionCard
          title={
            <>
              Start with the truth. <Accent>Keep improving from there.</Accent>
            </>
          }
          lede="Skene meets teams where they are: a free snapshot first, then continuous protection when the product data becomes business-critical."
        >
          <div className="grid gap-[24px]">
            <NumberedStep
              onLight
              n="01"
              title="Connect and audit"
            >
              Run a one-time analysis of the product&apos;s current collection layer. Skene maps
              what exists, what is broken, and what is missing.
            </NumberedStep>
            <NumberedStep
              onLight
              n="02"
              title="Align on the journey"
            >
              GTM names the funnels, lifecycle moments and customer decisions that need to be
              trusted. Skene turns them into a collection plan.
            </NumberedStep>
            <NumberedStep
              onLight
              n="03"
              title="Protect and improve"
            >
              Skene checks releases for drift, proposes precise fixes, and keeps surfacing the
              next data and automation opportunities.
            </NumberedStep>
          </div>
        </LightSectionCard>
      </Case>

      <Case name="section-bridge-untitled" width="w-[1120px]">
        {/* Ask q: the band with no title, no eyebrow and no lede — a `Bridge`
            used as an ARTIFACT rather than as a section. `title` was required
            and rendered an unconditional `<h2>`, so a band placed inside a
            `FeatureRow` had to print the row's own heading a second time and
            gave that `<section>` two `<h2>`s.

            Appended rather than folded into `section-bridge`: that case exists
            for the doubly nested inversion, which needs the eyebrow, the
            heading and the caption to have anything to invert. This one exists
            for their ABSENCE, and a case cannot prove both.

            What the baseline is holding is the spacing, not the missing text.
            The head block is a zero-height div when it is empty and the card
            row's 56px top margin is measured from it, so the failure this
            catches is a band that opens with an empty slot where a heading did
            not render. */}
        <Bridge caption="Every answer traces back to an event in your own database.">
          <BridgeNode
            label="GTM"
            title={<>&ldquo;Why did activation drop last week?&rdquo;</>}
            items={['Asks in plain language', 'Needs the number to hold']}
          />
          <BridgeNode
            featured
            label="Skene"
            title="Checks every event against the schema it lands in."
            items={['Reads the repo and the database', 'Comments on the pull request']}
          />
          <BridgeNode
            label="Engineering"
            title={<>&ldquo;It passed every test. What broke?&rdquo;</>}
            items={['Renames a field mid-sprint', 'Ships green']}
          />
        </Bridge>
      </Case>

      <Case name="section-finding-tag" width="w-[880px]">
        {/* Ask r: the tag alone, at the 9px it actually renders, on both
            grounds and in all three states.

            `section-finding-card` already renders these, and it did NOT drift
            when the tag was repainted — measured, not assumed. The suite scores
            a pixel as different only above a YIQ delta of 56, and the tint move
            from 18% to 12% is about 45, so those thousand-odd pixels are not
            counted at all; what remains is a scatter of antialiased 9px glyph
            edges, under the ratio budget. Which is the honest reason the
            computed test in `__tests__` is the guard here and this case is not.

            What the case is for: the state is now visible to a person and to
            the a11y panel at the size it actually ships, on both grounds, in
            all three states, with nothing else in the frame to read past.

            The light column carries `light` rather than only a cream fill.
            `onLight` switches the CARD, not the token mode, and the pair that
            was measured at 3.88 / 3.94 / 4.00 is the LIGHT value of each status
            token on a tint of itself — which is what a consumer gets inside a
            `ProductWindow`, and what this column reproduces in either sweep. */}
        <div className="grid grid-cols-2 gap-6">
          <div className="light grid gap-2 rounded-md bg-brand-light p-4">
            <Finding status="good" tag="VERIFIED" title="repo_connected" />
            <Finding status="warn" tag="CHANGED" title="checkout_started" />
            <Finding status="danger" tag="MISSING" title="signup_started" />
          </div>
          <div className="dark grid gap-2 rounded-md bg-chrome-surface-1 p-4">
            <Finding onLight={false} status="good" tag="VERIFIED" title="repo_connected" />
            <Finding onLight={false} status="warn" tag="CHANGED" title="checkout_started" />
            <Finding onLight={false} status="danger" tag="MISSING" title="signup_started" />
          </div>
        </div>
      </Case>

      <Case name="section-logo-row" width="w-[1120px]">
        {/* The proof strip, and the case that should have existed before it
            shipped at 80% of its documented size.

            `LogoRow` had NO case here, so none of the committed baselines
            covered it, so `min-h-14` measuring 44.8px against a comment that
            said 56 passed every gate this package has. It was found by
            measuring the rendered strip in a consumer, which is the one place
            a package's own suite should never be the second-best instrument.
            The file header now writes every spacing value as literal px; this
            case is what holds them.

            What the baseline is holding is GEOMETRY, not text: the 56px slot
            floor, the 14px inter-slot gap, the 24px under the heading and the
            stat, and the 14px above the caption. All four were a fifth short.
            A slot is an outlined blank of fixed minimum height, so a
            regression in any of them moves this frame and nothing else.

            Both grounds in one case, because this band declares none of its
            own. Every colour is a mode-aware role, so the strip follows a
            `light` ancestor onto cream without an `onLight` prop — which is
            exactly how the consumer ships it, inside a cream inset on
            /pricing. The left column takes whatever <html> is set to and the
            right column forces the cream, so the light sweep proves the inset
            and the dark sweep proves the strip survives being dropped onto a
            light ancestor from a dark page.

            NO logo in a slot, deliberately, and not because a demo is hard to
            write. The empty slot is the component's argument: named proof
            appears the day an account agrees to be named, and the file header
            forbids a fabricated mark in a story, a demo or sample data. A case
            that filled one to look better would be the first place that rule
            broke. The filled path is covered by the `decorative` prop's
            contract, not by an invented customer.

            The heading and stat strings are the ones the module's own prop
            docs use as their example, so nothing here is a figure this case
            made up. */}
        <div className="grid grid-cols-2 gap-6">
          <LogoRow
            caption="These slots stay empty until an account agrees to be named on-site."
            count={3}
            stat={
              <>
                <strong>10 paying teams</strong>, <strong>$2,000 MRR</strong>.
              </>
            }
            title="Who is running this"
          />
          <div className="light rounded-md bg-brand-light p-6">
            <LogoRow
              caption="These slots stay empty until an account agrees to be named on-site."
              count={3}
              stat={
                <>
                  <strong>10 paying teams</strong>, <strong>$2,000 MRR</strong>.
                </>
              }
              title="Who is running this"
            />
          </div>
        </div>
      </Case>

      <Case name="section-code" width="w-[880px]">
        {/* The inline identifier chip, and the only case on this page whose
            subject is that a component renders IDENTICALLY in two places.

            What the baseline holds is not the chip's shape — 4px of side
            padding, 1px top and bottom, a hairline and `rounded-sm` at body
            size — so much as the fact that each column below matches the one
            beside it. `Code` is `polarity: applies-both`: the default variant
            writes `dark` on the `<code>` itself and the `onLight` variant
            writes `light`, so each resolves ITS OWN tokens wherever a caller
            drops it. Every row is therefore rendered twice, once under a dark
            ancestor and once under a cream one, and the two readings have to be
            the same pixels. Delete either mode class from the module and this
            frame moves in exactly one column, which names the defect.

            That is worth a baseline because the failure it guards is
            measured, not hypothetical. The module header records four contrast
            readings, of which two are a variant rendered in the mode it is
            never meant to be in: `brand.peach` on `surface.2` under `light` is
            4.30:1, below the body floor, and `text.primary` on `brand.light`
            under `dark` is 1.00:1 — not dim, the same colour. "Never meant to"
            is a hope about where a caller puts it, and pinning is what makes it
            a guarantee.

            `PROSE_CODE` is the second mechanism and gets a row of its own: a
            descendant selector for prose the author cannot reach mark by mark.
            It has NO `onLight` spelling, which is why its row appears in the
            cream column too — the baseline holds the peach-on-near-black chip
            sitting inside a cream card, which is the shape a caller gets and
            has to decide about.

            `sections/code` is the fifth most-used module in the package and it
            sits on 7 of the 19 composing routes in `machine/compositions.yaml`.
            Until now it had no case, so none of the 201 baselines covered the
            most-repeated mark in the estate. */}
        <div className="grid grid-cols-2 gap-6">
          <div className="dark space-y-3 rounded-md bg-surface-deep-2 p-6 text-text-muted">
            <p>
              The check fails when <Code>upgrade_started</Code> stops firing from{' '}
              <Code>app/upgrade/route.ts</Code>.
            </p>
            <p>
              On cream: <Code onLight>public.subscriptions</Code> and{' '}
              <Code onLight>--dry-run</Code>.
            </p>
            <p className={PROSE_CODE}>
              Prose the caller did not author mark by mark, where{' '}
              <code>PROSE_CODE</code> reaches every <code>code</code> it contains.
            </p>
          </div>
          <div className="light space-y-3 rounded-md bg-brand-light p-6 text-text-muted">
            <p>
              The check fails when <Code>upgrade_started</Code> stops firing from{' '}
              <Code>app/upgrade/route.ts</Code>.
            </p>
            <p>
              On cream: <Code onLight>public.subscriptions</Code> and{' '}
              <Code onLight>--dry-run</Code>.
            </p>
            <p className={PROSE_CODE}>
              Prose the caller did not author mark by mark, where{' '}
              <code>PROSE_CODE</code> reaches every <code>code</code> it contains.
            </p>
          </div>
        </div>
      </Case>

      <Case name="pattern-pill-nav-frosted" width="w-[880px]">
        {/* Two exported constants and no component, which is why this module
            spent longest with no case: `scripts/build-inventory.mjs` filtered
            the layer directories on `.tsx` and dropped the only `.ts` module in
            the package outright, so /decisions listed 88 modules against
            context.yaml's 89 and nothing said which one was missing.

            The wash is the half that can regress silently, so the wash is what
            this frame holds: `chrome.surface-0` mixed to 60% over a HALFTONE,
            `blur(8px) saturate(180%)` behind it, and a hairline of
            `chrome.text-primary` at 14%. All four numbers are composited
            against artwork with hard black-and-white transitions, deliberately
            — over a flat fill a blur radius is invisible and a saturate
            multiplier does nothing, so a case on a plain ground would report
            green through a change to either.

            Both boxes carry the same style; what differs is the position
            constant. The top one is `PILL_NAV_POSITION.absolute` over hero
            media, the bottom is `.sticky` inside a scroll container. A static
            frame CANNOT prove sticky behaviour — at scroll offset 0 a sticky
            box and a static one are the same pixels — so what is held there is
            only that the class string still resolves to a bar at the top of its
            container, inset on both sides. The scroll behaviour itself is
            unheld and no baseline in this suite can hold it.

            Every colour here is a `chrome.*` role, which is invariant by
            construction, so the dark and light captures of this case are
            expected to be identical files. That is the assertion, not an
            accident: nav chrome that changed with the page mode would be the
            defect.

            THIS CASE MOVED 18 OTHER BASELINES, once, and the reason is worth
            knowing before anyone reads that commit as a regression. One
            composited `backdrop-filter` layer makes Chromium drop LCD subpixel
            text antialiasing for the whole page, so nine unrelated cases —
            `light-section-card-steps`, `section-bridge-untitled`,
            `section-final-cta-eyebrow`, `section-finding-tag`,
            `section-glyph-badge`, `section-logo-row`, `section-terminal-block`,
            `section-trust-panel-eyebrow`, `ui-card-surface` — re-rasterised
            their glyphs in greyscale. Proven rather than assumed: deleting only
            `backdropFilter` from the style below and rebaselining returned all
            nine to bytes IDENTICAL to the previous commit. No geometry moved,
            no colour changed, no capture changed size. It cannot be avoided
            without dropping the blur, and the blur is half of what this module
            is. Greyscale is also the steadier rasterisation of the two, so the
            one-off cost buys slightly less flake everywhere. */}
        <div className="space-y-6">
          <div className="relative h-[200px] overflow-hidden rounded-xl">
            <img
              src={assetUrls.subpageDither}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              className={`${PILL_NAV_POSITION.absolute} flex items-center justify-between px-6 py-4`}
              style={PILL_NAV_FROSTED_STYLE}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chrome-text-primary">
                absolute
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chrome-text-muted">
                inset-x-0 top-0 z-[1050]
              </span>
            </div>
          </div>

          <div className="relative h-[160px] overflow-y-auto rounded-xl">
            <img
              src={assetUrls.subpageDither}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-[320px] w-full object-cover"
            />
            <div
              className={`${PILL_NAV_POSITION.sticky} flex items-center justify-between px-6 py-4`}
              style={PILL_NAV_FROSTED_STYLE}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chrome-text-primary">
                sticky
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-chrome-text-muted">
                inset-x-0 top-0 z-[1050]
              </span>
            </div>
            <div className="relative h-[320px]" />
          </div>
        </div>
      </Case>

      <Case name="section-surface-cards" width="w-[880px]">
        {/* The ways-in grid: four peer cards on a textured field, one drawn
            cream. Second on the exposure list behind `sections/code` — it is on
            the consumer's home and integrations routes and had no baseline.

            What this frame holds is the grid's two structural arguments, both
            of which are numbers the module's header defends and neither of
            which any other gate can see:

            TWO TRACKS, never four and never `auto-fit`. The header records the
            measurement: four tracks in a ~640px band give each card 139px, 32
            of which is the card's own padding, and every two-word title wrapped
            to two lines. This case is 880px wide precisely so the `sm:` grid is
            live and a regression to `auto-fit` shows up as four columns rather
            than as a subtle reflow.

            THE MODE CLASSES ON THE CARDS. The featured cell carries `light` and
            the other three carry `dark`, and both are load-bearing in the way
            that has actually shipped: without `light` on the cream cell,
            `text.primary` keeps its dark reading and renders #faf1e9 on a
            #faf1e9 fill, which is not dim text, it is no text. Two captures per
            case is what makes that visible — with the classes intact both
            sweeps produce identical cards, and dropping either class moves
            exactly one of the two.

            The four `code` chips are taken verbatim from
            `INTEGRATION_ANIMATION_DETAILS` in
            `sections/card-animation-integrations`, whose source carries the
            comments recording what each string was corrected FROM and why: no
            `audit` subcommand exists, the GitHub surface is an App and not an
            Actions workflow, and the s-spelling of `analyse-journey` is the one
            the consuming repo's `check-claims.sh` accepts. The module header
            asks for a string the caller can point at a source for, and this is
            the source. */}
        <SurfaceCards
          texture={assetUrls.journeyField}
          surfaces={[
            {
              id: 'mcp',
              icon: '⌥',
              title: 'MCP server',
              context: 'Cursor · Claude Code',
              detail: 'Runs before the agent commits, inside the agent loop rather than after the PR lands.',
              code: 'skene mcp --cursor',
            },
            {
              id: 'gh',
              icon: '↵',
              title: 'GitHub App',
              context: 'Runs on every PR',
              detail: 'Install it on the repositories you pick and every pull request gets a review.',
              code: '/skene fix',
            },
            {
              id: 'api',
              icon: '↑',
              title: 'Cloud API',
              context: 'Any script, any time',
              detail: 'Hit the API directly from a script, a pipeline, or an internal tool.',
              code: 'POST /v1/compare',
            },
            {
              id: 'audit',
              icon: '✓',
              title: 'Repo audit',
              context: 'One-time · no commitment',
              detail: 'A one-time scan of what you have before you adopt anything else.',
              code: 'uvx skene analyse-journey .',
            },
          ]}
        />
      </Case>

      <Case name="section-team-card" width="w-[1120px]">
        {/* Three STATES of one person entry, not three people.

            That is the case's whole design. The module header argues that the
            media frame "only exists when the media does, so a stack keeps one
            shape whether every person has a photo or none do", and a grid of
            three different people cannot show that: the eye reads the
            difference as three people rather than as three states of the same
            card. So the same name and role runs in every cell and the frame
            holds the alignment claim directly — with no media the type starts
            at the panel's top padding; with media the name sits below a square
            frame; the bio and link block adds 14px above itself and nothing
            else moves. It also means nothing here fabricates a colleague. The
            one name is the one the module's own header uses as its worked
            example.

            The two media-less cards are as tall as the one with a portrait,
            and that is the grid's answer rather than a defect in the card:
            `TeamGrid` is a plain `grid`, whose default `align-items: stretch`
            runs every row to the height of its tallest cell. Worth knowing
            before reading this frame, because "one shape" is a claim about the
            panel, not about how much type fills it.

            Held: the `<li>` panel at `--radius-lg` with 24px of padding, the
            square media frame at `--radius-md` (aspect-square, not a fixed
            height, so it tracks the grid's column width), the 17px name, the
            11px mono uppercase role at 0.07em, and the underline-offset-4 on an
            anchor passed through `children` — which the module styles so a bare
            `<a>` needs no call-site classes, and which therefore has no other
            proof that it applies.

            `TeamGrid` is `sm:grid-cols-2 lg:grid-cols-3` against the VIEWPORT,
            which is 1280 in this suite, so three across is what a reader of
            this baseline is looking at. Both grounds in one capture is
            unnecessary here and deliberately skipped: `polarity: inherits` with
            `border`/`bg-card` and `text.*` roles throughout means the two mode
            sweeps already give a cream reading and an ink one of the same
            markup. */}
        <TeamGrid>
          <TeamCard name="Teemu Kinos" role="Founder" />
          <TeamCard name="Teemu Kinos" role="Founder">
            Builds the thing and answers the mail.{' '}
            <a href="#section-team-card">Say hello</a>.
          </TeamCard>
          <TeamCard
            media={<img src={assetUrls.agentOne} alt="" />}
            name="Teemu Kinos"
            role="Founder"
          />
        </TeamGrid>
      </Case>

      <Case name="section-integrations-highlight" width="w-[1120px]">
        {/* The pre-composed homepage band: `LightSectionCard` around a copy
            column, with `CardAnimationIntegrations` in the visual slot. 42
            lines of composition and no required props, which is exactly why it
            had no case — there is nothing to configure, so there was never a
            moment where somebody had to look at it.

            WRITING THIS CASE BROKE THE MODULE OPEN TWICE, which is the whole
            argument for the exercise and is why both findings are recorded
            here rather than only in the changeset.

            First: the animation rendered at 0x0. `LightSectionCard`'s visual
            column is `place-items-center`, so this module's wrapper was
            shrink-to-fit, and `CardAnimationIntegrations` is `aspect-square
            w-full` over two absolutely-positioned children and therefore has no
            intrinsic width. Measured 51x51 for the wrapper (its own padding,
            twice) and 0x0 for the animation, in a 469px column. The band shipped
            as a cream card with an empty right half. FIXED in the same commit,
            with `w-full` on the wrapper, because a baseline of a blank panel is
            the exact failure this suite exists to prevent — see the module
            source for the reasoning.

            Second, and NOT fixed: three of the four cards render their title in
            invariant `chrome.text-primary`, rgb(250,241,233), against
            `bg-surface-1`, which is mode-aware and resolves to rgb(244,244,245)
            under this band's `light`. That is roughly 1.03:1 — the same trap
            `sections/code`'s header documents, one level up. The one consumer
            that renders this animation calls `CardAnimationIntegrations`
            directly and repairs it at the call site with two `!` overrides
            mapping the chrome roles onto mode-aware ones; the package's own
            pre-composed band ships the unrepaired pairing. This baseline
            therefore holds a KNOWN-WRONG contrast reading, deliberately and on
            the record: it is a regression floor, not an endorsement, and the
            fix belongs in `card-animation-integrations` where it can be
            reviewed as its own change.

            What the frame holds is the COMPOSITION, and the composition is the
            only thing this module is: the cream card's split at `md`, the
            1350px cap and the 16/24px gutters, the copy column's title, lede,
            body and actions stack, and the animation sitting in a square visual
            panel with 24px of padding below `md` and 32 above. Its own copy is
            baked in — the four-ways-in title and lede are literals in the
            source, not props — so a wording change upstream lands here as a
            reflow and nowhere else.

            NOT held: the animation's motion. GSAP is pinned at 2.5s by
            `FrozenGsap` at the top of this page, which is inside the timeline's
            stable window (all four cards in at 0.81s, the detail panel fully in
            at 1.56s, the first swap out at 3.76s), so this baseline shows the
            first detail — MCP server — active and the other three cards at
            rest. The other three details, and every transition between them,
            are held by nothing. `section-card-animation-integrations` says the
            same thing about the same timeline; this case is here for the band
            around it. */}
        <IntegrationsHighlight
          actions={
            <>
              <Button variant="outline">Install the MCP server</Button>
              <Button variant="outline">Book the audit</Button>
            </>
          }
        />
      </Case>
    </main>
  )
}
