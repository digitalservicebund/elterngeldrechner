#!/usr/bin/env bash
#MISE description="Upload dist/ into the bucket of the selected environment"
#MISE hide=true

# Publish the build to STACKIT object storage.
#
# Two layouts exist because the Familienportal and a preview consume the widget
# differently:
#
#   root    — the CMS embeds <script src=".../index.js"> from the bucket root,
#             so the hashed entry file is copied to a stable index.js that must
#             never be cached, while the remaining assets keep their content
#             hash and stay cacheable.
#   preview — a standalone page under preview/<name>/ that loads index.html and
#             its assets relative to itself, so the whole dist/ tree is mirrored
#             into that subdirectory.
#
# EGR_DEPLOY_LAYOUT comes from the mise environment profile rather than from the
# caller, because the layout and the base path baked into the bundle have to
# agree: a preview bundle uploaded with the root layout would replace the
# environment's live deployment.

set -o errexit
set -o nounset
set -o pipefail

: "${EGR_DEPLOY_LAYOUT:?no environment selected, use MISE_ENV=staging or MISE_ENV=production}"
: "${EGR_BUCKET:?the selected environment declares no bucket}"

never_cache="max-age=0, no-cache, no-store, must-revalidate"

case "$EGR_DEPLOY_LAYOUT" in
  root)
    aws s3 sync dist/assets/ "s3://${EGR_BUCKET}/assets/" --exclude "index-*.js"
    aws s3 cp dist/assets/index-*.js "s3://${EGR_BUCKET}/index.js" --cache-control "$never_cache"
    ;;
  preview)
    : "${PREVIEW_NAME:?a preview needs PREVIEW_NAME to know its subdirectory}"
    aws s3 sync dist/ "s3://${EGR_BUCKET}/preview/${PREVIEW_NAME}" --cache-control "$never_cache"
    ;;
  *)
    echo "Unknown EGR_DEPLOY_LAYOUT '${EGR_DEPLOY_LAYOUT}', expected 'root' or 'preview'." >&2
    exit 1
    ;;
esac
