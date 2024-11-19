#!/bin/bash

set -e

bundle_file=$(uuidgen).yml

npx vite-bundle-visualizer -t list -o "$bundle_file" > /dev/null 2>&1

dev_dependencies=$(jq -r '.devDependencies | keys[]' package.json)

echo "Checking for leaked devDependencies in the bundle..."

leaked=()

for dep in $dev_dependencies; do
  if grep -q "$dep" "$bundle_file"; then
    leaked+=("$dep")
  fi
done

leaked_set=$(echo "${leaked[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' ')

rm -f "$bundle_file"

if [ -n "$leaked_set" ]; then
  echo "The following devDependencies have leaked into the bundle: $leaked_set"
  exit 1
else
  echo "No devDependencies leaked into the bundle."
  exit 0
fi
