"use client"

// Chart — one config-driven chart that covers the common spreadsheet types
// (bar, line, area, pie/donut, radar, radial) with multiple comparative series,
// stacking, a themed tooltip, optional grid/axes/legend/data-labels, smoothing,
// donut hole, and an entrance animation. Drive everything from `config`.
//
// Built on Recharts. Colours accept a theme token ("chart-1".."chart-5") or any
// CSS colour. Designed to headline dashboards.

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

/* ------------------------------- config ------------------------------- */

export type ChartType = "bar" | "line" | "area" | "pie" | "radar" | "radial"

export interface ChartSeries {
  /** Data field this series reads. */
  key: string
  /** Legend / tooltip label. */
  label: string
  /** A theme token ("chart-1".."chart-5") or any CSS colour. */
  color: string
}

/** Every field is required on purpose — see ARCHITECTURE.md "Configuration". */
export interface ChartConfig {
  type: ChartType
  /** Category / x-axis field (also the slice-name field for pie/radial). */
  xKey: string
  /** One or more series — more than one gives a comparative chart. */
  series: ChartSeries[]
  /** Stack bars / areas instead of grouping them. */
  stacked: boolean
  showLegend: boolean
  showGrid: boolean
  showTooltip: boolean
  showXAxis: boolean
  showYAxis: boolean
  /** Print each value on the chart. */
  showDataLabels: boolean
  /** Smooth (monotone) lines & areas instead of straight segments. */
  curved: boolean
  /** Show point dots on line / area series. */
  showDots: boolean
  /** Fill opacity for bars & areas (0–1). */
  fillOpacity: number
  /** Donut hole / radial inner radius in px (0 = solid pie). */
  innerRadius: number
  /** Play the entrance animation. */
  animate: boolean
  /** Chart height in px. */
  height: number
}

export const defaultChartConfig: ChartConfig = {
  type: "bar",
  xKey: "label",
  series: [{ key: "value", label: "Value", color: "chart-1" }],
  stacked: false,
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  showXAxis: true,
  showYAxis: true,
  showDataLabels: false,
  curved: true,
  showDots: false,
  fillOpacity: 1,
  innerRadius: 0,
  animate: true,
  height: 300,
}

/* ------------------------------ component ------------------------------ */

// Palette for single-series, multi-slice charts (pie / radial).
const SLICE = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

