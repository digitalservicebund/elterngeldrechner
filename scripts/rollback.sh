#!/usr/bin/env bash
#MISE description="Build a past ref in a throwaway worktree and publish it"
#MISE hide=true

# Reached through `mise run deploy --production --rollback --ref <x>`, which has
# already selected the environment.
#
# The ref decides everything about the build: its sources, its dependencies and
# its own pinned toolchain. So the build happens in a throwaway worktree rather
# than in the current checkout, which leaves the working tree, node_modules and
# HEAD alone and makes a rollback rehearsable from the command line instead of
# something to be debugged through the pipeline.

set -o errexit
set -o nounset
set -o pipefail

ref="${1:?usage: mise run deploy --production --rollback --ref <tag-or-sha>}"

worktree="$(mktemp -d)/build"
git worktree add --quiet --detach "$worktree" "$ref"
trap 'git worktree remove --force "$worktree"' EXIT

cd "$worktree"

# The ref's own mise.toml decides the toolchain, so install it before anything
# uses node: a plain `npm ci` would still run under the node of the checkout
# this was started from.
mise trust --quiet
mise install
mise exec -- npm ci --ignore-scripts

# The build precondition sits on the `publish` task (`depends = ["build"]` in
# mise.toml) and deliberately not here, where it would build the current
# checkout before the worktree even exists.
#
# VITE_BUILD_VERSION becomes the data-build attribute the smoke test compares,
# so it carries the resolved commit; a tag name would not identify a build
# unambiguously.
VITE_BUILD_VERSION="$(git rev-parse HEAD)" mise run publish
