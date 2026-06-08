# Layer 1 — Primitives

The shadcn-style atoms: Button, Input, Label, Dialog, Select, Checkbox, and the
~15–20 building blocks that 90% of every app is made of. Built on Radix UI for
behavior/accessibility and styled entirely with tokens via CVA.

## Rules

- **Compose from tokens only.** No hardcoded colors or sizes — use Tailwind
  utilities that resolve to [Layer 0](../tokens/README.md).
- **Never import a collection.** Primitives sit below collections in the graph.
  (`npm run guardrails` enforces this.)
- **Variants, not new components.** A different-looking button is a CVA variant
  on `Button`, not a new `FancyButton.tsx`. This rule is what keeps the library
  from ballooning. See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Shape of a primitive

Each primitive is one folder, co-located with its docs:

```
registry/primitives/button/
  button.tsx        # the component + its CVA variants
  button.mdx        # docs + live examples (definition of done)
```

_Populated in Phase 2._
