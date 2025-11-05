#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables without migration files)
npx prisma db push --skip-generate --accept-data-loss
