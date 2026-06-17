"use client"

// The documentation page — and a deliberate proof: it is built ENTIRELY from the
// library it documents. Every heading, card, tab, badge, and the searchable
// component catalog below are the REAL @swift-struck/ui components, imported and
// composed exactly the way one of your own apps would consume them (drawing from
// the package — never re-implementing a component inline). If this page looks
// good, the library works. Served as a static route at /documentation.

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Boxes, Sparkles } from "lucide-react"

import {
  defaultCollectionConfig,
  defaultContainerConfig,
  defaultTextDisplayConfig,
  type CollectionConfig,
  type ContainerConfig,
} from "@swift-struck/ui/lib/config"
import { cn } from "@swift-struck/ui/lib/utils"
import { CardGrid } from "@swift-struck/ui/registry/collections/card-grid/card-grid"
import { CollectionFrame } from "@swift-struck/ui/registry/collections/collection-frame/collection-frame"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@swift-struck/ui/registry/primitives/accordion/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@swift-struck/ui/registry/primitives/alert/alert"
import { Badge } from "@swift-struck/ui/registry/primitives/badge/badge"
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@swift-struck/ui/registry/primitives/card/card"
import { Clamp } from "@swift-struck/ui/registry/primitives/clamp/clamp"
import { Container } from "@swift-struck/ui/registry/primitives/container/container"
import { ModeToggle } from "@swift-struck/ui/registry/primitives/mode-toggle/mode-toggle"
import { Separator } from "@swift-struck/ui/registry/primitives/separator/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@swift-struck/ui/registry/primitives/tabs/tabs"
import { Title } from "@swift-struck/ui/registry/primitives/title/title"
import {
  Headline,
  Hint,
  Text as Body,
} from "@swift-struck/ui/registry/primitives/typography/typography"

/* ----------------------------- doc content ------------------------------- */

const BIG_IDEAS = [
  {
    q: "Tokens → primitives → collections",
    a: "Three layers, one direction. Colors and sizes (tokens) feed the atoms (primitives like Button), which feed the data views (collections like a Table). A robot referee (npm run guardrails) fails the build if anything reaches the wrong way — so it can never sprawl.",
  },
  {
    q: "Config-driven, with no hidden settings",
    a: "Every configurable component takes one typed `config` object, and every field on it is required. You can't render it without spelling out (or spreading) every setting — so no knob is ever invisible, and your settings are saveable per app.",
  },
  {
    q: "Tokens are the only source of truth",
    a: "No component ever hardcodes a color or size — only theme tokens. Re-skinning the whole library (or adding dark mode, or a native skin later) is a single-file edit.",
  },
  {
    q: "One web build, wrapped natively",
    a: "It's web-first. The same build is later wrapped for desktop (Tauri) and mobile (Capacitor) — no rewrite, ever.",
  },
]

type CatalogItem = {
  id: string
  name: string
  category: string
  blurb: string
}

