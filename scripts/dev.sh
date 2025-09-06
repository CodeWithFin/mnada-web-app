#!/bin/bash

# MNADA Development Server Startup Script
# This script starts both frontend and backend development servers

set -e  # Exit on any error

echo "🚀 Starting MNADA Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[MNADA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed!"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your configuration before continuing."
            print_warning "Press Enter to continue after editing .env, or Ctrl+C to exit..."
            read -r
        else
            print_error ".env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
}

# Start Docker services
start_docker_services() {
    print_status "Starting Docker services..."
    
    # Start core services (postgres, meilisearch, redis)
    docker-compose up -d postgres meilisearch redis
    
    # Wait for services to be healthy
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    timeout 60 bash -c 'until docker-compose exec postgres pg_isready -U mnada_user -d mnada_db; do sleep 2; done'
    
    # Wait for Meilisearch
    print_status "Waiting for Meilisearch..."
    timeout 60 bash -c 'until curl -f http://localhost:7700/health >/dev/null 2>&1; do sleep 2; done'
    
    print_success "Docker services are ready!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies if frontend exists
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
    
    # Install backend dependencies if backend exists
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        print_status "Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    print_success "Dependencies installed!"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Check if migration script exists
    if [ -f "scripts/migrate.sh" ]; then
        chmod +x scripts/migrate.sh
        ./scripts/migrate.sh
    else
        print_warning "migrate.sh not found. Skipping migrations."
    fi
}

# Seed database
seed_database() {
    print_status "Seeding database..."
    
    # Check if seed script exists
    if [ -f "scripts/seed.sh" ]; then
        chmod +x scripts/seed.sh
        ./scripts/seed.sh
    else
        print_warning "seed.sh not found. Skipping database seeding."
    fi
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    
    # Kill any existing processes on our ports
    print_status "Cleaning up existing processes..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    
    # Start servers using concurrently if available, otherwise use background processes
    if command -v concurrently &> /dev/null; then
        concurrently \
            --prefix "[{name}]" \
            --names "frontend,backend" \
            --prefix-colors "cyan,magenta" \
            "cd frontend && npm run dev" \
            "cd backend && npm run start:dev"
    else
        print_status "Starting frontend server (port 3000)..."
        if [ -d "frontend" ]; then
            cd frontend
            npm run dev &
            FRONTEND_PID=$!
            cd ..
        fi
        
        print_status "Starting backend server (port 4000)..."
        if [ -d "backend" ]; then
            cd backend
            npm run start:dev &
            BACKEND_PID=$!
            cd ..
        fi
        
        # Function to cleanup background processes on exit
        cleanup() {
            print_status "Shutting down development servers..."
            if [ ! -z "$FRONTEND_PID" ]; then
                kill $FRONTEND_PID 2>/dev/null || true
            fi
            if [ ! -z "$BACKEND_PID" ]; then
                kill $BACKEND_PID 2>/dev/null || true
            fi
            exit 0
        }
        
        # Trap cleanup function on script exit
        trap cleanup SIGINT SIGTERM
        
        print_success "Development servers started!"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend:  http://localhost:4000"
        print_status "Press Ctrl+C to stop all servers"
        
        # Wait for background processes
        wait
    fi
}

# Main execution
main() {
    echo "=============================================="
    echo "🎨 MNADA Web App Development Environment"
    echo "=============================================="
    
    check_dependencies
    check_env_file
    start_docker_services
    install_dependencies
    run_migrations
    seed_database
    start_dev_servers
}

# Run main function
main "$@"
