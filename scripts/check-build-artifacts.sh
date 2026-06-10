#!/usr/bin/env bash

# Enforce the single-artifact constraint from ADR 0005.
#
# The Familienportal embeds our widget with a plain <script src=.../index.js>
# that loads the bundle directly from object storage as a classic script. Code
# splitting turns that entry into an ES module with a top-level `export`, which
# a classic script cannot parse, so the widget dies on load. The build must
# therefore emit exactly one JS and one CSS file; a stray dynamic import
# silently reintroduces extra chunks, and this check fails the deploy first.

set -o errexit
set -o nounset
set -o pipefail

assets_dir="dist/assets"

count() {
  find "$assets_dir" -maxdepth 1 -name "$1" | wc -l | tr -d ' '
}

js_count=$(count "*.js")
css_count=$(count "*.css")

if [ "$js_count" != "1" ] || [ "$css_count" != "1" ]; then
  echo "::error title=Build artifact structure::Expected exactly one JS and one CSS file in $assets_dir (found ${js_count} JS, ${css_count} CSS). The Familienportal CMS cannot load code-split chunks; see ADR 0005."
  find "$assets_dir" -maxdepth 1 \( -name "*.js" -o -name "*.css" \) | sort
  exit 1
fi

echo "Build artifact structure OK: one JS, one CSS."
