"use client"

import * as React from "react"
import Link from "next/link"
import { Info, Terminal } from "lucide-react"

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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/primitives/avatar/avatar"
import { Badge } from "@/registry/primitives/badge/badge"
import { Button } from "@/registry/primitives/button/button"
import { Checkbox } from "@/registry/primitives/checkbox/checkbox"
import { Label } from "@/registry/primitives/label/label"
import { ModeToggle } from "@/registry/primitives/mode-toggle/mode-toggle"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/primitives/radio-group/radio-group"
import { Skeleton } from "@/registry/primitives/skeleton/skeleton"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/primitives/tooltip/tooltip"

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-tight">{name}</h2>
      <div className="flex min-h-24 flex-col items-start justify-center gap-4 rounded-xl border bg-card p-6 text-card-foreground">
        {children}
      </div>
    </section>
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
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-10">
        <header className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Component Gallery
            </h1>
            <p className="text-sm text-muted-foreground">
              Batch 1 — 9 new primitives. Every one is token-backed and lives in
              registry/primitives.
            </p>
          </div>
          <ModeToggle />
        </header>

        <div className="grid gap-8 sm:grid-cols-2">
          <Demo name="Tabs">
            <Tabs defaultValue="account" className="w-full">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent
                value="account"
                className="text-sm text-muted-foreground"
              >
                Manage your account settings here.
              </TabsContent>
              <TabsContent
                value="billing"
                className="text-sm text-muted-foreground"
              >
                Update billing and payment methods.
              </TabsContent>
            </Tabs>
          </Demo>

          <Demo name="Accordion">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes — it ships with Radix behavior and ARIA built in.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger>Is it themed?</AccordionTrigger>
                <AccordionContent>
                  Yes — entirely from Layer 0 tokens.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Demo>

          <Demo name="Checkbox & Radio Group">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <RadioGroup defaultValue="monthly">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
              </div>
            </RadioGroup>
          </Demo>

          <Demo name="Avatar & Tooltip">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover me
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
              <AlertDescription>
                This alert uses the default variant.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <Terminal />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something needs attention.</AlertDescription>
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
        </div>

        <Demo name="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "Paid"
                          ? "success"
                          : inv.status === "Pending"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {inv.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>
      </main>
    </TooltipProvider>
  )
}
