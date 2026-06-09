"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsUpDown,
  CreditCard,
  Info,
  LogOut,
  Search,
  Settings,
  Settings2,
  User,
} from "lucide-react"

import { ConfigEditor, JsonField } from "./_playground/config-editor"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@swift-struck/ui/registry/primitives/alert-dialog/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@swift-struck/ui/registry/primitives/avatar/avatar"
import { Badge } from "@swift-struck/ui/registry/primitives/badge/badge"
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@swift-struck/ui/registry/primitives/card/card"
import { Checkbox } from "@swift-struck/ui/registry/primitives/checkbox/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@swift-struck/ui/registry/primitives/command/command"
import {
  Choice,
  type ChoiceConfig,
  defaultChoiceConfig,
} from "@swift-struck/ui/registry/primitives/choice/choice"
import {
  DataTable,
  defaultDataTableConfig,
  type DataTableConfig,
} from "@swift-struck/ui/registry/collections/data-table/data-table"
import {
  Kanban,
  defaultKanbanConfig,
  type KanbanConfig,
} from "@swift-struck/ui/registry/collections/kanban/kanban"
import {
  CalendarView,
  defaultCalendarViewConfig,
  type CalendarViewConfig,
} from "@swift-struck/ui/registry/collections/calendar-view/calendar-view"
import {
  DetailView,
  defaultDetailViewConfig,
  type DetailViewConfig,
} from "@swift-struck/ui/registry/collections/detail-view/detail-view"
import {
  StatGrid,
  defaultStatGridConfig,
  type StatGridConfig,
  type StatItem,
} from "@swift-struck/ui/registry/collections/stat-grid/stat-grid"
import {
  Checklist,
  defaultChecklistConfig,
  type ChecklistConfig,
  type ChecklistItem,
} from "@swift-struck/ui/registry/collections/checklist/checklist"
import {
  Chart,
  defaultChartConfig,
  type ChartConfig,
} from "@swift-struck/ui/registry/collections/chart/chart"
import { List } from "@swift-struck/ui/registry/collections/list/list"
import { CardGrid } from "@swift-struck/ui/registry/collections/card-grid/card-grid"
import { CollectionFrame } from "@swift-struck/ui/registry/collections/collection-frame/collection-frame"
import { ActionRow } from "@swift-struck/ui/registry/primitives/action-row/action-row"
import { Rating } from "@swift-struck/ui/registry/primitives/rating/rating"
import { Spacer } from "@swift-struck/ui/registry/primitives/spacer/spacer"
import { Spinner } from "@swift-struck/ui/registry/primitives/spinner/spinner"
import {
  Headline,
  Hint,
  Text as Body,
} from "@swift-struck/ui/registry/primitives/typography/typography"
import { WebEmbed } from "@swift-struck/ui/registry/primitives/web-embed/web-embed"
import { Image } from "@swift-struck/ui/registry/primitives/image/image"
import { Video } from "@swift-struck/ui/registry/primitives/video/video"
import { Map } from "@swift-struck/ui/registry/primitives/map/map"
import { Stopwatch } from "@swift-struck/ui/registry/primitives/stopwatch/stopwatch"
import { Signature } from "@swift-struck/ui/registry/primitives/signature/signature"
import { FileUpload } from "@swift-struck/ui/registry/primitives/file-upload/file-upload"
import { DatePicker } from "@swift-struck/ui/registry/primitives/date-picker/date-picker"
import { Notes } from "@swift-struck/ui/registry/primitives/notes/notes"
import {
  Field,
  fieldProps,
} from "@swift-struck/ui/registry/primitives/field/field"
import {
  defaultActionConfig,
  defaultCollectionConfig,
  defaultContainerConfig,
  defaultFieldConfig,
  defaultImageConfig,
  defaultMapConfig,
  defaultTextDisplayConfig,
  defaultVideoConfig,
  validateField,
  type CollectionConfig,
  type ContainerConfig,
  type FieldConfig,
  type ImageConfig,
  type MapConfig,
  type TextDisplayConfig,
  type VideoConfig,
} from "@swift-struck/ui/lib/config"
import { cn } from "@swift-struck/ui/lib/utils"
import { Clamp } from "@swift-struck/ui/registry/primitives/clamp/clamp"
import { Container } from "@swift-struck/ui/registry/primitives/container/container"
import { Title } from "@swift-struck/ui/registry/primitives/title/title"
import {
  Form,
  defaultFormConfig,
  type FormConfig,
} from "@swift-struck/ui/registry/collections/form/form"
import {
  Comments,
  type CommentItem,
} from "@swift-struck/ui/registry/collections/comments/comments"
import {
  Chat,
  type ChatMessage,
} from "@swift-struck/ui/registry/collections/chat/chat"
import { AspectRatio } from "@swift-struck/ui/registry/primitives/aspect-ratio/aspect-ratio"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@swift-struck/ui/registry/primitives/breadcrumb/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@swift-struck/ui/registry/primitives/collapsible/collapsible"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@swift-struck/ui/registry/primitives/dialog/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@swift-struck/ui/registry/primitives/pagination/pagination"
import { ScrollArea } from "@swift-struck/ui/registry/primitives/scroll-area/scroll-area"
import { toast } from "@swift-struck/ui/registry/primitives/sonner/sonner"
import { Toggle } from "@swift-struck/ui/registry/primitives/toggle/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@swift-struck/ui/registry/primitives/toggle-group/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@swift-struck/ui/registry/primitives/dropdown-menu/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@swift-struck/ui/registry/primitives/hover-card/hover-card"
import { Input } from "@swift-struck/ui/registry/primitives/input/input"
import { Label } from "@swift-struck/ui/registry/primitives/label/label"
import { ModeToggle } from "@swift-struck/ui/registry/primitives/mode-toggle/mode-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@swift-struck/ui/registry/primitives/popover/popover"
import { Progress } from "@swift-struck/ui/registry/primitives/progress/progress"
import {
  RadioGroup,
  RadioGroupItem,
} from "@swift-struck/ui/registry/primitives/radio-group/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@swift-struck/ui/registry/primitives/select/select"
import { Separator } from "@swift-struck/ui/registry/primitives/separator/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@swift-struck/ui/registry/primitives/sheet/sheet"
import { Skeleton } from "@swift-struck/ui/registry/primitives/skeleton/skeleton"
import { Slider } from "@swift-struck/ui/registry/primitives/slider/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@swift-struck/ui/registry/primitives/table/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@swift-struck/ui/registry/primitives/tabs/tabs"
import { Textarea } from "@swift-struck/ui/registry/primitives/textarea/textarea"
import { Switch } from "@swift-struck/ui/registry/primitives/switch/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@swift-struck/ui/registry/primitives/tooltip/tooltip"

// The current search text, shared so each Demo can hide itself when filtered.
const SearchCtx = React.createContext("")

