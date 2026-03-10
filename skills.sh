#!/usr/bin/env bash
set -euo pipefail

# RTP Demo Hub codex skills registry.
# Keep this list in sync with CODEX_MEMORY.md and evolve as flows evolve.

SKILLS=(
  "mobile-payments-ui-auditor:Review mobile screens for spacing, hierarchy, CTA clarity, and premium payments UX quality"
  "flow-simplifier-payments:Detect and remove redundant payment and bill-pay steps while keeping optional modules separate"
  "theme-studio-asset-guard:Validate logo rendering, theme-token propagation, and fallback asset behavior"
  "scenario-integrity-checker:Ensure selected scenarios map to correct flow logic without cross-flow contamination"
  "payments-success-state-designer:Standardize processing, success, and receipt UI patterns across journeys"
  "agentic-payments-chat-designer:Enforce structured assistant-led payment UX with cards, chips, and quick actions"
  "mobile-demo-regression-check:Run end-to-end visual and scenario integrity regression checks"
)

if [[ "${1:-}" == "list" || "${1:-}" == "" ]]; then
  printf '%s\n' "${SKILLS[@]}"
  exit 0
fi

printf 'Unknown command: %s\n' "$1" >&2
printf 'Usage: %s [list]\n' "$(basename "$0")" >&2
exit 1
