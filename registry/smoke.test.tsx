// Breadth smoke tests — every listed primitive must mount without throwing with
// minimal props. Cheap insurance that a refactor or dependency bump didn't break
// a component's render path. Targeted behaviour lives in each component's own
// *.test.tsx; this file is purely "does it render". Run: `npm test`.

import type { ReactElement } from "react"

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Alert, AlertDescription, AlertTitle } from "./primitives/alert/alert"
import { Avatar, AvatarFallback } from "./primitives/avatar/avatar"
import { Badge } from "./primitives/badge/badge"
import { Button } from "./primitives/button/button"
import { Card, CardHeader, CardTitle } from "./primitives/card/card"
import { Checkbox } from "./primitives/checkbox/checkbox"
import { Input } from "./primitives/input/input"
import { Label } from "./primitives/label/label"
import { ProgressToggle } from "./primitives/progress-toggle/progress-toggle"
import { Separator } from "./primitives/separator/separator"
import { Skeleton } from "./primitives/skeleton/skeleton"
import { Spinner } from "./primitives/spinner/spinner"
import { Switch } from "./primitives/switch/switch"
import { Textarea } from "./primitives/textarea/textarea"
import { Toggle } from "./primitives/toggle/toggle"
import { Headline, Hint, Text } from "./primitives/typography/typography"

const cases: [string, () => ReactElement][] = [
  ["Button", () => <Button>Go</Button>],
  ["Badge", () => <Badge>New</Badge>],
  ["Spinner", () => <Spinner />],
  ["Input", () => <Input placeholder="x" />],
  ["Textarea", () => <Textarea />],
  ["Switch", () => <Switch />],
  ["Checkbox", () => <Checkbox />],
  ["Label", () => <Label>Name</Label>],
  ["Separator", () => <Separator />],
  ["Skeleton", () => <Skeleton />],
  [
    "Avatar",
    () => (
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    ),
  ],
  ["Toggle", () => <Toggle>B</Toggle>],
  ["ProgressToggle", () => <ProgressToggle done={false} onToggle={() => {}} />],
  [
    "Typography",
    () => (
      <>
        <Headline>H</Headline>
        <Text>body</Text>
        <Hint>hint</Hint>
      </>
    ),
  ],
  [
    "Alert",
    () => (
      <Alert>
        <AlertTitle>T</AlertTitle>
        <AlertDescription>D</AlertDescription>
      </Alert>
    ),
  ],
  [
    "Card",
    () => (
      <Card>
        <CardHeader>
          <CardTitle>T</CardTitle>
        </CardHeader>
      </Card>
    ),
  ],
]

describe("primitives render without crashing", () => {
  it.each(cases)("%s mounts", (_name, make) => {
    const { container } = render(make())
    expect(container.firstChild).toBeTruthy()
  })
})