// Per-demo Container config (background + stacking), keyed by demo name. Every
// demo wraps its children in a <Container>, so its ⚙ can switch the background
// (none/card/dark/light/image) and lay components horizontally vs vertically.
const ContainersCtx = React.createContext<{
  get: (key: string) => Record<string, unknown>
  set: (key: string, next: Record<string, unknown>) => void
}>({
  get: () =>
    ({ ...defaultContainerConfig }) as unknown as Record<string, unknown>,
  set: () => {},
})

const containerEnums = {
  background: ["none", "card", "dark", "light", "image"],
  direction: ["vertical", "horizontal"],
  padding: ["none", "sm", "md", "lg"],
  gap: ["none", "sm", "md", "lg"],
}

function Demo({
  name,
  children,
  config,
  setConfig,
  enums,
  data,
  setData,
  span = 1,
}: {
  name: string
  children: React.ReactNode
  // When provided, a "Config" section is added to the ⚙ to live-edit it.
  config?: Record<string, unknown>
  setConfig?: (next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
  // Optional: also expose the component's data (its content) as editable JSON.
  data?: unknown
  setData?: (next: unknown) => void
  // How many grid columns this card spans (1–3). Big demos use 2–3.
  span?: 1 | 2 | 3
}) {
  const query = React.useContext(SearchCtx)
  const containers = React.useContext(ContainersCtx)
  if (query && !name.toLowerCase().includes(query.toLowerCase())) return null

  const container = containers.get(name)
  const hasConfig = Boolean(config && setConfig)
  const hasData = Boolean(data !== undefined && setData)
  const spanClass =
    span === 3
      ? "sm:col-span-2 lg:col-span-3"
      : span === 2
        ? "sm:col-span-2"
        : ""

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", spanClass)}>
      {/* the component's name sits OUTSIDE/above its container */}
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-medium">{name}</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={`Edit ${name}`}
            >
              <Settings2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="max-h-[55vh] overflow-y-auto p-3">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Container · background &amp; layout
                  </p>
                  <ConfigEditor
                    config={container}
                    onChange={(n) => containers.set(name, n)}
                    enums={containerEnums}
                  />
                </div>
                {hasConfig && (
                  <div className="flex flex-col gap-3 border-t pt-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Config · live
                    </p>
                    <ConfigEditor
                      config={config!}
                      onChange={setConfig!}
                      enums={enums}
                    />
                  </div>
                )}
                {hasData && (
                  <div className="flex flex-col gap-2 border-t pt-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Data · live
                    </p>
                    <JsonField value={data} onCommit={(v) => setData!(v)} />
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Container
        config={container as unknown as ContainerConfig}
        className="min-h-20"
      >
        {children}
      </Container>
    </div>
  )
}

// A section header + a responsive grid of demo cards.
function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="animate-rise flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}

// VariantGroup — renders one demo card PER preset, each with its own ⚙ gear,
// all reading/writing a shared keyed config store. This is how we show "the top
// few configurations of a component, side by side, each editable" without
// hand-writing a state hook per card.
function VariantGroup({
  items,
  configs,
  onChange,
  enums,
  render,
}: {
  items: { id: string; name: string; span?: 1 | 2 | 3 }[]
  configs: Record<string, Record<string, unknown>>
  onChange: (id: string, next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
  render: (cfg: Record<string, unknown>, id: string) => React.ReactNode
}) {
  return (
    <>
      {items.map(({ id, name, span }) => (
        <Demo
          key={id}
          name={name}
          span={span}
          config={configs[id]}
          setConfig={(next) => onChange(id, next)}
          enums={enums}
        >
          {render(configs[id], id)}
        </Demo>
      ))}
    </>
  )
}

/* ------------------------------- demo data -------------------------------- */

const invoices = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
]

const tagOptions = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "eng" },
  { label: "Marketing", value: "mkt" },
  { label: "Product", value: "prod" },
  { label: "Sales", value: "sales" },
]

const people = [
  { name: "Ada Lovelace", role: "Engineering", status: "Active", commits: 128 },
  { name: "Grace Hopper", role: "Design", status: "Away", commits: 96 },
  { name: "Alan Turing", role: "Research", status: "Offline", commits: 212 },
  {
    name: "Katherine Johnson",
    role: "Product",
    status: "Active",
    commits: 154,
  },
]

