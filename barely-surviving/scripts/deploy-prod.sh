#!/bin/bash
set -e

NAMESPACE="barely-surviving-prod"

echo "🚀 Deploying Barely Surviving to Production..."
read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespaces/prod-namespace.yaml

# Deploy MongoDB
echo "Deploying MongoDB..."
kubectl apply -f k8s/mongodb/ -n $NAMESPACE

# Wait for MongoDB
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=180s || true

# Deploy Backend
echo "Deploying backend..."
kubectl apply -f k8s/backend/ -n $NAMESPACE

# Deploy Frontend
echo "Deploying frontend..."
kubectl apply -f k8s/frontend/ -n $NAMESPACE

# Deploy Ingress
echo "Deploying ingress..."
kubectl apply -f k8s/ingress/prod-ingress.yaml -n $NAMESPACE

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "📊 Check status:"
echo "  kubectl get all -n $NAMESPACE"
echo ""
echo "🌐 Access the app:"
echo "  Update k8s/ingress/prod-ingress.yaml with your domain"
echo "  Configure DNS to point to your k3s node IP"
echo ""
echo "📝 Monitor logs:"
echo "  kubectl logs -f deployment/backend -n $NAMESPACE"
echo "  kubectl logs -f deployment/frontend -n $NAMESPACE"
