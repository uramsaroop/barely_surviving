#!/bin/bash
set -e

NAMESPACE="barely-surviving-dev"

echo "🚀 Deploying Barely Surviving to Development..."

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespaces/dev-namespace.yaml

# Deploy MongoDB
echo "Deploying MongoDB..."
kubectl apply -f k8s/mongodb/ -n $NAMESPACE

# Wait for MongoDB
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=120s || true

# Deploy Backend
echo "Deploying backend..."
kubectl apply -f k8s/backend/ -n $NAMESPACE

# Deploy Frontend
echo "Deploying frontend..."
kubectl apply -f k8s/frontend/ -n $NAMESPACE

# Deploy Ingress
echo "Deploying ingress..."
kubectl apply -f k8s/ingress/dev-ingress.yaml -n $NAMESPACE

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Check status:"
echo "  kubectl get all -n $NAMESPACE"
echo ""
echo "🌐 Access the app:"
echo "  1. Add to /etc/hosts: 127.0.0.1 barely-surviving-dev.local"
echo "  2. Visit: http://barely-surviving-dev.local"
echo ""
echo "Or use port forwarding:"
echo "  kubectl port-forward svc/frontend 8080:80 -n $NAMESPACE"
echo "  Visit: http://localhost:8080"
