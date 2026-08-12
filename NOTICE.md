# Notices and third-party licences

Swift Struck UI is released under the [MIT Licence](LICENSE),
© 2026 Swift Struck. This file records what it is built on and what obligations
travel with it, because MIT-derived work must carry its notices forward.

## Derivation

The Layer 1 primitives are **derived from [shadcn/ui](https://ui.shadcn.com)**
(MIT, © shadcn), which is itself a copy-in pattern library rather than a
dependency: its source was adapted into `registry/primitives/`. The MIT licence
requires that its copyright notice and permission notice travel with derived
work, which is what this section does.

The Layer 2 collections are original, though their configuration model is
**inspired by [Glide](https://www.glideapps.com)**. Inspiration is not
derivation — no Glide code is present and no Glide licence applies.

## Runtime dependencies

Everything shipped to a consumer, grouped by licence. Regenerate with:

```bash
node -e "const p=require('./package.json');for(const d of Object.keys(p.dependencies)){console.log(require('./node_modules/'+d+'/package.json').license, d)}"
```

| Licence             | Count | Packages                                                                                       |
| ------------------- | ----: | ---------------------------------------------------------------------------------------------- |
| MIT                 |    29 | all `@radix-ui/react-*`, `clsx`, `cmdk`, `next-themes`, `recharts`, `sonner`, `tailwind-merge` |
| Apache-2.0          |     1 | `class-variance-authority`                                                                     |
| BSD-2-Clause        |     1 | `leaflet`                                                                                      |
| ISC                 |     1 | `lucide-react`                                                                                 |
| **Hippocratic-2.1** |     1 | `react-leaflet`                                                                                |

### Read this one before you redistribute

**`react-leaflet` is licensed under the Hippocratic Licence 2.1**, which is _not_
an OSI-approved open-source licence: it adds ethical-use restrictions that MIT
does not have, and it is a `dependencies` entry, so anyone installing
`@swift-struck/ui` receives it.

If that is a problem for a consumer — some organisations' legal review rejects
non-OSI licences outright — the practical options are:

1. Only the `Map` component uses it. A consumer who does not render a map never
   loads it, but still installs it.
2. Moving `react-leaflet` and `leaflet` to `peerDependencies` (optional) would
   push the choice to the consumer. This has not been done; it is a real,
   unmade decision, recorded here so nobody assumes it was considered and settled.

## Development-only dependencies

`devDependencies` are not shipped — `package.json` `files` limits the published
tree to `styles.css`, `registry`, `lib`, `registry.json` and `README.md`, and
excludes every `*.test.*`. Their licences therefore create no obligation for
consumers.

## Fonts

Inter is loaded through `next/font` in the showcase harness only (`www/`), which
is not shipped to consumers. Inter is licensed under the SIL Open Font Licence 1.1.
