#!/bin/sh

# Startup script for production deployment
echo "🚀 Starting portfolio deployment..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database not ready yet, retrying in 5 seconds..."
  sleep 5
done

echo "✅ Database connected successfully"

# Run Prisma migrations and ensure database is up to date
echo "🔄 Running database migrations..."
npx prisma db push --accept-data-loss

# Generate Prisma client (in case it's not available)
echo "⚙️ Ensuring Prisma client is available..."
npx prisma generate

# Seed database if needed (optional, will fail gracefully if data exists)
echo "🌱 Seeding database (if needed)..."
npx prisma db seed || echo "Seeding skipped (data may already exist)"

echo "✅ Database setup complete"

# Change to non-root user
echo "👤 Switching to non-root user..."
exec su-exec nextjs node server.js