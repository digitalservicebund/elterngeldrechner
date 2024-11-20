#!/usr/bin/env bash

set -o errexit

validate_command_availability() {
  if ! command -v "$1" &>/dev/null; then
    echo "Error: Required command '$1' is not installed."
    exit 1
  fi
}

validate_command_availability jq
validate_command_availability uuid

temporary_bundle_file_name=$(uuidgen).yml
trap "rm -f '$temporary_bundle_file_name'" EXIT

logs=$(npx --yes vite-bundle-visualizer@1.2.1 \
  --template=list \
  --output="$temporary_bundle_file_name" 2>&1)

exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "Command failed with exit code $exit_code"
  echo "$logs"
fi

dev_dependencies=$(jq -r '.devDependencies | keys[]' package.json)

echo "Verifying for any leaked development dependencies in the bundle..."

leaked_dependencies=()

for dependency_name in $dev_dependencies; do
  if grep --quiet "$dependency_name" "$temporary_bundle_file_name"; then
    leaked_dependencies+=("$dependency_name")
  fi
done

unique_leaked_dependencies=$(echo "${leaked_dependencies[@]}" | tr ' ' '\n' | sort --unique | tr '\n' ' ')

if [ -n "$unique_leaked_dependencies" ]; then
  echo "The following devDependencies have leaked into the bundle: $unique_leaked_dependencies"
  exit 1
else
  echo "No devDependencies leaked into the bundle."
  exit 0
fi
