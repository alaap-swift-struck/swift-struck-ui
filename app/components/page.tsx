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
  Terminal,
  User,
} from "lucide-react"

import { ConfigEditor, JsonField } from "./_playground/config-editor"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/primitives/accordion/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/primitives/alert/alert"
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
} from "@/registry/primitives/alert-dialog/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/primitives/avatar/avatar"
import { Badge } from "@/registry/primitives/badge/badge"
import { Button } from "@/registry/primitives/button/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/primitives/card/card"
import { Checkbox } from "@/registry/primitives/checkbox/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/primitives/command/command"
import {
  Choice,
  type ChoiceConfig,
  defaultChoiceConfig,
} from "@/registry/primitives/choice/choice"
import {
  DataTable,
  defaultDataTableConfig,
  type DataTableConfig,
} from "@/registry/collections/data-table/data-table"
import {
  Kanban,
  defaultKanbanConfig,
  type KanbanConfig,
} from "@/registry/collections/kanban/kanban"
import {
  CalendarView,
  defaultCalendarViewConfig,
  type CalendarViewConfig,
} from "@/registry/collections/calendar-view/calendar-view"
import {
  DetailView,
  defaultDetailViewConfig,
  type DetailViewConfig,
} from "@/registry/collections/detail-view/detail-view"
import {
  StatGrid,
  defaultStatGridConfig,
  type StatGridConfig,
  type StatItem,
} from "@/registry/collections/stat-grid/stat-grid"
import {
  Checklist,
  defaultChecklistConfig,
  type ChecklistConfig,
  type ChecklistItem,
} from "@/registry/collections/checklist/checklist"
import {
  Chart,
  defaultChartConfig,
  type ChartConfig,
} from "@/registry/collections/chart/chart"
import { ActionRow } from "@/registry/primitives/action-row/action-row"
import { Rating } from "@/registry/primitives/rating/rating"
import { Spacer } from "@/registry/primitives/spacer/spacer"
import { Spinner } from "@/registry/primitives/spinner/spinner"
import {
  Headline,
  Hint,
  Text as Body,
} from "@/registry/primitives/typography/typography"
import { WebEmbed } from "@/registry/primitives/web-embed/web-embed"
import { Image } from "@/registry/primitives/image/image"
import { Video } from "@/registry/primitives/video/video"
import { Map } from "@/registry/primitives/map/map"
import { Stopwatch } from "@/registry/primitives/stopwatch/stopwatch"
import { Signature } from "@/registry/primitives/signature/signature"
import { FileUpload } from "@/registry/primitives/file-upload/file-upload"
import { DatePicker } from "@/registry/primitives/date-picker/date-picker"
import { Notes } from "@/registry/primitives/notes/notes"
import { Field, fieldProps } from "@/registry/primitives/field/field"
import {
  defaultFieldConfig,
  validateField,
  type FieldConfig,
} from "@/lib/config"
import { Title } from "@/registry/primitives/title/title"
import {
  Form,
  defaultFormConfig,
  type FormConfig,
} from "@/registry/collections/form/form"
import {
  Comments,
  type CommentItem,
} from "@/registry/collections/comments/comments"
import { Chat, type ChatMessage } from "@/registry/collections/chat/chat"
import { AspectRatio } from "@/registry/primitives/aspect-ratio/aspect-ratio"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/primitives/breadcrumb/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/primitives/collapsible/collapsible"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/primitives/pagination/pagination"
import { ScrollArea } from "@/registry/primitives/scroll-area/scroll-area"
import { toast } from "@/registry/primitives/sonner/sonner"
import { Toggle } from "@/registry/primitives/toggle/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/primitives/toggle-group/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/primitives/dropdown-menu/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/primitives/hover-card/hover-card"
import { Input } from "@/registry/primitives/input/input"
import { Label } from "@/registry/primitives/label/label"
import { ModeToggle } from "@/registry/primitives/mode-toggle/mode-toggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/primitives/popover/popover"
import { Progress } from "@/registry/primitives/progress/progress"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/primitives/radio-group/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/primitives/select/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/primitives/sheet/sheet"
import { Skeleton } from "@/registry/primitives/skeleton/skeleton"
import { Slider } from "@/registry/primitives/slider/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/primitives/table/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/primitives/tabs/tabs"
import { Textarea } from "@/registry/primitives/textarea/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/primitives/tooltip/tooltip"

// The current search text, shared so each Demo can hide itself when filtered.
const SearchCtx = React.createContext("")

