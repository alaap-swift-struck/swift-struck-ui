"use client"

import * as React from "react"
import Link from "next/link"
import {
  CreditCard,
  Info,
  LogOut,
  Settings,
  Terminal,
  User,
} from "lucide-react"

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

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
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

export default function ComponentsGallery() {
  return (
    <TooltipProvider>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
        <header className="animate-rise flex items-end justify-between gap-4">
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
              Every primitive is token-backed and reactive — hover, focus, and
              tap to feel it.
            </p>
          </div>
          <ModeToggle />
        </header>

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
                <Input id="email" type="email" placeholder="you@example.com" />
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
                  <AvatarImage src="https://github.com/shadcn.png" alt="@cn" />
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
      </main>
    </TooltipProvider>
  )
}