// A glassy, on-theme replacement for Recharts' default tooltip.
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string }>
  label?: React.ReactNode
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass min-w-32 rounded-lg border px-3 py-2 text-xs shadow-lg">
      {label != null && label !== "" && (
        <div className="mb-1.5 font-medium text-foreground">{label}</div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-medium text-foreground tabular-nums">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export interface ChartProps<T extends Record<string, unknown>> {
  data: T[]
  config: ChartConfig
  className?: string
}

const TOKENS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

function Chart<T extends Record<string, unknown>>({
  data,
  config,
  className,
}: ChartProps<T>) {
  // Recharts sets fill/stroke as SVG attributes, where `var(--…)` does NOT
  // resolve. So read the tokens' real values from CSS and re-read on theme
  // change. Resolved after mount → first render matches SSR (no mismatch).
  const { resolvedTheme } = useTheme()
  const [palette, setPalette] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    for (const t of TOKENS) next[t] = cs.getPropertyValue(`--${t}`).trim()
    setPalette(next)
  }, [resolvedTheme])

  // Measure the container ourselves (ResponsiveContainer mis-measures inside
  // some flex/grid + animated layouts) and pass explicit pixel dimensions.
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver((entries) =>
      setWidth(Math.round(entries[0].contentRect.width))
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // token → real colour (falls back to the var() until resolved); raw CSS
  // colours pass straight through.
  const resolve = (c: string) =>
    /^chart-[1-5]$/.test(c) ? palette[c] || `var(--color-${c})` : c

  const anim = config.animate
  const animationDuration = 800
  const tick = { fill: "var(--color-muted-foreground)", fontSize: 12 }
  const axis = { tickLine: false, axisLine: false, tick }

  const grid = config.showGrid ? (
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--color-border)"
      vertical={false}
    />
  ) : null
  const tooltip = config.showTooltip ? (
    <Tooltip
      content={<ChartTooltip />}
      cursor={{ fill: "var(--color-muted)", opacity: 0.35 }}
    />
  ) : null
  const legend = config.showLegend ? (
    <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
  ) : null

  let chart: React.ReactElement

  if (config.type === "bar") {
    chart = (
      <BarChart data={data}>
        {grid}
        {config.showXAxis && <XAxis dataKey={config.xKey} {...axis} />}
        {config.showYAxis && <YAxis {...axis} width={40} />}
        {tooltip}
        {legend}
        {config.series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={resolve(s.color)}
            fillOpacity={config.fillOpacity}
            radius={config.stacked ? 0 : [6, 6, 0, 0]}
            stackId={config.stacked ? "stack" : undefined}
            isAnimationActive={anim}
            animationDuration={animationDuration}
          >
            {config.showDataLabels && (
              <LabelList
                dataKey={s.key}
                position="top"
                fill="var(--color-muted-foreground)"
                fontSize={11}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    )
  } else if (config.type === "line") {
    chart = (
      <LineChart data={data}>
        {grid}
        {config.showXAxis && <XAxis dataKey={config.xKey} {...axis} />}
        {config.showYAxis && <YAxis {...axis} width={40} />}
        {tooltip}
        {legend}
        {config.series.map((s) => (
          <Line
            key={s.key}
            type={config.curved ? "monotone" : "linear"}
            dataKey={s.key}
            name={s.label}
            stroke={resolve(s.color)}
            strokeWidth={2}
            dot={config.showDots}
            isAnimationActive={anim}
            animationDuration={animationDuration}
          >
            {config.showDataLabels && (
              <LabelList
                dataKey={s.key}
                position="top"
                fill="var(--color-muted-foreground)"
                fontSize={11}
              />
            )}
          </Line>
        ))}
      </LineChart>
    )
  } else if (config.type === "area") {
    chart = (
      <AreaChart data={data}>
        <defs>
          {config.series.map((s) => (
            <linearGradient
              key={s.key}
              id={`fill-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={resolve(s.color)}
                stopOpacity={0.7}
              />
              <stop
                offset="95%"
                stopColor={resolve(s.color)}
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
        </defs>
        {grid}
        {config.showXAxis && <XAxis dataKey={config.xKey} {...axis} />}
        {config.showYAxis && <YAxis {...axis} width={40} />}
        {tooltip}
        {legend}
        {config.series.map((s) => (
          <Area
            key={s.key}
            type={config.curved ? "monotone" : "linear"}
            dataKey={s.key}
            name={s.label}
            stroke={resolve(s.color)}
            strokeWidth={2}
            fill={`url(#fill-${s.key})`}
            fillOpacity={config.fillOpacity}
            dot={config.showDots}
            stackId={config.stacked ? "stack" : undefined}
            isAnimationActive={anim}
            animationDuration={animationDuration}
          />
        ))}
      </AreaChart>
    )
  } else if (config.type === "pie") {
    const valueKey = config.series[0]?.key ?? "value"
    chart = (
      <PieChart>
        {tooltip}
        {legend}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={config.xKey}
          innerRadius={config.innerRadius}
          paddingAngle={config.innerRadius > 0 ? 2 : 0}
          isAnimationActive={anim}
          animationDuration={animationDuration}
          label={
            config.showDataLabels
              ? { fill: "var(--color-muted-foreground)", fontSize: 11 }
              : false
          }
        >
          {data.map((_, i) => (
            <Cell key={i} fill={resolve(SLICE[i % SLICE.length])} />
          ))}
        </Pie>
      </PieChart>
    )
  } else if (config.type === "radar") {
    chart = (
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey={config.xKey} tick={tick} />
        {tooltip}
        {legend}
        {config.series.map((s) => (
          <Radar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stroke={resolve(s.color)}
            fill={resolve(s.color)}
            fillOpacity={config.fillOpacity * 0.5}
            isAnimationActive={anim}
            animationDuration={animationDuration}
          />
        ))}
      </RadarChart>
    )
  } else {
    // radial
    const valueKey = config.series[0]?.key ?? "value"
    chart = (
      <RadialBarChart
        data={data}
        innerRadius={Math.max(config.innerRadius, 20)}
        outerRadius="100%"
      >
        {tooltip}
        {legend}
        <RadialBar
          dataKey={valueKey}
          background
          isAnimationActive={anim}
          animationDuration={animationDuration}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={resolve(SLICE[i % SLICE.length])} />
          ))}
        </RadialBar>
      </RadialBarChart>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{ height: config.height }}
    >
      {width > 0 &&
        React.cloneElement(
          chart as React.ReactElement<{ width: number; height: number }>,
          { width, height: config.height }
        )}
    </div>
  )
}

export { Chart }
