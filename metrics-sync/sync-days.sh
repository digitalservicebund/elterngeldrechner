# This script was written for macOS. Please note that subtracting days
# works differently on macOS and Linux. For example, running `date -v1d`
# on September 22 outputs September 1 on macOS, but September 21 on Linux.

for i in $(seq 1 90); do
  npm run sync -- "$(date -v-${i}d +'%Y-%m-%d')"
done
