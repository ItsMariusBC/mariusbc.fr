#!/bin/sh

set -eu

echo "Starting portfolio deployment..."

PRISMA="node ./node_modules/prisma/build/index.js"

# Push schema to SQLite (creates the file if it doesn't exist)
echo "Applying database schema..."
$PRISMA db push
echo "Database schema up to date"

# Seed only when explicitly requested.
if [ "${SEED_ON_STARTUP:-false}" = "true" ]; then
  echo "Seeding database..."
  $PRISMA db seed || echo "Seeding skipped (data may already exist)"
else
  echo "Seeding skipped (set SEED_ON_STARTUP=true to enable)"
fi

echo "Startup complete - launching app"

exec node server.js
