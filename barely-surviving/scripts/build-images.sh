#!/bin/bash
set -e

echo "🔨 Building Barely Surviving Images..."

# Build backend
echo "Building backend..."
cd backend
docker build -t barely-surviving-backend:latest .
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm run build || echo "Warning: Frontend build requires npm install first"
docker build -t barely-surviving-frontend:latest .
cd ..

# Import to k3s
echo "Importing images to k3s..."
docker save barely-surviving-backend:latest | sudo k3s ctr images import -
docker save barely-surviving-frontend:latest | sudo k3s ctr images import -

echo "✅ Images built and imported successfully!"
echo ""
echo "Next steps:"
echo "  ./scripts/deploy-dev.sh    # Deploy to development"
echo "  ./scripts/deploy-prod.sh   # Deploy to production"
