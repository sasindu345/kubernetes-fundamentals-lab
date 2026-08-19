# Kubernetes Learning Path, Progress & Outcomes

This document outlines the end-to-end learning roadmap for the **Kubernetes Fundamentals Lab** (`notes-app`), tracking current progress, implementation details, troubleshooting milestones, and expected professional outcomes.

---

## 🎯 1. Project Overview & Architecture

The project is a multi-tier production-simulation architecture deployed to Kubernetes inside a dedicated namespace (`notes-app`).

```
                              [ Internet / Client ]
                                        │
                                        ▼ (HTTP :80)
                       ┌─────────────────────────────────┐
                       │  09-ingress / LoadBalancer       │
                       └────────────────┬────────────────┘
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │  04-frontend (Nginx Pods)       │
                       │  Service: frontend:80           │
                       │  - Static Asset Delivery        │
                       │  - Reverse Proxy /api/          │
                       └────────────────┬────────────────┘
                                        │ /api/ proxy
                                        ▼
                       ┌─────────────────────────────────┐
                       │  03-backend (Node.js API)       │
                       │  Service: backend:3000          │
                       │  - Ingests ConfigMap & Secret   │
                       │  - Exposes Health Probes        │
                       └────────────────┬────────────────┘
                                        │ postgres:5432
                                        ▼
                       ┌─────────────────────────────────┐
                       │  02-postgres (PostgreSQL Pod)   │
                       │  Service: postgres:5432         │
                       │  - 08-persistent-volume (EBS/PV)│
                       └─────────────────────────────────┘
```

---

## 📊 2. Step-by-Step Learning Roadmap & Status Tracker

| Stage | Module | Key Kubernetes Concepts Learned | Status | Manifests / Artifacts |
| :--- | :--- | :--- | :---: | :--- |
| **01** | **Namespace** | Resource isolation, tenant segmentation, RBAC boundary | ✅ Complete | [`k8s/01-namespace/namespace.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/01-namespace/namespace.yaml) |
| **02** | **PostgreSQL** | Stateful deployment, container runtime, Pod lifecycles | ✅ Complete | [`k8s/02-postgres/postgres-deployment.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/02-postgres/postgres-deployment.yaml) |
| **03** | **Backend API** | App deployments, env vars, container log debugging | ✅ Complete | [`k8s/03-backend/backend-deployment.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/03-backend/backend-deployment.yaml) |
| **04** | **Frontend (Nginx)** | Web servers, static hosting, Nginx reverse proxying | ✅ Complete | [`k8s/04-frontend/frontend-deployment.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/04-frontend/frontend-deployment.yaml) |
| **05** | **Services & DNS** | `ClusterIP`, service discovery, internal CoreDNS resolution | ✅ Complete | [`k8s/05-service/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/05-service) (`frontend-service.yaml`, `backend-service.yaml`, `postgres-service.yaml`) |
| **06** | **ConfigMaps** | 12-Factor app config, non-sensitive decoupling | ✅ Complete | [`k8s/06-configmap/backend-configmap.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/06-configmap/backend-configmap.yaml) |
| **07** | **Secrets** | Base64 encoded sensitive configs, Secret injection | ✅ Complete | [`k8s/07-secret/backend-secret.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/07-secret/backend-secret.yaml) |
| **08** | **Storage & PV** | `PersistentVolume` (PV), `PersistentVolumeClaim` (PVC), StorageClasses | ✅ Complete | [`k8s/08-persistent-volume/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/08-persistent-volume) (`postgres-pv.yaml`, `postgres-pvc.yaml`, `postgres-deployment.yaml`) |
| **09** | **Ingress & Routing** | Ingress Controllers (Nginx/Traefik), path-based routing, TLS | ✅ Complete | [`k8s/09-ingress/ingress.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/09-ingress/ingress.yaml) |
| **10** | **Resource Limits** | CPU/Memory requests & limits, QoS classes, OOMKilled prevention | ✅ Complete | [`k8s/10-resource-limits/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/10-resource-limits) (`frontend-deployment-resources.yaml`, `backend-deployment-resources.yaml`, `postgres-deployment-resources.yaml`) |
| **11** | **Health Checks** | `livenessProbe`, `readinessProbe`, `startupProbe`, self-healing | ✅ Complete | [`k8s/11-health-checks/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/11-health-checks) (`frontend-deployment-health.yaml`, `backend-deployment-health.yaml`, `postgres-deployment-health.yaml`) |
| **12** | **Rolling Updates** | Zero-downtime rollouts, rollback strategies, revision history | ✅ Complete | [`k8s/12-rolling-update/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/12-rolling-update) (`frontend-deployment-rolling.yaml`, `backend-deployment-rolling.yaml`) |

