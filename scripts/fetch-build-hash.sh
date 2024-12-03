#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1}"

var="$1"
if [ -z "$var" ]; then
  echo "Error: $2 not found."
  exit 1
fi

html_content=$(curl -s "$BASE_URL" || { echo "Error: Failed to fetch $BASE_URL"; exit 1; })

js_file=$(echo "$html_content" | grep -o 'src="[^"]*index-[^"]*\.js"' | sed -e 's/src="//' -e 's/"//' | head -n 1)

if [ -z "$js_file" ]; then
  echo "Error: JS file not found."
  exit 1
fi

if [[ "$js_file" == /* ]]; then
  js_url="$BASE_URL$js_file"
else
  js_url="$BASE_URL/$js_file"
fi

js_content=$(curl -s "$js_url" || { echo "Error: Failed to fetch $js_url"; exit 1; })

build_version=$(echo "$js_content" | grep "window.__BUILD_VERSION_HASH__" | sed -n "s/.*window.__BUILD_VERSION_HASH__ = '\([^']*\)'.*/\1/p")

if [ -z "$build_version" ]; then
  echo "Error: BUILD_VERSION_HASH not found."
  exit 1
fi

echo "$build_version"
