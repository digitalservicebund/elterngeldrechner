#!/usr/bin/env bash
#MISE description="Verify dist/ holds exactly one JS file and no CSS file"

# Enforce the single-artifact constraint from ADR 0005 & ADR 0011.
#
# The Familienportal embeds our widget with a plain <script src=.../index.js>
# that loads the bundle directly from object storage as a classic script. The
# build is an IIFE with its CSS inlined, so the deploy must ship exactly one JS
# file and no CSS file. Code splitting (a stray dynamic import) silently
# reintroduces extra chunks and an ES-module entry the classic script cannot
# parse; a stray CSS file means the CSS stopped being inlined. Either way this
# check fails the deploy first.

set -o errexit
set -o nounset
set -o pipefail

assets_dir="dist/assets"

count() {
  find "$assets_dir" -maxdepth 1 -name "$1" | wc -l | tr -d ' '
}

js_count=$(count "*.js")
css_count=$(count "*.css")

if [ "$js_count" != "1" ] || [ "$css_count" != "0" ]; then
  echo "::error title=Build artifact structure::Expected exactly one JS and no CSS file in $assets_dir (found ${js_count} JS, ${css_count} CSS). The Familienportal CMS cannot load code-split chunks; CSS must stay inlined in the IIFE bundle. See ADR 0005 / ADR 0011."
  find "$assets_dir" -maxdepth 1 \( -name "*.js" -o -name "*.css" \) | sort
  exit 1
fi

echo "Build artifact structure OK: one JS, no CSS (inlined)."