// The full catalog — what each building block is, in plain English.
const CATALOG: CatalogItem[] = [
  // Inputs & pickers
  {
    name: "Input",
    category: "Inputs",
    blurb: "A text field — text, email, phone, or number.",
  },
  { name: "Textarea", category: "Inputs", blurb: "A multi-line text box." },
  {
    name: "Choice",
    category: "Inputs",
    blurb: "Pick one or many — as a searchable dropdown, chips, or pills.",
  },
  { name: "Checkbox", category: "Inputs", blurb: "A single on/off tick box." },
  { name: "Switch", category: "Inputs", blurb: "A toggle switch (on/off)." },
  {
    name: "Radio Group",
    category: "Inputs",
    blurb: "Pick exactly one from a small set.",
  },
  {
    name: "Slider",
    category: "Inputs",
    blurb: "Drag to choose a number in a range.",
  },
  {
    name: "Date Picker",
    category: "Inputs",
    blurb: "Pick a date from a calendar.",
  },
  {
    name: "File Upload",
    category: "Inputs",
    blurb: "Choose images or files to upload.",
  },
  {
    name: "Rating",
    category: "Inputs",
    blurb: "A row of stars to give or show a score.",
  },
  {
    name: "Signature",
    category: "Inputs",
    blurb: "Draw a signature with a finger, mouse, or stylus.",
  },
  {
    name: "Notes",
    category: "Inputs",
    blurb: "A lightweight rich-text editor (bold, lists, highlight…).",
  },
  {
    name: "Field",
    category: "Inputs",
    blurb:
      "The wrapper that frames any input: label, required ring, help text, and validation.",
  },
  {
    name: "Form",
    category: "Inputs",
    blurb: "A config-driven form with built-in validation.",
  },
  // Display
  {
    name: "Typography",
    category: "Display",
    blurb: "Consistent Headline / Body / Hint text.",
  },
  {
    name: "Title",
    category: "Display",
    blurb: "A hero header — simple, image, profile, or cover.",
  },
  {
    name: "Detail View (Fields)",
    category: "Display",
    blurb: "Show one record as labelled fields.",
  },
  {
    name: "Stat Grid (Big Numbers)",
    category: "Display",
    blurb: "Big metric cards with deltas and trends.",
  },
  {
    name: "Chart",
    category: "Display",
    blurb: "Bar, line, area, pie, radar, or radial — multi-series.",
  },
  { name: "Progress", category: "Display", blurb: "A progress bar." },
  {
    name: "Image",
    category: "Display",
    blurb: "A framed image — shape, fit, aspect, tap-to-open.",
  },
  {
    name: "Video",
    category: "Display",
    blurb: "A player — autoplay, mute, loop, no-download, full-bleed.",
  },
  {
    name: "Map",
    category: "Display",
    blurb: "A map of your records, located by an address field.",
  },
  {
    name: "Web Embed",
    category: "Display",
    blurb: "Embed any page in a responsive frame.",
  },
  { name: "Badge", category: "Display", blurb: "A small status pill." },
  {
    name: "Avatar",
    category: "Display",
    blurb: "A user image with initials fallback.",
  },
  {
    name: "Alert",
    category: "Display",
    blurb: "An inline callout for important messages.",
  },
  {
    name: "Skeleton",
    category: "Display",
    blurb: "Shimmering placeholders while content loads.",
  },
  {
    name: "Clamp",
    category: "Display",
    blurb: "Truncate (by lines or characters) or expand any text.",
  },
  { name: "Spinner", category: "Display", blurb: "A small loading indicator." },
  // Collections
  {
    name: "List",
    category: "Collections",
    blurb: "A polished, data-bound list — with optional single-select rows.",
  },
  {
    name: "Card Grid",
    category: "Collections",
    blurb: "A responsive grid of cards from data.",
  },
  {
    name: "Data Table",
    category: "Collections",
    blurb: "Sortable, searchable table with row actions.",
  },
  {
    name: "Kanban",
    category: "Collections",
    blurb: "A board — drag cards between columns.",
  },
  {
    name: "Calendar",
    category: "Collections",
    blurb: "A month grid of events.",
  },
  {
    name: "Checklist",
    category: "Collections",
    blurb: "Tick items off, with progress.",
  },
  {
    name: "Comments",
    category: "Collections",
    blurb: "A threaded comments view.",
  },
  { name: "Chat", category: "Collections", blurb: "A message thread." },
  {
    name: "Permission Matrix",
    category: "Collections",
    blurb:
      "Edit a role's permissions — a grid of modules × Read, Create, Edit, Delete toggles.",
  },
  {
    name: "Collection Frame",
    category: "Collections",
    blurb:
      "The shared chrome every collection wears: title, live count, search, filter, sort, pagination, limit.",
  },
  // Actions
  {
    name: "Button",
    category: "Actions",
    blurb: "The button — six styles, three sizes.",
  },
  { name: "Link", category: "Actions", blurb: "A button rendered as a link." },
  {
    name: "Action Row",
    category: "Actions",
    blurb: "A tappable row: icon, title, subtitle, chevron.",
  },
  // Layout
  {
    name: "Container",
    category: "Layout",
    blurb:
      "The layout wrapper: background (none/card/dark/light/image) and horizontal vs vertical stacking.",
  },
  { name: "Card", category: "Layout", blurb: "A frosted-glass surface." },
  { name: "Separator", category: "Layout", blurb: "A thin divider line." },
  { name: "Spacer", category: "Layout", blurb: "A fixed vertical gap." },
  { name: "Tabs", category: "Layout", blurb: "Tabbed panels." },
  { name: "Accordion", category: "Layout", blurb: "Expandable sections." },
  {
    name: "Aspect Ratio",
    category: "Layout",
    blurb: "Lock content to a ratio (e.g. 16:9).",
  },
  {
    name: "Scroll Area",
    category: "Layout",
    blurb: "A styled scrollable region.",
  },
  {
    name: "Collapsible",
    category: "Layout",
    blurb: "Show/hide content on demand.",
  },
  // Navigation
  { name: "Breadcrumb", category: "Navigation", blurb: "Where-am-I trail." },
  {
    name: "Pagination",
    category: "Navigation",
    blurb: "Page-number controls.",
  },
  {
    name: "Toggle / Toggle Group",
    category: "Navigation",
    blurb: "On/off buttons; pick one or many.",
  },
  {
    name: "Command (⌘K)",
    category: "Navigation",
    blurb: "A command palette / quick search.",
  },
  // Overlays
  { name: "Dialog", category: "Overlays", blurb: "A modal dialog." },
  { name: "Sheet", category: "Overlays", blurb: "A slide-in side panel." },
  { name: "Popover", category: "Overlays", blurb: "A small floating panel." },
  { name: "Dropdown Menu", category: "Overlays", blurb: "A menu of actions." },
  {
    name: "Hover Card",
    category: "Overlays",
    blurb: "A card that appears on hover.",
  },
  {
    name: "Alert Dialog",
    category: "Overlays",
    blurb: "A confirm-before-you-act modal.",
  },
  { name: "Tooltip", category: "Overlays", blurb: "A hint on hover." },
  { name: "Toast", category: "Overlays", blurb: "A transient notification." },
  // Tokens
  {
    name: "Theme Provider",
    category: "Theming",
    blurb: "Light/dark theming for the whole app.",
  },
  { name: "Mode Toggle", category: "Theming", blurb: "The light/dark switch." },
  {
    name: "Ambient Background",
    category: "Theming",
    blurb: "An interactive gradient backdrop.",
  },
].map((c, i) => ({ id: String(i + 1), ...c }))