// A bigger dataset (deterministic — no Math.random/Date) so pagination, the
// live count, and search have something real to act on.
const FIRST = [
  "Ada",
  "Grace",
  "Alan",
  "Katherine",
  "Linus",
  "Margaret",
  "Edsger",
  "Barbara",
  "Tim",
  "Radia",
  "Donald",
  "Hedy",
]
const LAST = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Johnson",
  "Torvalds",
  "Hamilton",
  "Dijkstra",
  "Liskov",
  "Berners-Lee",
  "Perlman",
  "Knuth",
  "Lamarr",
]
const ROLES = [
  "Engineering",
  "Design",
  "Research",
  "Product",
  "Marketing",
  "Sales",
]
const STATUSES = ["Active", "Away", "Offline"]
const peopleLarge = Array.from({ length: 36 }, (_, i) => ({
  id: String(i + 1),
  name: `${FIRST[i % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
  role: ROLES[i % ROLES.length],
  status: STATUSES[i % STATUSES.length],
  commits: 40 + ((i * 37) % 260),
}))

// Map a status string to a Badge variant — reused across collection demos.
const statusVariant = (
  s: string
): React.ComponentProps<typeof Badge>["variant"] =>
  s === "Active" ? "success" : s === "Away" ? "warning" : "outline"

const tableConfig: DataTableConfig = {
  ...defaultDataTableConfig,
  columns: [
    {
      key: "name",
      header: "Name",
      type: "text",
      sortable: true,
      align: "left",
    },
    {
      key: "role",
      header: "Role",
      type: "text",
      sortable: true,
      align: "left",
    },
    {
      key: "status",
      header: "Status",
      type: "badge",
      sortable: false,
      align: "left",
    },
    {
      key: "commits",
      header: "Commits",
      type: "number",
      sortable: true,
      align: "right",
    },
  ],
  rowActions: true,
}

const initialTasks = [
  {
    id: "1",
    title: "Design login screen",
    assignee: "Ada",
    priority: "High",
    status: "todo",
  },
  {
    id: "2",
    title: "Set up CI pipeline",
    assignee: "Grace",
    priority: "Medium",
    status: "inprogress",
  },
  {
    id: "3",
    title: "Write component docs",
    assignee: "Alan",
    priority: "Low",
    status: "todo",
  },
  {
    id: "4",
    title: "Ship v1 release",
    assignee: "Katherine",
    priority: "High",
    status: "done",
  },
  {
    id: "5",
    title: "Polish pagination",
    assignee: "Ada",
    priority: "Medium",
    status: "inprogress",
  },
]

const kanbanConfig: KanbanConfig = {
  ...defaultKanbanConfig,
  groupBy: "status",
  columns: [
    { value: "todo", label: "To do" },
    { value: "inprogress", label: "In progress" },
    { value: "done", label: "Done" },
  ],
  titleField: "title",
  subtitleField: "assignee",
  badgeField: "priority",
  showCount: true,
}

// Fixed dates keep the calendar demo deterministic (no SSR/hydration drift).
const events = [
  { id: "1", date: "2024-06-04", title: "Standup", team: "Eng" },
  { id: "2", date: "2024-06-04", title: "Design review", team: "Design" },
  { id: "3", date: "2024-06-11", title: "Sprint planning", team: "Product" },
  { id: "4", date: "2024-06-11", title: "1:1 with Ada", team: "Eng" },
  { id: "5", date: "2024-06-18", title: "Launch", team: "Product" },
  { id: "6", date: "2024-06-25", title: "Retro", team: "Eng" },
]
const calInitialMonth = new Date(2024, 5, 1)
const calendarViewConfig: CalendarViewConfig = {
  ...defaultCalendarViewConfig,
  dateField: "date",
  titleField: "title",
  accentField: "team",
  weekStartsOn: "sunday",
  maxPerDay: 2,
}

const profile = {
  name: "Ada Lovelace",
  role: "Staff Engineer",
  status: "Active",
  location: "London",
  joined: "2021-03-14",
  commits: 1284,
}
const detailViewConfig: DetailViewConfig = {
  ...defaultDetailViewConfig,
  columns: 2,
  fields: [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "status", label: "Status", type: "badge" },
    { key: "location", label: "Location", type: "text" },
    { key: "joined", label: "Joined", type: "date" },
    { key: "commits", label: "Commits", type: "number" },
  ],
}

const stats: StatItem[] = [
  {
    id: "1",
    label: "Revenue",
    value: "$48,250",
    delta: "+12.4% MoM",
    trend: "up",
  },
  {
    id: "2",
    label: "Active Users",
    value: "1,284",
    delta: "+4.1% WoW",
    trend: "up",
  },
  { id: "3", label: "Churn", value: "2.1%", delta: "-0.3pt", trend: "down" },
]
const statGridConfig: StatGridConfig = {
  ...defaultStatGridConfig,
  columns: 3,
  showDelta: true,
}

const chartData = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 4800, expenses: 2600 },
  { month: "Mar", revenue: 5200, expenses: 3100 },
  { month: "Apr", revenue: 4600, expenses: 2800 },
  { month: "May", revenue: 5900, expenses: 3200 },
  { month: "Jun", revenue: 6400, expenses: 3500 },
]
const chartViewConfig: ChartConfig = {
  ...defaultChartConfig,
  type: "bar",
  xKey: "month",
  series: [
    { key: "revenue", label: "Revenue", color: "chart-1" },
    { key: "expenses", label: "Expenses", color: "chart-2" },
  ],
  height: 300,
}

const initialChecklist: ChecklistItem[] = [
  { id: "1", label: "Scaffold the repo", done: true },
  { id: "2", label: "Build the primitives", done: true },
  { id: "3", label: "Build the collections", done: false },
  { id: "4", label: "Backfill component docs", done: false },
]

const formConfig: FormConfig = {
  ...defaultFormConfig,
  columns: 2,
  submitLabel: "Create account",
  fields: [
    {
      name: "name",
      label: "Full name",
      type: "text",
      placeholder: "Ada Lovelace",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      placeholder: "Engineer",
      required: false,
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      placeholder: "A few words…",
      required: false,
    },
    {
      name: "notify",
      label: "Email notifications",
      type: "switch",
      placeholder: "",
      required: false,
    },
  ],
}

const initialComments: CommentItem[] = [
  {
    id: "1",
    author: "Ada Lovelace",
    body: "Love the new chart component!",
    time: "2h ago",
  },
  {
    id: "2",
    author: "Grace Hopper",
    body: "The live config gear is genius.",
    time: "1h ago",
  },
]

const initialMessages: ChatMessage[] = [
  { id: "1", from: "them", text: "Did the dashboard ship?", time: "09:41" },
  { id: "2", from: "me", text: "Yep — charts are live 🎉", time: "09:42" },
  { id: "3", from: "them", text: "Beautiful.", time: "09:42" },
]

// A required, validated Field demo config.
const usernameCfg: FieldConfig = {
  ...defaultFieldConfig,
  label: "Username",
  required: true,
  helpText: "3–16 characters. Letters, numbers, and underscores.",
  validation: {
    min: null,
    max: null,
    minLength: 3,
    maxLength: 16,
    pattern: "^[A-Za-z0-9_]+$",
  },
}

/* ----------------------- enum + initial knob configs ----------------------- */

const choiceEnums = {
  mode: ["single", "multi"],
  display: ["dropdown", "chips", "pills"],
}
const dataTableEnums = { density: ["comfortable", "compact"] }
const calendarEnums = { weekStartsOn: ["sunday", "monday"] }
const chartEnums = { type: ["bar", "line", "area", "pie", "radar", "radial"] }
const collectionEnums = { sortDir: ["asc", "desc"] }
const buttonEnums = {
  variant: ["default", "secondary", "outline", "ghost", "destructive", "link"],
  size: ["sm", "default", "lg"],
}
const badgeEnums = {
  variant: [
    "default",
    "secondary",
    "success",
    "warning",
    "destructive",
    "outline",
  ],
}
const spinnerEnums = { size: ["sm", "default", "lg"] }
const spacerEnums = { size: ["sm", "default", "lg", "xl"] }
const titleEnums = { variant: ["simple", "image", "profile", "cover"] }
const entryEnums = { type: ["text", "email", "number", "tel"] }
const checkEnums = { style: ["checkbox", "switch"] }
const accordionEnums = { type: ["single", "multiple"] }
const imageEnums = {
  shape: ["square", "rounded", "circle"],
  fit: ["cover", "contain"],
  aspect: ["auto", "16:9", "4:3", "1:1"],
}
const videoEnums = {
  fit: ["cover", "contain"],
  aspect: ["auto", "16:9", "4:3", "1:1"],
}
const mapEnums = {
  visualType: ["street", "satellite"],
  itemAction: ["detail", "none", "navigate", "workflow", "api"],
}
const actionEnums = {
  action: ["detail", "none", "navigate", "workflow", "api"],
}
const textOverflowEnums = {
  overflow: ["truncate", "expand"],
  truncateBy: ["lines", "characters"],
}

const SHADCN = "https://github.com/shadcn.png"

// Map demo records — located by the "location" field ("lat,lng"), labeled by "name".
const mapData = [
  { id: "1", name: "Big Ben", location: "51.5007,-0.1246" },
  { id: "2", name: "Tower Bridge", location: "51.5055,-0.0754" },
  { id: "3", name: "British Museum", location: "51.5194,-0.1270" },
]

const LONG_TEXT =
  "Swift Struck UI is a web-first, cross-platform component & collection library you build entire apps on top of — primitives like shadcn/ui plus data-bound, configurable collections like Glide. This paragraph is intentionally long so you can watch it truncate by lines or characters, or expand to show the whole thing."

// Every simple-primitive demo card's editable settings live here, keyed by id.
const initialKnobs: Record<string, Record<string, unknown>> = {
  // Actions
  "btn-default": {
    label: "Get started",
    variant: "default",
    size: "default",
    disabled: false,
  },
  "btn-secondary": {
    label: "Secondary",
    variant: "secondary",
    size: "default",
    disabled: false,
  },
  "btn-outline": {
    label: "Outline",
    variant: "outline",
    size: "default",
    disabled: false,
  },
  "btn-destructive": {
    label: "Delete",
    variant: "destructive",
    size: "default",
    disabled: false,
  },
  "link-one": {
    label: "Visit brimba",
    variant: "link",
    size: "default",
    disabled: false,
  },
  "actionrow-one": {
    title: "Profile",
    subtitle: "Name, photo, bio",
    trailing: "",
  },
  "actionrow-two": {
    title: "Billing",
    subtitle: "Plan & invoices",
    trailing: "Pro",
  },
  // Display
  "badge-default": { label: "New", variant: "default" },
  "badge-success": { label: "Active", variant: "success" },
  "badge-warning": { label: "Pending", variant: "warning" },
  "badge-outline": { label: "Draft", variant: "outline" },
  "rating-edit": { value: 4, max: 5, readOnly: false },
  "rating-readonly": { value: 3, max: 5, readOnly: true },
  "progress-a": { label: "Storage used", value: 62 },
  "progress-b": { label: "Upload", value: 28 },
  "title-profile": {
    variant: "profile",
    title: "Ada Lovelace",
    subtitle: "Staff Engineer · London",
    image: SHADCN,
  },
  "title-cover": {
    variant: "cover",
    title: "Release v1",
    subtitle: "Shipping June 2024",
    image: SHADCN,
  },
  "title-image": {
    variant: "image",
    title: "What's new",
    subtitle: "Notes & highlights",
    image: SHADCN,
  },
  "typography-one": {
    headline: "Headline",
    body: "Body copy for paragraphs and descriptions.",
    hint: "A small muted hint or caption.",
  },
  "text-overflow": { ...defaultTextDisplayConfig },
  "image-one": { ...defaultImageConfig, altText: "Sample image" },
  "video-one": { ...defaultVideoConfig },
  "map-one": {
    ...defaultMapConfig,
    addressField: "location",
    captionField: "name",
  },
  // Inputs
  "entry-text": {
    label: "Full name",
    type: "text",
    placeholder: "Ada Lovelace",
    multiline: false,
  },
  "entry-email": {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    multiline: false,
  },
  "entry-number": {
    label: "Age",
    type: "number",
    placeholder: "30",
    multiline: false,
  },
  "entry-multiline": {
    label: "Bio (multi-line)",
    type: "text",
    placeholder: "A few words…",
    multiline: true,
  },
  "check-box": { label: "Accept terms", checked: true, style: "checkbox" },
  "check-switch": {
    label: "Email notifications",
    checked: true,
    style: "switch",
  },
  "slider-one": { value: 40, max: 100, step: 1 },
  "select-one": { disabled: false },
  // Layout
  "spacer-one": { size: "lg" },
  "spinner-one": { size: "default" },
  "separator-one": { label: "OR" },
  "card-one": {
    title: "Project Atlas",
    body: "A container surface built from tokens.",
  },
  "container-demo": {
    ...defaultContainerConfig,
    background: "dark",
    direction: "horizontal",
    columns: 3,
  },
  "action-disabled": {
    ...defaultActionConfig,
    action: "workflow",
    disabled: true,
    showWhenDisabled: true,
  },
  // Navigation
  "toggle-one": { type: "single" },
  "accordion-one": { type: "single" },
  // Overlays — editable trigger/title/description text
  "ov-dialog": {
    trigger: "Open dialog",
    title: "Edit profile",
    description: "Make changes and save when you're done.",
  },
  "ov-sheet": {
    trigger: "Open sheet",
    title: "Edit profile",
    description: "Make changes and save when you're done.",
  },
  "ov-popover": {
    trigger: "Open popover",
    title: "Dimensions",
    description: "Set the width and height.",
  },
  "ov-hover": {
    trigger: "@brimba",
    title: "brimba",
    description: "The component library.",
  },
  "ov-alert": {
    trigger: "Delete",
    title: "Are you sure?",
    description: "This action cannot be undone.",
  },
}

/* -------------------------------------------------------------------------- */

export default function ComponentsGallery() {
  const [query, setQuery] = React.useState("")

  // Per-demo Container config (background + stacking), defaulted lazily to a card.
  const [containers, setContainers] = React.useState<
    Record<string, Record<string, unknown>>
  >({})
  const containersApi = React.useMemo(
    () => ({
      get: (k: string) =>
        containers[k] ??
        ({ ...defaultContainerConfig } as unknown as Record<string, unknown>),
      set: (k: string, n: Record<string, unknown>) =>
        setContainers((s) => ({ ...s, [k]: n })),
    }),
    [containers]
  )

  // Keyed store for all the simple-primitive demo cards.
  const [knobs, setKnobs] = React.useState(initialKnobs)
  const putKnob = (id: string, next: Record<string, unknown>) =>
    setKnobs((k) => ({ ...k, [id]: next }))

  // Collection demos driven by the shared CollectionFrame.
  const [listCfg, setListCfg] = React.useState<Record<string, unknown>>({
    ...defaultCollectionConfig,
    title: "Team",
    itemsPerPage: 6,
    showCount: true,
    searchable: true,
  })
  const [cardCfg, setCardCfg] = React.useState<Record<string, unknown>>({
    ...defaultCollectionConfig,
    title: "People",
    itemsPerPage: 6,
    showCount: true,
    searchable: true,
  })

  // Field validation demo.
  const [username, setUsername] = React.useState("")
  const [usernameTouched, setUsernameTouched] = React.useState(false)

  // Choice demos.
  const [picked, setPicked] = React.useState<string[]>(["eng", "design"])
  const [plan, setPlan] = React.useState<string[]>(["prod"])
  const [chips, setChips] = React.useState<string[]>(["design", "mkt"])
  const [pickedCfg, setPickedCfg] = React.useState<Record<string, unknown>>({
    ...defaultChoiceConfig,
    mode: "multi",
    display: "dropdown",
    placeholder: "Select tags",
  })
  const [planCfg, setPlanCfg] = React.useState<Record<string, unknown>>({
    ...defaultChoiceConfig,
    mode: "single",
    display: "pills",
    searchable: false,
  })
  const [chipsCfg, setChipsCfg] = React.useState<Record<string, unknown>>({
    ...defaultChoiceConfig,
    mode: "multi",
    display: "chips",
    max: 3,
  })

  // Data-driven collection/content demos.
  const [tableCfg, setTableCfg] = React.useState<Record<string, unknown>>(
    tableConfig as unknown as Record<string, unknown>
  )
  const [tasks, setTasks] = React.useState(initialTasks)
  const [kanbanCfg, setKanbanCfg] = React.useState<Record<string, unknown>>(
    kanbanConfig as unknown as Record<string, unknown>
  )
  const [calCfg, setCalCfg] = React.useState<Record<string, unknown>>(
    calendarViewConfig as unknown as Record<string, unknown>
  )
  const [detailCfg, setDetailCfg] = React.useState<Record<string, unknown>>(
    detailViewConfig as unknown as Record<string, unknown>
  )
  const [statCfg, setStatCfg] = React.useState<Record<string, unknown>>(
    statGridConfig as unknown as Record<string, unknown>
  )
  const [checkItems, setCheckItems] = React.useState(initialChecklist)
  const [checkCfg, setCheckCfg] = React.useState<Record<string, unknown>>(
    defaultChecklistConfig as unknown as Record<string, unknown>
  )
  const [chartRows, setChartRows] = React.useState(chartData)
  const [chartCfg, setChartCfg] = React.useState<Record<string, unknown>>(
    chartViewConfig as unknown as Record<string, unknown>
  )
  const [formCfg, setFormCfg] = React.useState<Record<string, unknown>>(
    formConfig as unknown as Record<string, unknown>
  )
  const [comments, setComments] = React.useState(initialComments)
  const [messages, setMessages] = React.useState(initialMessages)
  const [date, setDate] = React.useState<string | null>(null)
  const [peopleData, setPeopleData] = React.useState(peopleLarge)
  const [statData, setStatData] = React.useState(stats)
  const [eventData, setEventData] = React.useState(events)
  const [profileData, setProfileData] = React.useState(profile)

  return (
    <TooltipProvider>
      <SearchCtx.Provider value={query}>
        <ContainersCtx.Provider value={containersApi}>
          <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
            <header className="animate-rise flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← Dashboard
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Component Gallery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Grouped like Glide. Each card is one configuration — click the
                  ⚙ to tweak it live, or search to filter.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search components…"
                    className="pl-8"
                  />
                </div>
                <ModeToggle />
              </div>
            </header>

            {/* ============================ COLLECTIONS ============================ */}
            <Section
              title="Collections — data views"
              hint="Multi-row views. Every one wears the same chrome: a title, a live count, search, and pagination."
            >
              <Demo
                name="List · paginated"
                span={3}
                config={listCfg}
                setConfig={setListCfg}
                enums={collectionEnums}
                data={peopleData}
                setData={(d) => setPeopleData(d as typeof peopleLarge)}
              >
                <CollectionFrame
                  config={listCfg as unknown as CollectionConfig}
                  data={peopleData}
                  searchKeys={["name", "role", "status"]}
                  renderItems={(rows) => (
                    <List
                      items={rows.map((p) => ({
                        id: p.id,
                        title: p.name,
                        subtitle: p.role,
                        leading: (
                          <Avatar className="size-9">
                            <AvatarFallback>
                              {p.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ),
                        trailing: (
                          <Badge variant={statusVariant(p.status)}>
                            {p.status}
                          </Badge>
                        ),
                      }))}
                    />
                  )}
                />
              </Demo>

              <Demo
                name="Card · grid collection"
                span={3}
                config={cardCfg}
                setConfig={setCardCfg}
                enums={collectionEnums}
                data={peopleData}
                setData={(d) => setPeopleData(d as typeof peopleLarge)}
              >
                <CollectionFrame
                  config={cardCfg as unknown as CollectionConfig}
                  data={peopleData}
                  searchKeys={["name", "role", "status"]}
                  renderItems={(rows) => (
                    <CardGrid
                      columns={3}
                      items={rows.map((p) => ({
                        id: p.id,
                        title: p.name,
                        description: p.role,
                        footer: (
                          <Badge variant={statusVariant(p.status)}>
                            {p.status}
                          </Badge>
                        ),
                      }))}
                    />
                  )}
                />
              </Demo>

              <Demo
                name="DataTable · sortable · searchable · row actions"
                span={3}
                config={tableCfg}
                setConfig={setTableCfg}
                enums={dataTableEnums}
                data={peopleData}
                setData={(d) => setPeopleData(d as typeof peopleLarge)}
              >
                <DataTable
                  data={peopleData}
                  config={tableCfg as unknown as DataTableConfig}
                  actions={[
                    { label: "View", onSelect: () => {} },
                    { label: "Edit", onSelect: () => {} },
                  ]}
                  className="w-full"
                />
              </Demo>

              <Demo
                name="Kanban · drag cards between columns"
                span={3}
                config={kanbanCfg}
                setConfig={setKanbanCfg}
                data={tasks}
                setData={(d) => setTasks(d as typeof initialTasks)}
              >
                <Kanban
                  data={tasks}
                  onDataChange={setTasks}
                  config={kanbanCfg as unknown as KanbanConfig}
                  className="w-full"
                />
              </Demo>

              <Demo
                name="Calendar · month grid"
                span={3}
                config={calCfg}
                setConfig={setCalCfg}
                enums={calendarEnums}
                data={eventData}
                setData={(d) => setEventData(d as typeof events)}
              >
                <CalendarView
                  data={eventData}
                  config={calCfg as unknown as CalendarViewConfig}
                  initialMonth={calInitialMonth}
                  className="w-full"
                />
              </Demo>

              <Demo
                name="Checklist · tick items off"
                span={1}
                config={checkCfg}
                setConfig={setCheckCfg}
                data={checkItems}
                setData={(d) => setCheckItems(d as ChecklistItem[])}
              >
                <Checklist
                  items={checkItems}
                  onChange={setCheckItems}
                  config={checkCfg as unknown as ChecklistConfig}
                  className="w-full"
                />
              </Demo>

              <Demo name="Comments · thread">
                <Comments
                  items={comments}
                  onAdd={(body) =>
                    setComments((c) => [
                      ...c,
                      {
                        id: String(c.length + 1),
                        author: "You",
                        body,
                        time: "now",
                      },
                    ])
                  }
                  className="w-full"
                />
              </Demo>

              <Demo name="Chat · message thread">
                <Chat
                  messages={messages}
                  onSend={(text) =>
                    setMessages((m) => [
                      ...m,
                      {
                        id: String(m.length + 1),
                        from: "me",
                        text,
                        time: "now",
                      },
                    ])
                  }
                  className="w-full"
                />
              </Demo>
            </Section>

            {/* ============================== DISPLAY ============================= */}
            <Section
              title="Display — single-record content"
              hint="Read-mostly blocks that show one record or value (Glide's Fields, Big Numbers, Charts, media…)."
            >
              <Demo
                name="Fields · record detail"
                span={2}
                config={detailCfg}
                setConfig={setDetailCfg}
                data={profileData}
                setData={(d) => setProfileData(d as typeof profile)}
              >
                <DetailView
                  record={profileData}
                  config={detailCfg as unknown as DetailViewConfig}
                  className="w-full"
                />
              </Demo>

              <Demo
                name="Big Numbers · stat grid"
                span={2}
                config={statCfg}
                setConfig={setStatCfg}
                data={statData}
                setData={(d) => setStatData(d as typeof stats)}
              >
                <StatGrid
                  items={statData}
                  config={statCfg as unknown as StatGridConfig}
                  className="w-full"
                />
              </Demo>

              <Demo
                name="Chart · bar / line / area / pie / radar"
                span={3}
                config={chartCfg}
                setConfig={setChartCfg}
                enums={chartEnums}
                data={chartRows}
                setData={(d) => setChartRows(d as typeof chartData)}
              >
                <Chart
                  data={chartRows}
                  config={chartCfg as unknown as ChartConfig}
                  className="w-full"
                />
              </Demo>

              <VariantGroup
                items={[
                  { id: "progress-a", name: "Progress · bar" },
                  { id: "progress-b", name: "Progress · low" },
                ]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span>{String(c.label)}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {Number(c.value)}%
                      </span>
                    </div>
                    <Progress value={Number(c.value)} />
                  </div>
                )}
              />

              <VariantGroup
                items={[
                  { id: "title-profile", name: "Title · profile" },
                  { id: "title-cover", name: "Title · cover" },
                  { id: "title-image", name: "Title · image" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={titleEnums}
                render={(c) => (
                  <Title
                    variant={
                      c.variant as React.ComponentProps<typeof Title>["variant"]
                    }
                    title={String(c.title)}
                    subtitle={String(c.subtitle)}
                    image={String(c.image)}
                    className="w-full"
                  />
                )}
              />

              <VariantGroup
                items={[{ id: "typography-one", name: "Typography" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <>
                    <Headline className="text-lg">
                      {String(c.headline)}
                    </Headline>
                    <Body>{String(c.body)}</Body>
                    <Hint>{String(c.hint)}</Hint>
                  </>
                )}
              />

              <VariantGroup
                items={[
                  { id: "text-overflow", name: "Text · truncate / expand" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={textOverflowEnums}
                render={(c) => (
                  <Body>
                    <Clamp config={c as unknown as TextDisplayConfig}>
                      {LONG_TEXT}
                    </Clamp>
                  </Body>
                )}
              />

              <VariantGroup
                items={[
                  { id: "badge-default", name: "Badge · default" },
                  { id: "badge-success", name: "Badge · success" },
                  { id: "badge-warning", name: "Badge · warning" },
                  { id: "badge-outline", name: "Badge · outline" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={badgeEnums}
                render={(c) => (
                  <Badge
                    variant={
                      c.variant as React.ComponentProps<typeof Badge>["variant"]
                    }
                  >
                    {String(c.label)}
                  </Badge>
                )}
              />

              <VariantGroup
                items={[
                  { id: "rating-edit", name: "Rating · interactive" },
                  { id: "rating-readonly", name: "Rating · read-only" },
                ]}
                configs={knobs}
                onChange={putKnob}
                render={(c, id) => (
                  <Rating
                    value={Number(c.value)}
                    max={Number(c.max)}
                    readOnly={Boolean(c.readOnly)}
                    onChange={(v) => putKnob(id, { ...c, value: v })}
                  />
                )}
              />

              <VariantGroup
                items={[{ id: "image-one", name: "Image" }]}
                configs={knobs}
                onChange={putKnob}
                enums={imageEnums}
                render={(c) => (
                  <Image
                    src={SHADCN}
                    config={c as unknown as ImageConfig}
                    className="w-full"
                  />
                )}
              />

              <VariantGroup
                items={[{ id: "video-one", name: "Video" }]}
                configs={knobs}
                onChange={putKnob}
                enums={videoEnums}
                render={(c) => (
                  <Video
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                    poster={SHADCN}
                    config={c as unknown as VideoConfig}
                  />
                )}
              />

              <VariantGroup
                items={[{ id: "map-one", name: "Map" }]}
                configs={knobs}
                onChange={putKnob}
                enums={mapEnums}
                render={(c) => (
                  <Map
                    data={mapData}
                    config={c as unknown as MapConfig}
                    className="w-full"
                  />
                )}
              />

              <Demo name="Web Embed">
                <WebEmbed
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.135%2C51.503%2C-0.10%2C51.520&layer=mapnik"
                  title="Map"
                  className="w-full"
                />
              </Demo>

              <Demo name="Avatar & Tooltip">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={SHADCN} alt="@cn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        Hover
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>A token-styled tooltip</TooltipContent>
                  </Tooltip>
                </div>
              </Demo>

              <Demo name="Skeleton · variants">
                <div className="flex w-full flex-col gap-4">
                  <Skeleton variant="media" />
                  <Skeleton variant="text" lines={3} />
                  <Skeleton variant="list" lines={2} />
                </div>
              </Demo>

              <Demo name="Alert">
                <Alert>
                  <Info />
                  <AlertTitle>Heads up</AlertTitle>
                  <AlertDescription>The default variant.</AlertDescription>
                </Alert>
              </Demo>
            </Section>

            {/* ========================= INPUTS & PICKERS ======================== */}
            <Section
              title="Inputs & pickers"
              hint="Everything that collects input. Required fields get the animated teal ring; validation messages come from the config."
            >
              <Demo
                name="Choice · dropdown + search (multi)"
                config={pickedCfg}
                setConfig={setPickedCfg}
                enums={choiceEnums}
              >
                <div className="w-full">
                  <Choice
                    options={tagOptions}
                    value={picked}
                    onChange={setPicked}
                    config={pickedCfg as unknown as ChoiceConfig}
                  />
                </div>
              </Demo>
              <Demo
                name="Choice · pills (single)"
                config={planCfg}
                setConfig={setPlanCfg}
                enums={choiceEnums}
              >
                <Choice
                  options={tagOptions}
                  value={plan}
                  onChange={setPlan}
                  config={planCfg as unknown as ChoiceConfig}
                />
              </Demo>
              <Demo
                name="Choice · chips (multi, max 3)"
                config={chipsCfg}
                setConfig={setChipsCfg}
                enums={choiceEnums}
              >
                <Choice
                  options={tagOptions}
                  value={chips}
                  onChange={setChips}
                  config={chipsCfg as unknown as ChoiceConfig}
                />
              </Demo>

              <VariantGroup
                items={[
                  { id: "entry-text", name: "Entry · text" },
                  { id: "entry-email", name: "Entry · email" },
                  { id: "entry-number", name: "Entry · number" },
                  { id: "entry-multiline", name: "Entry · multi-line (size)" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={entryEnums}
                render={(c, id) => (
                  <div className="flex w-full flex-col gap-1.5">
                    <Label htmlFor={id}>{String(c.label)}</Label>
                    {c.multiline ? (
                      <Textarea
                        id={id}
                        rows={3}
                        placeholder={String(c.placeholder)}
                      />
                    ) : (
                      <Input
                        id={id}
                        type={String(c.type)}
                        placeholder={String(c.placeholder)}
                      />
                    )}
                  </div>
                )}
              />

              <Demo name="Field · required + live validation">
                <Field
                  config={usernameCfg}
                  htmlFor="username"
                  error={
                    usernameTouched
                      ? (validateField(username, usernameCfg) ?? undefined)
                      : undefined
                  }
                >
                  <Input
                    id="username"
                    value={username}
                    placeholder="ada_lovelace"
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setUsernameTouched(true)}
                    {...fieldProps(usernameCfg)}
                  />
                </Field>
              </Demo>

              <VariantGroup
                items={[
                  { id: "check-box", name: "Checkbox" },
                  { id: "check-switch", name: "Switch" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={checkEnums}
                render={(c, id) => (
                  <div className="flex items-center gap-2">
                    {c.style === "switch" ? (
                      <Switch
                        id={id}
                        checked={Boolean(c.checked)}
                        onCheckedChange={(v) =>
                          putKnob(id, { ...c, checked: v })
                        }
                      />
                    ) : (
                      <Checkbox
                        id={id}
                        checked={Boolean(c.checked)}
                        onCheckedChange={(v) =>
                          putKnob(id, { ...c, checked: Boolean(v) })
                        }
                      />
                    )}
                    <Label htmlFor={id}>{String(c.label)}</Label>
                  </div>
                )}
              />

              <Demo name="Radio Group">
                <RadioGroup defaultValue="monthly" className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="m" />
                    <Label htmlFor="m">Monthly</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yearly" id="y" />
                    <Label htmlFor="y">Yearly</Label>
                  </div>
                </RadioGroup>
              </Demo>

              <VariantGroup
                items={[{ id: "slider-one", name: "Slider" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c, id) => (
                  <div className="flex w-full flex-col gap-2">
                    <Slider
                      value={[Number(c.value)]}
                      max={Number(c.max)}
                      step={Number(c.step)}
                      onValueChange={(v) => putKnob(id, { ...c, value: v[0] })}
                    />
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Number(c.value)}
                    </span>
                  </div>
                )}
              />

              <VariantGroup
                items={[{ id: "select-one", name: "Select" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Select defaultValue="next" disabled={Boolean(c.disabled)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Demo name="Date Picker">
                <Field config={{ ...defaultFieldConfig, label: "Due date" }}>
                  <DatePicker value={date} onChange={setDate} />
                </Field>
              </Demo>

              <Demo name="File Upload">
                <Field config={{ ...defaultFieldConfig, label: "Attachments" }}>
                  <FileUpload accept="image/*" multiple className="w-full" />
                </Field>
              </Demo>

              <Demo name="Signature · required">
                <Field
                  config={{
                    ...defaultFieldConfig,
                    label: "Signature",
                    required: true,
                  }}
                  ringed={false}
                >
                  <Signature required className="w-full" />
                </Field>
              </Demo>

              <Demo name="Notes · editor">
                <Field config={{ ...defaultFieldConfig, label: "Notes" }}>
                  <Notes
                    defaultValue="<p>Edit <b>me</b> — try <i>bold</i>, lists, and a separator.</p>"
                    className="w-full"
                  />
                </Field>
              </Demo>

              <Demo name="Stopwatch">
                <Stopwatch />
              </Demo>

              <Demo
                name="Form · validated, config-driven"
                span={2}
                config={formCfg}
                setConfig={setFormCfg}
              >
                <Form
                  config={formCfg as unknown as FormConfig}
                  onSubmit={() => {}}
                  className="w-full"
                />
              </Demo>
            </Section>

            {/* ============================== ACTIONS ============================ */}
            <Section
              title="Actions"
              hint="Interacting fires a side-effect (navigate, workflow, API)."
            >
              <VariantGroup
                items={[
                  { id: "btn-default", name: "Button · primary" },
                  { id: "btn-secondary", name: "Button · secondary" },
                  { id: "btn-outline", name: "Button · outline" },
                  { id: "btn-destructive", name: "Button · destructive" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={buttonEnums}
                render={(c) => (
                  <Button
                    variant={
                      c.variant as React.ComponentProps<
                        typeof Button
                      >["variant"]
                    }
                    size={c.size as React.ComponentProps<typeof Button>["size"]}
                    disabled={Boolean(c.disabled)}
                  >
                    {String(c.label)}
                  </Button>
                )}
              />

              <VariantGroup
                items={[{ id: "link-one", name: "Link (button asChild)" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Button variant="link" asChild>
                    <a href="#">{String(c.label)}</a>
                  </Button>
                )}
              />

              <VariantGroup
                items={[
                  { id: "actionrow-one", name: "Action Row · profile" },
                  { id: "actionrow-two", name: "Action Row · trailing" },
                ]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <div className="w-full">
                    <ActionRow
                      icon={<User />}
                      title={String(c.title)}
                      subtitle={String(c.subtitle)}
                      trailing={
                        c.trailing ? (
                          <Badge variant="secondary">
                            {String(c.trailing)}
                          </Badge>
                        ) : undefined
                      }
                      onClick={() => {}}
                    />
                  </div>
                )}
              />

              <VariantGroup
                items={[
                  { id: "action-disabled", name: "Button · access-gated" },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={actionEnums}
                render={(c) => {
                  // No access: show it greyed-out, or hide it entirely.
                  if (c.disabled && !c.showWhenDisabled)
                    return (
                      <span className="text-xs text-muted-foreground">
                        Hidden — the signed-in user lacks access.
                      </span>
                    )
                  return (
                    <Button disabled={Boolean(c.disabled)}>Run workflow</Button>
                  )
                }}
              />
            </Section>

            {/* ============================== LAYOUT ============================= */}
            <Section title="Layout" hint="Structure & spacing.">
              <VariantGroup
                items={[
                  {
                    id: "container-demo",
                    name: "Container · background & stacking",
                    span: 3,
                  },
                ]}
                configs={knobs}
                onChange={putKnob}
                enums={containerEnums}
                render={(c) => (
                  <Container
                    config={c as unknown as ContainerConfig}
                    className="w-full"
                  >
                    {["One", "Two", "Three"].map((t) => (
                      <div
                        key={t}
                        className="rounded-lg border bg-background/40 p-4 text-sm"
                      >
                        {t}
                      </div>
                    ))}
                  </Container>
                )}
              />

              <VariantGroup
                items={[{ id: "card-one", name: "Card (container)" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{String(c.title)}</CardTitle>
                      <CardDescription>{String(c.body)}</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              />

              <VariantGroup
                items={[{ id: "separator-one", name: "Separator" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <div className="flex w-full items-center gap-3 text-xs text-muted-foreground">
                    <Separator className="flex-1" />
                    {String(c.label)}
                    <Separator className="flex-1" />
                  </div>
                )}
              />

              <VariantGroup
                items={[{ id: "spacer-one", name: "Spacer" }]}
                configs={knobs}
                onChange={putKnob}
                enums={spacerEnums}
                render={(c) => (
                  <>
                    <Badge>Above</Badge>
                    <Spacer size={c.size as "sm" | "default" | "lg" | "xl"} />
                    <Badge>Below</Badge>
                  </>
                )}
              />

              <VariantGroup
                items={[{ id: "spinner-one", name: "Spinner" }]}
                configs={knobs}
                onChange={putKnob}
                enums={spinnerEnums}
                render={(c) => (
                  <Spinner
                    size={
                      c.size as React.ComponentProps<typeof Spinner>["size"]
                    }
                  />
                )}
              />

              <VariantGroup
                items={[{ id: "accordion-one", name: "Accordion" }]}
                configs={knobs}
                onChange={putKnob}
                enums={accordionEnums}
                render={(c) =>
                  c.type === "multiple" ? (
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                          Yes, via Radix + ARIA.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="2">
                        <AccordionTrigger>Is it themed?</AccordionTrigger>
                        <AccordionContent>Yes, from tokens.</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                          Yes, via Radix + ARIA.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="2">
                        <AccordionTrigger>Is it themed?</AccordionTrigger>
                        <AccordionContent>Yes, from tokens.</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                }
              />

              <Demo name="Tabs">
                <Tabs defaultValue="a" className="w-full">
                  <TabsList>
                    <TabsTrigger value="a">Account</TabsTrigger>
                    <TabsTrigger value="b">Billing</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="a"
                    className="text-sm text-muted-foreground"
                  >
                    Account settings.
                  </TabsContent>
                  <TabsContent
                    value="b"
                    className="text-sm text-muted-foreground"
                  >
                    Billing details.
                  </TabsContent>
                </Tabs>
              </Demo>

              <Demo name="Collapsible">
                <Collapsible className="w-full">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      Toggle details
                      <ChevronsUpDown className="size-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 rounded-lg border p-3 text-sm text-muted-foreground">
                    Hidden content revealed on demand.
                  </CollapsibleContent>
                </Collapsible>
              </Demo>

              <Demo name="Aspect Ratio (16:9)">
                <div className="w-full">
                  <AspectRatio
                    ratio={16 / 9}
                    className="overflow-hidden rounded-lg border bg-gradient-to-br from-primary/20 to-chart-3/20"
                  />
                </div>
              </Demo>

              <Demo name="Scroll Area">
                <ScrollArea className="h-28 w-full rounded-lg border p-3">
                  <div className="flex flex-col gap-2 text-sm">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i}>Item {i + 1}</div>
                    ))}
                  </div>
                </ScrollArea>
              </Demo>

              <Demo name="Table (primitive)">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.id}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {inv.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Demo>
            </Section>

            {/* =========================== NAVIGATION =========================== */}
            <Section title="Navigation" hint="Move between pages & views.">
              <VariantGroup
                items={[{ id: "toggle-one", name: "Toggle & Toggle Group" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <>
                    <Toggle aria-label="Bold">
                      <Bold />
                    </Toggle>
                    {c.type === "multiple" ? (
                      <ToggleGroup type="multiple" defaultValue={["left"]}>
                        <ToggleGroupItem value="left" aria-label="Left">
                          <AlignLeft />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="center" aria-label="Center">
                          <AlignCenter />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="right" aria-label="Right">
                          <AlignRight />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    ) : (
                      <ToggleGroup type="single" defaultValue="left">
                        <ToggleGroupItem value="left" aria-label="Left">
                          <AlignLeft />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="center" aria-label="Center">
                          <AlignCenter />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="right" aria-label="Right">
                          <AlignRight />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  </>
                )}
              />

              <Demo name="Breadcrumb">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Choice</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Demo>

              <Demo name="Pagination">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </Demo>

              <Demo name="Command (⌘K)">
                <Command className="border">
                  <CommandInput placeholder="Type a command…" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem>
                        <User /> Profile <CommandShortcut>⌘P</CommandShortcut>
                      </CommandItem>
                      <CommandItem>
                        <Settings /> Settings{" "}
                        <CommandShortcut>⌘S</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Account">
                      <CommandItem>
                        <CreditCard /> Billing
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </Demo>
            </Section>

            {/* ============================== OVERLAYS =========================== */}
            <Section
              title="Overlays"
              hint="Float above the page. The ⚙ edits their trigger, title, and body text."
            >
              <VariantGroup
                items={[{ id: "ov-dialog", name: "Dialog" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">{String(c.trigger)}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{String(c.title)}</DialogTitle>
                        <DialogDescription>
                          {String(c.description)}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Save</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              />

              <Demo name="Dropdown Menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User /> Profile{" "}
                      <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard /> Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Demo>

              <VariantGroup
                items={[{ id: "ov-popover", name: "Popover" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">{String(c.trigger)}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">{String(c.title)}</p>
                        <p className="text-sm text-muted-foreground">
                          {String(c.description)}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />

              <VariantGroup
                items={[{ id: "ov-hover", name: "Hover Card" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">{String(c.trigger)}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>BR</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{String(c.title)}</p>
                          <p className="text-muted-foreground">
                            {String(c.description)}
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              />

              <VariantGroup
                items={[{ id: "ov-sheet", name: "Sheet" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">{String(c.trigger)}</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{String(c.title)}</SheetTitle>
                        <SheetDescription>
                          {String(c.description)}
                        </SheetDescription>
                      </SheetHeader>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button>Save changes</Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                )}
              />

              <VariantGroup
                items={[{ id: "ov-alert", name: "Alert Dialog" }]}
                configs={knobs}
                onChange={putKnob}
                render={(c) => (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">{String(c.trigger)}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{String(c.title)}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {String(c.description)}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              />

              <Demo name="Toast">
                <Button
                  variant="outline"
                  onClick={() =>
                    toast("Changes saved", {
                      description: "Your settings have been updated.",
                    })
                  }
                >
                  Show toast
                </Button>
              </Demo>
            </Section>
          </main>
        </ContainersCtx.Provider>
      </SearchCtx.Provider>
    </TooltipProvider>
  )
}