---

## 🛠️ 3. Current Progress Deep Dive

### Completed Milestones
1. **Isolated Namespace**: Created `notes-app` to prevent pollution of the `default` namespace.
2. **Database Tier**: Successfully spun up PostgreSQL Pod, exposed via ClusterIP service `postgres` on port `5432`.
3. **Configuration Decoupling**: Configured `backend-config` (ConfigMap) for DB host/port/name and `backend-secret` (Secret) for credentials.
4. **Backend REST API**: Node.js backend connects to database using Kubernetes internal DNS (`postgres:5432`).
5. **Frontend & Nginx Proxy**: Frontend script updated to `/api/notes`, Nginx reverse proxy configured, and [`k8s/05-service/frontend-service.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/05-service/frontend-service.yaml) created.
6. **Persistent Storage (PV/PVC)**: Created `postgres-pv` and `postgres-pvc` with volume mount at `/var/lib/postgresql/data` for database durability.
7. **Ingress Routing**: Created [`k8s/09-ingress/ingress.yaml`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/09-ingress/ingress.yaml) to route `notes.local` domain traffic directly to frontend and backend services.
8. **Resource Quotas & Limits**: Configured CPU/Memory `requests` and `limits` across frontend, backend, and PostgreSQL to guarantee Quality of Service (QoS) in [`k8s/10-resource-limits/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/10-resource-limits).
9. **Self-Healing Probes**: Implemented `livenessProbe` and `readinessProbe` in [`k8s/11-health-checks/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/11-health-checks).
10. **High Availability & Rolling Updates**: Configured 2 replicas with zero-downtime `RollingUpdate` strategy (`maxSurge: 1`, `maxUnavailable: 0`) in [`k8s/12-rolling-update/`](file:///Users/oneionei/Desktop/MyProjects/devops%20basic/kubernetes-fundamentals-lab/k8s/12-rolling-update).

### 🎉 Curriculum Status: Fully Implemented & Ready for Cluster Practice!
All 12 Kubernetes architectural modules are completed and ready for testing and demonstration in your local cluster or AWS Free Tier EC2 instance.

---

## 🏆 4. Target Outcomes & DevOps Portfolio Value

Upon completing this curriculum, you will possess tangible, production-grade DevOps competencies:

### Technical Competencies Mastered
1. **Kubernetes Networking**: Understanding internal CoreDNS, Service abstraction (ClusterIP vs NodePort vs LoadBalancer), and Ingress controllers.
2. **State Management**: Handling stateless frontends/APIs vs stateful database persistence using PVCs.
3. **High Availability & Reliability**: Configuring liveness/readiness probes to ensure Kubernetes only directs traffic to healthy pods and automatically restarts deadlocks.
4. **Security & Configuration Best Practices**: Decoupling configuration from container images using ConfigMaps and Secrets.
5. **Observability & Diagnostics**: Troubleshooting Pod states like `CrashLoopBackOff`, `Pending`, `ImagePullBackOff`, and `OOMKilled` using `kubectl describe`, `kubectl logs`, and events.

### Interview & Resume Talking Points
- *"Architected and deployed a multi-tier full-stack application on Kubernetes with dedicated namespaces, zero-downtime rolling updates, and self-healing health probes."*
- *"Implemented Kubernetes-native configuration management and stateful persistence using PersistentVolumeClaims."*
- *"Optimized cluster resource allocation by enforcing strict CPU and memory requests and limits to guarantee QoS."*
