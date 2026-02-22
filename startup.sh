#!/bin/sh

echo "🚀 Starting portfolio deployment..."

# Use the local prisma binary directly (avoids npx resolution issues in production)
PRISMA="./node_modules/.bin/prisma"

# Wait for the database to be ready (max 2 minutes)
echo "⏳ Waiting for database connection..."
MAX_RETRIES=24
COUNT=0

until $PRISMA db push --accept-data-loss; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "❌ Database unreachable after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi
  echo "Database not ready yet ($COUNT/$MAX_RETRIES), retrying in 5 seconds..."
  sleep 5
done

echo "✅ Database schema up to date"

# Seed database if possible
echo "🌱 Seeding database (if needed)..."
if command -v tsx >/dev/null 2>&1; then
  $PRISMA db seed || echo "Seeding skipped (data may already exist)"
else
  echo "tsx not available, skipping seed"
fi

echo "✅ Startup complete — launching app"

exec su-exec nextjs node server.js
