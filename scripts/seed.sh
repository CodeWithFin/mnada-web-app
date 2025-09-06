#!/bin/bash

# MNADA Database Seed Script
# Populates the database with sample data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[SEED]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Set default database URL if not provided
DATABASE_URL=${DATABASE_URL:-"postgresql://mnada_user:mnada_password@localhost:5432/mnada_db"}

print_status "Seeding database with sample data..."

# Check if PostgreSQL is accessible
if ! pg_isready -d "$DATABASE_URL" >/dev/null 2>&1; then
    print_error "Cannot connect to PostgreSQL. Make sure the database is running."
    print_status "Try running: docker-compose up -d postgres"
    exit 1
fi

# Check if schema exists
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -eq "0" ]; then
    print_warning "No tables found in database. Running migrations first..."
    if [ -f "scripts/migrate.sh" ]; then
        chmod +x scripts/migrate.sh
        ./scripts/migrate.sh
    else
        print_error "Migration script not found. Please run migrations first."
        exit 1
    fi
fi

# Run the seed data script
if [ -f "db/seed_mnada.sql" ]; then
    print_status "Inserting seed data..."
    psql "$DATABASE_URL" -f "db/seed_mnada.sql"
    print_success "Database seeded successfully!"
    
    # Display summary of seeded data
    print_status "Seed data summary:"
    echo "  - Users: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')"
    echo "  - Merchants: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM merchants;" | tr -d ' ')"
    echo "  - Products: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM products;" | tr -d ' ')"
    echo "  - Outfits: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM outfits;" | tr -d ' ')"
    echo "  - Orders: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM orders;" | tr -d ' ')"
    echo "  - Donations: $(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM donations;" | tr -d ' ')"
else
    print_error "Seed file not found: db/seed_mnada.sql"
    exit 1
fi

print_success "Database seeding completed!"

# Display test credentials
print_status "Test user credentials:"
echo "  Email: aisha@example.com (Regular User)"
echo "  Email: sarah@sarahdesigns.co.ke (Verified Merchant)"
echo "  Email: admin@mnada.app (Admin)"
echo "  Password: Use the hashed passwords from seed data or implement auth"
