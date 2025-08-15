#!/bin/bash

# AI UI Components Deployment Script
echo "🚀 Starting AI UI Components Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
fi

# Run tests
print_info "Running tests..."
npm test || {
    print_error "Tests failed. Please fix tests before deployment."
    exit 1
}
print_status "Tests passed"

# Run linting
print_info "Running linting..."
npm run lint || {
    print_error "Linting failed. Please fix linting errors before deployment."
    exit 1
}
print_status "Linting passed"

# Build the library
print_info "Building component library..."
npm run build || {
    print_error "Build failed. Please fix build errors before deployment."
    exit 1
}
print_status "Library build completed"

# Build Storybook
print_info "Building Storybook documentation..."
npx storybook build || {
    print_error "Storybook build failed."
    exit 1
}
print_status "Storybook build completed"

print_status "All builds completed successfully!"

echo ""
echo "📦 Deployment Options:"
echo ""
echo "1. NPM Package:"
echo "   npm publish"
echo ""
echo "2. Storybook to Netlify:"
echo "   netlify deploy --dir=storybook-static --prod"
echo ""
echo "3. Storybook to Vercel:"
echo "   vercel --prod storybook-static"
echo ""
echo "4. GitHub Pages:"
echo "   Push to main branch (automated via GitHub Actions)"
echo ""

print_info "Ready for deployment! 🎉"
