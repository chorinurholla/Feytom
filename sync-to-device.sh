#!/usr/bin/env bash
#
# Sync the cloud working mirror back into the device folder.
#
# Run from the cloud container. It rebuilds, refreshes build/ from site/dist/,
# and packs everything into one archive for transfer — Claude then commits that
# archive to the device and unpacks it in place.
#
# node_modules, dist, .astro and package-lock.json are never synced.
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="${1:-/home/claude/feytol-sync.zip}"

echo "==> build + gates"
( cd "$ROOT/site" && npm run build >/dev/null )

echo "==> refresh build/ from site/dist/"
rm -rf "$ROOT/build"
mkdir -p "$ROOT/build"
tar -C "$ROOT/site/dist" -cf - . | tar -C "$ROOT/build" -xf -

echo "==> regenerate standalone previews"
( cd "$ROOT/site" && node "$ROOT/tools/inline-previews.mjs" "$ROOT/previews" )

echo "==> pack"
STAGE="$(mktemp -d)"
mkdir -p "$STAGE/FEYTOL"
tar -C "$ROOT" \
    --exclude=node_modules --exclude=dist --exclude=.astro \
    --exclude='*.zip' \
    -cf - . | tar -C "$STAGE/FEYTOL" -xf -
rm -f "$OUT"
( cd "$STAGE" && zip -qr "$OUT" FEYTOL )
rm -rf "$STAGE"

echo "==> $OUT  ($(du -h "$OUT" | cut -f1))"
echo
echo "Next: Claude commits this archive to the device folder and unpacks it there."
echo
echo "NOTE for whoever unpacks it: the device mount disallows unlink, so \`tar -x\`"
echo "and \`unzip -o\` both FAIL on files that already exist. Unpack to a scratch"
echo "dir outside the mount, then copy in with \`cp\` — cp truncates in place"
echo "rather than unlinking, which the mount does allow:"
echo
echo "  unzip -q -o sync.zip -d \$HOME/unpack"
echo "  cd \$HOME/mnt/FEYTOL"
echo "  (cd \$HOME/unpack/FEYTOL && find . -type d) | while read -r d; do mkdir -p \"./\$d\"; done"
echo "  (cd \$HOME/unpack/FEYTOL && find . -type f) | while read -r f; do cp \"\$HOME/unpack/FEYTOL/\$f\" \"./\$f\"; done"
