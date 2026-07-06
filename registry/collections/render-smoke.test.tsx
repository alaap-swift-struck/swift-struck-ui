// Render-smoke for the display / wrapper collections — each mounts with valid
// minimal props/config and shows its content. Cheap insurance that a refactor or
// dependency bump didn't break a render path. Interaction-heavy collections have
// their own *.test.tsx; this file is breadth. Run: `npm test`.

import type { ReactElement } from "react"

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  ActivityFeed,
  defaultActivityFeedConfig,
} from "./activity-feed/activity-feed"
import { CardGrid } from "./card-grid/card-grid"
import { CopilotOverlay } from "./copilot-overlay/copilot-overlay"
import { DataPreviewTable } from "./data-preview-table/data-preview-table"
import {
  DescriptionList,
  defaultDescriptionListConfig,
} from "./description-list/description-list"
import { DetailView, defaultDetailViewConfig } from "./detail-view/detail-view"
import { Kanban, defaultKanbanConfig } from "./kanban/kanban"
import { List } from "./list/list"
import { ProgressDashboard } from "./progress-dashboard/progress-dashboard"
import {
  RecordDetail,
  defaultRecordDetailConfig,
} from "./record-detail/record-detail"
import { RunSteps } from "./run-steps/run-steps"
import { StatGrid, defaultStatGridConfig } from "./stat-grid/stat-grid"

const cases: [string, () => ReactElement, string][] = [
  [
    "StatGrid",
    () => (
      <StatGrid
        items={[
          {
            id: "1",
            label: "Revenue",
            value: "$10.2k",
            delta: "+5%",
            trend: "up",
          },
        ]}
        config={defaultStatGridConfig}
      />
    ),
    "Revenue",
  ],
  [
    "DetailView",
    () => (
      <DetailView
        record={{ name: "Ada Lovelace" }}
        config={{
          ...defaultDetailViewConfig,
          fields: [{ key: "name", label: "Name", type: "text" }],
        }}
      />
    ),
    "Ada Lovelace",
  ],
  [
    "Kanban",
    () => (
      <Kanban
        data={[{ id: "1", title: "Task A", status: "open" }]}
        onDataChange={() => {}}
        config={{
          ...defaultKanbanConfig,
          columns: [{ value: "open", label: "Open" }],
        }}
      />
    ),
    "Task A",
  ],
  [
    "ActivityFeed",
    () => (
      <ActivityFeed
        items={[{ id: "1", description: "Created the team" }]}
        config={defaultActivityFeedConfig}
      />
    ),
    "Created the team",
  ],
  [
    "DescriptionList",
    () => (
      <DescriptionList
        items={[{ label: "Role", value: "Admin" }]}
        config={defaultDescriptionListConfig}
      />
    ),
    "Admin",
  ],
  [
    "RecordDetail",
    () => (
      <RecordDetail title="Ada Lovelace" config={defaultRecordDetailConfig}>
        <p>body</p>
      </RecordDetail>
    ),
    "Ada Lovelace",
  ],
  [
    "RunSteps",
    () => <RunSteps steps={[{ label: "Import rows", status: "done" }]} />,
    "Import rows",
  ],
  [
    "DataPreviewTable",
    () => (
      <DataPreviewTable columns={["Name"]} rows={[["Ada"]]} totalCount={1} />
    ),
    "Ada",
  ],
  [
    "CopilotOverlay",
    () => (
      <CopilotOverlay
        active
        steps={[{ label: "Working on it" }]}
        currentIndex={0}
        onStop={() => {}}
      />
    ),
    "Working on it",
  ],
  ["List", () => <List items={[{ id: "1", title: "A row" }]} />, "A row"],
  [
    "CardGrid",
    () => <CardGrid items={[{ id: "1", title: "A card" }]} />,
    "A card",
  ],
  [
    "ProgressDashboard",
    () => (
      <ProgressDashboard
        members={[{ id: "u1", name: "Ada" }]}
        items={[{ id: "i1", label: "Welcome" }]}
        done={[]}
      />
    ),
    "Welcome",
  ],
]

describe("display collections render without crashing", () => {
  it.each(cases)("%s renders its content", (_name, make, expected) => {
    const { container } = render(make())
    expect(container.textContent).toContain(expected)
  })
})
