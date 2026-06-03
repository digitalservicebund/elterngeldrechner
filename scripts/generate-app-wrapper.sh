#!/usr/bin/env bash

# Generate the Familienportal host page (the "app wrapper") snapshot.
#
# Fetches and cleans a snapshot of the live Familienportal chrome that the
# Elterngeldrechner widget is embedded into, writing it to the gitignored
# wrapper directory where the Vite plugin looks for it.
#
# Requires wget.

set -o errexit
set -o nounset
set -o pipefail

# Edit index.html in place portably: BSD (macOS) and GNU sed disagree on the
# -i flag, so route through a temp file using only the common -e syntax.
edit_html() {
  sed "$@" index.html > index.html.edited && mv index.html.edited index.html
}

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cache_directory="${repo_root}/.app-wrapper"
target_directory="${cache_directory}/wrapper"

# Skip the fetch when a snapshot already exists, so `npm start` and the e2e
# build can call this unconditionally on every run. Pass --force to refresh
# against the live page.
if [ "${1:-}" != "--force" ] && [ -f "${target_directory}/index.html" ]; then
  echo "App wrapper snapshot already present; skipping fetch (--force to refresh)."
  exit 0
fi

# Work in a temporary directory beside the cache and only swap it into place
# once the fetch has been validated, so a failed or partial fetch can never
# poison the snapshot the build reads. The temp dir shares a filesystem with
# the target, so the final move is an atomic rename.
mkdir -p "${cache_directory}"
work_dir="$(mktemp -d "${cache_directory}/.tmp.XXXXXX")"
trap 'rm -rf "${work_dir}"' EXIT
cd "${work_dir}"

# Fetch the live host webpage with its requisites. Modest retries and a
# timeout so an unresponsive host fails quickly instead of hanging.
wget \
  --tries=3 \
  --timeout=30 \
  --retry-connrefused \
  --page-requisites \
  --convert-links \
  --span-hosts \
  --no-directories \
  --execute robots=off \
  --adjust-extension \
  "https://familienportal.de/familienportal/meta/egr"

mv egr.html index.html

# Remove the live widget assets and their references; the build injects its
# own freshly built bundle in their place via the Vite plugin.
rm index.js index.css
edit_html \
  -e 's#<script src="index.js" ></script>##' \
  -e 's#<link rel="stylesheet" href="index.css" >##'

# Make the SVG sprite self-contained by fetching it next to the page.
sprite_path=$(grep -o "/resource/crblob/.*/sprite-svg-data.svg" index.html)
sprite_url="https://familienportal.de${sprite_path}"
wget "${sprite_url}"
edit_html -e "s#/resource/crblob/.*/sprite-svg-data.svg#sprite-svg-data.svg#"

# Disable Matomo tracking in the snapshot.
edit_html -e "s#window\.initMatomo();#/* tracking disabled */#"

# Validate we fetched the real host page and not an error, redirect or WAF
# challenge page: the widget's mount point must be present.
if ! grep -q 'id="egr-root"' index.html; then
  echo "Error: fetched page is missing the #egr-root mount point." >&2
  echo "familienportal.de may be down or its markup may have changed." >&2
  exit 1
fi

# Atomically replace the snapshot with the validated fetch.
cd "${repo_root}"
rm -rf "${target_directory}"
mv "${work_dir}" "${target_directory}"
trap - EXIT

echo "Wrapper snapshot written to ${target_directory}"
