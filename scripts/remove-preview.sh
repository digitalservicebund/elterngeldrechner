#!/usr/bin/env bash
#MISE description="Delete the active preview from the staging bucket"
#MISE hide=true

# Remove what upload-build.sh published under preview/<name>/. Reached through
# `mise run deploy --preview --delete --name <x>`, which has already selected
# the environment.
#
# PREVIEW_NAME has to be non-empty, not merely set: "s3://bucket/preview/" with
# --recursive would delete every preview in the bucket at once.

set -o errexit
set -o nounset
set -o pipefail

if [ "${EGR_DEPLOY_LAYOUT:-}" != "preview" ]; then
  echo "No preview environment selected; use 'mise run deploy --preview --delete --name <name>'." >&2
  exit 1
fi

: "${EGR_BUCKET:?the selected environment declares no bucket}"
: "${PREVIEW_NAME:?a preview needs PREVIEW_NAME to know its subdirectory}"

aws s3 rm "s3://${EGR_BUCKET}/preview/${PREVIEW_NAME}" --recursive
