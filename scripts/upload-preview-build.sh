#!/usr/bin/env bash
#MISE description="Upload dist/ into the preview subdirectory of the staging bucket"
#MISE hide=true

# Publish a branch preview.
#
# A preview is a standalone page under preview/<name>/ that loads index.html and
# its assets relative to itself, so the whole dist/ tree is mirrored into that
# subdirectory. None of it is worth caching: a preview is rebuilt under the
# same name whenever its branch moves.
#
# Reached through `mise run deploy --preview --name <name>`, which has already
# selected the environment.

set -o errexit
set -o nounset
set -o pipefail

: "${EGR_BUCKET:?no environment selected, use MISE_ENV=preview}"
: "${PREVIEW_NAME:?a preview needs PREVIEW_NAME to know its subdirectory}"

never_cache="max-age=0, no-cache, no-store, must-revalidate"

aws s3 sync dist/ "s3://${EGR_BUCKET}/preview/${PREVIEW_NAME}" --cache-control "$never_cache"

# The base path the bundle was built with is where the page now lives, so it is
# also the only place the URL has to be spelled out.
echo "Preview published: ${VITE_BASE_PATH}index.html"
