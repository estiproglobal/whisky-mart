# CLAUDE.md

Guidance for agents working in this repository. For full context see
`Project_Context.md`, `Current_Task.md`, `Handoff.md`, and `DEFERRED.md`.

## Project

WhiskyMart is a premium whisky storefront: a pnpm + Turborepo monorepo with a
Next.js 15 (App Router) app in `apps/web` and shared domain types in
`packages/types`. The data, payments, content, and AI layers are interface-first
(in-memory/mock today, swappable for real backends later: see `DEFERRED.md`).

## Commands

```bash
pnpm install
pnpm typecheck        # tsc --noEmit across the workspace
pnpm lint             # next lint
pnpm test             # vitest
pnpm build            # production build (51 static pages)
```

In this sandbox, `turbo build` does not forward `NODE_EXTRA_CA_CERTS`, so
`next/font` fails TLS. Build the web app directly instead:

```bash
cd apps/web && NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt npx next build
```

## Writing & copy conventions

**Never use em-dashes (the `U+2014` glyph). Anywhere.** Not in UI copy, product
or editorial content, code comments, JSDoc, Markdown docs, commit messages, or
PR text. This is a hard rule for the project. (This file deliberately refers to
the character by its codepoint so the repo stays free of the literal glyph.)

Use the punctuation the sentence actually needs instead:

- **Colon (`:`)** to introduce an elaboration, list, or definition
  ("Smoky, peaty and maritime: the malts of Scotland's whisky island").
- **Comma (`,`)** for an appositive or a mid-sentence aside.
- **Parentheses (`(...)`)** for an inline aside that could be lifted out
  ("the islands (Skye, Orkney, Arran and more) produce coastal malts").
- **Semicolon (`;`)** to join two closely related independent clauses
  ("decanted from the same stock we sell; what you taste is what you'll pour").
- **Period (`.`)** to split into two sentences when the break is strong.

En-dashes (`–`, U+2013) are acceptable **only** in numeric ranges
("1–2 working days", "0–100"). Hyphens (`-`) are for compound words as normal.

Before committing, check that no em-dash slipped in (the command matches by
codepoint, so it contains no literal glyph itself):

```bash
rg "\u{2014}" -g '!node_modules' -g '!.next' .
# or with GNU grep:
LC_ALL=C.UTF-8 grep -rnP "\x{2014}" --include='*.ts' --include='*.tsx' \
  --include='*.mjs' --include='*.md' --include='*.json' .
```

## Other conventions

- Match the surrounding code's style, naming, and comment density.
- Keep changes interface-first; do not change checkout, payment, compliance, or
  data contracts unless the task requires it.
- Run typecheck, lint, test, and build before pushing; keep them all green.
