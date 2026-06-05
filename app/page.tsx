"use client"

import * as React from "react"
import Link from "next/link"
import { Car, Coffee, CreditCard, ShoppingCart, TrendingUp } from "lucide-react"

import { Badge } from "@/registry/primitives/badge/badge"
import { Button } from "@/registry/primitives/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/primitives/card/card"
import { Label } from "@/registry/primitives/label/label"
import { ModeToggle } from "@/registry/primitives/mode-toggle/mode-toggle"
import { Progress } from "@/registry/primitives/progress/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/primitives/select/select"
import { Separator } from "@/registry/primitives/separator/separator"
import { Slider } from "@/registry/primitives/slider/slider"
import { Textarea } from "@/registry/primitives/textarea/textarea"
import { List, type ListItem } from "@/registry/collections/list/list"

const contributions = [
  { month: "Dec", amount: 3200 },
  { month: "Jan", amount: 4100 },
  { month: "Feb", amount: 3500 },
  { month: "Mar", amount: 5200 },
  { month: "Apr", amount: 2800 },
  { month: "May", amount: 5900 },
]
const chartMax = Math.max(...contributions.map((c) => c.amount))

const targets = [
  { label: "Retirement", amount: "$420,000", pct: 65, of: "$273,000" },
  { label: "Real Estate", amount: "$85,000", pct: 32, of: "$27,200" },
]

function TxnIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground [&_svg]:size-4">
      {children}
    </div>
  )
}

const transactions: ListItem[] = [
  {
    id: "1",
    title: "Blue Bottle Coffee",
    subtitle: "Food & Drink",
    leading: (
      <TxnIcon>
        <Coffee />
      </TxnIcon>
    ),
    trailing: <span className="text-sm text-muted-foreground">Today</span>,
  },
  {
    id: "2",
    title: "Whole Foods Market",
    subtitle: "Groceries",
    leading: (
      <TxnIcon>
        <ShoppingCart />
      </TxnIcon>
    ),
    trailing: <span className="text-sm text-muted-foreground">Yesterday</span>,
  },
  {
    id: "3",
    title: "Stripe Payout",
    subtitle: "Income",
    leading: (
      <TxnIcon>
        <CreditCard />
      </TxnIcon>
    ),
    trailing: <Badge variant="success">+ $2,500</Badge>,
  },
  {
    id: "4",
    title: "Uber Technologies",
    subtitle: "Transport",
    leading: (
      <TxnIcon>
        <Car />
      </TxnIcon>
    ),
    trailing: <span className="text-sm text-muted-foreground">Oct 11</span>,
  },
]

export default function Home() {
  const [amount, setAmount] = React.useState(2500)

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="animate-rise flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Demo dashboard · built from the registry
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">brimba</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/components">Components →</Link>
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="animate-rise grid gap-4 lg:grid-cols-3">
        {/* Contribution history — CSS bar chart using the chart-2 (amber) token */}
        <Card className="hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle>Contribution History</CardTitle>
            <CardDescription>Last 6 months of activity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex h-40 gap-3">
              {contributions.map((c) => (
                <div
                  key={c.month}
                  className="group/bar flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="relative w-full rounded-t-md bg-chart-2/70 transition-all duration-300 group-hover/bar:bg-chart-2"
                    style={{ height: `${(c.amount / chartMax) * 100}%` }}
                  >
                    {/* value-on-hover tooltip */}
                    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md border bg-popover px-2 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-all duration-200 group-hover/bar:translate-y-0 group-hover/bar:opacity-100">
                      ${c.amount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {c.month}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-success" />
              Trending up 12% vs. the prior period
            </div>
          </CardContent>
        </Card>

        {/* Payout threshold — Select + Slider + Textarea + Button */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle>Payout Threshold</CardTitle>
            <CardDescription>
              Minimum balance before a payout triggers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Preferred Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US Dollar</SelectItem>
                  <SelectItem value="eur">EUR — Euro</SelectItem>
                  <SelectItem value="gbp">GBP — British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Minimum Payout</Label>
                <span className="text-lg font-semibold tabular-nums">
                  ${amount.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[amount]}
                min={50}
                max={10000}
                step={50}
                onValueChange={([v]) => setAmount(v)}
              />
            </div>

            <Textarea placeholder="Add any notes for this payout…" />
            <Button className="w-full">Save Threshold</Button>
          </CardContent>
        </Card>
      </div>

      <div className="animate-rise grid gap-4 lg:grid-cols-3">
        {/* Savings targets — Progress stats */}
        <Card className="hover-lift">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Savings Targets</CardTitle>
              <CardDescription>Active milestones for 2024</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              New Goal
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {targets.map((t) => (
              <div key={t.label} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs tracking-wide text-muted-foreground uppercase">
                    {t.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.of}</span>
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {t.amount}
                </div>
                <Progress value={t.pct} />
                <span className="text-xs text-muted-foreground">
                  {t.pct}% achieved
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent transactions — the List collection */}
        <Card className="hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <List
              items={transactions}
              className="hover-lift-none border-0 bg-transparent shadow-none"
            />
          </CardContent>
        </Card>
      </div>

      <footer className="border-t pt-5 text-sm text-muted-foreground">
        Same components, new theme — a single token edit re-skinned everything.
        tokens → primitives → collections ·{" "}
        <code className="text-foreground">npm run guardrails</code> keeps the
        layers honest.
      </footer>
    </main>
  )
}
