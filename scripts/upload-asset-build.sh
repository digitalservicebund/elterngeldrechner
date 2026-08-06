#!/usr/bin/env bash
#MISE description="Upload dist/ into the bucket root of the selected environment"
#MISE hide=true

# Publish the widget the Familienportal embeds.
#
# The CMS loads <script src=".../index.js"> from the bucket root, so the hashed
# entry file is copied to a stable index.js that must never be cached, while the
# remaining assets keep their content hash and stay cacheable.
#
# Reached through `mise run deploy --staging` or `--production`, which has
# already selected the environment.

set -o errexit
set -o nounset
set -o pipefail

: "${EGR_BUCKET:?no environment selected, use MISE_ENV=staging or MISE_ENV=production}"

never_cache="max-age=0, no-cache, no-store, must-revalidate"

aws s3 sync dist/assets/ "s3://${EGR_BUCKET}/assets/" --exclude "index-*.js"
aws s3 cp dist/assets/index-*.js "s3://${EGR_BUCKET}/index.js" --cache-control "$never_cache"
