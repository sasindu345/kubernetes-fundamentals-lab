#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "🧹 Cleaning up notes-app namespace & PVs..."
echo "=========================================="

kubectl delete namespace notes-app --ignore-not-found=true
kubectl delete pv postgres-pv --ignore-not-found=true

echo "✅ All notes-app resources have been cleaned up."