function Demo({
  name,
  children,
  config,
  setConfig,
  enums,
  data,
  setData,
}: {
  name: string
  children: React.ReactNode
  // When provided, a Settings gear appears that live-edits this config.
  config?: Record<string, unknown>
  setConfig?: (next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
  // Optional: also expose the component's data (its content) as editable JSON,
  // so config toggles have visible context to act on.
  data?: unknown
  setData?: (next: unknown) => void
}) {
  const query = React.useContext(SearchCtx)
  if (query && !name.toLowerCase().includes(query.toLowerCase())) return null

  const hasConfig = Boolean(config && setConfig)
  const hasData = Boolean(data !== undefined && setData)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        {(hasConfig || hasData) && (
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
            <PopoverContent align="end" className="w-80">
              <ScrollArea className="max-h-[60vh] pr-3">
                <div className="flex flex-col gap-4">
                  {hasConfig && (
                    <div className="flex flex-col gap-3">
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
                      <p className="text-xs text-muted-foreground">
                        The component's content — edit values here (e.g. each
                        item's delta) and they update instantly.
                      </p>
                      <JsonField value={data} onCommit={(v) => setData!(v)} />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
      <CardContent className="flex min-h-20 flex-col items-start justify-center gap-4">
        {children}
      </CardContent>
    </Card>
  )
}

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

// Allowed values for enum-type config fields (used by the live config editor).
const choiceEnums = {
  mode: ["single", "multi"],
  display: ["dropdown", "chips", "pills"],
}
const dataTableEnums = { density: ["comfortable", "compact"] }
const calendarEnums = { weekStartsOn: ["sunday", "monday"] }
const chartEnums = {
  type: ["bar", "line", "area", "pie", "radar", "radial"],
}

export default function ComponentsGallery() {
  const [query, setQuery] = React.useState("")

  // a required, validated Field demo (label + ring + live error from config)
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
  const [username, setUsername] = React.useState("")
  const [usernameTouched, setUsernameTouched] = React.useState(false)

  // selected values for the Choice demos
  const [picked, setPicked] = React.useState<string[]>(["eng", "design"])
  const [plan, setPlan] = React.useState<string[]>(["prod"])
  const [chips, setChips] = React.useState<string[]>(["design", "mkt"])

  // live, editable configs (Record-typed so the playground editor can mutate
  // any field; cast back to the component's config type at the call site)
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
  const [tableCfg, setTableCfg] = React.useState<Record<string, unknown>>(
    tableConfig as unknown as Record<string, unknown>
  )

  // Kanban data is mutable (cards move between columns on drag).
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
  const [rating, setRating] = React.useState(4)
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

  // Collection datasets held in state so the playground can live-edit each
  // component's content (the values its config toggles act on).
  const [peopleData, setPeopleData] = React.useState(people)
  const [statData, setStatData] = React.useState(stats)
  const [eventData, setEventData] = React.useState(events)
  const [profileData, setProfileData] = React.useState(profile)

  return (
    <TooltipProvider>
      <SearchCtx.Provider value={query}>
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
                Search components, then click the ⚙ on any configurable one to
                edit its config live.
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

          {/* --------------------- CONFIGURABLE (Glide layer) --------------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Configurable — driven by a typed config
              </h2>
              <p className="text-sm text-muted-foreground">
                Same component, different <code>config</code>. Every field is
                required, so no setting is ever hidden.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>

            <Demo
              name="DataTable · sortable · searchable · striped · row actions"
              config={tableCfg}
              setConfig={setTableCfg}
              enums={dataTableEnums}
              data={peopleData}
              setData={(d) => setPeopleData(d as typeof people)}
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
          </section>

          {/* ----------------------------- COLLECTIONS ---------------------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Collections — data views
            </h2>
            <Demo
              name="Chart · bar / line / area / pie / radar / radial"
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

            <Demo
              name="Kanban · drag cards between columns"
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
              name="Detail view · record fields"
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
              name="Stat grid · big numbers"
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
              name="Checklist · tick items off"
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

            <Demo
              name="Form · validated, config-driven"
              config={formCfg}
              setConfig={setFormCfg}
            >
              <Form
                config={formCfg as unknown as FormConfig}
                onSubmit={() => {}}
                className="w-full"
              />
            </Demo>

            <div className="grid gap-5 lg:grid-cols-2">
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
            </div>
          </section>

          {/* ------------------- CONTENT & ACTIONS — Glide parity ----------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Content &amp; actions
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Demo name="Rating">
                <Rating value={rating} onChange={setRating} />
                <Rating value={3} readOnly />
              </Demo>

              <Demo name="Spinner">
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner />
                  <Spinner size="lg" />
                </div>
              </Demo>

              <Demo name="Typography">
                <Headline className="text-lg">Headline</Headline>
                <Body>Body text for paragraphs and descriptions.</Body>
                <Hint>A small muted hint or caption.</Hint>
              </Demo>

              <Demo name="Action Row">
                <div className="w-full">
                  <ActionRow
                    icon={<User />}
                    title="Profile"
                    subtitle="Name, photo, bio"
                    onClick={() => {}}
                  />
                  <ActionRow
                    icon={<CreditCard />}
                    title="Billing"
                    trailing={<Badge variant="secondary">Pro</Badge>}
                  />
                </div>
              </Demo>

              <Demo name="Spacer">
                <Badge>Above</Badge>
                <Spacer size="lg" />
                <Badge>Below (8 units apart)</Badge>
              </Demo>

              <Demo name="Web Embed">
                <WebEmbed
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.135%2C51.503%2C-0.10%2C51.520&layer=mapnik"
                  title="Map"
                  className="w-full"
                />
              </Demo>
            </div>
          </section>

          {/* ----------------------------- PRIMITIVES ----------------------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Primitives
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Demo name="Buttons">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </Demo>

              <Demo name="Inputs">
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </Demo>

              <Demo name="Select">
                <Select defaultValue="next">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="remix">Remix</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                  </SelectContent>
                </Select>
              </Demo>

              <Demo name="Checkbox & Radio">
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms">Accept terms</Label>
                </div>
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

              <Demo name="Badges">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </Demo>

              <Demo name="Progress & Slider">
                <div className="flex w-full flex-col gap-4">
                  <Progress value={62} />
                  <Slider defaultValue={[40]} max={100} step={1} />
                </div>
              </Demo>

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

              <Demo name="Accordion">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>Yes, via Radix + ARIA.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="2">
                    <AccordionTrigger>Is it themed?</AccordionTrigger>
                    <AccordionContent>Yes, from tokens.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Demo>

              <Demo name="Avatar & Tooltip">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@cn"
                    />
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

              <Demo name="Alert">
                <Alert>
                  <Info />
                  <AlertTitle>Heads up</AlertTitle>
                  <AlertDescription>The default variant.</AlertDescription>
                </Alert>
              </Demo>

              <Demo name="Skeleton · variants">
                <div className="flex w-full flex-col gap-4">
                  <Skeleton variant="media" />
                  <Skeleton variant="text" lines={3} />
                  <Skeleton variant="list" lines={2} />
                </div>
              </Demo>

              <Demo name="Table">
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
            </div>
          </section>

          {/* ------------------------------ OVERLAYS ------------------------------ */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Overlays — Batch 2
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

              <Demo name="Popover">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Dimensions</p>
                      <Label htmlFor="w">Width</Label>
                      <Input id="w" defaultValue="100%" />
                    </div>
                  </PopoverContent>
                </Popover>
              </Demo>

              <Demo name="Hover Card">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">@brimba</Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>BR</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">brimba</p>
                        <p className="text-muted-foreground">
                          The component library.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Demo>

              <Demo name="Sheet">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes and save when done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Ada Lovelace" />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button>Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </Demo>

              <Demo name="Alert Dialog">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Demo>

              <Demo name="Command">
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
            </div>
          </section>

          {/* ------------------- NAVIGATION & STRUCTURE — Batch 3 ------------------ */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Navigation &amp; structure — Batch 3
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Demo name="Toggle & Toggle Group">
                <Toggle aria-label="Bold">
                  <Bold />
                </Toggle>
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
              </Demo>

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
            </div>
          </section>
          {/* ------------------------------- MEDIA -------------------------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Media &amp; titles
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Demo name="Title (profile / cover)">
                <Title
                  variant="profile"
                  title="Ada Lovelace"
                  subtitle="Staff Engineer · London"
                  image="https://github.com/shadcn.png"
                  className="w-full"
                />
              </Demo>

              <Demo name="Image">
                <Image
                  src="https://github.com/shadcn.png"
                  alt="Sample"
                  ratio={16 / 9}
                  className="w-full"
                />
              </Demo>

              <Demo name="Map">
                <Map lat={51.505} lng={-0.09} zoom={12} className="w-full" />
              </Demo>

              <Demo name="Video">
                <Video
                  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  poster="https://github.com/shadcn.png"
                  className="w-full"
                />
              </Demo>
            </div>
          </section>

          {/* -------------------------- INPUTS & ADVANCED ------------------------- */}
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Inputs &amp; advanced
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Demo name="Date Picker">
                <DatePicker value={date} onChange={setDate} />
              </Demo>

              <Demo name="Stopwatch">
                <Stopwatch />
              </Demo>

              <Demo name="Notes">
                <Notes
                  defaultValue="<p>Edit <b>me</b> — try <i>bold</i>, lists, and a separator.</p>"
                  className="w-full"
                />
              </Demo>

              <Demo name="Field · required + validation">
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

              <Demo name="File Upload">
                <FileUpload accept="image/*" multiple className="w-full" />
              </Demo>

              <Demo name="Signature · required">
                <Field
                  config={{
                    ...defaultFieldConfig,
                    label: "Signature",
                    required: true,
                  }}
                >
                  <Signature className="w-full" />
                </Field>
              </Demo>
            </div>
          </section>
        </main>
      </SearchCtx.Provider>
    </TooltipProvider>
  )
}
