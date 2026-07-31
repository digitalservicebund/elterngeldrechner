#!/bin/bash
#MISE description="Tag the next release and push it"
#MISE alias="release"
#MISE raw=true

set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: You have uncommited changes!"
  echo "Please commit or stash before starting release."
  exit 1
fi

echo "Fetching the newest tags and commits..."
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Error: Your local branch is not in sync with origin/main!"
    echo "Please push your commits to GitHub before creating a tag."
    exit 1
fi

LATEST=$(git tag | grep -E '^[0-9]+$' | sort -n | tail -1)

if [ -z "$LATEST" ]; then
    echo "Error: No numeric tag found!"
    exit 1
fi

NEXT=$(( LATEST + 1 ))

echo "These commits would go into release $NEXT:"
git-cliff --unreleased

read -p "Do you want to create and push version $NEXT? (y/n): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Abort."
    exit 0
fi

git tag "$NEXT" -m "Create tag for release $NEXT"
git push origin "$NEXT"

echo "Done! Version $NEXT has been tagged and pushed."
