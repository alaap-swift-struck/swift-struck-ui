/**
 * Guardrails that physically enforce brimba's layering. Run with
 * `npm run guardrails`. The build is meant to FAIL if any of these are
 * violated — that is the whole point. See ARCHITECTURE.md for the rationale.
 *
 * Allowed dependency direction (one way only):
 *
 *   tokens  →  primitives  →  collections
 *
 * i.e. collections may use primitives; primitives may NOT reach back into
 * collections; nothing in the library may depend on the docs/app harness.
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "Circular dependencies are the seed of unmaintainable growth.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "primitives-stay-below-collections",
      comment:
        "A primitive (layer 1) must never import a collection (layer 2). " +
        "If a primitive needs collection behavior, the abstraction is wrong.",
      severity: "error",
      from: { path: "^registry/primitives" },
      to: { path: "^registry/collections" },
    },
    {
      name: "tokens-import-nothing",
      comment:
        "Tokens (layer 0) are the root of the graph and import no components.",
      severity: "error",
      from: { path: "^registry/tokens" },
      to: { path: "^registry/(primitives|collections)" },
    },
    {
      name: "library-never-imports-harness",
      comment:
        "registry/ and lib/ are the shippable library. They must never depend " +
        "on app/ (the docs + showcase harness), or copy-in distribution breaks.",
      severity: "error",
      from: { path: "^(registry|lib)/" },
      to: { path: "^app/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  },
}
