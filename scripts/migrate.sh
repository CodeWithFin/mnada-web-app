#!/bin/bash

# MNADA Database Migration Script
# Runs database migrations using the schema file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[MIGRATE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Set default database URL if not provided
DATABASE_URL=${DATABASE_URL:-"postgresql://mnada_user:mnada_password@localhost:5432/mnada_db"}

print_status "Running database migrations..."

# Check if PostgreSQL is accessible
if ! pg_isready -d "$DATABASE_URL" >/dev/null 2>&1; then
    print_error "Cannot connect to PostgreSQL. Make sure the database is running."
    print_status "Try running: docker-compose up -d postgres"
    exit 1
fi

# Run the main schema migration
if [ -f "db/mnada_schema_supabase.sql" ]; then
    print_status "Applying main schema..."
    psql "$DATABASE_URL" -f "db/mnada_schema_supabase.sql"
    print_success "Schema migration completed!"
else
    print_error "Schema file not found: db/mnada_schema_supabase.sql"
    exit 1
fi

# Run additional migration files if they exist
if [ -d "db/migrations" ]; then
    for migration in db/migrations/*.sql; do
        if [ -f "$migration" ]; then
            print_status "Applying migration: $(basename "$migration")"
            psql "$DATABASE_URL" -f "$migration"
        fi
    done
fi

print_success "All migrations completed successfully!"
