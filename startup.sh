#!/bin/sh

set -eu

echo "Starting portfolio deployment..."

PRISMA="node ./node_modules/prisma/build/index.js"
DB_PATH="/app/data/portfolio.db"

# Apply schema changes without data loss.
# prisma db push only adds/modifies — it never drops tables
# unless the schema has breaking changes.
echo "Applying database schema..."
$PRISMA db push --skip-generate
echo "Database schema up to date"

# Seed only on first run (empty database) or when explicitly requested.
if [ "${SEED_ON_STARTUP:-false}" = "true" ]; then
  echo "Seeding database (forced)..."
  $PRISMA db seed || echo "Seeding skipped (data may already exist)"
elif [ ! -s "$DB_PATH" ]; then
  echo "Empty database detected, seeding..."
  $PRISMA db seed || echo "Seeding failed, continuing anyway"
else
  echo "Database already contains data, skipping seed"
fi

echo "Startup complete - launching app"

exec node server.js
