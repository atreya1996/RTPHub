#!/usr/bin/env bash
set -euo pipefail

# Installs RTP demo skills into: ${CODEX_HOME:-$HOME/.codex}/skills
# Usage:
#   ./skills.sh            # install/update all skills (idempotent)
#   ./skills.sh --list     # show install status for managed skills
#   CODEX_HOME=/path ./skills.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
INSTALL_ROOT="${DEFAULT_CODEX_HOME}/skills"

SKILLS=(
  "mobile-payments-ui-auditor"
  "flow-simplifier-payments"
  "theme-studio-asset-guard"
  "scenario-integrity-checker"
  "payments-success-state-designer"
  "agentic-payments-chat-designer"
  "mobile-demo-regression-check"
)

skill_description() {
  case "$1" in
    mobile-payments-ui-auditor)
      printf '%s\n' "Review mobile payment screens for hierarchy, spacing, CTA clarity, and premium UX quality." ;;
    flow-simplifier-payments)
      printf '%s\n' "Detect and remove redundant payment/bill-pay steps while preserving optional modules." ;;
    theme-studio-asset-guard)
      printf '%s\n' "Validate logo rendering, theme-token propagation, and fallback asset behavior." ;;
    scenario-integrity-checker)
      printf '%s\n' "Ensure selected scenarios map to correct flow logic without cross-flow contamination." ;;
    payments-success-state-designer)
      printf '%s\n' "Standardize processing, success, and receipt UI patterns across payment journeys." ;;
    agentic-payments-chat-designer)
      printf '%s\n' "Enforce assistant-led payment UX with cards, chips, and quick actions." ;;
    mobile-demo-regression-check)
      printf '%s\n' "Run end-to-end visual and scenario integrity regression checks for mobile demos." ;;
    *)
      return 1 ;;
  esac
}

write_skill() {
  local skill_name="$1"
  local skill_dir="${INSTALL_ROOT}/${skill_name}"
  local skill_file="${skill_dir}/SKILL.md"

  mkdir -p "${skill_dir}"
  cat > "${skill_file}" <<SKILL
# ${skill_name}

## Purpose
$(skill_description "${skill_name}")

## Usage
Use this skill when working on RTP demo payment experiences that need this specialty focus.

## Source
Installed from repository script: ${SCRIPT_DIR}/skills.sh
SKILL
}

list_status() {
  printf 'Install root: %s\n' "${INSTALL_ROOT}"
  for skill in "${SKILLS[@]}"; do
    if [[ -f "${INSTALL_ROOT}/${skill}/SKILL.md" ]]; then
      printf '[installed] %s\n' "${skill}"
    else
      printf '[missing]   %s\n' "${skill}"
    fi
  done
}

install_all() {
  mkdir -p "${INSTALL_ROOT}"
  for skill in "${SKILLS[@]}"; do
    write_skill "${skill}"
    printf 'Installed/updated: %s\n' "${skill}"
  done

  printf '\nDone. Skills are available under: %s\n' "${INSTALL_ROOT}"
  printf 'Tip: run "%s --list" to verify installation status.\n' "$(basename "$0")"
}

case "${1:-}" in
  ""|"--install"|"install")
    install_all
    ;;
  "--list"|"list")
    list_status
    ;;
  *)
    printf 'Unknown command: %s\n' "${1}" >&2
    printf 'Usage: %s [--install|--list]\n' "$(basename "$0")" >&2
    exit 1
    ;;
esac
