# NG Signals - Full Deployment Reference

This README is a detailed memory aid of what was done for this project on AWS, including both frontend deployment approaches and backend serverless deployment.

## Final API Endpoint You Obtained

- `https://9clpwaoipj.execute-api.us-east-1.amazonaws.com/api/v1/register`

---

## Big Picture: What You Actually Did

You used **multiple valid deployment paths**:

1. **Frontend path A (CI/CD static hosting):**
   - GitHub Actions workflow (`.github/workflows/deploy-frontend.yml`)
   - Build Angular app
   - Deploy static output to **S3 bucket** (`dev-daho`)

2. **Frontend path B (container hosting):**
   - Build Docker image for frontend
   - Push image to **Amazon ECR**
   - Deploy service with **AWS App Runner**

3. **Backend API path:**
   - Use **Serverless Framework**
   - Deploy functions to **AWS Lambda**
   - Expose endpoint through **API Gateway**
   - Store users in **DynamoDB**

These are not contradictory. You tested/used both frontend hosting options while backend stayed serverless on Lambda.

---

## Important Clarification (Main Confusion)

- You did **NOT** deploy Docker image to S3.
- **S3 deployment** = static files (`html`, `js`, `css`) from Angular build.
- **Docker deployment** = image pushed to ECR, then run by App Runner.
- GitHub Actions workflow currently shown in repo deploys **to S3** (not App Runner).

---

## Commands You Used (As Recorded)

### Project setup and dependencies

```bash
npx -p @angular/cli ng new ng-signals
git clone https://github.com/dahomost/ng-signals.git
npm install -D serverless serverless-offline
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb bcryptjs uuid
npm install @aws-sdk/client-dynamodb@3.632.0 @aws-sdk/lib-dynamodb@3.632.0
```

### AWS CLI setup

```bash
aws configure
aws sts get-caller-identity
```

### Backend serverless deploy / debug

```bash
cd back-end && npx serverless deploy
npx serverless deploy
npx serverless offline
npx serverless logs -f register -t
```

### Frontend production build

```bash
ng build --configuration production
```

### Docker and container deployment commands

```bash
docker info
docker run hello-world
docker build -t ng-signals-frontend:latest
docker build -t ng-signals-frontend:latest .
docker run -p 8080:80 ng-signals-frontend:latest
docker tag ng-signals-frontend:latest 589833671815.dkr.ecr.us-east-1.amazonaws.com/ng-signals-frontend:latest
docker push 589833671815.dkr.ecr.us-east-1.amazonaws.com/ng-signals-frontend:latest
```

Recommended command usually needed before pushing to ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 589833671815.dkr.ecr.us-east-1.amazonaws.com
```

---

## Frontend Deployment Method A: GitHub Actions -> S3

Workflow file:

- `.github/workflows/deploy-frontend.yml`

What it does:

1. Triggers on push to `main` for frontend/workflow changes.
2. Uses Node 22 and `npm ci`.
3. Runs unit tests: `npm run test:unit`.
4. Builds production Angular:
   - `npm run build -- --configuration production`
5. Configures AWS credentials from GitHub Secrets.
6. Deploys build output to S3:
   - `aws s3 sync dist/ng-signals/browser s3://dev-daho --delete`

Why this approach is useful:

- Simple static hosting path.
- Fully automated CI/CD from GitHub.
- Good for standard Angular static app hosting.

---

## Frontend Deployment Method B: Docker -> ECR -> App Runner

What you did:

1. Containerized frontend with Docker.
2. Tested locally with:
   - `docker run -p 8080:80 ng-signals-frontend:latest`
3. Tagged and pushed image to ECR repository:
   - `589833671815.dkr.ecr.us-east-1.amazonaws.com/ng-signals-frontend:latest`
4. Used App Runner service (`ng-signals-frontend`) to run it.

Why this approach is useful:

- Keeps runtime identical between local and cloud.
- Good when you want container-based platform workflow.
- Easy to redeploy by pushing a new image tag and triggering App Runner deploy.

---

## Backend Deployment: Serverless -> Lambda -> API Gateway

What you did:

1. Kept backend in `back-end` (Node.js serverless project).
2. Deployed with:
   - `npx serverless deploy`
3. Tested locally with:
   - `npx serverless offline`
4. Debugged with:
   - `npx serverless logs -f register -t`
5. Confirmed API endpoint:
   - `https://9clpwaoipj.execute-api.us-east-1.amazonaws.com/api/v1/register`
6. Used DynamoDB `users` table for persistence.

Why this approach is useful:

- No server management (fully managed Lambda).
- Scales automatically.
- Pay per request.
- Fast iteration with Serverless Framework.

---

## AWS Console Services You Touched

- **DynamoDB**: users table and items verification.
- **API Gateway**: endpoint mapping for Lambda API.
- **Lambda**: register and related functions.
- **ECR**: frontend image storage.
- **App Runner**: frontend container service.
- **S3**:
  - static frontend hosting bucket (`dev-daho`)
  - serverless deployment artifacts bucket (`ng-signals-api-dev-serverlessdeploymentbucket-...`)
- **IAM**: credentials/permissions for deployment.

---

## Why You Saw Both S3 and Docker Paths

You were learning AWS + CI/CD + Docker for the first time and successfully tried two frontend deployment patterns:

- **Pattern 1:** Static-site style via GitHub Actions and S3.
- **Pattern 2:** Container style via Docker, ECR, and App Runner.

Both are correct. You can keep one as primary and keep the other as backup/learning path.

---

## Suggested Primary Path Going Forward

Choose one frontend strategy to reduce confusion:

- If you want simpler static hosting and Git push auto deploy: **use S3 + GitHub Actions**.
- If you want container platform workflow: **use Docker + ECR + App Runner**.

Backend can remain Serverless/Lambda in both cases.

### Quick Decision Guide (S3 vs App Runner)

- `Choose S3 + GitHub Actions` when:
  - Your frontend is a static Angular build.
  - You want automatic deploy on `git push` to `main`.
  - You want lower cost and simpler operations.
  - You do not need container-specific runtime behavior.

- `Choose Docker + ECR + App Runner` when:
  - You want one containerized workflow (local + cloud).
  - You plan to standardize on Docker for team/devops.
  - You need container-level control (base image, runtime packaging, startup behavior).
  - You are okay managing image build/tag/push lifecycle.

- `Use both` only if:
  - You are intentionally learning/testing both deployment models.
  - You keep one as primary production path and one as backup/experiment.

---

## Fast Re-Deploy Checklists

### A) Backend API changes

```bash
cd back-end
npx serverless deploy
npx serverless logs -f register -t
```

### B) Frontend static S3 (CI/CD)

```bash
git add .
git commit -m "frontend changes"
git push origin main
```

GitHub Actions runs `deploy-frontend.yml` and syncs to S3.

### C) Frontend Docker App Runner

```bash
docker build -t ng-signals-frontend:latest .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 589833671815.dkr.ecr.us-east-1.amazonaws.com
docker tag ng-signals-frontend:latest 589833671815.dkr.ecr.us-east-1.amazonaws.com/ng-signals-frontend:latest
docker push 589833671815.dkr.ecr.us-east-1.amazonaws.com/ng-signals-frontend:latest
```

Then trigger App Runner deploy (or auto deploy if configured).

---

## Related Detailed Runbook and Screenshots

For the full step-by-step document with embedded screenshots:

- `docs/AWS_DEPLOYMENT_RUNBOOK.md`
- `docs/aws-screenshots/`

