# AWS Free Tier Guide for Kubernetes Learning

This guide outlines how to effectively leverage the **AWS Free Tier** to practice, deploy, and showcase Kubernetes workloads without incurring accidental cloud bills.

---

## ⚠️ 1. Critical Warning: Amazon EKS is NOT Free Tier Eligible

> [!WARNING]
> **Do not create an Amazon EKS (Elastic Kubernetes Service) cluster for casual learning.**
> - Amazon EKS charges **$0.10 per hour (~$73/month)** just for the cluster control plane management fee.
> - EKS control plane fees are **NOT** covered by the AWS Free Tier.
> - Managed Node Groups (EC2 instances) and Classic/Network Load Balancers also add extra costs.

---

## 🎁 2. What is Actually Free in AWS Free Tier (12 Months)?

| AWS Service | Free Tier Allowance | How We Use It for Kubernetes Learning |
| :--- | :--- | :--- |
| **Amazon EC2** | 750 hours/month of `t2.micro` (or `t3.micro` where available) | Host a lightweight Kubernetes node (using **k3s**, **MicroK8s**, or **kind**) |
| **Amazon EBS** | 30 GB of General Purpose (gp2/gp3) SSD storage | Root volume and Persistent Volume (PV) backing storage |
| **Amazon ECR** | 500 MB/month of Private Repositories (50 GB Public) | Store and pull container images (`notes-frontend`, `notes-backend`) |
| **Amazon S3** | 5 GB standard storage + 20,000 GET / 2,000 PUT requests | Store cluster backups, manifest templates, and static assets |
| **AWS IAM** | 100% Free always | Practice cloud security, IAM roles for service accounts, least privilege |
| **AWS Budgets** | First 2 action-enabled budgets free | Set a **$0.01 threshold alert** to immediately catch any unintended spend |

---

## 🏗️ 3. Recommended Architectures for Zero-Cost Kubernetes Practice

### Architecture 1: Local Cluster + AWS Cloud Integrations (Best for Daily Dev)
- **Kubernetes Cluster**: Run **Minikube**, **k3d**, or **kind** locally on your Mac.
- **AWS Cloud Services Used**:
  - **Amazon ECR**: Push your built Docker images from Mac to ECR private registry.
  - **AWS CLI & IAM**: Configure Kubernetes image pull secrets using IAM credentials.
- **Cost**: **$0.00** (Zero risk).

### Architecture 2: Cloud-Hosted Lightweight Kubernetes (k3s on EC2 `t2.micro`/`t3.micro`)
- **Compute**: Launch 1x EC2 `t2.micro` / `t3.micro` (Ubuntu 22.04 LTS) within the 750 hrs/month limit.
- **Cluster Runtime**: Install **k3s** (a certified, lightweight Kubernetes distribution created for resource-constrained environments).
- **Storage**: Attach a 20 GB gp3 EBS root volume (under the 30 GB free tier cap).
- **Networking**: Expose the app via EC2 Security Group and NodePort/Ingress or Traefik.
- **Cost**: **$0.00** (When staying within 1 active instance and 30 GB EBS).

```
   [ Developer Mac ] ──(git / kubectl)──▶ [ EC2 t2.micro / t3.micro ]
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  k3s Cluster │
                                         │  - Frontend  │
                                         │  - Backend   │
                                         │  - Postgres  │
                                         └──────────────┘
                                                │
                                      (Image Pull: Free Tier)
                                                ▼
                                        [ Amazon ECR ]
```

---

## 🛡️ 4. Essential Step 1: Set Up AWS Zero-Spend Budget & Billing Alerts

Before launching any resources, protect your account:

1. Open the **AWS Billing and Cost Management Console**.
2. Navigate to **Budgets** → **Create budget**.
3. Select **Zero spend budget** (or set a custom threshold of **$1.00 USD**).
4. Enter your email address to receive immediate notifications if any billable action occurs.
5. In **Billing Preferences**, enable **Receive Free Tier Usage Alerts**.

---

## 🚀 5. Practical Walkthrough: Running k3s on an AWS Free Tier EC2 Instance

### Step 5.1: Launch the Free Tier EC2 Instance
- **AMI**: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
- **Instance Type**: `t2.micro` (1 vCPU, 1 GiB Memory) or `t3.micro`
- **Storage**: 20 GiB gp3 (Default is 8 GiB; up to 30 GiB is free)
- **Security Group**:
  - `SSH` (Port 22) - restricted to your IP.
  - `HTTP` (Port 80) & `HTTPS` (Port 443) - for web traffic.
  - `Kube API` (Port 6443) - optional (restricted to your IP).

### Step 5.2: Configure Swap (Crucial for 1GB RAM instances)
Since `t2.micro` has 1GB RAM, create a 2GB swap file to ensure smooth operation when running multiple pods:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Step 5.3: Install k3s
Run the lightweight Kubernetes installer:

```bash
curl -sfL https://get.k3s.io | sh -
```

Check cluster status:

```bash
sudo kubectl get nodes
```

### Step 5.4: Access via Local `kubectl` (Optional)
Copy `/etc/rancher/k3s/k3s.yaml` to your Mac's `~/.kube/config`, replace `127.0.0.1` with your EC2 Public IP, and run `kubectl` commands directly from your laptop.

---

## 📦 6. Using Amazon ECR (Elastic Container Registry) with Free Tier

1. **Create an ECR Repository**:
   ```bash
   aws ecr create-repository --repository-name notes-backend --region us-east-1
   aws ecr create-repository --repository-name notes-frontend --region us-east-1
   ```

2. **Authenticate Docker to ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   ```

3. **Build, Tag, and Push**:
   ```bash
   docker build -t notes-backend:latest -f docker/backend/Dockerfile .
   docker tag notes-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/notes-backend:v1.0
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/notes-backend:v1.0
   ```

4. **Add Kubernetes ImagePullSecret**:
   ```bash
   kubectl create secret docker-registry ecr-secret \
     --docker-server=<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com \
     --docker-username=AWS \
     --docker-password=$(aws ecr get-login-password --region us-east-1) \
     -n notes-app
   ```

---

## 🧹 7. Resource Cleanup & Cost Prevention Checklist

Always run this checklist when finishing a study session:

- [ ] **Terminate unneeded EC2 instances** or stop them if not in use.
- [ ] **Delete unattached EBS Volumes** (unused volumes incur storage fees if exceeding 30GB).
- [ ] **Check for Elastic IPs (EIPs)**: Unattached Elastic IPs are charged $0.005/hour. Release them immediately.
- [ ] **Check for Load Balancers (ALB/NLB/CLB)**: Never leave cloud LoadBalancers active unless intentionally testing.
- [ ] **Review AWS Cost Explorer** weekly to verify $0.00 monthly balance.
