#!/usr/bin/env bash
# Copy audit for the Increment 12B humanization rules (Part 6).
# Run from apps/web. Exits non-zero if a banned pattern is found in
# user-facing source. See CLAUDE.md for the em-dash rule.
set -uo pipefail

fail=0

echo "== em-dash (U+2014): banned everywhere =="
# Built from the codepoint so this script never contains the glyph itself.
# Scans the whole repo (git toplevel, not ".." which is only apps/). The
# three owner-authored planning documents at the root predate this audit and
# carry em-dashes the owner has not asked to purge; they are excluded from
# the failing condition but anything new fails the audit.
EMDASH=$(printf '\u2014')
ROOT=$(git rev-parse --show-toplevel)
if rg -n "$EMDASH" --glob '!node_modules' --glob '!.next' \
  --glob '!STRATEGY.md' --glob '!PATH_B_PLAN.md' --glob '!CLAUDE_CODE_PROMPT_Increment12B.md' \
  "$ROOT"; then fail=1; else echo "clean"; fi

echo
echo "== ban list (marketing copy) =="
# "curated" is allowed at most once sitewide; flag every occurrence for review.
BANNED='beautifully judged|exceptional|elevate|journey|seamless|the moment it was made for|stands as|testament|curated'
if rg -in "$BANNED" app components lib/content lib/catalog/seed.ts lib/i18n/messages.ts lib/home.ts; then
  echo "(review each hit: 'curated' may appear at most once sitewide)"; fail=1
else
  echo "clean"
fi

echo
echo "== colon-splice glue candidates (list + colon openers) =="
# Heuristic: "Word, word and word:" or short fragment chains before a colon.
rg -n "[a-z]+, [a-z]+(,| and) [a-z]+\. We|[A-Z][a-z]+, [a-z]+, [a-z]+\." app components lib/content lib/i18n || echo "clean"

exit $fail
