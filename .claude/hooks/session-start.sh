#!/bin/bash
# Облачная сессия стартует с чистого контейнера: ставим Vercel CLI, если его нет.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
command -v vercel >/dev/null 2>&1 || npm i -g vercel@latest >/dev/null 2>&1 || echo "vercel CLI install failed" >&2
