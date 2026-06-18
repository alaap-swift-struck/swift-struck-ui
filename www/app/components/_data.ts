// Demo data + config presets for the component gallery — extracted from page.tsx
// to keep the showcase file lean. Pure data: no JSX, no state, no hooks.

import * as React from "react"

import {
  defaultActionConfig,
  defaultContainerConfig,
  defaultFieldConfig,
  defaultImageConfig,
  defaultMapConfig,
  defaultTextDisplayConfig,
  defaultVideoConfig,
  type FieldConfig,
} from "@swift-struck/ui/lib/config"
import {
  defaultCalendarViewConfig,
  type CalendarViewConfig,
} from "@swift-struck/ui/registry/collections/calendar-view/calendar-view"
import {
  defaultChartConfig,
  type ChartConfig,
} from "@swift-struck/ui/registry/collections/chart/chart"
import { type ChatMessage } from "@swift-struck/ui/registry/collections/chat/chat"
import { type ChecklistItem } from "@swift-struck/ui/registry/collections/checklist/checklist"
import { type CommentItem } from "@swift-struck/ui/registry/collections/comments/comments"
import {
  defaultDataTableConfig,
  type DataTableConfig,
} from "@swift-struck/ui/registry/collections/data-table/data-table"
import {
  defaultDetailViewConfig,
  type DetailViewConfig,
} from "@swift-struck/ui/registry/collections/detail-view/detail-view"
import {
  defaultFormConfig,
  type FormConfig,
} from "@swift-struck/ui/registry/collections/form/form"
import {
  defaultKanbanConfig,
  type KanbanConfig,
} from "@swift-struck/ui/registry/collections/kanban/kanban"
import {
  defaultPermissionMatrixConfig,
  type PermissionMatrixConfig,
  type PermissionMatrixValue,
} from "@swift-struck/ui/registry/collections/permission-matrix/permission-matrix"
import {
  defaultStatGridConfig,
  type StatGridConfig,
  type StatItem,
} from "@swift-struck/ui/registry/collections/stat-grid/stat-grid"
import {
  defaultTabsConfig,
  type TabsConfig,
} from "@swift-struck/ui/registry/primitives/tabs/tabs"
import {
  defaultActivityFeedConfig,
  type ActivityFeedConfig,
  type ActivityItem,
} from "@swift-struck/ui/registry/collections/activity-feed/activity-feed"
import {
  defaultDescriptionListConfig,
  type DescriptionItem,
  type DescriptionListConfig,
} from "@swift-struck/ui/registry/collections/description-list/description-list"
import {
  defaultRecordDetailConfig,
  type RecordDetailConfig,
} from "@swift-struck/ui/registry/collections/record-detail/record-detail"
import { Badge } from "@swift-struck/ui/registry/primitives/badge/badge"

export const invoices = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
]

export const tagOptions = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "eng" },
  { label: "Marketing", value: "mkt" },
  { label: "Product", value: "prod" },
  { label: "Sales", value: "sales" },
]

