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

import { ConfigEditor } from "./_playground/config-editor"

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
}: {
  name: string
  children: React.ReactNode
  // When provided, a Settings gear appears that live-edits this config.
  config?: Record<string, unknown>
  setConfig?: (next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
}) {
  const query = React.useContext(SearchCtx)
  if (query && !name.toLowerCase().includes(query.toLowerCase())) return null

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        {config && setConfig && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`Edit ${name} config`}
              >
                <Settings2 />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Config · live
              </p>
              <ScrollArea className="max-h-[60vh] pr-3">
                <ConfigEditor
                  config={config}
                  onChange={setConfig}
                  enums={enums}
                />
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

// Allowed values for enum-type config fields (used by the live config editor).
const choiceEnums = {
  mode: ["single", "multi"],
  display: ["dropdown", "chips", "pills"],
}
const dataTableEnums = { density: ["comfortable", "compact"] }

export default function ComponentsGallery() {
  const [query, setQuery] = React.useState("")

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
            >
              <DataTable
                data={people}
                config={tableCfg as unknown as DataTableConfig}
                actions={[
                  { label: "View", onSelect: () => {} },
                  { label: "Edit", onSelect: () => {} },
                ]}
                className="w-full"
              />
            </Demo>
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

              <Demo name="Skeleton">
                <div className="flex w-full items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
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
        </main>
      </SearchCtx.Provider>
    </TooltipProvider>
  )
}