const CATEGORY_VARIANTS: Record<
  string,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  Inputs: "default",
  Display: "secondary",
  Collections: "success",
  Actions: "warning",
  Layout: "outline",
  Navigation: "secondary",
  Overlays: "default",
  Theming: "outline",
}

const code = (s: string) => s.trim()

/* ------------------------------- the page -------------------------------- */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="animate-rise flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </span>
        <Headline className="text-xl">{title}</Headline>
      </div>
      {children}
    </section>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border bg-muted/60 p-4 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

export default function Documentation() {
  const catalogContainer: ContainerConfig = {
    ...defaultContainerConfig,
    background: "none",
    padding: "none",
  }
  const [catalogCfg, setCatalogCfg] = React.useState<CollectionConfig>({
    ...defaultCollectionConfig,
    title: "All components",
    itemsPerPage: 12,
    searchable: true,
    showCount: true,
    emptyText: "No components match your search.",
  })

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-10">
      {/* ------------------------------ header ------------------------------ */}
      <header className="animate-rise flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            <Sparkles className="size-3.5" /> Documentation
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">
            Swift Struck UI
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            A web-first, cross-platform component &amp; collection library you
            build entire apps on top of. This whole page is built from the
            library itself.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/components">
              <Boxes /> Gallery
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </header>

      {/* ------------------------- what it is (plain) ----------------------- */}
      <Section eyebrow="For everyone" title="What is this?">
        <Container
          config={{
            ...defaultContainerConfig,
            background: "card",
            padding: "lg",
          }}
        >
          <Body className="max-w-prose">
            Swift Struck UI is a box of ready-made building blocks for apps —
            like LEGO for software. There are <b>primitives</b> (the small
            pieces: buttons, inputs, dialogs) and <b>collections</b> (data
            views: lists, tables, boards, calendars, charts). You snap them
            together to build a real app, on the web today and on desktop &amp;
            mobile later — without rebuilding anything.
          </Body>
          <Hint>
            Everything you see — the headings, cards, tabs, badges, and the
            searchable catalog below — is the library showing itself off.
          </Hint>
        </Container>
      </Section>

      {/* --------------------------- the big ideas -------------------------- */}
      <Section eyebrow="The big ideas" title="Four rules keep it lean">
        <Accordion type="single" collapsible className="w-full">
          {BIG_IDEAS.map((idea, i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger>{idea.q}</AccordionTrigger>
              <AccordionContent>{idea.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* ----------------------------- get started -------------------------- */}
      <Section eyebrow="For developers" title="Get started">
        <Tabs defaultValue="install" className="w-full">
          <TabsList>
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="use">Use a component</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          <TabsContent value="install" className="flex flex-col gap-3 pt-2">
            <Body>
              Install straight from GitHub (no npm account needed) along with
              its peer dependencies:
            </Body>
            <Code>
              {code(
                `npm install github:alaap-swift-struck/swift-struck-ui react react-dom`
              )}
            </Code>
            <Body>
              The package ships TypeScript source, so your bundler tree-shakes
              it and Tailwind can see the class names. To pull later updates,
              re-run that same install — it re-fetches the latest from GitHub.
            </Body>
          </TabsContent>
          <TabsContent value="use" className="flex flex-col gap-3 pt-2">
            <Body>Import the component you want and render it:</Body>
            <Code>
              {code(`import { Button } from "@swift-struck/ui/registry/primitives/button/button"

export default function Page() {
  return <Button>Get started</Button>
}`)}
            </Code>
            <Body>
              Data views take one typed <code>config</code> — every field
              required, so nothing is hidden:
            </Body>
            <Code>
              {code(`import { CollectionFrame } from "@swift-struck/ui/registry/collections/collection-frame/collection-frame"
import { List } from "@swift-struck/ui/registry/collections/list/list"
import { defaultCollectionConfig } from "@swift-struck/ui/lib/config"

<CollectionFrame
  config={{ ...defaultCollectionConfig, title: "Team", itemsPerPage: 10 }}
  data={people}
  searchKeys={["name", "role"]}
  renderItems={(rows) => <List items={rows.map(toListItem)} />}
/>`)}
            </Code>
          </TabsContent>
          <TabsContent value="theme" className="flex flex-col gap-3 pt-2">
            <Body>
              Tell Tailwind v4 to scan the package, and bring the theme tokens:
            </Body>
            <Code>
              {code(`@import "tailwindcss";
@source "../node_modules/@swift-struck/ui/registry";

/* + the @theme / :root token block (teal brand, amber accent, radii…) */`)}
            </Code>
            <Body>
              Re-skinning everything — including dark mode — is a single edit to
              that token block.
            </Body>
          </TabsContent>
        </Tabs>
      </Section>

      {/* -------------------------- component catalog ----------------------- */}
      <Section eyebrow="The catalog" title="Every component, searchable">
        <Alert>
          <Boxes />
          <AlertTitle>This list is a live collection.</AlertTitle>
          <AlertDescription>
            The search, count, and pagination below are the real{" "}
            <code>CollectionFrame</code> — the same one your app would use.
          </AlertDescription>
        </Alert>
        <Container config={catalogContainer}>
          <CollectionFrame
            config={catalogCfg}
            data={CATALOG}
            searchKeys={["name", "category", "blurb"]}
            renderItems={(rows) => (
              <CardGrid
                columns={3}
                items={rows.map((c) => ({
                  id: c.id,
                  title: (
                    <span className="flex items-center justify-between gap-2">
                      {c.name}
                      <Badge variant={CATEGORY_VARIANTS[c.category]}>
                        {c.category}
                      </Badge>
                    </span>
                  ),
                  description: (
                    <Clamp config={{ ...defaultTextDisplayConfig, lines: 2 }}>
                      {c.blurb}
                    </Clamp>
                  ),
                }))}
              />
            )}
          />
        </Container>
        {/* a tiny ⚙-free hook so the page itself can tune the catalog */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          Per page:
          {[6, 12, 24].map((n) => (
            <Button
              key={n}
              variant={catalogCfg.itemsPerPage === n ? "default" : "outline"}
              size="sm"
              onClick={() => setCatalogCfg((c) => ({ ...c, itemsPerPage: n }))}
            >
              {n}
            </Button>
          ))}
          <Button asChild variant="link" size="sm" className="ml-auto">
            <Link href="/components">
              See them live in the gallery <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      {/* -------------------------- the config model ------------------------ */}
      <Section eyebrow="Under the hood" title="The configuration model">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "BaseConfig",
              d: "On every component: visible + visibility rules (show/hide by data conditions).",
            },
            {
              t: "FieldConfig",
              d: "Inputs: label, help text, required, and validation (min/max, length, pattern).",
            },
            {
              t: "CollectionConfig",
              d: "Data views: title, filter, sort, search, pagination, total limit.",
            },
            {
              t: "ActionConfig",
              d: "Actions: what a tap does (default: open the detail screen) + show-disabled.",
            },
          ].map((x) => (
            <Card key={x.t}>
              <CardHeader>
                <CardTitle className="font-mono text-sm">{x.t}</CardTitle>
                <CardDescription>{x.d}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Body className="max-w-prose">
          That's the shape every component shares. For the exhaustive,
          field-by-field reference — every component, every option, and what
          each value does — see{" "}
          <a
            href="https://github.com/alaap-swift-struck/swift-struck-ui/blob/main/CONFIG-REFERENCE.md"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            CONFIG-REFERENCE.md
          </a>{" "}
          on GitHub.
        </Body>
      </Section>

      {/* ------------------------- how it's organised ----------------------- */}
      <Section eyebrow="How it's organised" title="Two parts, one repo">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="success">repo root</Badge> the library
              </CardTitle>
              <CardDescription>
                <code>registry/</code> + <code>lib/</code> at the repo root{" "}
                <b>are</b> <code>@swift-struck/ui</code> — exactly what a GitHub
                install delivers. Layered tokens → primitives → collections, one
                folder per component.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">www/</Badge> the showcase
              </CardTitle>
              <CardDescription>
                This site — dashboard, gallery, and these docs. A real app that
                consumes the library, deployed to Cloudflare Pages.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Body className="max-w-prose">
          A fix in the library reaches every app that depends on it — instantly
          in this repo, and on the next GitHub install for anyone consuming it.
          Pinning to a commit or tag is the safety hatch.
        </Body>
      </Section>

      {/* -------------------------- quality & guardrails -------------------- */}
      <Section eyebrow="Confidence" title="Quality & guardrails">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Enforced layering",
              d: "A build-time referee fails the build if a layer reaches the wrong way — the architecture can't rot.",
            },
            {
              t: "Typed & required",
              d: "Strict TypeScript; every config field is required, so no setting is ever hidden.",
            },
            {
              t: "Unit tested",
              d: "Validation, the rule engine, and the collection pipeline are covered and run in CI.",
            },
            {
              t: "Token-pure",
              d: "No hardcoded colors or sizes — only theme tokens, so re-skinning is one edit.",
            },
            {
              t: "Lean by mandate",
              d: "Variants over new files; ~3% duplication; reuse before adding.",
            },
            {
              t: "Accessible base",
              d: "Built on Radix primitives for keyboard and screen-reader support.",
            },
          ].map((x) => (
            <Card key={x.t}>
              <CardHeader>
                <CardTitle className="text-sm">{x.t}</CardTitle>
                <CardDescription>{x.d}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      {/* ----------------------------- live & staging ----------------------- */}
      <Section eyebrow="Shipping" title="Live & staging">
        <Alert>
          <Boxes />
          <AlertTitle>Same code — only the URL differs.</AlertTitle>
          <AlertDescription>
            Staging and production are the <b>exact same build</b> deployed to
            two addresses; every line of code is identical. You test on staging,
            then promote that same build to live.
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="warning">Staging</Badge> test here first
              </CardTitle>
              <CardDescription>
                <code>staging.swift-struck-ui.pages.dev</code> — where a change
                lands before it's public. Click around and confirm it's right.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Badge variant="success">Live</Badge> the public site
              </CardTitle>
              <CardDescription>
                <code>swift-struck-ui.pages.dev</code> — promoted from the
                verified staging build. What everyone sees.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Body className="max-w-prose">
          Apps pull library updates the same controlled way: re-run the GitHub
          install to fetch the latest, or pin to a specific commit or tag so a
          change only reaches you when you choose — a breaking change never
          surprise-breaks a running app.
        </Body>
      </Section>

      {/* ------------------------------ cross-platform ---------------------- */}
      <Section eyebrow="Reach" title="One build, every device">
        <Container
          config={{
            ...defaultContainerConfig,
            background: "card",
            padding: "lg",
          }}
        >
          <Title
            variant="simple"
            title="Web today · desktop & mobile next"
            subtitle="The same web build is wrapped natively with Tauri (desktop) and Capacitor (mobile). No rewrite."
          />
        </Container>
      </Section>

      <Separator />
      <footer className="flex flex-wrap items-center justify-between gap-3 pb-6 text-sm text-muted-foreground">
        <span>Swift Struck UI — built with itself.</span>
        <span className="flex items-center gap-3">
          <Link href="/" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/components" className="hover:text-foreground">
            Gallery
          </Link>
          <span className="opacity-60">open source (soon)</span>
        </span>
      </footer>
    </main>
  )
}