export const people = [
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
export const FIRST = [
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
export const LAST = [
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
export const ROLES = [
  "Engineering",
  "Design",
  "Research",
  "Product",
  "Marketing",
  "Sales",
]
export const STATUSES = ["Active", "Away", "Offline"]
export const peopleLarge = Array.from({ length: 36 }, (_, i) => ({
  id: String(i + 1),
  name: `${FIRST[i % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
  role: ROLES[i % ROLES.length],
  status: STATUSES[i % STATUSES.length],
  commits: 40 + ((i * 37) % 260),
}))

// Map a status string to a Badge variant — reused across collection demos.
export const statusVariant = (
  s: string
): React.ComponentProps<typeof Badge>["variant"] =>
  s === "Active" ? "success" : s === "Away" ? "warning" : "outline"

export const tableConfig: DataTableConfig = {
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

export const initialTasks = [
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

export const kanbanConfig: KanbanConfig = {
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
export const events = [
  { id: "1", date: "2024-06-04", title: "Standup", team: "Eng" },
  { id: "2", date: "2024-06-04", title: "Design review", team: "Design" },
  { id: "3", date: "2024-06-11", title: "Sprint planning", team: "Product" },
  { id: "4", date: "2024-06-11", title: "1:1 with Ada", team: "Eng" },
  { id: "5", date: "2024-06-18", title: "Launch", team: "Product" },
  { id: "6", date: "2024-06-25", title: "Retro", team: "Eng" },
]
export const calInitialMonth = new Date(2024, 5, 1)
export const calendarViewConfig: CalendarViewConfig = {
  ...defaultCalendarViewConfig,
  dateField: "date",
  titleField: "title",
  accentField: "team",
  weekStartsOn: "sunday",
  maxPerDay: 2,
}

export const profile = {
  name: "Ada Lovelace",
  role: "Staff Engineer",
  status: "Active",
  location: "London",
  joined: "2021-03-14",
  commits: 1284,
}
export const detailViewConfig: DetailViewConfig = {
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

export const stats: StatItem[] = [
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
export const statGridConfig: StatGridConfig = {
  ...defaultStatGridConfig,
  columns: 3,
  showDelta: true,
}

export const chartData = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 4800, expenses: 2600 },
  { month: "Mar", revenue: 5200, expenses: 3100 },
  { month: "Apr", revenue: 4600, expenses: 2800 },
  { month: "May", revenue: 5900, expenses: 3200 },
  { month: "Jun", revenue: 6400, expenses: 3500 },
]
export const chartViewConfig: ChartConfig = {
  ...defaultChartConfig,
  type: "bar",
  xKey: "month",
  series: [
    { key: "revenue", label: "Revenue", color: "chart-1" },
    { key: "expenses", label: "Expenses", color: "chart-2" },
  ],
  height: 300,
}

export const initialChecklist: ChecklistItem[] = [
  { id: "1", label: "Scaffold the repo", done: true },
  { id: "2", label: "Build the primitives", done: true },
  { id: "3", label: "Build the collections", done: false },
  { id: "4", label: "Backfill component docs", done: false },
]

export const formConfig: FormConfig = {
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

export const initialComments: CommentItem[] = [
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

export const initialMessages: ChatMessage[] = [
  { id: "1", from: "them", text: "Did the dashboard ship?", time: "09:41" },
  { id: "2", from: "me", text: "Yep — charts are live 🎉", time: "09:42" },
  { id: "3", from: "them", text: "Beautiful.", time: "09:42" },
]

// A required, validated Field demo config.
export const usernameCfg: FieldConfig = {
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

/* --------------------------- permission matrix --------------------------- */

// A sample module list for one app (the rows of the grid). The app supplies its
// own — this is just the showcase's.
export const permissionModules = [
  { key: "teams", label: "Teams" },
  { key: "members", label: "Members" },
  { key: "roles", label: "Roles" },
  { key: "learning", label: "Learning" },
  { key: "help", label: "Help" },
  { key: "selectable", label: "Selectable data" },
]

// A DIFFERENT app's modules — proves the matrix is generic (config-only change).
export const salesModules = [
  { key: "orders", label: "Sales Orders" },
  { key: "invoices", label: "Invoices" },
  { key: "products", label: "Products" },
]

export const permissionMatrixConfig: PermissionMatrixConfig = {
  ...defaultPermissionMatrixConfig,
  modules: permissionModules,
  mode: "edit",
}

export const salesMatrixConfig: PermissionMatrixConfig = {
  ...defaultPermissionMatrixConfig,
  modules: salesModules,
  mode: "edit",
}

// A representative role. "help" is deliberately omitted to prove a module
// missing from the value renders as all-off (no crash).
export const permissionMatrixValue: PermissionMatrixValue = {
  teams: { read: true, create: false, edit: false, delete: false },
  members: { read: true, create: true, edit: true, delete: false },
  roles: { read: true, create: false, edit: false, delete: false },
  learning: { read: true, create: false, edit: false, delete: false },
  selectable: { read: false, create: false, edit: false, delete: false },
}

export const salesMatrixValue: PermissionMatrixValue = {
  orders: { read: true, create: true, edit: true, delete: false },
  invoices: { read: true, create: false, edit: false, delete: false },
  products: { read: true, create: true, edit: false, delete: false },
}

export const permissionEnums = {
  mode: ["edit", "read", "locked"],
  surface: ["card", "none"],
}

/* ------------------------------ config tabs ------------------------------ */

// Glide-style "Tabs Container": the tabs are DATA. Each has a label, a lucide
// icon name, and an optional badge (a count or a tag). Editable as JSON in the ⚙.
export const tabsConfig: TabsConfig = {
  ...defaultTabsConfig,
  variant: "pill",
  fullWidth: false,
  tabs: [
    {
      value: "inbox",
      label: "Inbox",
      icon: "inbox",
      badge: "24",
      badgeVariant: "",
    },
    {
      value: "drafts",
      label: "Drafts",
      icon: "file-pen",
      badge: "3",
      badgeVariant: "",
    },
    {
      value: "flagged",
      label: "Flagged",
      icon: "flag",
      badge: "8",
      badgeVariant: "destructive",
    },
  ],
}

export const tabsLineConfig: TabsConfig = {
  ...defaultTabsConfig,
  variant: "line",
  fullWidth: true,
  tabs: [
    {
      value: "overview",
      label: "Overview",
      icon: "layout-dashboard",
      badge: "",
      badgeVariant: "",
    },
    {
      value: "api",
      label: "API",
      icon: "code",
      badge: "New",
      badgeVariant: "success",
    },
    {
      value: "labs",
      label: "Labs",
      icon: "flask-conical",
      badge: "Beta",
      badgeVariant: "warning",
    },
  ],
}

export const tabsEnums = { variant: ["pill", "line"] }

/* ------------------------- record-detail blocks ------------------------- */

export const surfaceEnums = { surface: ["card", "none"] }

// Description / field list — empty values (Notes) drop out when hideEmpty is on.
export const descriptionItems: DescriptionItem[] = [
  { label: "Status", value: "Active" },
  { label: "Owner", value: "Ada Lovelace" },
  { label: "Plan", value: "Pro" },
  { label: "Location", value: "London" },
  { label: "Joined", value: "2021-03-14" },
  { label: "Notes", value: "" },
]
export const descriptionListConfig: DescriptionListConfig = {
  ...defaultDescriptionListConfig,
  columns: 2,
}

// Activity feed — passed oldest-first; newestFirst sorts it so newest is on top.
export const activityItems: ActivityItem[] = [
  {
    id: "1",
    description: "Created the account",
    actor: "Ada",
    timestamp: "2024-06-01 09:12",
  },
  {
    id: "2",
    description: "Upgraded to the Pro plan",
    actor: "Ada",
    timestamp: "2024-06-05 14:30",
  },
  {
    id: "3",
    description: "Invited 3 teammates",
    actor: "Grace",
    timestamp: "2024-06-11 10:02",
  },
  {
    id: "4",
    description: "Changed the billing email",
    actor: "Ada",
    timestamp: "2024-06-18 08:40",
  },
]
export const activityFeedConfig: ActivityFeedConfig = {
  ...defaultActivityFeedConfig,
}

export const recordDetailConfig: RecordDetailConfig = {
  ...defaultRecordDetailConfig,
}

/* ----------------------- enum + initial knob configs ----------------------- */

export const choiceEnums = {
  mode: ["single", "multi"],
  display: ["dropdown", "chips", "pills"],
}
export const dataTableEnums = {
  density: ["comfortable", "compact"],
  surface: ["card", "none"],
}
export const calendarEnums = { weekStartsOn: ["sunday", "monday"] }
export const chartEnums = {
  type: ["bar", "line", "area", "pie", "radar", "radial"],
}
export const collectionEnums = { sortDir: ["asc", "desc"] }
export const buttonEnums = {
  variant: ["default", "secondary", "outline", "ghost", "destructive", "link"],
  size: ["sm", "default", "lg"],
}
export const badgeEnums = {
  variant: [
    "default",
    "secondary",
    "success",
    "warning",
    "destructive",
    "outline",
  ],
}
export const spinnerEnums = { size: ["sm", "default", "lg"] }
export const spacerEnums = { size: ["sm", "default", "lg", "xl"] }
export const titleEnums = { variant: ["simple", "image", "profile", "cover"] }
export const entryEnums = { type: ["text", "email", "number", "tel"] }
export const checkEnums = { style: ["checkbox", "switch"] }
export const accordionEnums = { type: ["single", "multiple"] }
export const imageEnums = {
  shape: ["square", "rounded", "circle"],
  fit: ["cover", "contain"],
  aspect: ["auto", "16:9", "4:3", "1:1"],
}
export const videoEnums = {
  fit: ["cover", "contain"],
  aspect: ["auto", "16:9", "4:3", "1:1"],
}
export const mapEnums = {
  visualType: ["street", "satellite"],
  itemAction: ["detail", "none", "navigate", "workflow", "api"],
}
export const actionEnums = {
  action: ["detail", "none", "navigate", "workflow", "api"],
}
export const textOverflowEnums = {
  overflow: ["truncate", "expand"],
  truncateBy: ["lines", "characters"],
}

export const SHADCN = "https://github.com/shadcn.png"

// Map demo records — located by the "location" field ("lat,lng"), labeled by "name".
export const mapData = [
  { id: "1", name: "Big Ben", location: "51.5007,-0.1246" },
  { id: "2", name: "Tower Bridge", location: "51.5055,-0.0754" },
  { id: "3", name: "British Museum", location: "51.5194,-0.1270" },
]

export const LONG_TEXT =
  "Swift Struck UI is a web-first, cross-platform component & collection library you build entire apps on top of — primitives like shadcn/ui plus data-bound, configurable collections like Glide. This paragraph is intentionally long so you can watch it truncate by lines or characters, or expand to show the whole thing."

// Every simple-primitive demo card's editable settings live here, keyed by id.
export const initialKnobs: Record<string, Record<string, unknown>> = {
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
    label: "Visit Swift Struck UI",
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
    trigger: "@Swift Struck UI",
    title: "Swift Struck UI",
    description: "The component library.",
  },
  "ov-alert": {
    trigger: "Delete",
    title: "Are you sure?",
    description: "This action cannot be undone.",
  },
}
