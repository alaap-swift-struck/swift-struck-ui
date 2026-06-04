"use client"

import * as React from "react"
import { LayoutGrid, Plus, Rocket } from "lucide-react"

import { Badge } from "@/registry/primitives/badge/badge"
import { Button } from "@/registry/primitives/button/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/primitives/card/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/primitives/dialog/dialog"
import { Input } from "@/registry/primitives/input/input"
import { Label } from "@/registry/primitives/label/label"
import { ModeToggle } from "@/registry/primitives/mode-toggle/mode-toggle"
import { Switch } from "@/registry/primitives/switch/switch"
import { CardGrid } from "@/registry/collections/card-grid/card-grid"
import { List, type ListItem } from "@/registry/collections/list/list"

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
      {initials}
    </div>
  )
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string
  kicker: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {kicker}
        </span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  )
}

const team: ListItem[] = [
  {
    id: "1",
    title: "Ada Lovelace",
    subtitle: "Engineering · Online",
    leading: <Avatar name="Ada Lovelace" />,
    trailing: <Badge variant="success">Active</Badge>,
  },
  {
    id: "2",
    title: "Grace Hopper",
    subtitle: "Design · Away",
    leading: <Avatar name="Grace Hopper" />,
    trailing: <Badge variant="warning">Away</Badge>,
  },
  {
    id: "3",
    title: "Alan Turing",
    subtitle: "Research · Offline",
    leading: <Avatar name="Alan Turing" />,
    trailing: <Badge variant="secondary">Offline</Badge>,
  },
]

const templates = [
  {
    id: "a",
    title: "CRM Starter",
    description: "Contacts, deals, and a pipeline board.",
    footer: (
      <>
        <Badge variant="secondary">8 screens</Badge>
        <Badge variant="outline">Kanban</Badge>
      </>
    ),
  },
  {
    id: "b",
    title: "Field Inspector",
    description: "Offline-first checklists with photo capture.",
    footer: (
      <>
        <Badge variant="secondary">5 screens</Badge>
        <Badge variant="outline">Forms</Badge>
      </>
    ),
  },
  {
    id: "c",
    title: "Event Hub",
    description: "Agenda, speakers, and a live feed.",
    footer: (
      <>
        <Badge variant="secondary">6 screens</Badge>
        <Badge variant="outline">Calendar</Badge>
      </>
    ),
  },
]

const mediaBlock = (
  <div className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
    <LayoutGrid className="size-6 text-primary/60" />
  </div>
)

export default function Home() {
  const [selected, setSelected] = React.useState<ListItem | null>(null)

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-14 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Phase 1 + a taste of 2 &amp; 3
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">brimba</h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            A live slice to react to. Toggle the theme, click a list row, open
            the dialog. Everything here is built from the layered registry —
            tokens → primitives → collections.
          </p>
        </div>
        <ModeToggle />
      </header>

      <Section kicker="Layer 1" title="Primitives">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              One component, variants instead of new files.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add">
                <Plus />
              </Button>
              <Button>
                <Rocket /> With icon
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Form inputs</CardTitle>
              <CardDescription>Label, Input, and Switch.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify">Email notifications</Label>
                <Switch id="notify" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges &amp; Dialog</CardTitle>
              <CardDescription>Status pills and a modal.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a project</DialogTitle>
                    <DialogDescription>
                      A dialog assembled from Radix + tokens.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project">Project name</Label>
                    <Input id="project" placeholder="Untitled" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Create</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section kicker="Layer 2" title="Collections — the Glide part">
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              <code className="text-foreground">&lt;List&gt;</code> — data in,
              interactive rows out. Click one.
            </p>
            <List items={team} onItemClick={setSelected} />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              <code className="text-foreground">&lt;CardGrid&gt;</code> — the
              same idea, as responsive cards.
            </p>
            <CardGrid
              columns={3}
              items={templates.map((t) => ({ ...t, media: mediaBlock }))}
            />
          </div>
        </div>
      </Section>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.subtitle}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This dialog opened from a <code>&lt;List&gt;</code> row click —
            collection event wired straight into a primitive.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Built from the registry · tokens → primitives → collections ·{" "}
        <code className="text-foreground">npm run guardrails</code> keeps it
        that way.
      </footer>
    </main>
  )
}
