#!/bin/bash

# MNADA Setup Verification Script
# Checks if all components are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}🎨 MNADA Setup Verification${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_file() {
    if [ -f "$1" ]; then
        print_success "$1 exists"
        return 0
    else
        print_error "$1 not found"
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        print_success "$1/ directory exists"
        return 0
    else
        print_error "$1/ directory not found"
        return 1
    fi
}

check_executable() {
    if [ -x "$1" ]; then
        print_success "$1 is executable"
        return 0
    else
        print_error "$1 is not executable"
        return 1
    fi
}

print_header

echo -e "\n${BLUE}📁 Project Structure:${NC}"
check_directory "frontend"
check_directory "backend"
check_directory "db"
check_directory "scripts"
check_directory "infra"
check_directory "tests"
check_directory "docs"
check_directory ".github/workflows"

echo -e "\n${BLUE}📄 Configuration Files:${NC}"
check_file "package.json"
check_file ".env.example"
check_file ".gitignore"
check_file "README.md"
check_file "task.md"
check_file "docker-compose.yml"

echo -e "\n${BLUE}🗄️ Database Files:${NC}"
check_file "db/mnada_schema_supabase.sql"
check_file "db/seed_mnada.sql"

echo -e "\n${BLUE}🔧 Scripts:${NC}"
check_executable "scripts/dev.sh"
check_executable "scripts/migrate.sh"
check_executable "scripts/seed.sh"

echo -e "\n${BLUE}🚀 CI/CD:${NC}"
check_file ".github/workflows/ci-cd.yml"

echo -e "\n${BLUE}🐳 Docker Setup:${NC}"
if command -v docker &> /dev/null; then
    print_success "Docker is installed"
    
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        
        # Test docker-compose file
        if docker-compose config &> /dev/null; then
            print_success "docker-compose.yml is valid"
        else
            print_error "docker-compose.yml has syntax errors"
        fi
    else
        print_error "Docker Compose is not installed"
    fi
else
    print_error "Docker is not installed"
fi

echo -e "\n${BLUE}📦 Node.js Setup:${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION is installed"
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION is installed"
        
        # Check if dependencies are installed
        if [ -d "node_modules" ]; then
            print_success "Root dependencies installed"
        else
            print_warning "Root dependencies not installed (run: npm install)"
        fi
    else
        print_error "npm is not installed"
    fi
else
    print_error "Node.js is not installed"
fi

echo -e "\n${BLUE}📊 Project Statistics:${NC}"
if [ -f "db/seed_mnada.sql" ]; then
    USERS_COUNT=$(grep -c "INSERT INTO users" db/seed_mnada.sql || echo "0")
    PRODUCTS_COUNT=$(grep -c "INSERT INTO products" db/seed_mnada.sql || echo "0")
    echo "  - Sample Users: $USERS_COUNT"
    echo "  - Sample Products: $PRODUCTS_COUNT"
fi

if [ -f "task.md" ]; then
    TOTAL_TASKS=$(grep -c "^- \[" task.md || echo "0")
    COMPLETED_TASKS=$(grep -c "^- \[x\]" task.md || echo "0")
    echo "  - Total Tasks: $TOTAL_TASKS"
    echo "  - Completed Tasks: $COMPLETED_TASKS"
fi

echo -e "\n${BLUE}🎯 Ready to Start Development:${NC}"
if [ -f ".env" ]; then
    print_success ".env file exists"
else
    print_warning ".env file not found - copy from .env.example"
fi

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo "1. Copy .env.example to .env and configure"
echo "2. Start Docker services: npm run docker:up"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Seed database: npm run db:seed"
echo "5. Start development: npm run dev"

echo -e "\n${GREEN}✨ MNADA project setup verification complete!${NC}"
