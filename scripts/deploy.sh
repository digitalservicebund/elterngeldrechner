#!/usr/bin/env bash
#MISE description="Deploy, roll back or delete: --staging, --production or --preview --name <name>"

# The one entry point for everything that touches a bucket.
#
# Its whole job is to turn the choice of environment into the MISE_ENV that
# carries it and then re-enter mise. That indirection is the point: a bucket, a
# base path and a PostHog host are configuration of an environment, so they live
# in mise.<env>.toml and are never passed as arguments.
#
# The two extra verbs belong to the one environment that can have them:
# --rollback to production, which is the only environment with releases worth
# returning to, and --delete to a preview, the only one that is ever emptied
# rather than replaced by the next deploy.

set -o errexit
set -o nounset
set -o pipefail

fail() {
  cat >&2 <<USAGE
$1

usage: mise run deploy --staging
       mise run deploy --production [--rollback --ref <tag-or-sha>]
       mise run deploy --preview --name <name> [--delete]
USAGE
  exit 1
}

environment=""
name=""
ref=""
rollback=false
delete=false

while [ $# -gt 0 ]; do
  case "$1" in
    --staging | --production | --preview)
      [ -z "$environment" ] || fail "Pick one environment, not both --$environment and $1."
      environment="${1#--}"
      ;;
    --rollback) rollback=true ;;
    --delete) delete=true ;;
    # Checking for the value before shifting keeps a trailing `--name` from
    # exiting on the loop's own shift, which errexit would swallow silently.
    --name) [ $# -ge 2 ] || fail "--name needs a value."; name="$2"; shift ;;
    --name=*) name="${1#*=}" ;;
    --ref) [ $# -ge 2 ] || fail "--ref needs a value."; ref="$2"; shift ;;
    --ref=*) ref="${1#*=}" ;;
    *) fail "Unknown option $1." ;;
  esac
  shift
done

case "$name" in -*) fail "--name needs a value." ;; esac
case "$ref" in -*) fail "--ref needs a value." ;; esac

[ -n "$environment" ] || fail "Pick an environment."

if [ "$rollback" = true ] && [ "$delete" = true ]; then
  fail "Pick either --rollback or --delete."
fi
if [ "$environment" = preview ] && [ -z "$name" ]; then
  fail "A preview is published under preview/<name>/, so it needs --name."
fi
if [ "$environment" != preview ] && [ -n "$name" ]; then
  fail "--name belongs to --preview; --$environment publishes to the bucket root."
fi
if [ "$rollback" = true ] && [ "$environment" != production ]; then
  fail "--rollback belongs to --production; staging and preview are rebuilt from main."
fi
if [ "$rollback" = true ] && [ -z "$ref" ]; then
  fail "--rollback needs the --ref to roll back to."
fi
if [ "$rollback" = false ] && [ -n "$ref" ]; then
  fail "--ref only means something together with --rollback."
fi
if [ "$delete" = true ] && [ "$environment" != preview ]; then
  fail "--delete belongs to --preview; --$environment is replaced by the next deploy, never emptied."
fi

# A preview is a subdirectory of the staging bucket, so its profile layers on
# top of staging's rather than replacing it.
case "$environment" in
  staging) export MISE_ENV="staging" ;;
  production) export MISE_ENV="production" ;;
  preview) export MISE_ENV="staging,preview" PREVIEW_NAME="$name" ;;
esac

if [ "$delete" = true ]; then
  exec mise run remove-preview
fi

if [ "$rollback" = true ]; then
  exec "$(dirname "$0")/rollback.sh" "$ref"
fi

# A preview is the only deployment that publishes index.html, and that page is
# only worth looking at with the Familienportal chrome the snapshot provides.
# Without it the build silently falls back to a bare host page, so require the
# snapshot instead: the task is a no-op when it is already there and fails when
# it cannot be fetched. A root deploy uploads only index.js and never reads it.
if [ "$environment" = preview ]; then
  mise run generate-app-wrapper
fi

exec mise run publish
