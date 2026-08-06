#!/usr/bin/env bash
#MISE description="Delete the active preview from the staging bucket"
#MISE hide=true

# Remove what upload-preview-build.sh published under preview/<name>/. Reached
# through `mise run deploy --preview --delete --name <x>`, which has already
# selected the environment and, like the two publish tasks, resolved the
# bucket credentials with fnox.
#
# PREVIEW_NAME has to be non-empty, not merely set: "s3://bucket/preview/" with
# --recursive would delete every preview in the bucket at once.

set -o errexit
set -o nounset
set -o pipefail

: "${EGR_BUCKET:?no environment selected, use MISE_ENV=preview}"
: "${PREVIEW_NAME:?a preview needs PREVIEW_NAME to know its subdirectory}"

exec aws s3 rm "s3://${EGR_BUCKET}/preview/${PREVIEW_NAME}" --recursive
