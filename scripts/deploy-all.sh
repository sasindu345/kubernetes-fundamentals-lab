#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "🚀 Deploying Kubernetes Fundamentals Lab"
echo "=========================================="

# 1. Namespace, ConfigMap, Secret
echo "📦 Applying Namespace, ConfigMap, and Secret..."
kubectl apply -f k8s/01-namespace/namespace.yaml
kubectl apply -f k8s/06-configmap/backend-configmap.yaml
kubectl apply -f k8s/07-secret/backend-secret.yaml

# 2. Database with Persistent Volume
echo "💾 Setting up PostgreSQL with Persistent Storage..."
kubectl apply -f k8s/08-persistent-volume/postgres-pv.yaml
kubectl apply -f k8s/08-persistent-volume/postgres-pvc.yaml
kubectl apply -f k8s/05-service/postgres-service.yaml
kubectl apply -f k8s/11-health-checks/postgres-deployment-health.yaml

# 3. Backend & Frontend Services + Deployments
echo "⚙️  Deploying Backend and Frontend (with Health Checks & Limits)..."
kubectl apply -f k8s/05-service/backend-service.yaml
kubectl apply -f k8s/12-rolling-update/backend-deployment-rolling.yaml

kubectl apply -f k8s/05-service/frontend-service.yaml
kubectl apply -f k8s/12-rolling-update/frontend-deployment-rolling.yaml

# 4. Ingress
echo "🌐 Configuring Ingress Routing..."
kubectl apply -f k8s/09-ingress/ingress.yaml

echo "=========================================="
echo "✅ All resources applied successfully!"
echo "Checking pod status in namespace notes-app:"
kubectl get all,pv,pvc,ingress -n notes-app
echo "=========================================="
