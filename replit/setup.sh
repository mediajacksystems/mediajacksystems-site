#!/bin/sh
# One-time setup in the Replit project "MediaJack Systems Website": from now on Replit publishes the site from
# github.com/mediajacksystems/mediajacksystems-site instead of the old oil and gas site, with no Replit AI involved.
# Run it once in that project's Shell:
#   curl -fsSL https://raw.githubusercontent.com/mediajacksystems/mediajacksystems-site/main/replit/setup.sh | sh
set -e
A=artifacts/mediajack/.replit-artifact/artifact.toml
if [ ! -f "$A" ]; then echo "Run this from the main folder of the MediaJack Systems Website project on Replit."; exit 1; fi
[ -f "$A.before-github" ] || cp "$A" "$A.before-github"
curl -fsSL https://raw.githubusercontent.com/mediajacksystems/mediajacksystems-site/main/replit/artifact.toml -o "$A.new"
grep -q 'mediajacksystems-site' "$A.new" && mv "$A.new" "$A"
echo
echo "Done. When this project is published, Replit now builds the site from GitHub (the latest main branch)."
echo "The old settings are kept in $A.before-github, and the old site's code is still in artifacts/mediajack."
