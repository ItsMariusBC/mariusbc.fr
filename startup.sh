#!/bin/sh

echo "Starting portfolio deployment..."

PRISMA="./node_modules/.bin/prisma"

# Push schema to SQLite (creates the file if it doesn't exist)
echo "Applying database schema..."
$PRISMA db push
echo "Database schema up to date"

# Seed database if possible
echo "Seeding database (if needed)..."
if command -v tsx >/dev/null 2>&1; then
  $PRISMA db seed || echo "Seeding skipped (data may already exist)"
else
  echo "tsx not available, skipping seed"
fi

echo "Startup complete - launching app"

exec node server.js
