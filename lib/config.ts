// =============================================================================
// brimba configuration system — the shared vocabulary every component's
// `config` is built from. See ARCHITECTURE.md "Configuration" + "Taxonomy".
//
// Model: a universal BaseConfig (visibility) sits under every component, then a
// per-category mixin (Field / Action / Collection / Content) adds shared knobs
// for that kind of component, then each component adds its own. Compose with
// intersection types + spreading the matching `defaultXConfig`.
// =============================================================================

/* ----------------------------- visibility rules ---------------------------- */

/** Where a rule reads its value from. */
export type RuleSource = "row" | "user" | "app"

export type RuleOperator =
  | "is"
  | "isNot"
  | "contains"
  | "gt"
  | "lt"
  | "isEmpty"
  | "isNotEmpty"

/** A single condition, e.g. { source:"row", field:"status", op:"is", value:"active" }. */
export interface Rule {
  source: RuleSource
  field: string
  op: RuleOperator
  value: string
}

/** The data a rule is evaluated against (current row, signed-in user, app state). */
export interface VisibilityContext {
  row: Record<string, unknown>
  user: Record<string, unknown>
  app: Record<string, unknown>
}

export const emptyContext: VisibilityContext = { row: {}, user: {}, app: {} }

function evalRule(rule: Rule, ctx: VisibilityContext): boolean {
  const raw = ctx[rule.source]?.[rule.field]
  const s = String(raw ?? "")
  switch (rule.op) {
    case "is":
      return s === rule.value
    case "isNot":
      return s !== rule.value
    case "contains":
      return s.toLowerCase().includes(rule.value.toLowerCase())
    case "gt":
      return Number(raw) > Number(rule.value)
    case "lt":
      return Number(raw) < Number(rule.value)
    case "isEmpty":
      return raw == null || s === ""
    case "isNotEmpty":
      return raw != null && s !== ""
    default:
      return true
  }
}

/** True if the rules pass. No rules → always true. `matchAny` switches AND→OR. */
export function evaluateRules(
  rules: Rule[],
  ctx: VisibilityContext,
  matchAny = false
): boolean {
  if (!rules || rules.length === 0) return true
  return matchAny
    ? rules.some((r) => evalRule(r, ctx))
    : rules.every((r) => evalRule(r, ctx))
}

/* ------------------------------- base config ------------------------------- */

/** On EVERY component. The minimum shared config. */
export interface BaseConfig {
  /** Hard show/hide switch. */
  visible: boolean
  /** Conditional visibility — all must pass (see evaluateRules). */
  visibilityRules: Rule[]
}

export const defaultBaseConfig: BaseConfig = {
  visible: true,
  visibilityRules: [],
}

/* ----------------------------- category configs ---------------------------- */

/** Validation for input fields (null = no limit). */
export interface FieldValidation {
  min: number | null
  max: number | null
  minLength: number | null
  maxLength: number | null
  pattern: string
}

export const defaultFieldValidation: FieldValidation = {
  min: null,
  max: null,
  minLength: null,
  maxLength: null,
  pattern: "",
}

/** Input components (text, number, choice, notes…). */
export interface FieldConfig extends BaseConfig {
  label: string
  helpText: string
  required: boolean
  disabled: boolean
  validation: FieldValidation
}

export const defaultFieldConfig: FieldConfig = {
  ...defaultBaseConfig,
  label: "",
  helpText: "",
  required: false,
  disabled: false,
  validation: { ...defaultFieldValidation },
}

/** Action components — interacting triggers a side-effect. */
export type ActionKind = "none" | "navigate" | "workflow" | "api"

export interface ActionConfig extends BaseConfig {
  action: ActionKind
  /** route / workflow id / endpoint, depending on `action`. */
  target: string
  /** ask the user to confirm before firing. */
  confirm: boolean
}

export const defaultActionConfig: ActionConfig = {
  ...defaultBaseConfig,
  action: "none",
  target: "",
  confirm: false,
}

/** Collection components — data-bound views. `filter`/`sort`/`limit` are
 * DECLARED here and EXECUTED by the data layer (D1/SQL) — the component itself
 * just receives the resulting rows. */
export interface CollectionConfig extends BaseConfig {
  dataSource: string
  filter: Rule[]
  sortBy: string
  sortDir: "asc" | "desc"
  limit: number | null
  searchable: boolean
  emptyText: string
}

export const defaultCollectionConfig: CollectionConfig = {
  ...defaultBaseConfig,
  dataSource: "",
  filter: [],
  sortBy: "",
  sortDir: "asc",
  limit: null,
  searchable: true,
  emptyText: "Nothing here yet.",
}

/** Content components — display data, read-only. */
export interface ContentConfig extends BaseConfig {
  emptyText: string
}

export const defaultContentConfig: ContentConfig = {
  ...defaultBaseConfig,
  emptyText: "",
}
